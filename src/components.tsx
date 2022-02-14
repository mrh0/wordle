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

export function Row(props: {cells: Elem[], current: boolean}) {
    return props.current ? <div className="flex animate-pulse">{props.cells}</div> : <div className="flex">{props.cells}</div>;
}

export function Board(props: {game: Wordle}) {
    const {game} = props;
    const [line, setLine] = useState(game.getUserLine());
    
    game.addEventListener((type) => {
        switch(type) {
            case 'accepted':
                setLine(game.getUserLine());
                break;
        }
    })

    let rowKey = 0;
    let cellKey = 0;
    return <div className="ml-8">
        {
            game.getBoard().map((r) => ( 
                <Row key={rowKey++} current={rowKey === line} cells={
                    r.map((c) => (
                            <Cell key={cellKey++} cell={c} game={game}/>
                        )
                    )
                }/>) 
            )
        }
    </div>
}

export function UsedLetters(props: {game: Wordle}) {
    const letters1 = Array.from(Array(13)).map((e, i) => i + 65).map((x) => String.fromCharCode(x));
    const letters2 = Array.from(Array(13)).map((e, i) => i + 65+13).map((x) => String.fromCharCode(x));
    let i = 0;
    return <div>
        <div className="flex">
            {letters1.map((l) => <UsedLetter key={i++} game={props.game} letter={l} used={false}/>)}
        </div>
        <div className="flex">
            {letters2.map((l) => <UsedLetter key={i++} game={props.game} letter={l} used={false}/>)}
        </div>
    </div>
}

export function UsedLetter(props: {game: Wordle, letter: string, used: boolean}) {
    const {game, letter} = props;
    const [used, setUsed] = useState(props.used);

    game.addEventListener((type) => {
        switch(type) {
            case 'use':
                setUsed(game.isLetterUsed(letter));
                break;
        }
    });

    return used ? 
    <div className="bg-gray-700 rounded-md w-8 px-1 pb-4 pt-2 mx-2 my-2 text-2xl text-slate-800 align-middle text-center font-bold">
        <p>{props.letter}</p>
    </div>
    :
    <div className="bg-gray-600 rounded-md w-8 px-1 pb-4 pt-2 mx-2 my-2 text-2xl text-slate-50 align-middle text-center font-bold">
        <p>{props.letter}</p>
    </div> 
}