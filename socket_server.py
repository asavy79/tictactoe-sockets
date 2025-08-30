import asyncio
from uuid import uuid4
from websockets.asyncio.server import serve
import json
from game import TicTacToe


class GameRoom:
    def __init__(self, hostname, port):
        self.hostname = hostname
        self.port = port
        self.games = {}
        self.connections = {}

    def message_handler(self):
        pass

    async def start_server(self):

        async with serve(self.echo, host=self.hostname, port=self.port) as server:
            print("Starting server")
            await server.serve_forever()

    async def echo(self, websocket):
        client_id = str(uuid4())
        self.connections[client_id] = websocket
        print(f"Client {client_id} connected")
        async for message in websocket:
            data = json.loads(message)
            payload = {}
            if data['type'] == 'game_create':
                print("Creating game")
                await self.create_game(websocket)
            elif data['type'] == 'game_join':
                print("Joining game")
                await self.join_game(data, websocket)

            elif data['type'] == 'move':
                print("Moving")
                await self.handle_move(data, websocket)

            elif data['type'] == 'reset_game':
                print("Resetting game")
                pass

    async def join_game(self, data, websocket):
        payload = {}
        game_id = data['game_id']
        game = self.games[game_id]
        game['player2'] = websocket
        payload['type'] = 'game_join'
        payload['success'] = True
        payload['game_id'] = game_id
        payload["player"] = "O"
        await websocket.send(json.dumps(payload))

    async def create_game(self, websocket):
        payload = {}
        game_id = str(uuid4())
        new_game = TicTacToe()
        self.games[game_id] = {
            "game": new_game,
            "player1": websocket,
            "player2": None
        }
        payload['success'] = True
        payload['game_id'] = game_id
        payload['type'] = 'game_create'
        payload['player'] = "X"

        print(self.games[game_id])
        await websocket.send(json.dumps(payload))

    async def handle_move(self, data, websocket):
        payload = {}
        game_id = data['game_id']
        game_room = self.games[game_id]
        game = game_room['game']

        row, col = data['row'], data['column']

        # Determine which player is making the move based on websocket
        if websocket == game_room['player1']:
            moving_player = "X"
        elif websocket == game_room['player2']:
            moving_player = "O"
        else:
            payload['type'] = 'error'
            payload['message'] = 'You are not part of this game!'
            await websocket.send(json.dumps(payload))
            return

        # Check if it's this player's turn
        current_player = game.get_current_player()
        if moving_player != current_player:
            payload['type'] = 'error'
            payload['message'] = 'Not your turn!'
            await websocket.send(json.dumps(payload))
            return

        if not game.place_piece(row, col, current_player):
            payload['type'] = 'error'
            payload['message'] = 'Invalid move!'
            await websocket.send(json.dumps(payload))
            return

        winner = game.get_winner()
        if winner:
            game.print_board()
            payload['type'] = 'result'
            payload['result'] = 'win'
            payload['player'] = current_player
            payload['row'] = row
            payload['column'] = col

        tie = game.check_tie()
        if tie:
            payload['type'] = 'result'
            payload['result'] = 'tie'
            payload['player'] = current_player
            payload['row'] = row
            payload['column'] = col

        if not winner and not tie:
            game.switch_turns()
            payload['type'] = 'switch_turns'
            payload['turn'] = game.get_current_player()
            payload['row'] = row
            payload['column'] = col
            payload['player'] = current_player

        socket1, socket2 = game_room['player1'], game_room['player2']

        payload_json = json.dumps(payload)
        if socket1:
            await socket1.send(payload_json)
        if socket2:
            await socket2.send(payload_json)


if __name__ == "__main__":
    socket_con = GameRoom("localhost", 8765)
    asyncio.run(socket_con.start_server())
