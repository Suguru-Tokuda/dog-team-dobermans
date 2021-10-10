import ConfigService from './ConfigService';
import * as nodemailer from 'nodemailer';

export default class EmailService {
    static sendEmail(email: string, subject: string, htmlBody: string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: ConfigService.getConfig().office.user,
                pass: ConfigService.getConfig().office.pass
            }
        });

        const options = {
            sender: ConfigService.getConfig().office.user,
            from: ConfigService.getConfig().office.user,
            to: email,
            subject: subject,
            html: htmlBody
        };

        return transporter.sendMail(options);
    }
}