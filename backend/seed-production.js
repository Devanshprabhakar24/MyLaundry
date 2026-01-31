import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";

const USERS_TO_SEED = [
    {
        name: "Demo User",
        email: "user@example.com",
        password: "123456789",
        role: "user"
    },
    {
        name: "Demo Admin",
        email: "admin@mylaundry.com",
        password: "123456789",
        role: "admin"
    },
    {
        name: "Devansh Prabhakar",
        email: "dev24prabhakar@gmail.com",
        password: "123456789",
        role: "user"
    }
];

async function seedDatabase() {
    console.log("=".repeat(60));
    console.log("🌱 SEEDING PRODUCTION DATABASE");
    console.log("=".repeat(60));
    console.log(`📡 Connecting to: ${process.env.MONGODB_URI?.split('@')[1] || 'MongoDB'}`);

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        for (const userData of USERS_TO_SEED) {
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                // Update existing user - delete and recreate to ensure fresh password hash
                await User.deleteOne({ email: userData.email });
                console.log(`🔄 Deleted existing: ${userData.email}`);
            }

            // Create new user - pre-save hook will hash the password
            const newUser = new User(userData);
            await newUser.save();
            console.log(`✅ Created: ${userData.email} (role: ${userData.role})`);
        }

        console.log("\n" + "=".repeat(60));
        console.log("🎉 SEEDING COMPLETE");
        console.log("=".repeat(60));
        console.log("You can now log in with any of these credentials:");
        console.log("  - user@example.com / 123456789 (User)");
        console.log("  - admin@mylaundry.com / 123456789 (Admin)");
        console.log("  - dev24prabhakar@gmail.com / 123456789 (User)");
        console.log("=".repeat(60));

    } catch (error) {
        console.error("❌ Seeding Failed:", error.message);
        console.error(error);
    } finally {
        await mongoose.disconnect();
        console.log("\n✅ Disconnected from MongoDB");
        process.exit();
    }
}

seedDatabase();
