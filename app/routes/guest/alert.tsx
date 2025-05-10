import { AlertBox } from "@sugar/overlays/alert-box";
import axios from "axios";
import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "react-router";
import { useSugarQueue, type SugarAlert } from "~/components/hooks/useQueue";
import { isValidJSON } from "~/utils/helpers";
import type { Route } from "./+types/alert";
import "./overlay.css";
import { getSocialMetas } from "~/utils/seo";

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "Alerts - Sugar",
      description: "Alerts Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/alerts",
    }),
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const isProfileActive = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: address,
  });

  return isProfileActive.data.success ? null : redirect("/profile");
}

export default function Alert() {
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [donate, setDonate] = useState<SugarAlert | null>(null);

  const { state, dispatch, onNewData } = useSugarQueue<SugarAlert>();
  const [toDisplay] = state;

  const [searchParams, setSearchParams] = useSearchParams();

  function connect(url: string) {
    const ws = new WebSocket(url);
    setConnection(ws);

    ws.addEventListener("open", () => {
      console.log("onopen");
      ws.send("ping");
    });

    ws.addEventListener("message", (event) => {
      if (isValidJSON(event.data)) {
        const message = JSON.parse(event.data);

        onNewData(message.payload);
      }
    });

    ws.addEventListener("close", () => {
      setConnection(null);
      console.warn("WebSocket closed, attempting to reconnect...");
      setTimeout(() => connect(url));
    });

    ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  useEffect(() => {
    // if (searchParams.get("address") === null) {
    //   redirect("/");
    // }

    connect(`${import.meta.env.VITE_WS_URL}/alerts?address=${searchParams.get("address")}`);

    return () => {
      connection?.close();
    };
  }, []);

  useEffect(() => {
    setDonate(null);
    const sedikit = setInterval(() => {
      setDonate(toDisplay);
      clearInterval(sedikit);
    }, 100);
  }, [toDisplay]);

  return (
    <div className="p-12 bg-transparent h-screen">
      {/*  */}
      {donate && <AlertBox {...donate} onEnd={() => dispatch({ type: "DECREMENT" })} />}
    </div>
  );
}
