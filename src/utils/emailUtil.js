"use strict";

const dotenv = require("dotenv");
dotenv.config();

const nodeMailer = require("nodemailer");

/*
    smtp.gmail.com
    Requires SSL: Yes
    Requires TLS: Yes (if available)
    Requires Authentication: Yes
    Port for SSL: 465
    Port for TLS/STARTTLS: 587
*/

const gmailTransporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// TODO: Add try and catch statements?

let emailUtil = {
    trySendMailAsUser: async function(username, email, subject, html, attachments = []) {
        if (!process.env.ENABLE_EMAIL_SUPPORT) {
            return;
        }

        const res = await gmailTransporter.sendMail({
            from: `${username} <${email}>`,
            to: process.env.GMAIL_USER,
            subject,
            html,
            attachments
        });

        console.log(`Message sent: ${res.messageId}`);
        console.log(res.accepted);
        console.log(res.rejected);
    },
    trySendMailAsServer: async function(emails, subject, html, attachments = []) {
        if (!process.env.ENABLE_EMAIL_SUPPORT) {
            return;
        }

        const res = await gmailTransporter.sendMail({
            from: `${process.env.GMAIL_NAME} <noreply.${process.env.GMAIL_USER}>`,
            to: emails,
            subject,
            html,
            attachments
        });

        console.log(`Message sent: ${res.messageId}`);
        console.log(res.accepted);
        console.log(res.rejected);
    },
};

const welcomeMessage = 
`<h1></h1>
<p>Welcome To Jurassic Park</p>
<a href="www.google.com">Click here</a>`;

module.exports = { emailUtil, welcomeMessage };
