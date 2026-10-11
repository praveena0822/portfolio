import nodemailer from 'nodemailer';
import { env, smtpEnabled } from '../config/env.js';
import { escapeHtml } from '../utils/sanitize.js';

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT || 587,
      secure: (env.SMTP_PORT || 587) === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}

const oneLine = (s) => String(s).replace(/[\r\n]+/g, ' ');

// Returns true when the notification was sent, false when SMTP is not configured.
export async function sendContactNotification({ name, email, subject, message }) {
  if (!smtpEnabled) return false;
  await getTransporter().sendMail({
    from: `"Portfolio contact form" <${env.SMTP_USER}>`,
    to: env.CONTACT_RECIPIENT,
    replyTo: `"${oneLine(name).replace(/"/g, '')}" <${email}>`,
    subject: `[Portfolio] ${oneLine(subject)}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
           <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
           <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
  });
  return true;
}
