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
        client_id = uuid4()
        self.connections[client_id] = websocket
        async for message in websocket:
            data = json.loads(message)
            payload = {}
            if data['type'] == 'create_game':
                await self.create_game(websocket)

            elif data['type'] == 'join_game':
                await self.join_game(data, websocket)

            elif data['type'] == 'move':
                await self.handle_move(data)

            elif data['type'] == 'reset_game':
                pass

    async def join_game(self, data, websocket):
        payload = {}
        game_id = data['game_id']
        game = self.games[game_id]
        game['player2'] = websocket
        payload['type'] = 'game_join'
        payload['success'] = True
        await websocket.send(json.dumps(payload))

    async def create_game(self, websocket):
        payload = {}
        game_id = uuid4()
        new_game = TicTacToe()
        self.games[game_id] = {
            "game": new_game,
            "player1": websocket,
            "player2": None
        }
        payload['success'] = True
        payload['game_id'] = game_id
        await websocket.send(json.dumps(payload))

    async def handle_move(self, data, websocket):
        payload = {}
        game_id = data['game_id']
        game = self.games[game_id]['game']

        row, col = data['row'], data['column']

        game_object = game['game']

        current_player = game_object.get_current_player()

        if not game_object.place_piece(row, col, current_player):
            payload['type'] = 'error'
            payload['message'] = 'Invalid move!'
            await websocket.send(json.dumps(payload))

        winner = game_object.get_winner()
        if winner:
            payload['type'] = 'result'
            payload['result'] = 'win'
            payload['player'] = current_player

        tie = game.check_tie()
        if tie:
            payload['type'] = 'result'
            payload['result'] = 'tie'

        if winner or tie:
            payload_json = json.dumps(payload)

        else:
            game_object.switch_turns()
            payload['type'] = 'switch_turns'
            payload['turn'] = game_object.get_current_player()

        socket1, socket2 = self.games['player1'], self.games['player2']
        await socket1.send(payload_json)
        await socket2.send(payload_json)


if __name__ == "__main__":
    socket_con = GameRoom("localhost", 8765)
    asyncio.run(socket_con.start_server())
