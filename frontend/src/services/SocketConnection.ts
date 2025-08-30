

export interface MoveType {
    type: "move";
    column: number;
    row: number;
    game_id: string;
}

export type SendJoinGameType = {
    type: "game_join";
    game_id: string;
}

export interface ErrorType {
    type: "error";
    message: string;
}

export interface ResultType {
    type: "result";
    result: "win" | "tie";
    player: "X" | "O";
    row: number;
    column: number;
}

export interface JoinGameType {
    type: "game_join";
    game_id: string;
    success: boolean;
    player: "X" | "O";
}

export interface CreateGameType {
    type: "game_create";
    game_id: string;
    success: boolean;
    player: "X" | "O";
}

export interface ResetGameType {
    type: "reset_game";
    game_id: string;
}

export interface SwitchTurnsType {
    type: "switch_turns";
    row: number;
    column: number;
    player: "X" | "O";
    turn: "X" | "O";
}

export function sendJoinGame(socket: WebSocket, joinGame: SendJoinGameType) {
    socket.send(JSON.stringify(joinGame));
}

export function sendMove(socket: WebSocket, move: MoveType) {
    socket.send(JSON.stringify(move));
}

export function sendCreateGame(socket: WebSocket, createGame: { type: "game_create" }) {
    socket.send(JSON.stringify(createGame));
}

export function sendResetGame(socket: WebSocket, resetGame: ResetGameType) {
    socket.send(JSON.stringify(resetGame));
}


export interface HandleMessageProps {
    websocket: WebSocket;
    updateBoard: (row: number, column: number, player: string) => void;
    showError: (message: string) => void;
    displayWin: (player: "X" | "O") => void;
    displayTie: () => void;
    changeTurn: () => void;
    setGameId: (gameId: string) => void;
    setCurrentPlayer: (player: string) => void;
    setPlayer: (player: string) => void;
}


export function handleMessage(props: HandleMessageProps) {
    const { websocket, updateBoard, showError, displayWin, displayTie, setGameId, setCurrentPlayer, setPlayer } = props;
    websocket.addEventListener("message", ({ data }) => {
        const event: MoveType | ErrorType | ResultType | CreateGameType | JoinGameType | SwitchTurnsType = JSON.parse(data);

        if (event.type == "error") {
            showError(event.message);
        }
        else if (event.type == "result") {
            const { result, player, row, column } = event;
            if (result == 'win') {
                updateBoard(row, column, player);
                displayWin(player ? player : "X");

            }
            else {
                updateBoard(row, column, player);
                displayTie();

            }
        }
        else if (event.type == "switch_turns") {
            const { row, column, player, turn, } = event;
            updateBoard(row, column, player);
            setCurrentPlayer(turn);
        }
        else if (event.type == "game_create") {
            if (event.success) {
                setGameId(event.game_id);
                setPlayer(event.player);
                setCurrentPlayer("X"); // Game always starts with X
            }
            else {
                showError("Failed to create game");
            }
        }
        else if (event.type == "game_join") {
            if (event.success) {
                setGameId(event.game_id);
                setPlayer(event.player);
                setCurrentPlayer("X"); // Game always starts with X
            }
            else {
                showError("Failed to join game");
            }
        }
        else {
            // const result = event.result;
            // if (result == 'tie') {
            //     displayTie();
            // }
            // else {
            //     displayWin(event?.player ? event.player : "X");
            // }
        }

    })
}