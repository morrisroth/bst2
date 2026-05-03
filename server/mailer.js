const nodemailer = require('nodemailer');

async function sendMail({ subject, html }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  const to = process.env.NOTIFY_EMAIL || user;

  console.log('sendMail called, user:', user ? 'set' : 'MISSING', 'pass:', pass ? 'set' : 'MISSING');

  if (!user || !pass) {
    console.error('Email not sent: GMAIL_USER or GMAIL_PASS missing from env');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"חדר בעל שם טוב" <${user}>`,
    to,
    subject,
    html,
  });

  console.log('Email sent to', to);
}

module.exports = { sendMail };
