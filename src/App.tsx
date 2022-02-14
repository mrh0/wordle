import './App.css';
import {Board} from './components'
import Wordle from './Wordle';
import words from './words'

const hardMode = window.location.pathname.match(/\/?hard\/?/);
console.log("Mode:", hardMode ? "Hard" : "Easy");
const game = new Wordle(5, 6, hardMode ? words.hard : words.easy);

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
		<div className='w-max h-max bg-gray-800 px-4 py-4'>
			<p className='text-slate-50 text-center'>Hello Wordle</p>
			<Board game={game}/>
		</div>
	);
}
