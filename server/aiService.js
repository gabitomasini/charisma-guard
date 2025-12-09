
/**
 * Generates the payload for the AI API based on the excel data.
 * This is where any pre-processing or filtering logic should go.
 * @param {Object} excelData - The data object returned from readExcelData
 * @returns {Object} The payload to send to the AI API
 */
// server/aiService.js
export const generateAiPayload = (excelData, targetEventName = null) => {
    // 1. Identify events with Critical or Moderate criticality
    // If targetEventName is provided, we ALSO filter by that name.

    const criticalOrModerateEvents = excelData.events
        .filter(event => {
            const criticality = (event.criticality || '').toLowerCase();
            const isCriticalOrModerate = criticality === 'crítico' || criticality === 'moderado';

            if (targetEventName) {
                return isCriticalOrModerate && event.event === targetEventName;
            }
            return isCriticalOrModerate;
        })
        .map(event => event.event); // We only need the event name


    // 2. Filter mentions that belong to these events


    const filteredMentions = excelData.mentions
        .filter(mention => criticalOrModerateEvents.includes(mention.eventName));

    // 3. Format payload as requested
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
