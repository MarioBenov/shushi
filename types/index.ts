export enum CellColor {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue',
    YELLOW = 'yellow',
    PINK = 'pink',
    EMPTY = 'empty'
}

export enum MoveDir {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down'
}

export type CellState = {
    color: CellColor,
    key: string,
    selected: boolean,
    move: {
        dir: MoveDir,
        color: CellColor
    } | null
}