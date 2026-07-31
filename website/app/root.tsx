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
import { supabase } from "~/lib/supabase/browser";

import "./app.css";
import "./styles/app.scss";

function AppBoot() {
    const { hydrate } = useAuthStore();

    useEffect(() => {
        void hydrate();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            void hydrate();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [hydrate]);

    return <Outlet />;
}

export default function App() {
    return (
        <html lang="en" className="dark">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
            <Meta />
            <Links />
            <link rel="stylesheet" href="/github-markdown-dark.css" />
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