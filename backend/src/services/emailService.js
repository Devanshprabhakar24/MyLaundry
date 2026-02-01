// backend/src/services/emailService.js
// Robust email service for MyLaundry — exports named helpers used across routes.
// Uses nodemailer; falls back to Ethereal for dev if SMTP not configured.

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Cache transporter instance
let cachedTransporter = null;

async function createTransporter() {
    // Return cached transporter if available
    if (cachedTransporter) {
        return cachedTransporter;
    }

    const host = process.env.EMAIL_HOST?.trim();
    const portRaw = process.env.EMAIL_PORT?.trim();
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    console.log("[emailService] Initializing email transporter...");
    console.log("[emailService] EMAIL_HOST:", host ? `${host.substring(0, 5)}...` : "NOT SET");
    console.log("[emailService] EMAIL_PORT:", portRaw || "NOT SET");
    console.log("[emailService] EMAIL_USER:", user ? `${user.substring(0, 5)}...` : "NOT SET");
    console.log("[emailService] EMAIL_PASS:", pass ? "****SET****" : "NOT SET");

    // Dev fallback: Ethereal
    if (!host || !portRaw || !user || !pass || host === "smtp.example.com") {
        console.warn("[emailService] SMTP credentials not found or using placeholder. Creating Ethereal test account for dev.");
        try {
            const testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: { user: testAccount.user, pass: testAccount.pass },
            });
            transporter.__isEthereal = true;
            cachedTransporter = transporter;
            return transporter;
        } catch (err) {
            console.error("[emailService] Failed to create Ethereal account:", err.message);
            return null;
        }
    }

    const port = parseInt(portRaw, 10) || 587;
    const secure = port === 465;

    // Gmail-specific configuration
    const isGmail = host.includes("gmail");

    const transportConfig = {
        host,
        port,
        secure,
        auth: { user, pass },
        connectionTimeout: 30_000,
        greetingTimeout: 15_000,
        socketTimeout: 30_000,
    };

    // For Gmail, use specific settings that work better in production
    if (isGmail) {
        transportConfig.service = "gmail";
        transportConfig.auth = {
            user,
            pass, // This should be an App Password, not regular password
        };
        // Remove host/port when using service
        delete transportConfig.host;
        delete transportConfig.port;
        delete transportConfig.secure;
        console.log("[emailService] Using Gmail service configuration");
    } else {
        transportConfig.tls = {
            rejectUnauthorized: process.env.NODE_ENV === "production",
            minVersion: "TLSv1.2"
        };
    }

    const transporter = nodemailer.createTransport(transportConfig);
    cachedTransporter = transporter;
    return transporter;
}

// Reset transporter (useful for reconnection)
export function resetTransporter() {
    cachedTransporter = null;
    transporterPromise = createTransporter();
}

let transporterPromise = createTransporter();

function logSmtpError(err) {
    try {
        console.error("  message:", err && err.message ? err.message : err);
        if (err && err.code) console.error("  code:", err.code);
        if (err && err.response) console.error("  response:", typeof err.response === "string" ? err.response : JSON.stringify(err.response));
        if (err && err.responseCode) console.error("  responseCode:", err.responseCode);
        if (err && err.stack) console.error("  stack:", err.stack.split("\n").slice(0, 6).join("\n"));
    } catch (e) {
        console.error("[emailService] error logging failure", e);
    }
}

// Verify transporter at startup
export async function verifyTransporter() {
    try {
        const t = await transporterPromise;
        if (!t) {
            console.warn("[emailService] No transporter available - emails will be skipped");
            return false;
        }
        await t.verify();
        console.log("[emailService] ✅ SMTP transporter verified successfully.");
        return true;
    } catch (err) {
        console.error("[emailService] ❌ SMTP transporter verification failed:");
        logSmtpError(err);

        // In production, log helpful tips
        if (process.env.NODE_ENV === "production") {
            console.error("[emailService] Production troubleshooting tips:");
            console.error("  1. Ensure EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS are set in Vercel environment variables");
            console.error("  2. For Gmail, use an App Password (not your regular password)");
            console.error("  3. Create App Password at: https://myaccount.google.com/apppasswords");
        }
        return false;
    }
}

