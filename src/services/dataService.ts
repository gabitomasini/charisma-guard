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
}

export interface DashboardData {
    mentions: Mention[];
    events: EventMetric[];
    lastUpdate: Date;
}

export const loadExcelData = async (filter?: string, sort?: string): Promise<DashboardData> => {
    try {
        const queryParams = new URLSearchParams();
        if (filter) queryParams.append('sentiment', filter);
        if (sort) queryParams.append('sort', sort);

        const response = await fetch(`/api/dashboard-data?${queryParams.toString()}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();

        // Ensure dates are parsed back to Date objects if needed, 
        // essentially just return the data structure now matching what the server sends
        return {
            mentions: data.mentions,
            events: data.events,
            lastUpdate: new Date(data.lastUpdate)
        };
    } catch (error) {
        console.error("Error loading data from API:", error);
        return { mentions: [], events: [], lastUpdate: new Date() };
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
