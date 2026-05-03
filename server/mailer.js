const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendMail({ subject, html }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) return;
  await transporter.sendMail({
    from: `"חדר בעל שם טוב" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
    subject,
    html,
  });
}

module.exports = { sendMail };
