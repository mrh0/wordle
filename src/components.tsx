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
    return props.current ? 
    <div className="flex animate-pulse">{props.cells}</div> 
    : 
    <div className="flex">{props.cells}</div>;
}

export function Board(props: {game: Wordle}) {
    const {game} = props;
    const [line, setLine] = useState(game.getUserLine());
    
    game.addEventListener((type) => {
        switch(type) {
            case 'accepted':
                setLine(game.getUserLine());
                break;
            case 'end':
                setLine(-1);
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

export function Title(props: {game: Wordle, text: string}) {
    const {game} = props;
    const [text, setText] = useState(props.text);

    game.addEventListener((type) => {
        switch(type) {
            case 'win':
                setText("YOU WIN!");
                break;
            case 'lose':
                setText("YOU LOSE!");
                break;
            case 'start':
                setText("HELLO WORDLE!");
                break;
        }
    })

    switch(text) {
        case "YOU WIN!":
            return <><h1 className='rainbow text-center font-bold text-5xl text-slate-50 mb-1 mt-2'>{text}</h1><p className='text-center font-bold text-1xl text-slate-50 mb-1'>{game.getWord() + " IS CORRECT"}</p></>;
        case "YOU LOSE!":
            return <><h1 className='text-center font-bold text-5xl text-slate-50 mb-1 mt-2'>{text}</h1><p className='text-center font-bold text-1xl text-slate-50 mb-1'>{"THE WORD WAS " + game.getWord()}</p></>;
        default:
            return <><h1 className='text-center font-bold text-5xl text-slate-50 mb-1 mt-2'>{text}</h1><p className='text-center font-bold text-1xl text-slate-50 mb-1'>{"MAKE A GUESS"}</p></>;
    }    
}

export function Footer(props: {game: Wordle, setHardmode: () => void}) {
    const {game, setHardmode} = props;
    const [modeText, setModeText] = useState(game.getDifficulty());

    game.addEventListener((type) => {
        switch(type) {
            case 'reset':
                setModeText(game.getDifficulty());
                break;
        }
    })

    return <><p className='text-center font-bold text-1xl text-slate-50 mb-1'>
        <span className='hover:cursor-pointer' onClick={() => game.reset()}>NEW WORD</span>
        <span className='mx-2'>|</span>
        <span className='hover:cursor-pointer' onClick={() => setHardmode()}>{(modeText === 'hard' ? 'EASY' : 'HARD') + " MODE"}</span>
        </p>
    <p onClick={() => window.location.href = "https://github.com/mrh0/wordle"} className='text-center font-bold text-1xl text-slate-50 mb-1 hover:cursor-pointer'>© MRH0 2022</p></>
}