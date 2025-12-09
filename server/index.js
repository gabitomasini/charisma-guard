import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchDashboardData } from './utils.js';
import { generateAiPayload, fetchAiInsights } from './aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());



app.get('/api/dashboard-data', async (req, res) => {
    try {
        const { sentiment, sort, eventName, source } = req.query;
        const data = await fetchDashboardData({ sentiment, sort, eventName, source });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

app.get('/api/ai-analysis', async (req, res) => {
    try {
        const { event } = req.query;
        // Fix: Fetch newest mentions AND specific event mentions to ensure we catch relevant data
        const data = await fetchDashboardData({ sort: 'newest', eventName: event });
        const payload = generateAiPayload(data, event);
        const insights = await fetchAiInsights(payload);
        res.json(insights);
    } catch (error) {
        console.error("Error fetching AI insights:", error);
        res.status(500).json({ error: 'Failed to fetch AI insights', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
