const API_BASE_URL = "http://localhost:8000";

export interface UploadResponse {
  message: string;
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

export const api = {
  async uploadSchema(
    file: File,
    database: string = "example"
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_BASE_URL}/upload-schema?database=${database}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Upload failed");
    }

    return response.json();
  },

  async generateSQL(question: string): Promise<QueryResponse> {
    const response = await fetch(`${API_BASE_URL}/generate-sql`, {
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

    return response.json();
  },

  async runSQL(sql: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/run-sql`, {
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

    return response.json();
  },
};
