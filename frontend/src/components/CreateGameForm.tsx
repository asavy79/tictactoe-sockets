import { useState } from "react";


interface CreateGameFormProps {
    onCreateGame: () => void;
}
export default function CreateGameForm(props: CreateGameFormProps) {
    const { onCreateGame } = props;
    return (
        <div className="flex flex-col items-center" id="create-game-form" onSubmit={onCreateGame}>
            <h1 className="text-2xl font-bold mb-4" id="create-game-title">Create Game</h1>
            <button type="submit" id="create-game-button">Create Game</button>
        </div>
    )
}