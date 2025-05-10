import { useEffect, useRef } from "react";
import YouTube, { type YouTubePlayer } from "react-youtube";

interface YTProps {
  media: {
    id: string;
    start?: number;
    end?: number;
  };
  onVideoEnd: () => void;
}

export function Youtube({ media, onVideoEnd }: YTProps) {
  const { id, start, end } = media;
  const yt = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    const toBeClear = setInterval(() => {
      if (
        yt.current &&
        //@ts-expect-error asdasd
        yt.current?.h &&
        //@ts-expect-error asdasd
        yt.current?.g &&
        typeof yt.current.getCurrentTime === "function" &&
        typeof yt.current.getPlayerState === "function"
      ) {
        console.log("euy");
        yt.current.playVideo();
        clearInterval(toBeClear);
      }
    }, 100);
  }, []);

  return (
    <YouTube
      className="aspect-video w-full h-full"
      iframeClassName="rounded-2xl"
      opts={{
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 0,
          start,
          end,
          enablejsapi: 1,
        },
      }}
      videoId={id}
      onEnd={() => {
        console.log("ON END");
        onVideoEnd();
      }}
      onError={() => {
        console.log("ONERROR");
        onVideoEnd();
      }}
      onReady={(event) => {
        yt.current = event.target;
      }}
    />
  );
}
