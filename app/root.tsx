import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./assets/style/app.css";
import { ScreenIndicator } from "@sugar/screen-indicator";
import { WagmiProvider } from "wagmi";
import { WAGMI_XELLAR_CONFIG } from "@services/wagmi/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SugarWalletProvider } from "@sugar/wallet/provider";
import { Toaster } from "sonner";
import { darkTheme, XellarKitProvider } from "@xellar/kit";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: "/favicon.ico",
  },
  {
    rel: "icon",
    href: "/favicon.ico",
  },
  // {
  //   rel: "icon",
  //   href: "/favicon.png",
  //   type: "image/png",
  // },
];

if (typeof document !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

// gsap.registerPlugin(useGSAP);
export function Layout({ children }: { children: React.ReactNode }) {
  // useGSAP(() => {
  //   Observer.create({
  //     target: window,
  //     type: "wheel, scroll",
  //   });
  // });

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <ScrollRestoration />
        <ScreenIndicator />
        <Scripts />
        <Toaster position="top-center" expand={true} />
      </body>
    </html>
  );
}

export default function App() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={WAGMI_XELLAR_CONFIG}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider theme={darkTheme}>
          <SugarWalletProvider>
            <Outlet />
          </SugarWalletProvider>
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
