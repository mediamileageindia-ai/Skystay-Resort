#!/bin/bash
# ============================================
# SKY STAY RESORTS — One-Click Setup Script
# ============================================
# Usage: bash setup.sh

set -e
GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GOLD}╔══════════════════════════════════════╗${NC}"
echo -e "${GOLD}║     SKY STAY RESORTS — SETUP         ║${NC}"
echo -e "${GOLD}╚══════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo -e "${RED}❌ Node.js not found. Install from https://nodejs.org (v18+)${NC}"
  exit 1
fi
NODE_VER=$(node -v | cut -c2- | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}❌ Node.js v18+ required. Current: $(node -v)${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Install Frontend
echo ""
echo -e "${GOLD}▶ Installing frontend dependencies...${NC}"
cd frontend
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Frontend ready${NC}"
cd ..

# Copy logo if exists
if [ -f "sky_stay_logo.jpg" ]; then
  cp sky_stay_logo.jpg frontend/public/logo.jpg
  echo -e "${GREEN}✓ Logo copied${NC}"
fi

echo ""
echo -e "${GOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GOLD}║  ✅ SETUP COMPLETE!                          ║${NC}"
echo -e "${GOLD}║                                              ║${NC}"
echo -e "${GOLD}║  Run this command to start the website:      ║${NC}"
echo -e "${GOLD}║                                              ║${NC}"
echo -e "${GOLD}║    cd frontend && npm run dev                ║${NC}"
echo -e "${GOLD}║                                              ║${NC}"
echo -e "${GOLD}║  Then open: http://localhost:3000            ║${NC}"
echo -e "${GOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""
