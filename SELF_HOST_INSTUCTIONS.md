## Getting Started

### Prerequisites

Before running the application, you'll need to set up several services and environment variables:

1. **Setup Local Services with Docker**

   - Make sure you have [Docker](https://docs.docker.com/get-docker/), [NodeJS](https://nodejs.org/en/download/), and [pnpm](https://pnpm.io/installation) installed.
   - Clone the repository: `git clone https://github.com/nizzyabi/Mail0.git`
   - Install all dependencies: `pnpm install`
   - Copy the example env, `cp .env.example .env`
   - Run `pnpm docker:up` to start the database and other services.
   - Run `pnpm db:push` to sync your schema with the database
   - Use `pnpm db:studio` to view and manage your data

2. **Better Auth Setup**

   - Open `.env` and change the BETTER_AUTH_SECRET to a random string. (Use `openssl rand -hex 32` to generate a 32 character string)

     ```env
     BETTER_AUTH_SECRET=your_secret_key
     ```

3. **Google OAuth Setup (Optional)**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable the Google OAuth2 API
   - Create OAuth 2.0 credentials (Web application type)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-production-url/api/auth/callback/google` (production)
   - Add to `.env`:

     ```env
     GOOGLE_CLIENT_ID=your_client_id
     GOOGLE_CLIENT_SECRET=your_client_secret
     ```

   - Add the following APIs to your Google Cloud Project: People API, Gmail API
     - Go to 'APIs and Services' > 'Enable APIs and Services' > Search for 'Google People API' and click 'Enable'
     - Go to 'APIs and Services' > 'Enable APIs and Services' > Search for 'Gmail API' and click 'Enable'

### Running Locally

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
