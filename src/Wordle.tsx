export default class Wordle {
    private width: number;
    private height: number;
    private board: string[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.board = this.initBoard();
    }

    public getBoard() {
        return this.board;
    }

    public putWord(line: number, word: string) {
        word = word.toUpperCase();
        for(let i = 0; i < word.length; i++) {
            this.board[line][i] = word.charAt(i);
        }
    }

    public initBoard(): [][] {
        let rows: any[] = [];
        for(let i = 0; i < this.width; i++) {
            let cells: any[] = [];
            for(let i = 0; i < this.height; i++) {
                cells.push("");
            }
            rows.push(cells);
        }
        return rows;
    }

    public getSize() {
        return {width: this.width, height: this.height};
    }
};