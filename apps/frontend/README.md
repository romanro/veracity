This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Setting Up Local Proxy Environment

1. Create .env.local in tre root of the project
2. Copy sample.env.local file contents there

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## API Endpoints

### Configuration
- **Base URL**: `process.env.NEXT_HTTP_URL` (sample: `https://new.cyberpravda.dev`)
- **Authentication**: Bearer token via `Authorization` header
- **Localization**: `X-Locale` header

### Arguments API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/arguments` | Get all arguments (with optional params) |
| GET | `/api/arguments/{id}` | Get argument by ID |
| POST | `/api/arguments` | Create new argument |
| POST | `/api/arguments2` | Create argument as proof |
| PUT | `/api/arguments/{id}` | Update argument |
| DELETE | `/api/arguments/{id}` | Delete argument |
| GET | `/api/Ashvant2/opinions/{versionId}/flat?userId={userId}` | Get opinion arguments by user ID |
| POST | `/api/Ashvant2/opinions/arguments` | Submit opinion arguments |

### Profile API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/profile` | Get current user profile |
| POST | `/api/v1/profile` | Update current user profile |

### Topics API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/topics` | Get all topics (with search params) |
| GET | `/api/topics/{id}` | Get topic by ID |
| POST | `/api/topics` | Create new topic |
| PUT | `/api/topics/{id}` | Update topic |
| DELETE | `/api/topics/{id}` | Delete topic |

### Versions API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/versions` | Get all versions (with search params) |
| GET | `/api/versions/{id}` | Get version by ID |
| POST | `/api/versions` | Create new version |
| PUT | `/api/versions/{id}` | Update version |
| DELETE | `/api/versions/{id}` | Delete version |

### Summary
- **Total Endpoints**: 18
- **GET Requests**: 8
- **POST Requests**: 5
- **PUT Requests**: 3
- **DELETE Requests**: 3

All authenticated endpoints support:
- **Authorization**: `Bearer {accessToken}` (from localStorage)
- **X-Locale**: Language preference (from cookies)
- **Content-Type**: `application/json`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
