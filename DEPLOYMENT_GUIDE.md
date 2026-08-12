# Frontend Production & Docker Integration Guide

This guide outlines the steps to make your Next.js frontend production-ready and compatible with a Dockerized backend environment.

## 1. Next.js Configuration (`next.config.mjs`)
For Docker deployments, it is highly recommended to enable `output: 'standalone'`. Also, ensure TypeScript errors are not ignored in production.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Enable standalone mode for smaller, docker-friendly build
  output: 'standalone', 
  
  // 2. IMPORTANT: Remove this for production to ensure code quality
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  
  // 3. Configure image optimization if not using a Vercel-like environment
  // images: {
  //   unoptimized: true, 
  // },
}

export default nextConfig
```

## 2. Environment Variables
Your frontend uses `NEXT_PUBLIC_API_URL`. When running in Docker, this variable MUST be set during the **build** phase.

- **Development:** Uses `.env.local` (e.g., `http://localhost:5001`).
- **Production (Dockerized):** The frontend build must know the production API URL. If your backend is in a separate container, the browser needs the URL *it* will use to reach the backend (e.g., `https://api.yourdomain.com` or `http://localhost:5001` if accessed via a reverse proxy on the host).

## 3. Backend Integration (Docker Compose)
To ensure smooth communication between the frontend and a Dockerized backend (Node/MongoDB):

### Example `docker-compose.yml` Structure
```yaml
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5001 # Or your public API URL
    depends_on:
      - backend

  backend:
    image: your-backend-image
    ports:
      - "5001:5001"
    environment:
      - MONGO_URI=mongodb://db:27017/dbname
    depends_on:
      - db

  db:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## 4. Production Checklist
- [ ] **Remove `ignoreBuildErrors: true`**: Fix all TypeScript errors before deployment.
- [ ] **Update `.env`**: Use production environment variables.
- [ ] **Dockerize**: Create a `Dockerfile` for the Next.js app (using the `standalone` build output).
- [ ] **Reverse Proxy**: Use Nginx or Traefik in front of your containers for HTTPS and routing.
