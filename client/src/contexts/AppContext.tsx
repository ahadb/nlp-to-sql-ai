import React, { createContext, useContext, useState } from "react";
import { type QueryHistoryItem } from "../types/query";

interface AppContextType {
  selectedQuery: QueryHistoryItem | null;
  setSelectedQuery: (query: QueryHistoryItem | null) => void;
  populateQueryInput: (query: QueryHistoryItem) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedQuery, setSelectedQuery] = useState<QueryHistoryItem | null>(
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
