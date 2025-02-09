FROM node:22-slim

WORKDIR /mail0
COPY package*.json ./

# install pnpm before we start
RUN npm install --global corepack@latest
RUN corepack enable pnpm

# install deps
RUN pnpm install
RUN pnpm build

COPY . .

# env vars, overriden by the `.env` file via compose
ENV BASE_URL=http://localhost:3000
ENV DATABASE_URL=postgresql://postgres:super-secret-password@localhost:5432/mail0
ENV BETTER_AUTH_SECRET=
ENV BETTER_AUTH_URL=
ENV GOOGLE_CLIENT_ID=
ENV GOOGLE_CLIENT_SECRET=
ENV NEXT_PUBLIC_POSTHOG_KEY=
ENV NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
ENV REDIS_URL=
ENV REDIS_TOKEN=

EXPOSE 3000

CMD ["pnpm", "start"]
