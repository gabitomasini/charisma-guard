import { fetchDashboardData } from './utils.js';

async function debugAppCode() {
    try {
        console.log("Calling fetchDashboardData...");
        const data = await fetchDashboardData({ sentiment: 'all' });
        console.log("Success!");
        console.log("Events fetched:", data.events.length);
        console.table(data.events.slice(0, 3));
    } catch (err) {
        console.error("fetchDashboardData FAILED:", err);
    }
}

debugAppCode();
