import './App.css';
import {Board, Title, UsedLetters} from './components'
import Wordle from './Wordle';


const hardMode = window.location.pathname.match(/\/?hard\/?/);
console.log("Mode:", hardMode ? "Hard" : "Easy");
const game = new Wordle(5, 6, !!hardMode);

document.addEventListener('keypress', (evt) => {
	if(evt.key.match(/^[a-zA-Z]{1}$/))
		game.userTyped(evt.key);
});

document.addEventListener('keydown', (evt) => {
	if(evt.key === 'Backspace')
		game.userDeleted();
	if(evt.key === 'Enter')
		game.userSubmit();
});

export default function App() {
	return (
		<div className='w-max h-screen bg-gray-800 px-4 py-4 m-auto shadow-gray-800 shadow-2xl'>
			<Title game={game} text="HELLO WORDLE!"/>
			<Board game={game}/>
			<UsedLetters game={game}/>
		</div>
	);
}
