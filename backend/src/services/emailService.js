// backend/src/services/emailService.js
// Email service for MyLaundry — uses Resend API (HTTP-based, works on Render/Vercel)
// Falls back to Nodemailer for local development

import { Resend } from "resend";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Check if we should use Resend (production) or Nodemailer (local dev)
const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const useResend = !!RESEND_API_KEY;

let resendClient = null;
let nodemailerTransporter = null;

// Initialize email provider
async function initializeEmailProvider() {
    if (useResend) {
        console.log("[emailService] Using Resend API for email delivery");
        resendClient = new Resend(RESEND_API_KEY);
        return true;
    }

    // Fallback to Nodemailer for local development
    console.log("[emailService] RESEND_API_KEY not set, using Nodemailer for local dev");

    const host = process.env.EMAIL_HOST?.trim();
    const portRaw = process.env.EMAIL_PORT?.trim();
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    if (!host || !user || !pass) {
        console.warn("[emailService] Creating Ethereal test account for dev...");
        try {
            const testAccount = await nodemailer.createTestAccount();
            nodemailerTransporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
            nodemailerTransporter.__isEthereal = true;
            return true;
        } catch (err) {
            console.error("[emailService] Failed to create Ethereal account:", err.message);
            return false;
        }
    }

    // Use Gmail/SMTP for local testing
    const isGmail = host.includes("gmail");
    if (isGmail) {
        nodemailerTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user, pass },
        });
    } else {
        const port = parseInt(portRaw, 10) || 587;
        nodemailerTransporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
        });
    }
    return true;
}

// Initialize on module load
let initPromise = initializeEmailProvider();

// Verify email service
export async function verifyTransporter() {
    await initPromise;

    if (useResend) {
        console.log("[emailService] ✅ Resend API configured");
        return true;
    }

    if (nodemailerTransporter) {
        try {
            await nodemailerTransporter.verify();
            console.log("[emailService] ✅ Nodemailer transporter verified");
            return true;
        } catch (err) {
            console.error("[emailService] ❌ Nodemailer verification failed:", err.message);
            return false;
        }
    }

    return false;
}

// Reset (reinitialize)
export function resetTransporter() {
    resendClient = null;
    nodemailerTransporter = null;
    initPromise = initializeEmailProvider();
}

// Generic send email
export async function sendEmail(to, subject, html, text, retries = 2) {
    await initPromise;

    const from = process.env.EMAIL_FROM || "MyLaundry <onboarding@resend.dev>";

    console.log(`[emailService] Sending email to: ${to}`);
    console.log(`[emailService] Subject: ${subject}`);
    console.log(`[emailService] From: ${from}`);

    // Use Resend API (production)
    if (useResend && resendClient) {
        try {
            const result = await resendClient.emails.send({
                from,
                to: [to],
                subject,
                html,
                text: text || undefined,
            });

            if (result.error) {
                console.error("[emailService] ❌ Resend error:", result.error);
                return { ok: false, error: result.error.message };
            }

            console.log(`[emailService] ✅ Email sent via Resend (id=${result.data?.id})`);
            return { ok: true, info: result.data };
        } catch (err) {
            console.error("[emailService] ❌ Resend failed:", err.message);

            if (retries > 0) {
                console.log(`[emailService] Retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return sendEmail(to, subject, html, text, retries - 1);
            }

            return { ok: false, error: err.message };
        }
    }

    // Use Nodemailer (local dev)
    if (nodemailerTransporter) {
        try {
            const info = await nodemailerTransporter.sendMail({ from, to, subject, html, text });

            if (nodemailerTransporter.__isEthereal) {
                console.log("[emailService] 📧 Preview URL:", nodemailer.getTestMessageUrl(info));
            }

            console.log(`[emailService] ✅ Email sent via Nodemailer (messageId=${info.messageId})`);
            return { ok: true, info };
        } catch (err) {
            console.error("[emailService] ❌ Nodemailer failed:", err.message);
            return { ok: false, error: err.message };
        }
    }

    console.warn("[emailService] No email provider configured - skipping email");
    return { ok: false, error: "Email service not configured" };
}

// === Email Templates ===

// Welcome email
export async function sendWelcomeEmail(userEmail, userName = "") {
    const subject = "Welcome to MyLaundry! 🧺";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome${userName ? ", " + escapeHtml(userName) : ""}!</h1>
            <p>Thanks for signing up for MyLaundry.</p>
            <p>We're excited to take care of your laundry needs!</p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">— The MyLaundry Team</p>
        </div>
    `;
    const text = `Welcome${userName ? ", " + userName : ""}! Thanks for signing up for MyLaundry.`;
    return sendEmail(userEmail, subject, html, text);
}

// Order confirmation
export async function sendOrderConfirmationEmail(userEmail, order = {}) {
    const orderId = order._id?.toString() || "—";
    const itemsHtml = Array.isArray(order.items) && order.items.length
        ? `<ul>${order.items.map(it => `<li>${escapeHtml(String(it.name || it.service || it))} — qty: ${escapeHtml(String(it.quantity || 1))}</li>`).join("")}</ul>`
        : "<p>No items listed.</p>";

    const subject = `Order Confirmed — MyLaundry #${orderId.slice(-8)}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Order Confirmed! ✅</h1>
            <p>Hi ${escapeHtml(order.userName || "there")},</p>
            <p>Your order <strong>#${escapeHtml(orderId.slice(-8))}</strong> has been received.</p>
            <h3>Items:</h3>
            ${itemsHtml}
            <p><strong>Total: ₹${escapeHtml(String(order.total || "0"))}</strong></p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">— The MyLaundry Team</p>
        </div>
    `;
    const text = `Order #${orderId} confirmed. Total: ₹${order.total || 0}.`;
    return sendEmail(userEmail, subject, html, text);
}

// Order status update
export async function sendOrderStatusUpdateEmail(userEmail, order = {}) {
    const statusText = (order.status || "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    const orderId = order._id?.toString() || "";

    const subject = `Order Update — MyLaundry #${orderId.slice(-8)} is "${statusText}"`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Order Status Update 📦</h1>
            <p>Hi ${escapeHtml(order.userName || "there")},</p>
            <p>Your order <strong>#${escapeHtml(orderId.slice(-8))}</strong> status has been updated to:</p>
            <p style="font-size: 24px; font-weight: bold; color: #059669;">${escapeHtml(statusText)}</p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">— The MyLaundry Team</p>
        </div>
    `;
    const text = `Order #${orderId} status: ${statusText}`;
    return sendEmail(userEmail, subject, html, text);
}

// Order receipt
export async function sendOrderReceiptEmail(userEmail, order = {}) {
    const orderId = order._id?.toString() || "—";
    const subject = `Receipt — MyLaundry Order #${orderId.slice(-8)}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Payment Receipt 🧾</h1>
            <p>Hi ${escapeHtml(order.userName || "there")},</p>
            <p>Receipt for order <strong>#${escapeHtml(orderId.slice(-8))}</strong></p>
            <p><strong>Total Paid: ₹${escapeHtml(String(order.total || "0"))}</strong></p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px;">— The MyLaundry Team</p>
        </div>
    `;
    const text = `Receipt for order #${orderId}. Total: ₹${order.total || 0}`;
    return sendEmail(userEmail, subject, html, text);
}

// HTML escape helper
function escapeHtml(s = "") {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Default export
export default {
    sendEmail,
    verifyTransporter,
    resetTransporter,
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateEmail,
    sendOrderReceiptEmail,
};
