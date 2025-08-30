# Tic-Tac-Toe with WebSockets

A real-time multiplayer tic-tac-toe game with instant player-to-player communication. I built this project to explore the functionality of WebSockets and real-time communication.

## Tech Stack

**Frontend:**
- React with TypeScript
- Tailwind CSS for styling
- WebSocket client for real-time communication

**Backend:**
- Python with `asyncio` and `websockets`
- Custom TicTacToe game engine
- Session management for multiplayer rooms

## How It Works

1. **Create a game** - Player 1 creates a new game room and gets assigned as "X"
2. **Join the fun** - Player 2 joins using the game ID and becomes "O" 
3. **Play in real-time** - Clicks are instantly synchronized across both players' screens
4. **Smart validation** - The server ensures proper turn-taking and validates all moves

## Current Status

I'm still polishing some of the core game logic and error handling. Feel free to drop any suggestins.

## Getting Started

1. **Backend**: Run `python socket_server.py` to start the WebSocket server
2. **Frontend**: Navigate to the `frontend/` directory, run `npm install` then `npm run dev`
3. **Play**: Open two browser windows, create a game in one, join with the game ID in the other, and enjoy!

