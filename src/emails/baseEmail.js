"use strict";

const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const ejs = require("ejs");
const nodeMailer = require("nodemailer");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const validator = require("email-validator");

const errors = require("./../errors/errors.js");

/** Docs */
class BaseEmail {
    constructor (subject, template, data) {
        this.subject = subject;
        this.template = path.join(__dirname, "/templates/", template);
        this.data = data;
    }

    /**
     * Send email to somebody
     * @param {string} to Messenger receiver.
     * @return {boolean} was successful or not.
     */
    async send (to) {
        if (process.env.ENABLE_EMAIL === "false") {
            return;
        }

        const validation = validator.validate(to);

        // "Invalid email address!"

        if (!validation) { throw new errors.UnknownError(null); }

        const transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        transporter.use("compile", htmlToText());

        const options = {
            from: `${process.env.EMAIL_DISPLAY_NAME} <noreply.${process.env.EMAIL_USER}>`,
            to,
            subject: this.subject,
            html: await ejs.renderFile(this.template, this.data)
        };

        const info = await transporter.sendMail(options);

        console.log(`Email has been sent: ${info.response}`);
        console.log(`Email has been: ${(info.accepted ? "accepted" : "rejected")}`);
        console.log(`Message sent: ${info.messageId}`);

        return info.accepted;
    }
}

module.exports = BaseEmail;
