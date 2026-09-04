import { useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";
import { QueryProvider } from "~/components/providers/QueryProvider";
import { useAuthStore } from "~/store/use-auth-store";
import { supabase } from "~/lib/supabase/browser";
import emailjs from "@emailjs/browser";

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

    useEffect(() => {
        emailjs.init("bNwktbc4EGNVF_zWT");
    }, []);

  return <Outlet />;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the "url" query parameter from the URL
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get("url");

    if (redirectUrl) {
      // Navigate to the captured path and clear the query parameter
      searchParams.delete("url");
      const newSearch = searchParams.toString()
        ? `?${searchParams.toString()}`
        : "";
      navigate(`${redirectUrl}${newSearch}`, { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <Meta />
        <Links />
        <link rel="stylesheet" href="/github-markdown-dark.css" />
        <link rel="stylesheet" href="/starry-night-dark.css" />
      </head>
      <body className="dark">
        <QueryProvider>
          <AppBoot />
        </QueryProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
