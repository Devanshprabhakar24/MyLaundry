import fetch from 'node-fetch';

const ENDPOINT = "https://mylaundry-backend-hi3w.onrender.com/dev/seed";

async function runRemoteFix() {
    console.log(`📡 Connecting to Remote Server: ${ENDPOINT}`);
    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        console.log("-----------------------------------------");
        console.log("REMOTE SERVER RESPONSE:");
        console.log(JSON.stringify(data, null, 2));
        console.log("-----------------------------------------");

        const combinedResults = (data.results || []).join(" ");
        if (combinedResults.includes("dev24prabhakar@gmail.com")) {
            console.log("✅ SUCCESS: The server has received the new code and processed your account.");
        } else {
            console.log("⚠️  WARNING: The server seems to be running OLD code (Deployment not finished yet).");
            console.log("   It did not report fixing 'dev24prabhakar@gmail.com'.");
        }

    } catch (error) {
        console.error("❌ Request Failed:", error.message);
    }
}

runRemoteFix();
