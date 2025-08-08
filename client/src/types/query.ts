export type QueryStatus = "success" | "error" | "pending";

export interface QueryHistoryItem {
  id: string;
  question: string;
  sql: string;
  timestamp: Date;
  status: QueryStatus;
  results?: any; // Optional results from SQL execution
}

export interface QueryHistoryState {
  items: QueryHistoryItem[];
  isLoading: boolean;
  error: string | null;
}
