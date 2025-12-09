import { fetchDashboardData } from './utils.js';
import { generateAiPayload } from './aiService.js';

async function debugAi() {
    try {
        console.log("Fetching data...");
        const data = await fetchDashboardData({ sentiment: 'all' });

        console.log(`Fetched ${data.events.length} events and ${data.mentions.length} mentions.`);

        // Debug Criticality values
        const criticalities = [...new Set(data.events.map(e => e.criticality))];
        console.log("Unique Criticalities found:", criticalities);

        // Check matches
        const uniqueMentionEvents = [...new Set(data.mentions.map(m => m.eventName))];
        console.log("Sample Mention Events from Clean DB:", uniqueMentionEvents.slice(0, 5));

        console.log("Generating payload...");
        const payload = generateAiPayload(data);
        console.log("Payload texts count:", payload.texts.length);

        if (payload.texts.length === 0) {
            console.log("PAYLOAD IS EMPTY! This confirms the issue.");
        } else {
            console.log("Sample text:", payload.texts[0]);
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

debugAi();
