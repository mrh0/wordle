import './App.css';
import {Board, Cell} from './components'
import Wordle from './Wordle';

function App() {
  const game = new Wordle(5, 5);
  game.putWord(0, "Hello");
  return (
    <div className='w-max h-max bg-gray-800 px-4 py-4'>
      <p className='text-slate-50 text-center'>Hello Wordle</p>
      <Board game={game}/>
    </div>
  );
}

export default App;
