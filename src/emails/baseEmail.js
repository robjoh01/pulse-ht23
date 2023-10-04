"use strict";

const dotenv = require("dotenv");
dotenv.config();

const ejs = require("ejs");
const nodeMailer = require("nodemailer");
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const validator = require("email-validator");

class BaseEmail {
    constructor(subject, template, data) {
        this.subject = subject
        this.template = `${__dirname}/templates/${template}`;
        this.data = data
    }

    /**
     * Send email to somebody
     * @param {String} to Messenger receiver.
     * @return {Boolean} was successful or not.
     */
    async send(to) {
        if (process.env.ENABLE_EMAIL === "false") {
            return;
        }

        const validation = validator.validate(to);
    
        if (!validation)
            throw "Invalid email address!";

        const transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        transporter.use("compile", htmlToText());

        const options = {
            from: `${process.env.EMAIL_DISPLAY_NAME} <noreply.${process.env.EMAIL_USER}>`,
            to,
            subject: this.subject,
            html: await ejs.renderFile(this.template, this.data),
        };

        const info = await transporter.sendMail(options);

        console.log(`Email has been sent: ${info.response}`);
        console.log(`Email has been: ${(info.accepted ? "accepted" : "rejected")}`);
        console.log(`Message sent: ${info.messageId}`);

        return info.accepted;
    }
}

module.exports = BaseEmail;
