import { useState, useEffect } from "react";
import "./App.css";
import Board from "./components/Board";
import { sendCreateGame, sendJoinGame, sendMove, type MoveType } from "./services/SocketConnection";
import { handleMessage } from "./services/SocketConnection";

function App() {

  const [gameId, setGameId] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [boardState, setBoardState] = useState<string[][]>([["", "", ""], ["", "", ""], ["", "", ""]]);

  const [joinGameId, setJoinGameId] = useState<string>("");

  const [player, setPlayer] = useState<string>("X");


  const [currentPlayer, setCurrentPlayer] = useState<string>("X");

  const [message, setMessage] = useState<string>("");

  function makeMove(row: number, column: number, game_id: string) {
    if(socket && game_id !== "") {
      if(player !== currentPlayer) {
        setMessage("It's not your turn")
        return
      }
      const move = {type: "move", row, column, game_id} as MoveType;
      sendMove(socket, move);
    }
  }


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765")
    socket.onopen = () => {
      console.log("Connected to server")
      setSocket(socket)
      
      handleMessage({
        websocket: socket,
        updateBoard: (row: number, column: number, player: string) => {
          setBoardState(prevBoard => 
            prevBoard.map((boardRow, rIdx) =>
              boardRow.map((cell, cIdx) =>
                rIdx === row && cIdx === column ? player : cell
              )
            )
          )
        },
        showError: (message: string) => {
          setMessage(message)
        },
        displayWin: (player: string) => {
          setMessage(player + " wins!")
        },
        displayTie: () => {
          setMessage("It's a tie!")
        },
        changeTurn: () => {
          setMessage("Change turn")
        },
        setGameId: (gameId: string) => {
          setGameId(gameId)
        },
        setCurrentPlayer: (player: string) => {
          setCurrentPlayer(player)
        },
        setPlayer: (assignedPlayer: string) => {
          setPlayer(assignedPlayer)
        }
      })
    }
    
    socket.onclose = () => {
      console.log("Disconnected from server")
    }
    return () => {
      socket.close()
    }
  }, [])

  return (
    <>
      <div>{message}</div>
      {gameId && (
        <div>You are : {player}</div>
      )}
      
    <div>{gameId}</div>
              <div>
          <Board boardState={boardState} makeMove={(row, column) => makeMove(row, column, gameId)} />
        </div>
      <div>
        {socket && gameId === "" && (
          <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => {
            sendCreateGame(socket, { type: "game_create" })
          }}>
            Create Game
          </button>
        )
        }
        {socket && gameId === "" && (
          <>
          <div className="text-xl font-semibold mb-4 text-center flex flex-col items-center">
            Join Game
            <input className="border-2 border-gray-300 rounded-md p-2" type="text" value={joinGameId} onChange={(e) => {
            setJoinGameId(e.target.value)
          }} />
          <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => {
            sendJoinGame(socket, { type: "game_join", game_id: joinGameId })
            }}>
              Join Game
            </button>
          </div>
    
          </>
        )
        }
      </div>
    </>
  );
}

export default App;
