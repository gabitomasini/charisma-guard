export interface Mention {
    date: string;
    time: string;
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    source: string;
    author: string;
    url: string;
    location?: string;
    eventName?: string;
}

export interface EventMetric {
    date: string;
    event: string;
    negative: number;
    neutral: number;
    positive: number;
    total: number;
    reach_negative: number;
    reach_neutral: number;
    reach_positive: number;
    reach_total: number;
    risk: number;
    criticality: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';
    interactions?: number;
    nr?: number;
}

// Assuming SentimentCounts and VolumeHistory are defined elsewhere or will be defined.
// For the purpose of this edit, we'll treat them as valid types.
interface SentimentCounts {
    positive: number;
    negative: number;
    neutral: number;
}

interface VolumeHistory {
    date: string;
    volume: number;
}

export interface SocialMetric {
    channel: string;
    total: number;
    negative: number;
    positive: number;
    neutral: number;
}

export interface SentimentTrend {
    date: string;
    positive: number;
    negative: number;
    neutral: number;
}

export interface DashboardData {
    mentions: Mention[];
    events: EventMetric[];
    sentimentCounts: SentimentCounts;
    volumeHistory: VolumeHistory[];
    socialMetrics?: SocialMetric[];
    sentimentEvolution?: SentimentTrend[];
    lastUpdate: Date;
    sources?: string[];
}

export const loadExcelData = async (filter?: string, sort?: string, eventName?: string, source?: string): Promise<DashboardData> => {
    try {
        const queryParams = new URLSearchParams();
        if (filter) queryParams.append('sentiment', filter);
        if (sort) queryParams.append('sort', sort);
        if (eventName) queryParams.append('eventName', eventName);
        if (source) queryParams.append('source', source);

        const response = await fetch(`/api/dashboard-data?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();

        // Ensure dates are parsed back to Date objects if needed, 
        // essentially just return the data structure now matching what the server sends
        return {
            ...data,
            lastUpdate: new Date(data.lastUpdate)
        };
    } catch (error) {
        console.error("Error loading data from API:", error);
        return {
            mentions: [],
            events: [],
            sentimentCounts: { positive: 0, negative: 0, neutral: 0 },
            volumeHistory: [],
            lastUpdate: new Date(),
            sources: []
        };
    }
};

export const fetchAiSummaries = async (eventName?: string): Promise<any> => {
    try {
        let url = '/api/ai-analysis';
        if (eventName) {
            url += `?event=${encodeURIComponent(eventName)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching AI summaries:", error);
        return null;
    }
};

export const sendTelegramAlert = async (message: string): Promise<boolean> => {
    try {
        const response = await fetch("http://localhost:8000/telegram/send-message/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Error sending Telegram alert:", error);
        return false;
    }
};
