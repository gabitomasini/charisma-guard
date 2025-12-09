import { query } from './db.js';

async function inspectMentions() {
    try {
        console.log("Fetching unique event names from mentions...");
        const res = await query(`
            SELECT DISTINCT evento 
            FROM coritiba_mentions_bw 
            WHERE evento ILIKE '%Rafinha%'
        `);
        console.log("Matches for 'Rafinha':");
        console.table(res.rows);
    } catch (err) {
        console.error(err);
    }
}

inspectMentions();
