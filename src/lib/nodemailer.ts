import nodemailer from "nodemailer";

const port = Number(process.env.MAIL_PORT) || 587;
const isSecure =
  process.env.MAIL_SSL_TLS === "True" ||
  process.env.MAIL_SSL_TLS === "true" ||
  port === 465;
const requireTLS =
  process.env.MAIL_STARTTLS === "True" || process.env.MAIL_STARTTLS === "true";

// Clean any surrounding quotes from password
const rawPassword = process.env.MAIL_PASSWORD || "";
const cleanPassword = rawPassword.replace(/^["']|["']$/g, "").trim();

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER || "smtp.gmail.com",
  port: port,
  secure: isSecure,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: cleanPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
  requireTLS: requireTLS,
});

export interface BookCallRequest {
  name: string;
  email: string;
  projectType: string;
  budget?: string;
  details: string;
}

export async function sendBookCallEmail(data: BookCallRequest) {
  const mailFrom =
    process.env.MAIL_FROM ||
    process.env.MAIL_USERNAME ||
    "ranahammadismail@gmail.com";
  const formattedBudget = data.budget || "Not specified";

  // 1. Notification email to Agency Admin
  const adminMailOptions = {
    from: `"Softrix Notifications" <${mailFrom}>`,
    to: mailFrom,
    replyTo: data.email,
    subject: `📅 New Call Booking Request: ${data.name} (${data.projectType})`,
    text: `
New Call Booking Request received:

Name: ${data.name}
Email: ${data.email}
Project Type: ${data.projectType}
Budget Range: ${formattedBudget}

Project Details:
${data.details}

Timestamp: ${new Date().toLocaleString()}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="margin-bottom: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 12px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 22px;">New Call Booking Request</h2>
          <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Softrix Agency Web Form</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-size: 14px; width: 140px; font-weight: 600;">Client Name:</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 15px; font-weight: 500;">${data.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: 600;">Work Email:</td>
            <td style="padding: 10px 0; color: #2563eb; font-size: 15px;"><a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: 600;">Project Type:</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 15px;">${data.projectType}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #64748b; font-size: 14px; font-weight: 600;">Budget Range:</td>
            <td style="padding: 10px 0; color: #0f172a; font-size: 15px; font-weight: 600; color: #16a34a;">${formattedBudget}</td>
          </tr>
        </table>

        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <p style="font-weight: 600; color: #334155; margin: 0 0 8px 0; font-size: 14px;">Project Details:</p>
          <p style="color: #1e293b; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.details}</p>
        </div>

        <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px; text-align: center;">
          Received on ${new Date().toLocaleString()} &bull; Reply directly to this email to contact ${data.name}.
        </div>
      </div>
    `,
  };

  // 2. Friendly confirmation email to the Client
  const clientMailOptions = {
    from: `"Softrix" <${mailFrom}>`,
    to: data.email,
    subject: `We received your request — Softrix`,
    text: `
Hi ${data.name},

Thank you for reaching out to Softrix!

We have received your call request regarding "${data.projectType}". Our team is reviewing your project details and will get back to you within one working day to schedule our discovery call.

Summary of your request:
- Project Type: ${data.projectType}
- Budget: ${formattedBudget}
- Details: ${data.details}

Best regards,
The Softrix Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Thanks for reaching out, ${data.name}!</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          We have received your request to book a call regarding <strong>${data.projectType}</strong>. Our team is reviewing your details and will reply within one working day to confirm a time for our discovery call.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px; padding: 14px 16px; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Your Project Summary</p>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #0f172a;"><strong>Project Type:</strong> ${data.projectType}</p>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: #0f172a;"><strong>Budget:</strong> ${formattedBudget}</p>
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Details:</strong> ${data.details}</p>
        </div>

        <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 24px 0 0;">
          If you have any questions or urgent files to share in the meantime, feel free to reply to this email.
        </p>

        <p style="color: #0f172a; font-weight: 600; font-size: 14px; margin: 24px 0 0;">
          The Softrix Team<br/>
          <span style="color: #64748b; font-weight: normal; font-size: 13px;">AI-Powered Software & Engineering</span>
        </p>
      </div>
    `,
  };

  // Send admin notification
  const adminResult = await transporter.sendMail(adminMailOptions);

  // Send client confirmation (wrapped in try/catch so admin gets notified even if client address bounces)
  try {
    await transporter.sendMail(clientMailOptions);
  } catch (err) {
    console.warn("Client confirmation email could not be sent:", err);
  }

  return adminResult;
}
