import { useEffect } from "react";
import type { SugarAlert } from "~/components/hooks/useQueue";

type AlertBoxProps = {
  onEnd: () => void;
} & SugarAlert;

export function AlertBox(props: AlertBoxProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onEnd();
    }, 1000 * 10);

    return () => {
      console.log("unMounted");
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="text-4xl flex flex-col gap-8 items-center text-center bg-pink p-4 rounded-xl shadow-[0.6rem_0.6rem_0_#ec003f]">
      <div className="flex flex-wrap justify-center gap-2">
        <p className="text-white font-bold">{props.donator}</p>
        <p>just gave</p>
        <p className="text-white font-bold">
          {props.amount} {"$"}
          {props.symbol}
        </p>
      </div>
      <p>{props.message}</p>
    </div>
  );
}
