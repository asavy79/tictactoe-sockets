

export interface MoveType {
    type: "move";
    column: number;
    row: number;
    player: "X" | "O"
}

export interface ErrorType {
    type: "error";
    message: string;
}

export interface ResultType {
    type: "result";
    result: "win" | "tie";
    player?: "X" | "O"
}


export function sendMove(move: MoveType) {

    const socket = new WebSocket("ws://localhost:8765/")
    socket.send(JSON.stringify(move));
}


export interface HandleMessageProps {
    websocket: WebSocket;
    updateBoard: (row: number, column: number, player: string) => void;
    showError: (message: string) => void;
    displayWin: (player: "X" | "O") => void;
    displayTie: () => void;
    changeTurn: () => void;
}


export function handleMessage(props: HandleMessageProps) {
    const {websocket, updateBoard, showError, displayWin, displayTie} = props;
    websocket.addEventListener("message", ({data}) => {
        const event: MoveType | ErrorType | ResultType = JSON.parse(data);

        if(event.type == "error") {
            showError(event.message);
        }
        else if(event.type == "move") {
            const {row, column, player} = event;
            updateBoard(row, column, player);
        }
        else {
            const result = event.result;
            if(result == 'tie') {
                displayTie();
            }
            else {
                displayWin(event?.player ? event.player : "X");
            }
        }

    })
}