// Generic send with retry
export async function sendEmail(to, subject, html, text, retries = 2) {
    try {
        const t = await transporterPromise;
        if (!t) {
            console.warn("[emailService] No transporter - skipping email to:", to);
            return { ok: false, error: "Email service not configured" };
        }

        const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || `MyLaundry <no-reply@mylaundry.local>`;

        console.log(`[emailService] Attempting to send email to: ${to}`);
        console.log(`[emailService] Subject: ${subject}`);
        console.log(`[emailService] From: ${from}`);

        const info = await t.sendMail({ from, to, subject, text: text || undefined, html });

        if (t.__isEthereal) {
            console.log("[emailService] Preview URL:", nodemailer.getTestMessageUrl(info));
        }
        console.log(`[emailService] ✅ Email sent to ${to} (messageId=${info.messageId})`);
        return { ok: true, info };
    } catch (err) {
        console.error("[emailService] ❌ Failed to send email:");
        logSmtpError(err);

        // Retry logic for transient errors
        if (retries > 0 && (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT' || err.code === 'ESOCKET')) {
            console.log(`[emailService] Retrying... (${retries} attempts left)`);
            resetTransporter();
            await new Promise(resolve => setTimeout(resolve, 2000));
            return sendEmail(to, subject, html, text, retries - 1);
        }

        return { ok: false, error: String(err && err.message ? err.message : err) };
    }
}

// === Convenience email helpers ===

// Welcome email
export async function sendWelcomeEmail(userEmail, userName = "") {
    const subject = "Welcome to MyLaundry!";
    const html = `<h1>Welcome${userName ? ", " + escapeHtml(userName) : ""}!</h1><p>Thanks for signing up.</p>`;
    const text = `Welcome${userName ? ", " + userName : ""}! Thanks for signing up.`;
    return sendEmail(userEmail, subject, html, text);
}

// Order confirmation (placed)
export async function sendOrderConfirmationEmail(userEmail, order = {}) {
    const orderId = order._id?.toString() || "—";
    const itemsHtml = Array.isArray(order.items) && order.items.length
        ? `<ul>${order.items.map(it => `<li>${escapeHtml(String(it.name || it.service || it))} — qty:${escapeHtml(String(it.quantity || 1))}</li>`).join("")}</ul>`
        : "<p>No items listed.</p>";
    const subject = `Order Confirmation — MyLaundry #${orderId.slice(-8)}`;
    const html = `<h1>Order Confirmed</h1><p>Hi ${escapeHtml(order.userName || "")},</p><p>Your order <strong>#${escapeHtml(orderId)}</strong> has been received.</p><p><strong>Items:</strong></p>${itemsHtml}<p><strong>Total:</strong> ${escapeHtml(String(order.total || "0"))}</p>`;
    const text = `Order #${orderId} confirmed. Total: ${order.total || 0}.`;
    return sendEmail(userEmail, subject, html, text);
}

// Order status update (status changed)
export async function sendOrderStatusUpdateEmail(userEmail, order = {}) {
    const statusText = (order.status || "").replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    const subject = `Your MyLaundry Order #${order._id?.toString()?.slice(-8) || "—"} is now "${statusText}"`;
    const html = `<h1>Order Status Update</h1><p>Hi ${escapeHtml(order.userName || "")},</p><p>Your order <strong>#${escapeHtml(order._id?.toString() || "")}</strong> status: <strong>${escapeHtml(statusText)}</strong>.</p><p>— MyLaundry</p>`;
    const text = `Order #${order._id} status: ${statusText}`;
    return sendEmail(userEmail, subject, html, text);
}

// Order receipt / invoice
export async function sendOrderReceiptEmail(userEmail, order = {}) {
    const orderId = order._id?.toString() || "—";
    const subject = `Receipt for MyLaundry Order #${orderId.slice(-8)}`;
    const html = `<h1>Order Receipt</h1><p>Hi ${escapeHtml(order.userName || "")},</p><p>Receipt for order <strong>#${escapeHtml(orderId)}</strong>. Total paid: <strong>${escapeHtml(String(order.total || "0"))}</strong></p>`;
    const text = `Receipt for order #${orderId}. Total: ${order.total || 0}`;
    return sendEmail(userEmail, subject, html, text);
}

// helper to escape html fragments
function escapeHtml(s = "") {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// default export for older import styles
export default {
    sendEmail,
    verifyTransporter,
    resetTransporter,
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateEmail,
    sendOrderReceiptEmail,
};
