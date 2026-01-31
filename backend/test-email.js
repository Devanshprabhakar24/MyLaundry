import { sendWelcomeEmail } from './src/services/emailService.js';

console.log('🧪 Testing email service...\n');

const result = await sendWelcomeEmail('dev24prabhakar@gmail.com', 'Test User');

console.log('\n📧 Email send result:', result);

if (result.ok) {
    console.log('✅ Email sent successfully!');
    console.log('Check your inbox at dev24prabhakar@gmail.com');
} else {
    console.log('❌ Email failed to send');
    console.log('Error:', result.error);
}

process.exit(result.ok ? 0 : 1);
