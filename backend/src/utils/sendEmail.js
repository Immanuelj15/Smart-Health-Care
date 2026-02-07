import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // This transporter uses the Host and Port from your .env file for Mailtrap,
  // instead of the 'gmail' service.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER, // Your Mailtrap username
      pass: process.env.EMAIL_PASS, // Your Mailtrap password
    },
  });

  const mailOptions = {
    from: 'SmartHealth <noreply@smarthealth.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;