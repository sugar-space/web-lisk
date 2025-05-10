import { Youtube } from "@sugar/overlays/mediashare/youtube";
import { useEffect, useRef, useState } from "react";
import { redirect, useSearchParams } from "react-router";
import { ClientOnly } from "remix-utils/client-only";
import { useSugarQueue, type SugarMediashare } from "~/components/hooks/useQueue";
import { cn } from "~/utils/cn";
import { isValidJSON } from "~/utils/helpers";
import type { Route } from "./+types/mediashare";
import axios from "axios";
import "./overlay.css";
import { getSocialMetas } from "~/utils/seo";

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "Mediashare - Sugar",
      description: "Mediashare Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/mediashare",
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

export default function Mediashare() {
  const divRef = useRef<HTMLDivElement>(null);
  const [connection, setConnection] = useState<WebSocket | null>(null);
  const [donate, setDonate] = useState<SugarMediashare | null>(null);

  const { state, dispatch, onNewData } = useSugarQueue<SugarMediashare>();
  const [toDisplay] = state;

  const [searchParams, setSearchParams] = useSearchParams();

  function parseYouTubeId(url: string) {
    const regex = /(?:v=|be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

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
    connect(`${import.meta.env.VITE_WS_URL}/mediashare?address=${searchParams.get("address")}`);

    return () => {
      connection?.close();
    };
  }, []);

  useEffect(() => {
    if (divRef.current) {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      const timeout = setTimeout(() => {
        divRef.current!.dispatchEvent(clickEvent);
        clearTimeout(timeout);
      }, 500);
    }

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setDonate(null);
    const sedikit = setInterval(() => {
      setDonate(toDisplay);
      clearInterval(sedikit);
    }, 100);
  }, [toDisplay]);

  return (
    <div className={cn("p-12 bg-transparent h-screen")} ref={divRef}>
      {donate && (
        <div
          className={cn(
            "flex flex-col gap-8 text-4xl items-center text-center rounded-xl aspect-video p-4",
            "bg-pink shadow-[0.6rem_0.6rem_0_#ec003f]"
          )}
        >
          <ClientOnly>
            {() => (
              <Youtube
                media={{
                  id: parseYouTubeId(toDisplay.media.url)!,
                  start: toDisplay.media.start,
                  end: toDisplay.media.end,
                }}
                onVideoEnd={() => {
                  dispatch({ type: "DECREMENT" });
                  setDonate(null);
                }}
              />
            )}
          </ClientOnly>
          {/* <div className="flex flex-col justify-center gap-2">
            <p>
              {toDisplay.donator} baru saja memberikan {toDisplay.amount} {toDisplay.symbol}
            </p>
            <p>{toDisplay.message}</p>
          </div> */}

          <div className="text-4xl flex flex-col gap-8 items-center text-center w-full">
            <div className="flex flex-wrap justify-center gap-2">
              <p className="text-white font-bold">{toDisplay.donator}</p>
              <p>just gave</p>
              <p className="text-white font-bold">
                {toDisplay.amount} {"$"}
                {toDisplay.symbol}
              </p>
            </div>
            <p>{toDisplay.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
