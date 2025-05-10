import { Alert, AlertDescription, AlertTitle } from "@shadcn/alert";
import { Input } from "@shadcn/input";
import { ButtonMagnet } from "@sugar/button";
import { ForwardLink } from "@sugar/button/arrow";
import { Card } from "@sugar/card";
import { AlertCircle, Check, Pencil } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { redirect, useActionData, useLoaderData, useNavigate, useSubmit } from "react-router";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shadcn/form";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";
import { Switch } from "@shadcn/switch";
import { ABI } from "~/constants/ABI";
import { CONTRACT_ADDRESS } from "~/constants/CA";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import type { Route } from "./+types";
import { cn } from "~/utils/cn";
import { useWatchAsset } from "~/utils/watchers";
import { getSocialMetas } from "~/utils/seo";

export { loader, action } from "./utils/action-loader";

export function meta({}: Route.MetaArgs) {
  return [
    ...getSocialMetas({
      title: "Profile - Sugar",
      description: "Profile Sugar - Spread sweetness into communities, streamer in web3.",
      path: "/",
    }),
  ];
}

export default function ({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const actionData = useActionData();
  const submit = useSubmit();
  const { isAlreadySetUsername, address, username, avatar, filteredTokens } = loaderData;
  const [flashMsg, setFlashMsg] = useState(false);
  const [isLoadingTokenControl, setIsLoadingTokenControl] = useState(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        username: z.string().min(2, "Username must be at least 2 characters"),
        address: z
          .string()
          .min(42, "Address must be at least 42 characters")
          .max(42, "Address must be at most 42 characters"),
      })
    ),
    defaultValues: {
      username: username,
      address: address,
    },
  });

  const onSubmit = form.handleSubmit(
    (data, e) => {
      submit(data, { method: "POST", action: "/profile" });
    },
    (error) => {
      console.log(error);
    }
  );

  /* -------------------------------------------------------------------------- */
  /*                              Toggle Whitelist                              */
  /* -------------------------------------------------------------------------- */
  const {
    data: dataToggle,
    writeContract: writeToggle,
    isPending: isTogglePending,
  } = useWriteContract();

  const { data: receiptToggle, isLoading: isReceiptToggleLoading } = useWaitForTransactionReceipt({
    hash: dataToggle,
  });

  function handleToggleTokenWhitelist(tokenAddress: string, val: boolean) {
    writeToggle({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: "setWhitelistToken",
      args: [tokenAddress, val],
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Withdraw                                  */
  /* -------------------------------------------------------------------------- */
  const {
    data: dataWithdraw,
    writeContract: writeWithdraw,
    isPending: isWithdrawPending,
  } = useWriteContract();

  const { data: receiptWithdraw, isLoading: isWithdrawReceiptLoading } =
    useWaitForTransactionReceipt({
      hash: dataWithdraw,
    });

  const { watchAsset } = useWatchAsset();

  function handleWithdraw(tokenAddress: string) {
    writeWithdraw({
      abi: ABI,
      address: CONTRACT_ADDRESS,
      functionName: "withdrawCreatorFunds",
      args: [tokenAddress],
    });
  }

  useEffect(() => {
    if (actionData && actionData["success"]) {
      setFlashMsg(true);
      const timeout = setTimeout(() => {
        setFlashMsg(false);
        navigate("/profile", { replace: true, preventScrollReset: true });
        clearTimeout(timeout);
      }, 1000);
    }
  }, [actionData]);

  useEffect(() => {
    const loading =
      isTogglePending || isReceiptToggleLoading || isWithdrawPending || isWithdrawReceiptLoading;

    setIsLoadingTokenControl(loading);
    if (!loading) {
      const timeout = setTimeout(() => {
        navigate("/profile", { replace: true, preventScrollReset: true });
        clearTimeout(timeout);
      }, 100);
    }
  }, [isTogglePending, isReceiptToggleLoading, isWithdrawPending, isWithdrawReceiptLoading]);

  return (
    <div className="flex flex-col gap-8">
      {!isAlreadySetUsername && (
        <Alert variant={"orange"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Pages Restricted</AlertTitle>
          <AlertDescription>You should set a username before accessing all pages!</AlertDescription>
        </Alert>
      )}
      {flashMsg && (
        <Alert variant="green">
          <Check className="h-4 w-4" />
          <AlertTitle>Succeed</AlertTitle>
          <AlertDescription>Successfully set username!</AlertDescription>
        </Alert>
      )}
      <Card
        color="transparent"
        textColor="[#47B172]"
        title="Profile"
        actions={
          isAlreadySetUsername && (
            <ForwardLink to={`/${username}`} className="text-inherit">
              View as public
            </ForwardLink>
          )
        }
      >
        <div className="flex flex-row gap-8 items-center">
          <div className="group relative">
            <img src={avatar} className="rounded-full size-60" />
            <div className="absolute inset-0 backdrop-blur-md h-full w-full rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Pencil className="text-green size-10 cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-col gap-8 w-1/2">
            <Form {...form}>
              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex flex-row justify-between">
                        Username
                        <FormMessage className="text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Set your username here ..."
                          className="dark:bg-transparent focus-visible:ring-0 placeholder:text-white/70 border-white/70 focus-visible:border-white md:text-lg h-max"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex flex-row justify-between">
                        Address
                        <FormMessage className="text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="dark:bg-transparent focus-visible:ring-0 placeholder:text-white/70 border-white/70 focus-visible:border-white md:text-lg h-max"
                          disabled
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-start">
                  <ButtonMagnet color="green" type="submit">
                    Save Changes
                  </ButtonMagnet>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Card>

      {isAlreadySetUsername && (
        <Card
          color="transparent"
          textColor="[#77C6D9]"
          title="Token Control"
          className={cn(isLoadingTokenControl && "blur-md")}
        >
          <Table>
            <TableCaption>A list of your balance to withdraw.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Allow Receive</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((val, i) => (
                <TableRow key={i} className="">
                  <TableCell className="font-medium flex flex-row gap-4 items-center">
                    <img src={val.icon} className="size-10 object-contain" />
                    <div className="flex flex-col gap-2">
                      <p>{val.symbol}</p>
                      <p className="text-xs">{val.token_address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {val.balance} ${val.symbol}
                  </TableCell>
                  <TableCell>
                    <Switch
                      className="cursor-pointer"
                      checked={val.allowed}
                      onCheckedChange={(valueHandle) =>
                        handleToggleTokenWhitelist(val.token_address, valueHandle)
                      }
                      disabled={val.token_address === "0x0000000000000000000000000000000000000000"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-x-2">
                      {val.token_address !== "0x0000000000000000000000000000000000000000" && (
                        <ButtonMagnet
                          color="green"
                          onClick={() =>
                            watchAsset?.({
                              address: val.token_address,
                              symbol: val.symbol,
                              decimals: val.decimals,
                              image: val.icon,
                            })
                          }
                        >
                          Add Token
                        </ButtonMagnet>
                      )}
                      <ButtonMagnet
                        color="orange"
                        onClick={() => handleWithdraw(val.token_address)}
                      >
                        Withdraw
                      </ButtonMagnet>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
