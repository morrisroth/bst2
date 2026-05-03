const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const NOTIFY_FILE = path.join(__dirname, 'data', 'notify-emails.json');

function getRecipients() {
  try {
    if (fs.existsSync(NOTIFY_FILE)) {
      const list = JSON.parse(fs.readFileSync(NOTIFY_FILE, 'utf8'));
      const emails = list.map(e => e.email).filter(Boolean);
      if (emails.length) return emails.join(', ');
    }
  } catch {}
  return process.env.NOTIFY_EMAIL || process.env.GMAIL_USER;
}

async function sendMail({ subject, html }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;

  if (!user || !pass) {
    console.error('Email not sent: GMAIL_USER or GMAIL_PASS missing from env');
    return;
  }

  const to = getRecipients();
  if (!to) {
    console.error('Email not sent: no recipients configured');
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

  console.log('Email sent to:', to);
}

module.exports = { sendMail };
