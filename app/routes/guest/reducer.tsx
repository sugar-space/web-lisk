import { ButtonMagnet } from "@sugar/button";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shadcn/dropdown-menu";
import { ArrowLink } from "@sugar/button/arrow";

const APPEND_ALERT = "APPEND_ALERT";
const DECREMENT_ALERT = "DECREMENT_ALERT";

interface AlertAction {
  type: "APPEND_ALERT" | "DECREMENT_ALERT";
  alerts: AlertState["alerts"];
}

// An interface for our state
interface AlertState {
  alerts: { name: string }[];
}

function alertReducer(state: AlertState, action: AlertAction) {
  switch (action.type) {
    case APPEND_ALERT:
      console.log("state", state);
      console.log(action.alerts);
      const after = {
        alerts: [...state.alerts, ...action.alerts],
      };
      return after;
    case DECREMENT_ALERT:
      if (state.alerts.length) {
        const [_, ...restAlerts] = state.alerts;
        const after = { ...state, alerts: [...restAlerts] };

        console.log("after", after);
        return after;
      }
      console.log("state", state);
      return state;
    default:
      return state;
  }
}

function useAlertQueue() {
  const [state, dispatch] = React.useReducer(alertReducer, { alerts: [] });

  const onNewData = (data: AlertState["alerts"]) => {
    dispatch({ type: APPEND_ALERT, alerts: data });
  };

  return { dispatch, state, onNewData };
}

export default function Reducer() {
  const {
    state: { alerts },
    dispatch,
  } = useAlertQueue();

  const [ahay, asoy] = alerts;

  return (
    <>
      <p
        className="p-3 rounded-lg bg-foreground text-background w-max m-5"
        onClick={() =>
          dispatch({
            type: "APPEND_ALERT",
            alerts: [{ name: `alert ${Number(Math.random() * 100).toFixed(2)}` }],
          })
        }
      >
        add
      </p>

      <p
        className="p-3 rounded-lg bg-foreground text-background w-max m-5"
        onClick={() =>
          dispatch({
            type: "DECREMENT_ALERT",
            alerts: [],
          })
        }
      >
        decrement
      </p>
      <p>a {JSON.stringify(ahay)}</p>
      <p>a {JSON.stringify(asoy)}</p>
      <p>b {JSON.stringify(alerts)}</p>

      {/* <div className="rounded-lg m-5 p-5 bg-foreground/20 text-background"> */}
      <ButtonMagnet color="pink">Connect Wallet</ButtonMagnet>

      <div className="w-max p-5 border border-white m-5">
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* </div> */}
      {/* <p>halo</p> */}
      <ArrowLink className="mt-20" to="/about" direction="left">
        Learn More
      </ArrowLink>
    </>
  );
}
