"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectPaymentProofTemplate = void 0;
const rejectPaymentProofTemplate = (name) => {
    return `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Bukti Pembayaran Ditolak - Tiket Eventku</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        padding: 32px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .logo {
        text-align: center;
        margin-bottom: 24px;
      }

      .logo img {
        height: 60px;
      }

      h1 {
        color: #e11d48;
        font-size: 22px;
      }

      p {
        color: #374151;
        font-size: 16px;
        line-height: 1.6;
      }

      .footer {
        text-align: center;
        color: #9ca3af;
        font-size: 12px;
        margin-top: 32px;
      }

      @media (max-width: 600px) {
        .container {
          padding: 20px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="logo">
        <img src="http://localhost:3000/images/logo/lokaAdicaralogo.png" alt="Tiket Eventku" />
      </div>
      <h1>Bukti Pembayaran Ditolak</h1>
      <p>
        Halo ${name},<br />
        Terima kasih telah mengirimkan bukti pembayaran untuk transaksi Anda di <strong>Loka Adicara</strong>.
      </p>
      <p>
        Setelah kami tinjau, kami mohon maaf karena bukti pembayaran yang Anda kirimkan belum dapat kami terima.
      </p>
      <p>
        Silakan unggah ulang bukti pembayaran yang valid melalui halaman transaksi Anda agar proses dapat dilanjutkan.
      </p>
      <p>
        Jika Anda mengalami kendala atau memiliki pertanyaan, jangan ragu untuk menghubungi tim dukungan kami.
      </p>
      <div class="footer">
        &copy; 2025 Tiket Eventku. All rights reserved.
      </div>
    </div>
  </body>
</html>`;
};
exports.rejectPaymentProofTemplate = rejectPaymentProofTemplate;
