import type { MetaFunction } from "react-router";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";
import { AppShell } from "./components/layout/AppShell/AppShell";
import "./styles/app.scss";

export const meta: MetaFunction = () => {
    return [
        { title: "CorkAirportDojo" },
        {
            name: "description",
            content: "Learn. Build. Grow.",
        },
    ];
};

export default function App() {
    return (
        <html lang="en">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
        <AppShell>
            <Outlet />
        </AppShell>
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}