// backend/testVerifyEmail.js
import { verifyTransporter } from "./src/services/emailService.js";

(async () => {
    await verifyTransporter();
})();
