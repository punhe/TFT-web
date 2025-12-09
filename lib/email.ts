import nodemailer from 'nodemailer';

// Email transporter configuration
// In production, configure with your SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from: string;
  trackingId: string;
  baseUrl: string;
}

export async function sendTrackedEmail(options: EmailOptions) {
  const { to, subject, html, from, trackingId, baseUrl } = options;

  // Add tracking pixel
  const trackingPixel = `<img src="${baseUrl}/api/track/open/${trackingId}" width="1" height="1" style="display:none;" />`;
  
  // Replace all links with tracked links
  const trackedHtml = html.replace(
    /<a\s+([^>]*href=["'])([^"']+)(["'][^>]*)>/gi,
    (match, before, url, after) => {
      // Skip if already a tracking link
      if (url.includes('/api/track/click/')) {
        return match;
      }
      const trackedUrl = `${baseUrl}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`;
      return `<a ${before}${trackedUrl}${after}`;
    }
  ) + trackingPixel;

  const mailOptions = {
    from,
    to,
    subject,
    html: trackedHtml,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: String(error) };
  }
}

