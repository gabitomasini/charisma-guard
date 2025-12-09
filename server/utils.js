import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read Excel file
export const readExcelData = (options = {}) => {
    try {
        const filePath = path.join(__dirname, '../public/Mentions_Coritiba.xlsx');
        const workbook = XLSX.readFile(filePath);

        // Parse 'mentions' sheet
        const mentionsSheet = workbook.Sheets['mentions_jan_a_mar'];
        const mentionsRaw = XLSX.utils.sheet_to_json(mentionsSheet, { header: 1 });

        // Find header row and indices
        // @ts-ignore
        const mentionsHeaders = mentionsRaw[0];

        // @ts-ignore
        const eventNameIndex = mentionsHeaders.indexOf("EVENTO");

        // Skip header row
        // @ts-ignore
        // @ts-ignore
        const mentionsData = mentionsRaw.slice(1).map(row => {
            const rawSentiment = (row[5] || 'neutral').toString().toLowerCase().trim();
            let sentiment = 'neutral';
            if (rawSentiment.includes('pos')) sentiment = 'positive';
            else if (rawSentiment.includes('neg')) sentiment = 'negative';

            // Format date if it's an Excel serial number
            let dateStr = row[0];
            if (typeof row[0] === 'number') {
                const dateObj = XLSX.SSF.parse_date_code(row[0]);
                // pad with leading zeros
                const day = String(dateObj.d).padStart(2, '0');
                const month = String(dateObj.m).padStart(2, '0');
                dateStr = `${day}/${month}/${dateObj.y}`;
            }

            return {
                date: dateStr,
                time: row[1],
                text: row[3], // Column D is Text
                url: row[4],  // Column E is URL
                sentiment: sentiment, // Normalized to 'positive' | 'negative' | 'neutral'
                source: row[6], // Column G is Domain/Source
                location: row[7], // Column H is Location
                author: row[8], // Column I is Authot
                eventName: (() => {
                    if (eventNameIndex === -1 || !row[eventNameIndex]) return undefined;
                    let name = String(row[eventNameIndex]).trim();
                    name = name.replace(/^\d{2}\/\d{2}\s*[-–]\s*/, '');
                    return name.trim();
                })()
            };
        }).filter(m => m.text && m.date);

        console.log(`[DEBUG] Loaded ${mentionsData.length} mentions. First sentiment: ${mentionsData[0]?.sentiment}`);

        // Parse 'fórmulas' sheet
        const formulasSheet = workbook.Sheets['fórmulas'];
        const formulasRaw = XLSX.utils.sheet_to_json(formulasSheet, { header: 1 });

        // Skip header row
        // Headers: EVENTO(0), Neg(1), Neu(2), Pos(3), Total(4), AlcNeg(5), AlcNeu(6), AlcPos(7), AlcTotal(8), NR(9), IVN(10), IAN(11), RISCO(12), Criticidade(13)
        // @ts-ignore
        const eventsData = formulasRaw.slice(1).map(row => ({
            date: row[0] ? XLSX.SSF.format("yyyy-mm-dd", row[0]) : '',
            event: row[1] ? String(row[1]).trim() : '',
            negative: row[2] || 0,
            neutral: row[3] || 0,
            positive: row[4] || 0,
            total: row[5] || 0,
            reach_negative: row[6] || 0,
            reach_neutral: row[7] || 0,
            reach_positive: row[8] || 0,
            reach_total: row[9] || 0,
            // NR(10), IVN(11), IAN(12)
            risk: row[13] || 0,
            criticality: row[14] || 'Baixo'
        })).filter(e => e.event);

        // Initial filtering by valid text and date
        let finalMentions = mentionsData.filter(m => m.text && m.date);

        console.log(`[DEBUG] Request Options:`, options);

        // Apply Sentiment Filter
        if (options.sentiment && options.sentiment !== 'all') {
            console.log(`[DEBUG] Filtering by sentiment: ${options.sentiment}`);
            finalMentions = finalMentions.filter(m => m.sentiment === options.sentiment);
            console.log(`[DEBUG] Filtered count: ${finalMentions.length}`);
        }

        // Apply Sorting
        if (options.sort) {
            console.log(`[DEBUG] Sorting by: ${options.sort}`);
            finalMentions.sort((a, b) => {
                const parseDate = (dateStr, timeStr) => {
                    try {
                        // formats: DD/MM/YYYY or DD/MM
                        if (!dateStr) return 0;
                        const parts = String(dateStr).split('/');
                        let day = parseInt(parts[0], 10);
                        let month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
                        // If year is missing, assume current year or generic year for comparison
                        let year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();

                        let hours = 0, mins = 0;
                        if (timeStr) {
                            // timeStr can be generic formatted number from Excel like 0.5 for noon, 
                            // or a string "HH:MM"
                            if (String(timeStr).includes(':')) {
                                const tParts = String(timeStr).split(':');
                                hours = parseInt(tParts[0], 10);
                                mins = parseInt(tParts[1], 10);
                            } else if (typeof timeStr === 'number') {
                                // Excel fraction of day
                                const totalMins = Math.floor(timeStr * 24 * 60);
                                hours = Math.floor(totalMins / 60);
                                mins = totalMins % 60;
                            }
                        }

                        return new Date(year, month, day, hours, mins).getTime();
                    } catch (e) {
                        return 0;
                    }
                };

                const timeA = parseDate(a.date, a.time);
                const timeB = parseDate(b.date, b.time);

                return options.sort === 'newest' ? timeB - timeA : timeA - timeB;
            });
        }

        return { mentions: finalMentions, events: eventsData, lastUpdate: new Date() };
    } catch (error) {
        console.error("Error reading Excel file:", error);
        throw error;
    }
};
