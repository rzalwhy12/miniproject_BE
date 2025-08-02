interface TicketItem {
  name: string;
  quantity: number;
}

export const sendTicketTemplate = (
  name: string,
  eventName: string,
  eventDate: string,
  transactionCode: string,
  tickets: TicketItem[]
) => {
  const ticketList = tickets
    .map(
      (item) =>
        `<li><strong>${item.name}</strong> &times; ${item.quantity}</li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Tiket Anda - ${eventName}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #fff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid #e0e0e0;
    }

    .logo {
      text-align: center;
      margin-bottom: 24px;
    }

    .logo img {
      height: 60px;
    }

    h1 {
      color: #2c3e50;
      font-size: 24px;
      margin-bottom: 16px;
      text-align: center;
    }

    p {
      color: #444;
      font-size: 16px;
      line-height: 1.6;
      margin: 8px 0;
    }

    ul {
      margin: 12px 0;
      padding-left: 20px;
      color: #2c3e50;
    }

    .section-divider {
      border-top: 1px solid #ddd;
      margin: 24px 0;
    }

    .footer {
      text-align: center;
      color: #999;
      font-size: 13px;
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
      <img src="http://localhost:3000/images/logo/lokaAdicaralogo.png" alt="Loka Adicara" />
    </div>

    <h1>Tiket Anda Telah Dikirim!</h1>

    <p>Hai <strong>${name}</strong>,</p>
    <p>Terima kasih telah membeli tiket di <strong>Loka Adicara</strong>. Berikut adalah detail transaksi Anda:</p>

    <div class="section-divider"></div>

    <p><strong>Nama Event:</strong> ${eventName}</p>
    <p><strong>Tanggal Event:</strong> ${eventDate}</p>
    <p><strong>Kode Transaksi:</strong> ${transactionCode}</p>

    <p><strong>Tiket yang Dibeli:</strong></p>
    <ul>${ticketList}</ul>

    <div class="section-divider"></div>

    <p>
      Silakan tunjukkan email ini atau kode transaksi Anda saat check-in di lokasi acara.<br />
      Sampai jumpa di acara!
    </p>

    <div class="footer">
      &copy; 2025 Loka Adicara. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};
