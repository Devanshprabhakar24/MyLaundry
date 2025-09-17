// backend/testSendEmail.js
import { sendWelcomeEmail } from "./src/services/emailService.js";

(async () => {
    const res = await sendWelcomeEmail("dev24prabhakar@gmail.com", "Devansh");
    console.log("Result:", res);
})();
