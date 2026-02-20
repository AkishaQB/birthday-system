import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBirthdayEmail({
  to,
  imageBuffer,
}: {
  to: string;
  imageBuffer: Buffer;
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    cc: process.env.EMAIL_USER, // CC to self for testing
    subject: "Happy Birthday 🎉",
    text: "Wishing you a wonderful birthday!",
    attachments: [
      {
        filename: "birthday.png",
        content: imageBuffer,
      },
    ],
  });
}
