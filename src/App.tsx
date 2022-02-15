import './App.css';
import {Board, Footer, Title, UsedLetters} from './components'
import Wordle from './Wordle';

const s = new URLSearchParams(window.location.search);
const hardMode = s.has('hard')//!!s.match(/.*[\?|\&]hard/);
let wordIndex = -1;
if(s.has('word'))
	wordIndex = Number.parseInt(s.get('word') || '-1');
console.log("Mode:", hardMode ? "Hard" : "Easy");

const game = new Wordle(5, 6, hardMode);

if(wordIndex > -1)
	game.setWordByIndex(wordIndex);

game.addEventListener((type) => {
	switch(type) {
		case 'setword':
			const s = new URLSearchParams(window.location.search);
			s.set("word", ""+game.getWordIndex());
			window.location.search = s.toString();
			break;
	}
})

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
			<Footer game={game} setHardmode={setHardmode}/>
		</div>
	);
}

function setHardmode() {
	const s = new URLSearchParams(window.location.search);
	if(s.has("hard"))
		s.delete("hard");
	else
		s.set("hard", "");
	s.delete("word");
	window.location.search = s.toString();
}