import React, { createContext, useContext, useState } from "react";
import { type QueryHistoryItem } from "../types/query";

interface AppContextType {
  selectedQuery: QueryHistoryItem | null;
  setSelectedQuery: (query: QueryHistoryItem | null) => void;
  populateQueryInput: (query: QueryHistoryItem) => void;
  currentSchema: string | null;
  currentTable: string | null;
  setCurrentSchema: (schema: string | null) => void;
  setCurrentTable: (table: string | null) => void;
  currentGeneratedSQL: string | null;
  setCurrentGeneratedSQL: (sql: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedQuery, setSelectedQuery] = useState<QueryHistoryItem | null>(
    null
  );
  const [currentSchema, setCurrentSchema] = useState<string | null>(null);
  const [currentTable, setCurrentTable] = useState<string | null>("data_table");
  const [currentGeneratedSQL, setCurrentGeneratedSQL] = useState<string | null>(
    null
  );

  const populateQueryInput = (query: QueryHistoryItem) => {
    setSelectedQuery(query);
    // This will be used to populate the input field in QueryAnalyzer
  };

  const value: AppContextType = {
    selectedQuery,
    setSelectedQuery,
    populateQueryInput,
    currentSchema,
    currentTable,
    setCurrentSchema,
    setCurrentTable,
    currentGeneratedSQL,
    setCurrentGeneratedSQL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }

  // Debug logging to see schema/table values when context is used
  console.log(
    "useApp called - currentSchema:",
    context.currentSchema,
    "currentTable:",
    context.currentTable,
    "currentGeneratedSQL:",
    context.currentGeneratedSQL
  );

  return context;
};
