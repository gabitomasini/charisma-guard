import express from 'express';
import cors from 'cors';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper function to read Excel file
const readExcelData = () => {
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
        const eventNameIndex = mentionsHeaders.indexOf("Nome do Evento");

        // Skip header row
        // @ts-ignore
        const mentionsData = mentionsRaw.slice(1).map(row => ({
            date: row[0],
            time: row[1],
            text: row[3], // Column D is Text
            url: row[4],  // Column E is URL
            // @ts-ignore
            sentiment: (row[5] || 'neutral').toLowerCase(), // Column F is Sentiment
            source: row[6], // Column G is Domain/Source
            location: row[7], // Column H is Location
            author: row[8], // Column I is Authot
            eventName: eventNameIndex > -1 ? row[eventNameIndex] : undefined
            // @ts-ignore
        })).filter(m => m.text && m.date);

        // Parse 'fórmulas' sheet
        const formulasSheet = workbook.Sheets['fórmulas'];
        const formulasRaw = XLSX.utils.sheet_to_json(formulasSheet, { header: 1 });

        // Skip header row
        // Headers: EVENTO(0), Neg(1), Neu(2), Pos(3), Total(4), AlcNeg(5), AlcNeu(6), AlcPos(7), AlcTotal(8), NR(9), IVN(10), IAN(11), RISCO(12), Criticidade(13)
        // @ts-ignore
        const eventsData = formulasRaw.slice(1).map(row => ({
            event: row[0],
            negative: row[1] || 0,
            neutral: row[2] || 0,
            positive: row[3] || 0,
            total: row[4] || 0,
            reach_negative: row[5] || 0,
            reach_neutral: row[6] || 0,
            reach_positive: row[7] || 0,
            reach_total: row[8] || 0,
            risk: row[12] || 0,
            criticality: row[13] || 'Baixo'
            // @ts-ignore
        })).filter(e => e.event);

        return { mentions: mentionsData, events: eventsData, lastUpdate: new Date() };
    } catch (error) {
        console.error("Error reading Excel file:", error);
        throw error;
    }
};

app.get('/api/dashboard-data', (req, res) => {
    try {
        const data = readExcelData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
