# Standard RedwoodSDK Starter

This "standard starter" is the recommended implementation for RedwoodSDK. You get a Typescript project with:

- Vite
- database (Prisma via D1)
- TailwindCSS
- Realtime 
- Session Management (via DurableObjects)
- Storage (via R2)
- Queues (via D1)
- Authentication (via BetterAuth)
- Resend (for email)

## Creating your project

```shell
pnpm install
```

## Environemnt vars

Set the following environment variables in your `.env` file:

```shell
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
RESEND_API_KEY=
```

Run `npx wrangler types` to generate the `worker-configuration.d.ts` file.

## Running the dev server

```shell
pnpm dev
```

Point your browser to the URL displayed in the terminal (e.g. `http://localhost:5173/`). You should see a "Hello World" message in your browser.

## Wrangler Types

Run `wrangler types` to generate the `worker-configuration.d.ts` file.

## Shadcn UI Hydration Error

You may need to add `aria-controls` to ui components for shadcn ui to work. For example:

```
<SelectTrigger className="w-full" aria-controls="workspace-dropdown-content">
```

## Deploying your app

### Wrangler Setup

Within your project's `wrangler.jsonc`:

- Replace the `__change_me__` placeholders with a name for your application

- Create a new D1 database:

```shell
npx wrangler d1 create my-project-db
```

Copy the database ID provided and paste it into your project's `wrangler.jsonc` file:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "my-project-db",
      "database_id": "your-database-id",
    },
  ],
}
```

### Authentication Setup

For authentication setup and configuration, including optional bot protection, see the [Authentication Documentation](https://docs.rwsdk.com/core/authentication).

## Further Reading

- [RedwoodSDK Documentation](https://docs.rwsdk.com/)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/runtime-apis/secrets/)
