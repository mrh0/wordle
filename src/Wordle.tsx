import { CellData } from "./types";
import allwords from './words'

type EventType = 'change' | 'start' | 'end' | 'accepted' | 'use';
type EventCallback = (evt: EventType) => void;

export default class Wordle {
    private width: number;
    private height: number;
    private board: CellData[][];
    private word: string;

    private userInput: string;
    private userLine: number;
    
    private listeners: EventCallback[];

    private used: {[letter: string]:boolean};

    private words: string[];

    constructor(width: number, height: number, hard: boolean) {
        this.width = width;
        this.height = height;
        this.board = this.initBoard();
        this.word = "";

        this.userInput = "";
        this.userLine = 0;

        this.listeners = [];
        this.used = {};

        this.words = allwords.hard.concat(allwords.easy);

        const words = hard ? allwords.hard : allwords.easy;
        this.setWord(words[Math.floor(Math.random() * words.length)]);
    }

    public reset() {
        this.board = this.initBoard();
        this.word = "";

        this.userInput = "";
        this.userLine = 0;

        this.listeners = [];
    }

    public getBoard() {
        return this.board;
    }

    public getUsed() {
        return this.used;
    }

    private setWord(word: string) {
        if(word.length !== this.width)
            throw "Invalid word length";
        this.word = word.toUpperCase();
        console.log("Word is: ", this.word);
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
        if(this.userLine >= this.height) {
            this.triggerEvent('end');
            return true;
        }

        this.triggerEvent('accepted');
        return true;
    }

    public getUserLine() {
        return this.userLine;
    }
};