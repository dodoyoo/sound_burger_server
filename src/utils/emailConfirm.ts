import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (
  email: string,
  verification_token: string
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 465,
    secure: true,
    auth: {
      user: 'assad15903@naver.com',
      pass: '3217Q9V3SP9Z',
    },
  });

  const mailOption = {
    from: 'assad15903@naver.com',
    to: email,
    subject: '이메일 인증',
    text: `아래 링크를 클릭하여 이메일을 인증하세요: http://localhost:3000/api/verify?token=${verification_token}`,
  };

  await transporter.sendMail(mailOption);
};
