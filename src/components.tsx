import React, { useState } from 'react';
import Wordle from "./Wordle";
import { CellData } from "./types";
type Elem = JSX.Element;

export function Cell(props: {cell: CellData, game: Wordle}) {
    const [letter, setLetter] = useState(props.cell.letter);
    const [color, setColor] = useState(props.cell.color);
    const {cell, game} = props;

    game.addEventListener((type) => {
        switch(type) {
            case 'change':
                setLetter(cell.letter);
                setColor(cell.color);
                break;
        }
    })

    switch(color) {
        case 'yellow':
            return <div className="bg-yellow-600 rounded-md w-24 h-24 text-center align-middle text-7xl text-slate-50 font-bold mx-2 my-2 pt-2">
                {letter}
            </div>
        case 'green':
            return <div className="bg-green-600 rounded-md w-24 h-24 text-center align-middle text-7xl text-slate-50 font-bold mx-2 my-2 pt-2">
                {letter}
            </div>
    }
    return <div className="bg-gray-600 rounded-md w-24 h-24 text-center align-middle text-7xl text-slate-50 font-bold mx-2 my-2 pt-2">
        {letter}
    </div>
}

export function Row(props: {cells: Elem[]}) {
    return <div className="flex">{props.cells}</div>
}

export function Board(props: {game: Wordle}) {
    const {game} = props;

    
    let rowKey = 0;
    let cellKey = 0;
    return <div>
        {
            game.getBoard().map((r) => ( 
                <Row key={rowKey++} cells={
                    r.map((c) => (
                            <Cell key={cellKey++} cell={c} game={game}/>
                        )
                    )
                }/>) 
            )
        }
    </div>
}