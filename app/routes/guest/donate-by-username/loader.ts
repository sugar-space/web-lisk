import { redirect } from "react-router";
import { sepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import { getWalletSession } from "@services/cookie";
import axios from "axios";
import type { Route } from "./+types";
import { COINS } from "~/constants/coins";
import { ABI } from "~/constants/ABI";
import { CONTRACT_ADDRESS } from "~/constants/CA";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getWalletSession(request);

  try {
    const fromCheckAddress = await axios
      .post(`${process.env.VITE_BE_URL}/account/check`, {
        address: session,
      })
      .catch(() => {
        return {
          data: {
            success: false,
            username: "",
          },
        };
      });

    const creatorCheckAddress = await axios.get(
      `${process.env.VITE_BE_URL}/account/${params.username}`
    );

    if (creatorCheckAddress.status !== 200) {
      return redirect("/");
    }

    const client = createPublicClient({
      chain: sepolia,
      transport: http("https://sepolia.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
    });

    const filteredTokens = [];
    for (const token of COINS) {
      if (token.token_address !== "0x0000000000000000000000000000000000000000") {
        const result = await client.readContract({
          abi: ABI,
          address: CONTRACT_ADDRESS,
          functionName: "isTokenWhitelisted",
          args: [creatorCheckAddress.data.address, token.token_address],
        });

        if (result) {
          filteredTokens.push({
            ...token,
            allowed: true,
          });
        }
      } else {
        filteredTokens.push(token);
      }
    }

    return {
      filteredTokens,
      from: {
        isAlreadySetUsername: fromCheckAddress.data.success,
        username: fromCheckAddress.data.username,
        address: session ?? "",
      },
      creator: {
        address: creatorCheckAddress.data.address,
        username: creatorCheckAddress.data.username,
        avatar: creatorCheckAddress.data.avatar ?? "https://placehold.co/50",
      },
    };
  } catch (error) {
    console.log(error);
    return redirect("/");
  }
}
