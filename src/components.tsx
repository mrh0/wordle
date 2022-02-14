import { JsxElement } from "typescript";
import Wordle from "./Wordle";
type Elem = JSX.Element;

export function Cell(props: {letter: string}) {
    return <div className="bg-gray-600 rounded-md w-24 h-24 text-center align-middle text-7xl text-slate-50 font-bold mx-2 my-2 pt-2">
        {props.letter}
    </div>
}

export function Row(props: {cells: Elem[]}) {
    return <div className="flex">{props.cells}</div>
}

export function Board(props: {game: Wordle}) {
    const board = props.game.getBoard();
    
    return <div>
        {
            board.map((r) => ( 
                <Row cells={ r.map((c) => (<Cell letter={c}/>) )} />)
            )
        }
    </div>
}