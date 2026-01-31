import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

const TARGET_EMAIL = "dev24prabhakar@gmail.com";
const TARGET_PASSWORD = "123456789";

async function resetUser() {
    console.log("---------------------------------------------------------");
    console.log(`🛠️  FIXING ACCOUNT: ${TARGET_EMAIL}`);
    console.log(`📡 Connecting to Cloud DB...`);

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected.");

        // 1. Check if user exists
        let user = await User.findOne({ email: TARGET_EMAIL });

        if (user) {
            console.log(`⚠️  User exists. Updating password to '${TARGET_PASSWORD}'...`);
            // Manually hash because findOneAndUpdate bypasses pre-save hooks usually, 
            // but we will use save() to be sure or manual hash.
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(TARGET_PASSWORD, salt);
            await user.save();
            console.log("✅ Password updated successfully.");
        } else {
            console.log(`⚠️  User not found. Creating new account...`);
            const newUser = new User({
                name: "Devansh Prabhakar",
                email: TARGET_EMAIL,
                password: TARGET_PASSWORD, // pre-save hook will hash this
                role: "admin", // Giving admin access so you can see everything
                phone: "9876543210"
            });
            await newUser.save();
            console.log("✅ User created successfully.");
        }

        console.log("---------------------------------------------------------");
        console.log("🎉 FIX COMPLETE");
        console.log(`👉 You can now login with:`);
        console.log(`   Email: ${TARGET_EMAIL}`);
        console.log(`   Password: ${TARGET_PASSWORD}`);
        console.log("---------------------------------------------------------");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

resetUser();
