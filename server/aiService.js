
/**
 * Generates the payload for the AI API based on the excel data.
 * This is where any pre-processing or filtering logic should go.
 * @param {Object} excelData - The data object returned from readExcelData
 * @returns {Object} The payload to send to the AI API
 */
// server/aiService.js
export const generateAiPayload = (excelData, targetEventName = null) => {
    // 1. Identify events with Critical, Moderate, or High (Alto) criticality
    // If targetEventName is provided, we prioritize that specific event regardless of criticality.

    const targetEvents = excelData.events.filter(event => {
        const criticality = (event.criticality || '').toLowerCase().trim();
        const eventName = (event.event || '').trim();
        const targetName = (targetEventName || '').trim();

        // 1. If target is specified, match it exactly (case-insensitive if needed, but usually exact from UI)
        if (targetEventName) {
            return eventName === targetName;
        }

        // 2. Otherwise filter by criticality
        return ['crítico', 'moderado', 'alto'].includes(criticality);
    });

    const targetEventNames = targetEvents.map(e => e.event.trim());
    console.log(`[AI Service] Selected events for analysis: ${targetEventNames.join(', ')}`);
    console.log(`[AI Service] Total mentions available in excelData: ${excelData.mentions.length}`);

    // Debug: Print some available event names from mentions to see what we have
    const sampleMentionEvents = [...new Set(excelData.mentions.map(m => m.eventName).filter(Boolean))].slice(0, 5);
    console.log(`[AI Service] Sample Mention Events in Data: ${JSON.stringify(sampleMentionEvents)}`);

    // 2. Filter mentions that belong to these events
    const filteredMentions = excelData.mentions.filter(mention => {
        if (!mention.eventName) return false;
        const mentionEvent = mention.eventName.trim().toLowerCase();
        // Check if any of the target events are contained within the mention's event name
        // (Handles prefixes like "25/01 - ...") and case insensitivity
        const match = targetEventNames.some(target => mentionEvent.includes(target.toLowerCase()));

        // Detailed debug for a specific fail case if needed (uncomment to debug specific strings)
        // if (targetEventNames[0] && mentionEvent.includes("rafinha")) {
        //      console.log(`Comparing '${mentionEvent}' with target '${targetEventNames[0]}' -> Match: ${match}`);
        // }

        return match;
    });

    console.log(`[AI Service] Found ${filteredMentions.length} mentions for analysis.`);

    // 3. Format payload as requested
    // LIMIT REMOVED per user request despite potential token risks
    console.log(`[AI Service] Sending ALL ${filteredMentions.length} mentions for analysis.`);

    const texts = filteredMentions.map(mention => ({
        evento: mention.eventName,
        snippet: mention.text,
        sentiment: mention.sentiment
    }));

    return {
        texts: texts
    };
};

/**
 * Sends the payload to the AI API.
 * @param {Object} payload - The payload object
 * @returns {Promise<Object>} The response from the AI API
 */
export const fetchAiInsights = async (payload) => {
    const AI_API_URL = 'http://localhost:8000/prevision/generate-summary/'; // Make sure to handle this path correctly if it changes

    // NOTE: The user mentioned "http://localhost:8000" but didn't specify the exact endpoint (e.g., /analyze).
    // I will assume the root or a generic endpoint for now. 
    // If the 8000 server expects a specific path, we should add it here.
    // Verify payload

    const response = await fetch(AI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("AI API Error Response:", errorText);
        throw new Error(`AI API responded with status: ${response.status}`);
    }

    return await response.json();
};
