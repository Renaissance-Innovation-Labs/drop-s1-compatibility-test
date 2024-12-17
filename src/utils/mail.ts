import nodemailer from "nodemailer"
import HttpException from "./exception"
import { MAIL_PASS, MAIL_SERVICE, MAIL_USER } from "../config"
class Mail {
     static async sendMail(options: any) {
        try {
            const transporter = nodemailer.createTransport({
                service: MAIL_SERVICE,
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASS
                },
            })
            await transporter.sendMail(options)
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new HttpException(500, "couldn't send mail")
            }
        }
    }
}

export default Mail