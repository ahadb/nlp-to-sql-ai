import React, { createContext, useContext, useReducer, useEffect } from "react";
import { type QueryHistoryItem, type QueryStatus } from "../types/query";

interface QueryHistoryState {
  queries: QueryHistoryItem[];
  isLoading: boolean;
  error: string | null;
}

type QueryHistoryAction =
  | { type: "ADD_QUERY"; payload: QueryHistoryItem }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOAD_FROM_STORAGE"; payload: QueryHistoryItem[] }
  | { type: "CLEAR_HISTORY" };

const initialState: QueryHistoryState = {
  queries: [],
  isLoading: false,
  error: null,
};

function queryHistoryReducer(
  state: QueryHistoryState,
  action: QueryHistoryAction
): QueryHistoryState {
  switch (action.type) {
    case "ADD_QUERY":
      const newQueries = [action.payload, ...state.queries]; // Keep all queries
      localStorage.setItem("queryHistory", JSON.stringify(newQueries));
      return {
        ...state,
        queries: newQueries,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "LOAD_FROM_STORAGE":
      return {
        ...state,
        queries: action.payload,
      };

    case "CLEAR_HISTORY":
      localStorage.removeItem("queryHistory");
      return {
        ...state,
        queries: [],
      };

    default:
      return state;
  }
}

interface QueryHistoryContextType {
  state: QueryHistoryState;
  addQuery: (
    question: string,
    sql: string,
    status: QueryStatus,
    results?: any
  ) => void;
  clearHistory: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const QueryHistoryContext = createContext<QueryHistoryContextType | undefined>(
  undefined
);

export const QueryHistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(queryHistoryReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("queryHistory");
      if (stored) {
        const queries = JSON.parse(stored).map((query: any) => ({
          ...query,
          timestamp: new Date(query.timestamp),
        }));
        dispatch({ type: "LOAD_FROM_STORAGE", payload: queries });
      }
    } catch (error) {
      console.error("Failed to load query history from localStorage:", error);
    }
  }, []);

  const addQuery = (
    question: string,
    sql: string,
    status: QueryStatus,
    results?: any
  ) => {
    const newQuery: QueryHistoryItem = {
      id: Date.now().toString(),
      question,
      sql,
      status,
      timestamp: new Date(),
      results,
    };
    dispatch({ type: "ADD_QUERY", payload: newQuery });
  };

  const clearHistory = () => {
    dispatch({ type: "CLEAR_HISTORY" });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const value: QueryHistoryContextType = {
    state,
    addQuery,
    clearHistory,
    setLoading,
    setError,
  };

  return (
    <QueryHistoryContext.Provider value={value}>
      {children}
    </QueryHistoryContext.Provider>
  );
};

export const useQueryHistory = () => {
  const context = useContext(QueryHistoryContext);
  if (context === undefined) {
    throw new Error(
      "useQueryHistory must be used within a QueryHistoryProvider"
    );
  }
  return context;
};
