import _ from 'lodash'
import { CellColor, CellState, MoveDir } from '~/types';

export class GameLogic {
    public static colors = Object.values(CellColor)

    public static generateCell(): CellState {
        return {
        color: GameLogic.colors[Math.floor(Math.random() * (GameLogic.colors.length - 1))],
        key: _.uniqueId('cell'),
        selected: false,
        move: null
      }
    }
      
    private static generateRow(length = 5): CellState[]  { 
        return Array.from({length}).map(GameLogic.generateCell)    
    }

    public cells = ref<CellState[][]>([])

    public init(rows: number, cols: number) : void {
        this.cells.value = Array.from({length: rows}).map(() => GameLogic.generateRow(cols))
    }

    public moveCell(
        rIndex: number, 
        cIndex: number, 
        dir: MoveDir, 
        nextColor?: CellColor
    ) {
        let dirR = 0, dirC = 0

        switch(dir) {
            case MoveDir.UP: {dirR = 1; break;}
            case MoveDir.DOWN: {dirR = -1; break;}
            case MoveDir.LEFT: {dirC = 1; break;}
            case MoveDir.RIGHT: { dirC = -1; break }
        }

        const color = unref(this.cells)[rIndex + dirR*2]?.[cIndex + dirC*2]?.color ?? nextColor ?? CellColor.EMPTY

        unref(this.cells)[rIndex + dirR][cIndex + dirC].move = {
            dir,
            color
        }
    }
}