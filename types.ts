export interface Source {
  title: string;
  url: string;
}

export interface TrendItem {
  id: string;
  title: string;
  category: 'AI' | 'Material Science' | 'Global Economy' | 'Tech';
  summary: string;
  impact: string;
  keywords: string[];
  sources?: Source[];
}

export interface DailyReport {
  date: string;
  summary: string;
  trends: TrendItem[];
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}