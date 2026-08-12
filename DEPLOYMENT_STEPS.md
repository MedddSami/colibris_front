# Complete Deployment Steps

Follow these steps to deploy your full stack (Frontend, Backend, Database) using Docker Compose.

## 1. Prerequisites
- Docker and Docker Compose installed on your server.
- All environment files (`.env`) properly populated for both Frontend and Backend services.

## 2. Prepare Directories
Ensure you have the following structure on your server:
```text
/your-deployment-folder/
├── frontend/ (Next.js project)
│   ├── Dockerfile
│   └── ...
├── backend/ (Node.js project)
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml
```

## 3. Configuration Check
- Ensure `docker-compose.yml` correctly references the build contexts (`context: ./frontend` and `context: ./backend`).
- Update `NEXT_PUBLIC_API_URL` in `docker-compose.yml` to the URL your browser will use (e.g., `http://your-server-ip:5001`).

## 4. Deploy
1. Navigate to the deployment folder:
   ```bash
   cd /your-deployment-folder/
   ```
2. Build and start the containers in detached mode:
   ```bash
   docker-compose up -d --build
   ```

## 5. Maintenance
- **Check status:** `docker-compose ps`
- **View logs:** `docker-compose logs -f`
- **Update/Restart:**
  ```bash
  docker-compose down
  docker-compose up -d --build
  ```
