// import { Resend } from "resend";
// import { env } from "cloudflare:workers";

// const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  // Placeholder implementation - replace with actual email service
  console.log("📧 Sending verification email:");
  console.log("To:", email);
  console.log("Subject: Verify your email address");
  console.log("Verification URL:", verificationUrl);
  console.log("Text: Please verify your email address by clicking the following link:", verificationUrl);
  
  // Simulate successful email sending
  const mockData = {
    id: `mock-email-${Date.now()}`,
    to: email,
    subject: "Verify your email address"
  };
  
  console.log("✅ Email sent successfully (mock):", mockData);
  return mockData;
};

export const VerificationEmail = ({ name }: { name: string }) => {
    return `<div>Hello ${name}</div>`; 
};