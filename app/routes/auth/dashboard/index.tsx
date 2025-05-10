import { getWalletSession } from "@services/cookie";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";
import { Card } from "@sugar/card";
import { LogoStaticAnimated } from "@sugar/logo-static-animated";
import type { Route } from "./+types";
import axios from "axios";
import { redirect, useLoaderData } from "react-router";
import { ForwardLink } from "@sugar/button/arrow";
import type { TransactionItem } from "../history";
import { useState } from "react";
import { Copy } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getWalletSession(request);

  const isSetUsername = await axios.post(`${process.env.VITE_BE_URL}/account/check`, {
    address: session,
  });

  if (!isSetUsername.data.success) {
    return redirect("/profile");
  }

  const summary = await axios
    .get(`${process.env.VITE_BE_URL}/trx/summary/${session}`)
    .then((res) => res.data.data);

  return {
    summary: summary as TransactionItem[],
  };
}

export default function Dashboard() {
  const loaderData = useLoaderData<typeof loader>();
  const { summary } = loaderData;

  const [isCopied, setIsCopied] = useState(false);
  function handleCopy(val: string) {
    navigator.clipboard.writeText(val);
    setIsCopied(true);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-10">
        <div className="col-span-1">
          <Card
            className="col-span-1"
            title="Historic"
            color="green"
            actions={
              <ForwardLink to="/history" className="text-inherit">
                View all
              </ForwardLink>
            }
          >
            <Table>
              <TableCaption>A list of your recent transaction.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Tx Hash</TableHead>
                  {/* <TableHead>Address</TableHead> */}
                  {/* <TableHead>Type</TableHead> */}
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.map((val, id) => (
                  <TableRow key={id} className="odd:bg-transparent even:bg-slate-900/10">
                    <TableCell className="font-medium flex flex-row gap-2">
                      {val.transactionHash.slice(0, 10)}...{val.transactionHash?.slice(-8)}
                      {isCopied ? (
                        <p className="italic">Copied!</p>
                      ) : (
                        <Copy
                          className="cursor-pointer"
                          onClick={() => handleCopy(val.transactionHash)}
                        />
                      )}
                    </TableCell>
                    {/* <TableCell>
                      {val.from.slice(0, 6)}...{val.from?.slice(-4)}
                    </TableCell> */}
                    {/* <TableCell className="uppercase">{val.type}</TableCell> */}
                    <TableCell className="text-right">
                      {val.amount} {val.tokenType}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div className="col-span-1 flex flex-col gap-y-10">
          <Card title="Summary" color="orange">
            <div className="grid grid-cols-2 divide-x-2 gap-5">
              <div className="flex flex-col gap-5 pr-5">
                <p>
                  USDT
                  <br />
                  &asymp;
                </p>
                <p className="text-end text-5xl font-bold">99,12</p>
              </div>
              <div className="flex flex-col gap-5">
                <p>
                  Highest
                  <br />
                  Received
                </p>
                <p className="text-end text-5xl font-bold">199,12</p>
              </div>
            </div>
          </Card>
          <Card title="Achievements" color="pink">
            <div className="flex flex-col gap-5 pr-5">
              <p className="text-center">
                Most
                <br />
                Sweet
              </p>
              <p className="text-center text-5xl font-bold">99,12</p>
              <p className="text-xs text-white/80 text-center">
                A biggest support to other author.
              </p>
            </div>
          </Card>

          <LogoStaticAnimated />
        </div>
      </div>
    </>
  );
}
