import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "http://8dc2b5a1e5b742ee979d0c89de2b8c29@localhost:8000/25479",
  tracesSampleRate: 0.1,
});