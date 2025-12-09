import { query } from './db.js';

// Helper to format date
const formatDate = (date) => {
    if (!date) return '';
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return String(date);

        // Format to DD/MM/YYYY
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return String(date);
    }
};

export const fetchDashboardData = async (options = {}) => {
    try {
        console.log(" [DEBUG] Executing fetchDashboardData with UPDATED SQL logic");
        // --- 1. Fetch Mentions from 'coritiba_mentions_bw' ---
        let mentionsQuery = `
            SELECT 
                date, time, title, snippet, url, sentiment, 
                page_type as source, region as location, author, evento as "eventName"
            FROM coritiba_mentions_bw
            WHERE date IS NOT NULL
        `;

        const params = [];
        let paramCount = 1;

        if (options.eventName) {
            mentionsQuery += ` AND evento = $${paramCount}`;
            params.push(options.eventName);
            paramCount++;
        }

        // Sentiment Filter
        if (options.sentiment && options.sentiment !== 'all') {
            // Using ILIKE for case-insensitive matching (e.g., 'Positive' matches 'positive')
            mentionsQuery += ` AND sentiment ILIKE $${paramCount}`;
            params.push(`%${options.sentiment}%`);
            paramCount++;
        }

        // Source (Social Network) Filter
        if (options.source && options.source !== 'all') {
            mentionsQuery += ` AND page_type ILIKE $${paramCount}`;
            params.push(`%${options.source}%`);
            paramCount++;
        }

        // Sorting
        if (options.sort === 'newest') {
            mentionsQuery += ` ORDER BY date DESC, time DESC`;
        } else {
            mentionsQuery += ` ORDER BY date ASC, time ASC`;
        }

        // Safety limit (optional but good practice)
        mentionsQuery += ` LIMIT 5000`;

        console.log(`[DB] Executing mentions query...`);
        const mentionsRes = await query(mentionsQuery, params);

        const mentions = mentionsRes.rows.map(row => ({
            date: formatDate(row.date),
            time: row.time,
            text: row.snippet || row.title, // Use snippet if available, else title
            url: row.url,
            sentiment: (row.sentiment || 'neutral').toLowerCase().trim(),
            source: row.source,
            location: row.location,
            author: row.author,
            eventName: row.eventName ? row.eventName.trim() : undefined
        }));

        console.log(`[DB] Fetched ${mentions.length} mentions.`);

        // --- 2. Fetch Events from 'coritiba_indices_bw' ---
        console.log(`[DB] Executing events query...`);
        const eventsRes = await query(`
            SELECT 
                data as "date", evento as "event", 
                mencoes_negativas as negative, mencoes_neutras as neutral, mencoes_positivas as positive, 
                mencoes_total as total,
                CAST(regexp_replace(alcance_negativo, '[^0-9]', '', 'g') AS NUMERIC) as reach_negative, 
                CAST(regexp_replace(alcance_neutro, '[^0-9]', '', 'g') AS NUMERIC) as reach_neutral, 
                CAST(regexp_replace(alcance_positivo, '[^0-9]', '', 'g') AS NUMERIC) as reach_positive, 
                CAST(regexp_replace(alcance_total, '[^0-9]', '', 'g') AS NUMERIC) as reach_total,
                CAST(REPLACE(regexp_replace(risco, '[^0-9,]', '', 'g'), ',', '.') AS NUMERIC) as "risk", 
                criticidade as "criticality",
                interacoes as "interactions"
            FROM coritiba_indices_bw


        `);

        const events = eventsRes.rows.map(row => ({
            date: formatDate(row.date),
            event: row.event,
            negative: Number(row.negative) || 0,
            neutral: Number(row.neutral) || 0,
            positive: Number(row.positive) || 0,
            total: Number(row.total) || 0,
            reach_negative: Number(row.reach_negative) || 0,
            reach_neutral: Number(row.reach_neutral) || 0,
            reach_positive: Number(row.reach_positive) || 0,
            reach_total: Number(row.reach_total) || 0,
            risk: Number(row.risk) || 0,
            criticality: row.criticality || 'Baixo',
            interactions: Number(row.interactions) || 0
        }));

        console.log(`[DB] Fetched ${events.length} events.`);
        if (events.length > 0) {
            console.log("[DEBUG] Sample Event Data Types:", {
                total: typeof events[0].total,
                risk: typeof events[0].risk,
                reach_total: typeof events[0].reach_total,
                value_sample: events[0].reach_total
            });
        }

        // --- 3. Fetch Available Sources (page_type) ---
        console.log(`[DB] Executing sources query...`);
        const sourcesRes = await query(`
            SELECT DISTINCT page_type
            FROM coritiba_mentions_bw
            WHERE page_type IS NOT NULL
            ORDER BY page_type ASC
        `);
        const sources = sourcesRes.rows.map(row => row.page_type);

        return { mentions, events, sources, lastUpdate: new Date() };

    } catch (error) {
        console.error("Error fetching dashboard data from DB:", error);
        throw error;
    }
};
