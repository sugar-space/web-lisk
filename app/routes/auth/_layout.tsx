import { Outlet, redirect, useLoaderData } from "react-router";
import { BottomMenu } from "./bottom-menu";
import type { Route } from "../+types/_layout";
import { getWalletSession } from "@services/cookie";
import axios from "axios";
import { ConnectWalletXellar } from "@sugar/wallet/connect-wallet-xellar";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request);
  if (!session) {
    return redirect("/");
  }

  const isSetUsername = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: session,
  });

  return {
    username: isSetUsername.data.success ? `${isSetUsername.data.username} 🍭` : session,
  };
}

export default function LayoutAuth() {
  const loaderData = useLoaderData<typeof loader>();

  const { username } = loaderData;

  return (
    <>
      <div className="container h-screen px-[20px] lg:px-[50px] py-[45px] flex flex-col gap-10">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <p className="text-6xl">Hi! 👋</p>
            <p className="text-xl">{username}</p>
          </div>
          <ConnectWalletXellar />
        </div>
        <div className="pb-48">
          <Outlet />
        </div>
      </div>
      <BottomMenu />
    </>
  );
}
