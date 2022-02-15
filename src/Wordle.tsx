import { CellData } from "./types";
import allwords from './words'

type EventType = 'change' | 'start' | 'end' | 'accepted' | 'use' | 'win' | 'lose' | 'setword' | 'reset';
type EventCallback = (evt: EventType) => void;

export default class Wordle {
    private width: number;
    private height: number;
    private board: CellData[][];
    private word: string;
    private wordIndex: number;

    private userInput: string;
    private userLine: number;
    
    private listeners: EventCallback[];

    private used: {[letter: string]:boolean};

    private words: string[];
    private ended: boolean;

    private difficulty: 'easy' | 'hard';

    constructor(width: number, height: number, hard: boolean) {
        this.width = width;
        this.height = height;
        this.board = this.initBoard();
        this.word = "";
        this.wordIndex = 0;

        this.userInput = "";
        this.userLine = 0;

        this.listeners = [];
        this.used = {};

        this.words = allwords.hard.concat(allwords.easy);
        this.ended = false;

        this.difficulty = hard ? 'hard' : 'easy';

        this.addEventListener((type) => {
            switch(type) {
                case 'end':
                    this.ended = true;
                    this.userLine=this.height;
                    break;
            }
        });

        this.reset();
    }

    public reset() {
        this.userInput = "";
        this.userLine = 0;

        this.used = {};
        this.ended = false;

        this.board.map(r => r.map(c => {
            c.color = 'gray';
            c.letter = '';
            return c;
        }))

        const words = this.difficulty === 'hard' ? allwords.hard : allwords.easy;
        const index = Math.floor(Math.random() * words.length);
        this.setWordByIndex(index);
        this.triggerEvent('reset');
        this.triggerEvent('start');
    }

    public getWordIndex() {
        return this.wordIndex;
    }

    public getBoard() {
        return this.board;
    }

    public getUsed() {
        return this.used;
    }

    public getWord() {
        return this.word;
    }

    public getDifficulty() {
        return this.difficulty;
    }

    private setWord(word: string, index: number) {
        if(word == null)
            throw "Invalid word";
        if(word.length !== this.width)
            throw "Invalid word length";
        this.word = word.toUpperCase();
        this.wordIndex = index;
        console.log("Word is: ", this.word);
        this.triggerEvent('setword');
    }

    public setWordByIndex(index: number) {
        const words = this.difficulty === 'hard' ? allwords.hard : allwords.easy;
        this.setWord(words[index], index);
    }

    public setLineData(line: number, word: string) {
        word = word.toUpperCase();
        
        this.useLetters(word);

        let buff = this.word.split("");
        for(let i = 0; i < word.length; i++) {
            this.board[line][i].letter = word.charAt(i);
            this.board[line][i].color = 'gray';
        }
        for(let i = 0; i < word.length; i++) {
            if(this.word.charAt(i) === word.charAt(i)) {
                this.board[line][i].letter = word.charAt(i);
                this.board[line][i].color = 'green';
                buff[i] = "";
            }
        }
        for(let i = 0; i < word.length; i++) {
            let index = buff.indexOf(word.charAt(i));
            if(index > -1 && this.word.charAt(i) !== word.charAt(i)) {
                this.board[line][i].letter = word.charAt(i);
                this.board[line][i].color = 'yellow';
                buff[index] = "";
            }
        }
        if(word === this.word) {
            this.triggerEvent('win');
            this.triggerEvent('end');
            console.log("Won");
        }
    }

    public setLine(line: number, word: string) {
        this.setLineData(line, word);
        this.triggerEvent('change');
    }

    public useLetters(word: string) {
        for(let letter of word.split(""))
            this.used[letter] = true;
        this.triggerEvent('use');
    }

    public isLetterUsed(letter: string) {
        return !!this.used[letter];
    }

    public initBoard(): CellData[][] {
        let rows: CellData[][] = [];
        for(let i = 0; i < this.height; i++) {
            let cells: CellData[] = [];
            for(let i = 0; i < this.width; i++) {
                cells.push({letter: "", color: 'gray'});
            }
            rows.push(cells);
        }
        return rows;
    }

    public getSize() {
        return {width: this.width, height: this.height};
    }

    public addEventListener(callback: EventCallback) {
        this.listeners.push(callback);
    }

    private triggerEvent(type: EventType) {
        for(let i = 0; i < this.listeners.length; i++)
            this.listeners[i](type);
    }

    private updateUserInput() {
        for(let i = 0; i < this.width; i++) {
            this.board[this.userLine][i].letter = (i < this.userInput.length ? this.userInput.charAt(i) : "");
            this.board[this.userLine][i].color = 'gray';
        }
        this.triggerEvent('change');
    }

    public userTyped(char: string) {
        if(this.ended)
            return;
        char = char.toUpperCase();
        if(this.userInput.length < this.width) {
            this.userInput += char;
            this.updateUserInput();
        }
    }

    public userDeleted() {
        if(this.userInput.length > 0) {
            this.userInput = this.userInput.substring(0, this.userInput.length-1)
            this.updateUserInput();
        }
    }

    public userSubmit() {
        if(this.userInput.length !== this.width)
            return false;

        if(this.words.indexOf(this.userInput.toLowerCase()) === -1)
            return false;
        this.setLine(this.userLine, this.userInput);
        
        this.userInput = "";
        this.userLine++;
        if(this.userLine >= this.height && !this.ended) {
            this.triggerEvent('lose');
            this.triggerEvent('end');
            console.log("Lost");
            return true;
        }

        this.triggerEvent('accepted');
        return true;
    }

    public getUserLine() {
        return this.userLine;
    }
};