// Written by Robin Johannesson

"use strict";

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
    sendMailAsUser: async function(username, email, subject, html, attachments = []) {
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
    sendMailAsServer: async function(emails, subject, html, attachments = []) {
        const res = await gmailTransporter.sendMail({
            from: `${process.env.GMAIL_NAME} <${process.env.GMAIL_USER}>`,
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

module.exports = emailUtil;
