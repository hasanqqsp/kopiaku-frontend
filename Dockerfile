# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Runtime stage
FROM nginx:1.25-alpine AS runtime

# Configure Nginx for Vue router (history mode)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/vue.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]