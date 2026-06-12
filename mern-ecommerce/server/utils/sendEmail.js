const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER) { console.log('📧 Email skipped (no SMTP config)'); return; }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: process.env.SMTP_PORT,
    secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({ from: `"ShopKart" <${process.env.SMTP_USER}>`, to, subject, html });
};

module.exports = sendEmail;
