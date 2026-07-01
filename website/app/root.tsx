import { useEffect } from "react";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";
import { QueryProvider } from "~/components/providers/QueryProvider";
import { useAuthStore } from "~/store/use-auth-store";

import "./app.css";
import "./styles/app.scss";

function AppBoot() {
    const { hydrate } = useAuthStore();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    return <Outlet />;
}

export default function App() {
    return (
        <html lang="en" className="dark">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
        </head>
        <body>
        <QueryProvider>
            <AppBoot />
        </QueryProvider>
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}