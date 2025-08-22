"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailTemplate = void 0;
const verifyEmailTemplate = (name, verifyUrlFE) => {
    return `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Verifikasi Email - Tiket Eventku</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f7f7f7;
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
        color: #333333;
        font-size: 22px;
      }

      p {
        color: #555555;
        font-size: 16px;
        line-height: 1.6;
      }

      .button {
        display: inline-block;
        padding: 12px 24px;
        margin: 24px 0;
        background-color: #4f46e5;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }

      .footer {
        text-align: center;
        color: #999999;
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
      <h1>Verifikasi Email Anda</h1>
      <p>
        Halo, <br />
        Terima kasih ${name} telah mendaftar di <strong>Loka Adicara</strong>! <br />
        Untuk mengaktifkan akun Anda, silakan klik tombol di bawah ini:
      </p>
      <p style="text-align: center;">
        <a href="${verifyUrlFE}" class="button">Verifikasi Email</a>
      </p>
      <div class="footer">
        &copy; 2025 Tiket Eventku. All rights reserved.
      </div>
    </div>
  </body>
</html>`;
};
exports.verifyEmailTemplate = verifyEmailTemplate;
