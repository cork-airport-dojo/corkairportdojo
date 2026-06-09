import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import "./app.css";
import "./styles/app.scss";

export default function App() {
    return (
        <html lang="en" className="dark">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        </body>
        </html>
    );
}