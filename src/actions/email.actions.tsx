"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import ResetPasswordEmail from "@/emails/reset-password";
import VerifyEmail from "@/emails/verify-email";

export async function sendEmail({
  to,
  name,
  subject,
  url,
  type,
}: {
  to: string;
  name: string;
  subject: string;
  url: string;
  type: "reset-password" | "verify-email";
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not set in environment variables.");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail", // or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Input validation
    if (!to || !name || !subject || !url) {
      throw new Error("Invalid email input: Missing required fields.");
    }

    const body =
      type === "reset-password"
        ? await render(<ResetPasswordEmail name={name} url={url} />)
        : await render(<VerifyEmail url={url} name={name} />);

    const options = {
      from: process.env.EMAIL_USER,
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      html: body,
    };

    await transporter.sendMail(options);

    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
