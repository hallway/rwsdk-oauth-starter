
import { Resend } from "resend";
import { env } from "cloudflare:workers";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address",
    text: `Please verify your email address by clicking the following link: ${verificationUrl}`,
  });

  if (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }

  return data;
};

export const VerificationEmail = ({ name }: { name: string }) => {
    return `<div>Hello ${name}</div>`; 
};