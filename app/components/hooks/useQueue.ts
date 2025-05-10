import { useReducer } from "react";

const AlertActions = {
  APPEND: "APPEND",
  DECREMENT: "DECREMENT",
} as const;

export interface SugarAlert {
  donator: string;
  message: string;
  amount: number;
  symbol: string;
}

export interface SugarMediashare {
  donator: string;
  message: string;
  amount: number;
  symbol: string;
  media: {
    type: "yt" | "tiktok" | "ig";
    url: string;
    start: number;
    end?: number;
  };
}

// Define the generic action type
type AlertAction<T> =
  | { type: typeof AlertActions.APPEND; payload: T }
  | { type: typeof AlertActions.DECREMENT };

function alertReducer<T>(state: T[], action: AlertAction<T>): T[] {
  switch (action.type) {
    case AlertActions.APPEND:
      return [...state, action.payload];

    case AlertActions.DECREMENT:
      return state.length > 0 ? state.slice(1) : state;

    default:
      return state;
  }
}

// Generic Hook to handle either SugarAlert or SugarMediashare
export function useSugarQueue<T>() {
  const [state, dispatch] = useReducer(alertReducer<T>, []);

  const onNewData = (data: T) => {
    dispatch({ type: AlertActions.APPEND, payload: data });
  };

  return { dispatch, state, onNewData };
}
