import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"MyLaundry Service" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
    }
};

// --- Email Templates ---

export const sendWelcomeEmail = (userEmail, name) => {
    const subject = "Welcome to MyLaundry!";
    const html = `
    <h1>Hi ${name},</h1>
    <p>Welcome to MyLaundry! We're excited to help you with all your laundry needs.</p>
    <p>You can now schedule pickups, track your orders, and manage your account online.</p>
    <p>Best,<br/>The MyLaundry Team</p>
  `;
    sendEmail(userEmail, subject, html);
};

export const sendOrderConfirmationEmail = (userEmail, order) => {
    const subject = `Your MyLaundry Order Confirmation #${order._id.toString().slice(-6)}`;
    const html = `
    <h1>Order Confirmed!</h1>
    <p>Hi there,</p>
    <p>Your order #${order._id.toString().slice(-6)} has been successfully placed.</p>
    <p><b>Pickup Date:</b> ${new Date(order.pickupDate).toLocaleDateString()}</p>
    <p><b>Total:</b> ₹${order.total}</p>
    <p>We'll notify you when our driver is on the way. You can track your order status from your dashboard.</p>
  `;
    sendEmail(userEmail, subject, html);
};

export const sendOrderStatusUpdateEmail = (userEmail, order) => {
    const statusText = order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const subject = `Your MyLaundry Order #${order._id.toString().slice(-6)} has been updated to "${statusText}"`;
    const html = `
        <h1>Order Status Update</h1>
        <p>Hi there,</p>
        <p>The status of your order #${order._id.toString().slice(-6)} is now: <strong>${statusText}</strong>.</p>
        <p>You can view the full details on your dashboard.</p>
    `;
    sendEmail(userEmail, subject, html);
};