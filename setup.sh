#!/bin/bash
# ──────────────────────────────────────────────
#  3D Word Cloud – Setup & Run (macOS)
#  Installs deps for both frontend and backend,
#  then starts both servers concurrently.
# ──────────────────────────────────────────────

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/Backend"
FRONTEND_DIR="$ROOT_DIR/Frontend"

# Colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

log() { echo -e "${CYAN}▸ $1${NC}"; }
done_log() { echo -e "${GREEN}✓ $1${NC}"; }

# ── Backend setup ───────────────────────────────
log "Setting up backend..."

if [ ! -d "$BACKEND_DIR/venv" ]; then
  python3 -m venv "$BACKEND_DIR/venv"
  done_log "Created virtual environment"
fi

source "$BACKEND_DIR/venv/bin/activate"
pip install -q -r "$BACKEND_DIR/requirements.txt"
done_log "Backend dependencies installed"

# ── Frontend setup ──────────────────────────────
log "Setting up frontend..."

cd "$FRONTEND_DIR"
npm install --silent
done_log "Frontend dependencies installed"

# ── Start both servers ──────────────────────────
log "Starting servers..."

cleanup() {
  echo ""
  log "Shutting down..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
  done_log "Servers stopped"
  exit 0
}

trap cleanup SIGINT SIGTERM

# Backend on port 8000
cd "$BACKEND_DIR"
source "$BACKEND_DIR/venv/bin/activate"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Frontend on port 5173
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
done_log "Backend  → http://localhost:8000"
done_log "Frontend → http://localhost:5173"
echo ""
log "Press Ctrl+C to stop both servers"

wait
