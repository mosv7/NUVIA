FROM node:22-bookworm-slim AS workspace
WORKDIR /workspace
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
RUN pnpm install --frozen-lockfile
COPY backend backend
COPY apps/web apps/web
COPY packages/shared-types packages/shared-types

FROM workspace AS api
ENV HOST=0.0.0.0
EXPOSE 3001
CMD ["node", "backend/server.js"]

FROM workspace AS web-build
RUN pnpm --filter @nuvia/web build

FROM nginx:stable-alpine AS web
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /workspace/apps/web/dist /usr/share/nginx/html
EXPOSE 80
