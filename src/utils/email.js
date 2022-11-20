import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port:  process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
            tls: {
                ciphers:'SSLv3'
            }
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email was sent sucessfully");
    } catch (error) {
        console.log("email was not sent");
        console.log(error);
    }
};

export default sendEmail;