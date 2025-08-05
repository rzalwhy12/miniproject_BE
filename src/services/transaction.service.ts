import TransactionRepository from "../repositories/transaction.repository";
import { ITransactionCreate } from "../dto/req/transacionReq.dto";
import AppError from "../errors/AppError";
import { StatusCode } from "../constants/statusCode.enum";
import { TransactionStatus } from "../../prisma/generated/client";
import { sendEmail } from "../utils/sendEmail";
import { sendTicketTemplate } from "../template/sendTicket.template";
import { prisma } from "../config/prisma";
import { rejectPaymentProofTemplate } from "../template/sendTicketReject.template";

class TransactionService {
  private transactionRepository = new TransactionRepository();

  //status awal waiting payment
  public createTransaction = async (
    customerId: number,
    data: ITransactionCreate
  ) => {
    const { useCoupon, usePoint, voucherCode, eventId } = data;

    // Ambil semua harga tiket
    const ticketPrice = await this.transactionRepository.getTicketPrice(data);
    const totalPrice = ticketPrice.reduce(
      (total, item) => total + item.subTotal,
      0
    );

    // Cek status event
    const isPublished = await this.transactionRepository.isPublished(eventId);
    if (!isPublished) {
      throw new AppError("Event belum dipublish", StatusCode.BAD_REQUEST);
    }

    // Step 1: Validasi voucher
    let voucherDiscount: number | undefined;
    if (voucherCode) {
      const voucher = await this.transactionRepository.validVoucher(
        voucherCode
      );
      if (!voucher)
        throw new AppError("Voucher tidak ditemukan", StatusCode.BAD_REQUEST);
      const now = new Date();
      if (now < voucher.startDate)
        throw new AppError("Voucher belum aktif", StatusCode.BAD_REQUEST);
      if (now > voucher.endDate)
        throw new AppError("Voucher sudah kedaluwarsa", StatusCode.BAD_REQUEST);
      voucherDiscount = voucher.discount;
    }

    let coupon: number | undefined;
    if (useCoupon) {
      const findCoupon = await this.transactionRepository.findCoupon(
        customerId
      );

      if (!findCoupon?.coupon?.id) {
        throw new AppError("Cannot find your coupon", StatusCode.BAD_REQUEST);
      }

      if (findCoupon.coupon.expiresAt < new Date()) {
        throw new AppError("Coupon has expired", StatusCode.BAD_REQUEST);
      }

      if (findCoupon.coupon.usedTemporarily || findCoupon.coupon.isUsed) {
        throw new AppError(
          "Coupon is already used or in process",
          StatusCode.BAD_REQUEST
        );
      }

      const updateTemp = await this.transactionRepository.updateCoupenTempt(
        findCoupon.coupon.id
      );

      coupon = updateTemp.discount;
    }

    let point: number = 0;
    if (usePoint) {
      const availablePoints = await this.transactionRepository.findPoint(
        customerId
      );

      if (!availablePoints.length) {
        throw new AppError(
          "Tidak ada poin yang tersedia",
          StatusCode.BAD_REQUEST
        );
      }

      await this.transactionRepository.updatePointTempt(customerId);

      point = availablePoints.reduce((total, item) => total + item.amount, 0);
    }

    let finalPrice = totalPrice;

    if (voucherDiscount) {
      const voucherAmount = (finalPrice * voucherDiscount) / 100;
      finalPrice -= voucherAmount;
    }

    if (coupon) {
      const couponAmount = (finalPrice * coupon) / 100;
      finalPrice -= couponAmount;
    }

    if (point > finalPrice) {
      point = finalPrice; //cegah negatif
    }
    finalPrice -= point;

    //final check
    if (finalPrice < 0) {
      finalPrice = 0;
    }

    //simpan transaksi
    const transaction = await this.transactionRepository.createTransaction(
      customerId,
      data,
      useCoupon,
      usePoint,
      ticketPrice,
      finalPrice
    );

    return transaction;
  };
  //status jadi waiting confirm
  public uploadProofPayment = async (
    transactionId: number,
    proofImage: string,
    customerId: number
  ) => {
    const transaction = await this.transactionRepository.findTransaction(
      transactionId
    );
    if (!transaction) {
      throw new AppError("Transaction not Found", StatusCode.NOT_FOUND);
    }
    if (new Date(transaction.expiredAt) < new Date()) {
      await this.transactionRepository.updateStatus(
        transactionId,
        TransactionStatus.EXPIRED
      );
      throw new AppError("Transaction already expired", StatusCode.BAD_REQUEST);
    }
    if (transaction.customerId !== customerId) {
      throw new AppError(
        "Yout not the owner Of this trasaction",
        StatusCode.UNAUTHORIZED
      );
    }
    const uploadedProof = await this.transactionRepository.uploadPaymentProof(
      transaction.id,
      proofImage
    );
    return uploadedProof;
  };
  //reject atau done
  public organizerResponse = async (
    status: string,
    transactionId: number,
    organizerId: number
  ) => {
    const findTx = await this.transactionRepository.findTransaction(
      transactionId
    );
    if (!findTx) {
      throw new AppError("Transaction not Found", StatusCode.NOT_FOUND);
    }
    const findEvent = await this.transactionRepository.findEventId(
      findTx.eventId
    );
    if (findEvent?.organizerId !== organizerId) {
      throw new AppError("your not The Owner", StatusCode.CONFLICT);
    }
    if (findTx.status !== TransactionStatus.WAITING_CONFIRMATION) {
      throw new AppError(
        "Must be waiting to confirmation status",
        StatusCode.CONFLICT
      );
    }
    if (status === TransactionStatus.DONE) {
      // update status transaksi jadi DONE
      const tx = await this.transactionRepository.updateStatus(
        findTx.id,
        status
      );

      //kurangi kuota tiket sesuai item yang dibeli
      await this.transactionRepository.updateIfDone(tx.id);

      //jika user pakai kupon, update isUsed & useAt
      if (tx.useCoupon) {
        const findCoupon = await this.transactionRepository.findCoupon(
          tx.customerId
        );
        if (!findCoupon?.coupon?.id) {
          throw new AppError(
            "Cannot Update Coupon",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }
        await this.transactionRepository.doneUseCoupon(findCoupon.coupon.id);
      }

      // jika user pakai poin, tandai semua point sebagai sudah digunakan
      if (tx.usePoint) {
        await this.transactionRepository.doneUsePoint(tx.customerId);
      }

      //ambil data event & customer untuk email
      const event = await this.transactionRepository.findEventId(
        findTx.eventId
      );
      const user = await this.transactionRepository.findCustomer(tx.customerId);
      if (!user || !event) {
        throw new AppError(
          "Failed To Send Email",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      //ambil data order item (nama tiket & jumlah)
      const orderItem = await this.transactionRepository.findOrderItem(tx.id);
      const myOrderItems = orderItem.map((item) => ({
        name: item.ticketType.name,
        quantity: item.quantity,
      }));

      //kirim email tiket ke customer
      await sendEmail(
        user.email,
        `Your Ticket ${event.name}`,
        sendTicketTemplate(
          user.name,
          event.name,
          event.startDate.toLocaleDateString("id-ID"),
          tx.transactionCode,
          myOrderItems
        )
      );

      return tx;
    }

    if (status === TransactionStatus.REJECTED) {
      const tx = await this.transactionRepository.updateStatus(
        findTx.id,
        status
      );

      // Jika user pakai kupon, tandai kuponnya tidak digunakan
      if (tx.useCoupon) {
        const findCoupon = await this.transactionRepository.findCoupon(
          tx.customerId
        );
        if (!findCoupon?.coupon?.id) {
          throw new AppError(
            "Cannot Update Coupon",
            StatusCode.INTERNAL_SERVER_ERROR
          );
        }
        await this.transactionRepository.rejectUseCoupon(findCoupon.coupon.id);
      }

      // Jika user pakai poin, kembalikan poinnya
      if (tx.usePoint) {
        await this.transactionRepository.rejectUsePoint(tx.customerId);
      }

      // Ambil data event & customer untuk email
      const event = await this.transactionRepository.findEventId(
        findTx.eventId
      );
      const user = await this.transactionRepository.findCustomer(tx.customerId);

      if (!user || !event) {
        throw new AppError(
          "Failed To Send Email",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      // Kirim email penolakan dengan template HTML
      await sendEmail(
        user.email,
        `Bukti Pembayaran Ditolak - ${event.name}`,
        rejectPaymentProofTemplate(user.name)
      );

      return tx;
    }
  };
  public getListOrder = async (organizerId: number) => {
    const trasnsaction =
      await this.transactionRepository.showActiveOrderListByOrganizer(
        organizerId
      );
    return trasnsaction;
  };
}

export default TransactionService;
