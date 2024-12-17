import Mail from "nodemailer/lib/mailer";

class MailOptions implements Mail.Options {
    constructor(public to: string, public subject: string, public html: string) { }
}

export default MailOptions