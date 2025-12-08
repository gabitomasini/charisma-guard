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

export const loadExcelData = async (): Promise<DashboardData> => {
    try {
        const response = await fetch('/api/dashboard-data');
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
