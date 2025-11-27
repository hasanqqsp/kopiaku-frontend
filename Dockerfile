# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Copy all sources (simpler; enables runtime check for lockfile)
# If you want better layer caching, you can split manifest copies manually.
COPY . .

ENV NODE_ENV=production

# Use pnpm if pnpm-lock.yaml exists, else fallback to npm (ci if lockfile, install otherwise)
RUN set -eux; \
    corepack enable; \
    if [ -f pnpm-lock.yaml ]; then \
        echo "Detected pnpm-lock.yaml -> using pnpm"; \
        pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
        echo "Detected package-lock.json -> using npm ci"; \
        npm ci --no-audit --no-fund; \
    else \
        echo "No lockfile -> using npm install"; \
        npm install --no-audit --no-fund; \
    fi

# Build
RUN npm run build || ( [ -f pnpm-lock.yaml ] && pnpm run build )

# Runtime stage
FROM nginx:1.25-alpine AS runtime

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/vue.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]