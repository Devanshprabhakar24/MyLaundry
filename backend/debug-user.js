import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";

const emailToCheck = process.argv[2] || "dev24prabhakar@gmail.com";

async function checkUser() {
    console.log("---------------------------------------------------------");
    console.log(`🔍 Checking database for user: ${emailToCheck}`);
    console.log(`📡 Connecting to: ${process.env.MONGODB_URI?.split('@')[1] || 'Unknown DB'}`); // Hide credentials
    console.log("---------------------------------------------------------");

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        const user = await User.findOne({ email: emailToCheck });

        if (!user) {
            console.error(`❌ User '${emailToCheck}' NOT FOUND in this database.`);
            console.log("---------------------------------------------------------");
            console.log("Possibilities:");
            console.log("1. You added the data to a LOCAL database (localhost), but this app uses CLOUD (Atlas).");
            console.log("2. The email has a typo.");
            console.log("\nSolution: Use the 'Sign Up' page on the website to create the user in the correct database.");
        } else {
            console.log(`✅ User Found! ID: ${user._id}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Password Field: ${user.password}`);

            const isHashed = user.password && user.password.startsWith('$2');

            if (!isHashed) {
                console.error("\n❌ CRITICAL ISSUE: The password is PLAIN TEXT.");
                console.log("   Reason: You likely manually typed the password in MongoDB Compass.");
                console.log("   Result: Login will FAIL because the system expects an encrypted hash.");
                console.log("\n   Solution: Delete this user in Compass and Sign Up via the App.");
            } else {
                console.log("\n✅ Password appears to be properly hashed (Encrypted).");
                console.log("   If login still fails, the password you are typing doesn't match this hash.");
            }
        }

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        console.log("---------------------------------------------------------");
        await mongoose.disconnect();
        process.exit();
    }
}

checkUser();
