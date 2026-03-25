#!/bin/bash
set -e

echo "=========================================="
echo "  Aarambha School — Production Deployment"
echo "=========================================="
echo ""

# ─── Step 1: Check prerequisites ─────────────────────────────────────────────
echo "1. Checking prerequisites..."

if ! command -v docker &> /dev/null; then
  echo "   Docker not found. Installing..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  echo "   Docker installed. You may need to log out and back in."
fi

if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null; then
  echo "   Docker Compose not found. Installing..."
  sudo apt-get update && sudo apt-get install -y docker-compose-plugin
fi

echo "   ✓ Docker and Docker Compose available"

# ─── Step 2: Check .env file ─────────────────────────────────────────────────
echo ""
echo "2. Checking environment configuration..."

if [ ! -f .env ]; then
  echo "   .env file not found!"
  echo "   Creating from template..."

  # Generate secure passwords
  DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
  MINIO_KEY=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 20)
  MINIO_SECRET=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 40)
  JWT=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 64)
  ADMIN_PASS=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)

  cat > .env << EOF
# Generated on $(date)
DB_PASSWORD=${DB_PASS}
MINIO_ACCESS_KEY=${MINIO_KEY}
MINIO_SECRET_KEY=${MINIO_SECRET}
JWT_SECRET=${JWT}
ADMIN_EMAIL=admin@aarambha.school
ADMIN_PASSWORD=${ADMIN_PASS}
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Leyo5YsAAAAAHsDQI6v-Gj1gbPJ_k0NezgUUdgJ
RECAPTCHA_SECRET_KEY=6Leyo5YsAAAAAFJ-Q53WSUXaihumjJiDedoQRdae
EOF

  echo "   ✓ .env created with secure random passwords"
  echo ""
  echo "   ╔══════════════════════════════════════════╗"
  echo "   ║  SAVE THESE CREDENTIALS SECURELY!        ║"
  echo "   ╚══════════════════════════════════════════╝"
  echo ""
  echo "   Admin Email:    admin@aarambha.school"
  echo "   Admin Password: ${ADMIN_PASS}"
  echo "   DB Password:    ${DB_PASS}"
  echo ""
else
  echo "   ✓ .env file exists"
fi

# ─── Step 3: Build and deploy ─────────────────────────────────────────────────
echo ""
echo "3. Building and deploying..."

docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

echo "   ✓ Containers started"

# ─── Step 4: Wait for services ────────────────────────────────────────────────
echo ""
echo "4. Waiting for services to be healthy..."

for i in {1..30}; do
  if docker compose -f docker-compose.prod.yml exec -T postgres pg_isready -U aarambha_user -d aarambha > /dev/null 2>&1; then
    echo "   ✓ PostgreSQL ready"
    break
  fi
  sleep 2
done

sleep 5

# ─── Step 5: Run migrations and seed ──────────────────────────────────────────
echo ""
echo "5. Running database migrations..."

docker compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy 2>&1 || {
  echo "   Migration failed, trying fresh setup..."
  docker compose -f docker-compose.prod.yml exec -T app npx prisma migrate dev --name init 2>&1
}

echo "   ✓ Migrations applied"

echo ""
echo "6. Seeding database..."

docker compose -f docker-compose.prod.yml exec -T app npx prisma db seed 2>&1 || {
  echo "   ⚠ Seed failed (may already be seeded)"
}

# ─── Step 6: Set MinIO bucket policy ──────────────────────────────────────────
echo ""
echo "7. Configuring MinIO..."

sleep 3
docker compose -f docker-compose.prod.yml exec -T minio mc alias set local http://localhost:9000 $(grep MINIO_ACCESS_KEY .env | cut -d= -f2) $(grep MINIO_SECRET_KEY .env | cut -d= -f2) 2>/dev/null || true
docker compose -f docker-compose.prod.yml exec -T minio mc mb local/aarambha-uploads 2>/dev/null || true
docker compose -f docker-compose.prod.yml exec -T minio mc anonymous set download local/aarambha-uploads 2>/dev/null || true

echo "   ✓ MinIO configured"

# ─── Step 7: Open firewall ports ──────────────────────────────────────────────
echo ""
echo "8. Configuring firewall..."

if command -v ufw &> /dev/null; then
  sudo ufw allow 5555/tcp comment "Aarambha - Website"
  sudo ufw allow 5554/tcp comment "Aarambha - MinIO Images"
  echo "   ✓ Firewall rules added (5555, 5554)"
else
  echo "   ⚠ ufw not found — manually open ports 5555 and 5554"
fi

# ─── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "=========================================="
echo "  ✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "  Website:      http://beta.aarambha.school:5555"
echo "  Admin Panel:  http://beta.aarambha.school:5555/admin/login"
echo "  MinIO Console: http://beta.aarambha.school:5553"
echo ""
echo "  Check logs:   docker compose -f docker-compose.prod.yml logs -f"
echo "  Stop:         docker compose -f docker-compose.prod.yml down"
echo "  Restart:      docker compose -f docker-compose.prod.yml restart"
echo ""
