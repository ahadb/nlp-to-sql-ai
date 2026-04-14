// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to localhost for development
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",

  // API Endpoints
  ENDPOINTS: {
    // Upload endpoints
    UPLOAD: "/upload",
    UPLOAD_SCHEMAS: "/upload/schemas",
    UPLOAD_SAMPLE_DATA: "/upload/sample-data",
    
    // Data endpoints
    TABLES: "/tables/",
    TABLES_DATA: "/tables",
    DASHBOARD: "/dashboard/",
    REPORTS: "/reports/",
    CONNECTIONS: "/connections/",
    
    // Insights endpoints
    INSIGHTS_DASHBOARD: "/insights/dashboard/all",
    DATA_INSIGHTS: "/data/insights",
    
    // Chat endpoints
    CHAT_MESSAGE: "/chat/message",
    CHAT_HISTORY: "/chat/history",
    CHAT_CONTEXT: "/chat/context",
    
    // Auth endpoints
    AUTH_SIGNIN: "/auth/signin",
    AUTH_SIGNUP: "/auth/signup",
    AUTH_SIGNOUT: "/auth/signout",
    AUTH_ME: "/auth/me",
    AUTH_REFRESH: "/auth/refresh",
    
    // Debug endpoints
    CURRENT_DATABASE: "/current-database",
    DEBUG_SCHEMA_DETAILS: "/debug/schema-details",
  },
};

// Demo Mode Configuration
export const DEMO_CONFIG = {
  // Enable demo mode for mock responses
  ENABLED: true,
  
  // Whether to use mock responses for template questions only
  MOCK_TEMPLATES_ONLY: true,
  
  // Whether to use mock responses for all queries
  MOCK_ALL_QUERIES: false,
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Pre-built URLs for convenience
export const API_URLS = {
  // Upload URLs
  UPLOAD: buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD),
  UPLOAD_SCHEMAS: buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_SCHEMAS),
  UPLOAD_SAMPLE_DATA: buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_SAMPLE_DATA),
  
  // Data URLs
  TABLES: buildApiUrl(API_CONFIG.ENDPOINTS.TABLES),
  TABLES_DATA: buildApiUrl(API_CONFIG.ENDPOINTS.TABLES_DATA),
  DASHBOARD: buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD),
  REPORTS: buildApiUrl(API_CONFIG.ENDPOINTS.REPORTS),
  CONNECTIONS: buildApiUrl(API_CONFIG.ENDPOINTS.CONNECTIONS),
  
  // Insights URLs
  INSIGHTS_DASHBOARD: buildApiUrl(API_CONFIG.ENDPOINTS.INSIGHTS_DASHBOARD),
  DATA_INSIGHTS: buildApiUrl(API_CONFIG.ENDPOINTS.DATA_INSIGHTS),
  
  // Chat URLs
  CHAT_MESSAGE: buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_MESSAGE),
  CHAT_HISTORY: buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_HISTORY),
  CHAT_CONTEXT: buildApiUrl(API_CONFIG.ENDPOINTS.CHAT_CONTEXT),
  
  // Auth URLs
  AUTH_SIGNIN: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_SIGNIN),
  AUTH_SIGNUP: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_SIGNUP),
  AUTH_SIGNOUT: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_SIGNOUT),
  AUTH_ME: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_ME),
  AUTH_REFRESH: buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_REFRESH),
  
  // Debug URLs
  CURRENT_DATABASE: buildApiUrl(API_CONFIG.ENDPOINTS.CURRENT_DATABASE),
  DEBUG_SCHEMA_DETAILS: buildApiUrl(API_CONFIG.ENDPOINTS.DEBUG_SCHEMA_DETAILS),
};

// Helper function to build URLs with parameters
export const buildApiUrlWithParams = (endpoint: string, params: Record<string, string | number>): string => {
  const url = new URL(buildApiUrl(endpoint));
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
};
