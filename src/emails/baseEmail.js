"use strict";

const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const ejs = require("ejs");
const nodeMailer = require("nodemailer");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const validator = require("email-validator");

const errors = require("./../errors/errors.js");

/**
 * Base class for sending emails using Node.js and nodemailer.
 * @memberof emails
 * @class BaseEmail
 */
class BaseEmail {
    /**
     * Create an instance of BaseEmail.
     * @constructor
     * @param {string} subject - The subject of the email.
     * @param {string} template - The template file path for the email content.
     * @param {object} data - The data to be rendered in the email template.
     */
    constructor (subject, template, data) {
        this.subject = subject;
        this.template = path.join(__dirname, "/templates/", template);
        this.data = data;
    }

    /**
     * Send email to a specified recipient.
     * @async
     * @param {string} to - The recipient's email address.
     * @returns {boolean} - Indicates whether the email was sent successfully.
     * @throws Will throw an error if the email address is invalid or sending fails.
     */
    async send (to) {
        if (process.env.ENABLE_EMAIL === "false") {
            return;
        }

        // Validate the email address
        const validation = validator.validate(to);

        if (!validation) {
            throw new errors.UnknownError("Invalid email address!");
        }

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
