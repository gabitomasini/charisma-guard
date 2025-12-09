import { fetchDashboardData } from './utils.js';

async function verifyMigration() {
    try {
        console.log("Fetching dashboard data from DB...");
        const data = await fetchDashboardData({ sort: 'newest' });

        console.log("--- Verification Results ---");
        console.log(`Events Found: ${data.events.length}`);
        if (data.events.length > 0) {
            console.log("Sample Event:", data.events[0]);
        }

        console.log(`Mentions Found: ${data.mentions.length}`);
        if (data.mentions.length > 0) {
            console.log("Sample Mention:", data.mentions[0]);
        }

        console.log("Last Update:", data.lastUpdate);

        if (data.events.length > 0 && data.mentions.length > 0) {
            console.log("\n✅ SUCCESS: Data loaded from PostgreSQL correctly.");
        } else {
            console.log("\n⚠️ WARNING: Data loaded but lists are empty. Check database content.");
        }

    } catch (error) {
        console.error("\n❌ FAILED: Error fetching data.", error);
    }
}

verifyMigration();
