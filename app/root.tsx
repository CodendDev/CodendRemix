import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { NextUIProvider } from "@nextui-org/react";
import CustomError from "~/components/errors/CustomError";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html className="m-0 h-full w-full">
      <head>
        <title>Something went wrong</title>
        <Meta />
        <Links />
      </head>
      <body className="m-0 h-full w-full">
        <CustomError />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
        <title>Codend</title>
        <Meta />
        <Links />
      </head>
      <body className="h-screen">
        <NextUIProvider className="h-screen">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </body>
    </html>
  );
}
