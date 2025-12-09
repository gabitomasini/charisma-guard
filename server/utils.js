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
                CAST(REPLACE(regexp_replace(nr, '[^0-9,]', '', 'g'), ',', '.') AS NUMERIC) as "nr",
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
            nr: Number(row.nr) || 0,
            criticality: row.criticality,
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

        // --- 4. Fetch Social Metrics from 'coritiba_redes_sociais_bw' ---
        console.log(`[DB] Executing social metrics query...`);
        const socialRes = await query(`
            SELECT * FROM coritiba_redes_sociais_bw
        `);

        if (socialRes.rows.length > 0) {
            console.log("[DEBUG] Social Metrics Row Structure:", Object.keys(socialRes.rows[0]));
            // Also log the first row values to be sure
            console.log("[DEBUG] First Row:", socialRes.rows[0]);
        }

        // Map assuming potential column names based on other tables, but keeping it raw for inspection if needed
        // Assuming columns: rede_social, mencoes_total, mencoes_negativas, etc.
        const socialMetrics = socialRes.rows.map(row => ({
            channel: row.page_type,
            total: Number(row.mencoes_total) || Number(row.total) || 0,
            negative: Number(row.mencoes_negativas) || Number(row.negativas) || 0,
            positive: Number(row.mencoes_positivas) || Number(row.positivas) || 0,
            neutral: Number(row.mencoes_neutras) || Number(row.neutras) || 0
        }));

        // --- 5. Calculate Sentiment Evolution from Fetched Mentions (In-Memory) ---
        // Reuse the 'mentions' array (first 5000 rows) to avoid slow DB aggregation
        const evolutionMap = {};

        mentions.forEach(m => {
            if (!m.date) return;
            const d = new Date(m.date);
            if (isNaN(d.getTime())) return;

            // Format YYYY-MM
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

            if (!evolutionMap[key]) {
                evolutionMap[key] = { date: key, positive: 0, negative: 0, neutral: 0 };
            }

            const sentiment = m.sentiment ? m.sentiment.toLowerCase() : '';
            if (sentiment === 'positivo') evolutionMap[key].positive++;
            else if (sentiment === 'negativo') evolutionMap[key].negative++;
            else evolutionMap[key].neutral++; // treat others/neutral as neutral
        });

        const sentimentEvolution = Object.values(evolutionMap).sort((a, b) => a.date.localeCompare(b.date));

        return { mentions, events, sources, socialMetrics, sentimentEvolution, lastUpdate: new Date() };

    } catch (error) {
        console.error("Error fetching dashboard data from DB:", error);
        throw error;
    }
};
