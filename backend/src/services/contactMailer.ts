import nodemailer from 'nodemailer';
import { config } from '../config';

interface ContactPayload {
  name: string;
  email: string;
  org?: string;
  phone?: string;
  topic: string;
  message: string;
}

function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export async function sendContactForwardEmail(
  payload: ContactPayload,
): Promise<{ sent: boolean; reason?: string }> {
  const { host, port, secure, user, pass, from } = config.contact.smtp;
  const recipients = config.contact.forwardTo;

  if (!recipients.length) {
    return { sent: false, reason: 'CONTACT_FORWARD_TO is empty' };
  }
  if (!host || !user || !pass) {
    return { sent: false, reason: 'SMTP is not fully configured (SMTP_HOST/USER/PASS missing)' };
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  const subject = `New enquiry: ${payload.topic} — ${payload.name}`;

  const text = [
    'New contact form submission from robotinkerpreneur.com',
    '',
    `Name:    ${payload.name}`,
    `Email:   ${payload.email}`,
    `Phone:   ${payload.phone || '-'}`,
    `Org:     ${payload.org || '-'}`,
    `Topic:   ${payload.topic}`,
    '',
    'Message:',
    payload.message,
  ].join('\n');

  const html = `
    <h2 style="color:#1d2a3a">New enquiry via RoboTinkerPreneur contact form</h2>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      <tr><td style="padding:6px 14px 6px 0;color:#666;font-weight:bold">Name</td><td>${esc(payload.name)}</td></tr>
      <tr><td style="padding:6px 14px 6px 0;color:#666;font-weight:bold">Email</td><td><a href="mailto:${esc(payload.email)}">${esc(payload.email)}</a></td></tr>
      <tr><td style="padding:6px 14px 6px 0;color:#666;font-weight:bold">Phone</td><td>${esc(payload.phone || '-')}</td></tr>
      <tr><td style="padding:6px 14px 6px 0;color:#666;font-weight:bold">Organisation</td><td>${esc(payload.org || '-')}</td></tr>
      <tr><td style="padding:6px 14px 6px 0;color:#666;font-weight:bold">Topic</td><td>${esc(payload.topic)}</td></tr>
    </table>
    <h3 style="color:#1d2a3a;margin-top:16px">Message</h3>
    <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(payload.message)}</p>
    <hr style="border:none;border-top:1px solid #e3e8ef;margin-top:24px"/>
    <p style="color:#999;font-size:12px">Sent from robotinkerpreneur.com · Nervescape Analytics</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to: recipients.join(', '),
      replyTo: payload.email,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (e: any) {
    console.error('[contactMailer] SMTP error:', e.message);
    return { sent: false, reason: e.message };
  }
}
