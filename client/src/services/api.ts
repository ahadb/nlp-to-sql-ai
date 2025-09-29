import { authService } from './auth';
import { API_URLS, API_CONFIG, buildApiUrlWithParams } from '../config/api';

export interface UploadResponse {
  message: string;
  schema: string;
}

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  data: {
    question: string;
    sql_query: string;
    schema: string;
  };
}

export interface DatabaseResponse {
  database: string;
  file_type?: string;
  available_databases?: {
    sql: string;
    csv: string;
  };
}

export interface InsightData {
  title: string;
  metric: string;
  change: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  data_points: number[];
}

export interface InsightsResponse {
  status: string;
  insights: InsightData[];
  patterns: InsightData[];
  message: string;
}

export interface ChatMessage {
  message: string;
  schema_id?: string;
  user_id?: string;
}

export interface ChatResponse {
  status: string;
  message: string;
  sql_query?: string;
  query_results?: {
    columns: string[];
    data: any[];
    row_count: number;
    error?: string;
  };
  context?: any;
  timestamp: string;
}

export const api = {
  async uploadSchema(file: File): Promise<UploadResponse> {
    // Read file content
    const fileContent = await file.text();
    
    // Determine schema type
    const isCSV = file.name.endsWith('.csv');
    const schemaType = isCSV ? 'CSV_FILE' : 'SQL_SCHEMA';
    
    // Prepare request body for your backend
    const requestBody = {
      file_name: file.name,
      file_content: fileContent,
      schema_type: schemaType,
      description: `Uploaded ${isCSV ? 'CSV' : 'SQL'} file: ${file.name}`
    };

    const response = await authService.authenticatedFetch(API_URLS.UPLOAD, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Upload failed");
    }

    const backendResponse = await response.json();
    
    // Transform backend response to match expected format
    return {
      message: backendResponse.message,
      schema: backendResponse.schema_id || 'unknown'
    };
  },

  async generateSQL(
    question: string,
    schema?: string,
    table?: string
  ): Promise<QueryResponse> {
    // Use AWS generate endpoint from environment variable
    const awsGenerateUrl = import.meta.env.VITE_AWS_GENERATE_URL;

    if (!awsGenerateUrl) {
      throw new Error("AWS generate endpoint not configured");
    }

    // Build dynamic URL with query parameters
    // Parse the base URL to avoid duplicate query parameters
    const baseUrl = new URL(awsGenerateUrl);
    const queryParams = new URLSearchParams(baseUrl.search);

    // Override or add schema and table parameters
    if (schema) queryParams.set("schema", schema);
    if (table) queryParams.set("table", table);

    // Reconstruct the URL with the updated parameters
    baseUrl.search = queryParams.toString();
    const fullUrl = baseUrl.toString();

    console.log("Calling AWS generate endpoint:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to generate SQL");
    }

    const awsResponse = await response.json();

    // Transform AWS response to match existing QueryResponse format
    return {
      data: {
        question,
        sql_query: awsResponse.sql,
        schema: awsResponse.schema_used,
      },
    };
  },

  async runSQL(sql: string, schema?: string): Promise<any> {
    // Use AWS query endpoint from environment variable
    const awsQueryUrl = import.meta.env.VITE_AWS_QUERY_URL;

    if (!awsQueryUrl) {
      throw new Error("AWS query endpoint not configured");
    }

    // Build dynamic URL with schema parameter
    const fullUrl = schema ? `${awsQueryUrl}?schema=${schema}` : awsQueryUrl;

    console.log("Calling AWS query endpoint:", fullUrl, "with SQL:", sql);

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to run SQL");
    }

    const awsResponse = await response.json();

    // Transform AWS response to match expected format
    return {
      data: awsResponse.rows || [],
      schema_used: awsResponse.schema_used,
      sql: awsResponse.sql,
      ...awsResponse,
    };
  },

  async getDataSources(): Promise<any> {
    const response = await authService.authenticatedFetch(API_URLS.UPLOAD_SCHEMAS, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get data sources");
    }

    return response.json();
  },

  async getTables(): Promise<any> {
    const response = await authService.authenticatedFetch(API_URLS.TABLES, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get tables");
    }

    return response.json();
  },

  async getCurrentDatabase(): Promise<DatabaseResponse> {
    const response = await fetch(API_URLS.CURRENT_DATABASE, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get current database");
    }

    return response.json();
  },

  async getSchemaDetails(): Promise<any> {
    const response = await fetch(API_URLS.DEBUG_SCHEMA_DETAILS, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get schema details");
    }

    return response.json();
  },

  async getTableData(tableName: string, schemaName: string, limit: number = 5): Promise<any> {
    const response = await authService.authenticatedFetch(buildApiUrlWithParams(API_CONFIG.ENDPOINTS.TABLES_DATA + `/${tableName}/data`, { schema: schemaName, limit }), {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get table data");
    }

    return response.json();
  },

  // Dashboard API methods
  async getDashboard(): Promise<any> {
    const response = await authService.authenticatedFetch(API_URLS.DASHBOARD, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get dashboard data");
    }

    return response.json();
  },

  // Reports API methods
  async getReports(): Promise<any> {
    const response = await authService.authenticatedFetch(API_URLS.REPORTS, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get reports");
    }

    return response.json();
  },

  // Data Insights API methods
  async getDataInsights(tableName: string): Promise<any> {
    const response = await authService.authenticatedFetch(`${API_URLS.DATA_INSIGHTS}/${tableName}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get data insights");
    }

    return response.json();
  },

  // Connections API methods
  async getConnections(): Promise<any> {
    const response = await authService.authenticatedFetch(API_URLS.CONNECTIONS, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to get connections");
    }

    return response.json();
  },

  async getDashboardInsights(): Promise<InsightsResponse> {
    try {
      const response = await fetch(API_URLS.INSIGHTS_DASHBOARD, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: InsightsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard insights:', error);
      throw error;
    }
  },

  // Sample data functions
  async loadSampleData(): Promise<any> {
    const response = await fetch(API_URLS.UPLOAD_SAMPLE_DATA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to load sample data");
    }
    
    return response.json();
  },

  // Chat functions
  async sendChatMessage(message: string, schemaId: string = "all"): Promise<ChatResponse> {
    const response = await fetch(API_URLS.CHAT_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        schema_id: schemaId,
        user_id: 'default'
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send chat message');
    }
    
    return response.json();
  },

  async getChatHistory(userId: string = "default"): Promise<any> {
    const response = await fetch(`${API_URLS.CHAT_HISTORY}/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to get chat history');
    }
    return response.json();
  },

  async getDataContext(schemaId: string): Promise<any> {
    const response = await fetch(`${API_URLS.CHAT_CONTEXT}/${schemaId}`);
    if (!response.ok) {
      throw new Error('Failed to get data context');
    }
    return response.json();
  }
};
