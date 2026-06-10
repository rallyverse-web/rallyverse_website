# Vercel Analytics Integration

RallyVerse now uses Vercel Analytics for lightweight, production-friendly traffic monitoring across the entire site.

## What Was Added

- The `@vercel/analytics` package is included in the app dependencies.
- The `Analytics` component is rendered once in the global app layout so every page view is tracked automatically.
- No custom events, cookies, GA4 replacement work, or extra client code were added.

## Where Analytics Is Initialized

- File: [`app/layout.tsx`](../app/layout.tsx)
- Initialization:

```tsx
import { Analytics } from '@vercel/analytics/react'
```

```tsx
<Analytics />
```

The component is mounted in the shared root layout, which makes it active on every public page and route rendered by Next.js.

## How To Access Analytics Data In Vercel

1. Open the RallyVerse project in the [Vercel dashboard](https://vercel.com/dashboard).
2. Go to the project.
3. Open the **Analytics** section in the project sidebar.
4. Review traffic, page views, and top-performing pages there.

Analytics data becomes available after the deployment receives real traffic.

## Environment And Deployment Notes

- No new environment variables are required for Vercel Analytics.
- The integration is enabled automatically in Vercel deployments.
- Keep the root layout mounted for all routes so analytics stays site-wide.
- If you preview the site locally, the component stays harmless and production-safe, but Vercel dashboards only populate once the app is deployed and serving traffic.
