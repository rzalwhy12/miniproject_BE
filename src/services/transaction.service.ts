import TransactionRepository from "../repositories/transaction.repository";
import { IOrderCreateReq } from "../dto/transacionReq.dto";

class TransactionService {
  private transactionRepository = new TransactionRepository();

  public orderItem = async (userId: number, data: IOrderCreateReq) => {
    // Hitung subTotal tiap orderItem (dummy, seharusnya ambil harga dari ticketType)
    // Untuk contoh, subTotal = quantity * 100000
    data.orderItems = data.orderItems.map((item) => ({
      ...item,
      subTotal: item.quantity * 100000,
    }));
    return await this.transactionRepository.createTransaction(userId, data);
  };
}

export default TransactionService;
