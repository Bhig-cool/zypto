import nodemailer from 'nodemailer';

async function sendWelcomeEmail(toEmail, username) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Zypto" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome to Zypto!',
    html: `<h1>Welcome, ${username}!</h1><p>Thanks for joining Zypto, your DeFi trading platform.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export default sendWelcomeEmail;