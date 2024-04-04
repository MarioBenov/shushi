import _ from 'lodash'
import { CellColor, CellLoc, CellState, MoveDir } from '~/types'

export class GameLogic {
  public static colors = Object.values(CellColor)

  public static generateColor (): CellColor {
    return GameLogic.colors[Math.floor(Math.random() * (GameLogic.colors.length - 1))]
  }

  public static generateCell (): CellState {
    return {
      color: GameLogic.generateColor(),
      key: _.uniqueId('cell'),
      selected: false,
      move: null,
      hide: false
    }
  }

  private static generateRow (length = 5): CellState[] {
    return Array.from({ length }).map(GameLogic.generateCell)
  }

  public static getNextLoc (loc: CellLoc, dir: MoveDir): CellLoc {
    const nextLoc = Object.assign({}, loc)

    switch (dir) {
      case MoveDir.UP: { nextLoc.row += 1; break }
      case MoveDir.DOWN: { nextLoc.row -= 1; break }
      case MoveDir.LEFT: { nextLoc.col += 1; break }
      case MoveDir.RIGHT: { nextLoc.col -= 1; break }
    }

    return nextLoc
  }

  public static dirTowards (loc1: CellLoc, loc2: CellLoc): MoveDir | null {
    if (_.isMatch(loc1, loc2)) return null

    const rowDiff = loc2.row - loc1.row
    const colDiff = loc2.col - loc1.col

    if (rowDiff === 0)
      if (colDiff > 0) return MoveDir.RIGHT
      else return MoveDir.LEFT

    if (colDiff === 0)
      if (rowDiff > 0) return MoveDir.DOWN
      else return MoveDir.UP

    return null
  }

  public getFirst (loc: CellLoc, dir: MoveDir): CellLoc {
    const nextLoc = Object.assign({}, loc)

    switch (dir) {
      case MoveDir.UP: { nextLoc.row = this.rows - 1; break }
      case MoveDir.DOWN: { nextLoc.row = 0; break }
      case MoveDir.LEFT: { nextLoc.col = this.cols - 1; break }
      case MoveDir.RIGHT: { nextLoc.col = 0; break }
    }

    return nextLoc
  }

  public getLast (loc: CellLoc, dir: MoveDir): CellLoc {
    const nextLoc = Object.assign({}, loc)

    switch (dir) {
      case MoveDir.UP: { nextLoc.row = 0; break }
      case MoveDir.DOWN: { nextLoc.row = this.rows - 1; break }
      case MoveDir.LEFT: { nextLoc.col = 0; break }
      case MoveDir.RIGHT: { nextLoc.col = this.cols - 1; break }
    }

    return nextLoc
  }

  public static getPrevLoc (loc: CellLoc, dir: MoveDir): CellLoc {
    const nextLoc = Object.assign({}, loc)

    switch (dir) {
      case MoveDir.UP: { nextLoc.row -= 1; break }
      case MoveDir.DOWN: { nextLoc.row += 1; break }
      case MoveDir.LEFT: { nextLoc.col -= 1; break }
      case MoveDir.RIGHT: { nextLoc.col += 1; break }
    }

    return nextLoc
  }

  public rows: number = 0
  public cols: number = 0

  public cells = ref<CellState[][]>([])

  private nextColor = GameLogic.generateColor()

  public init (rows: number, cols: number) : void {
    this.rows = rows
    this.cols = cols

    this.cells.value = Array.from({ length: rows }).map(() => GameLogic.generateRow(cols))
  }

  public inBounds ({ row, col }: CellLoc) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols
  }

  public moveCell (
    loc: CellLoc,
    dir: MoveDir,
  ) {
    const nextCell: CellLoc = GameLogic.getNextLoc(loc, dir)
    let nextColor = this.nextColor

    if (!this.inBounds(nextCell)) {
      this.nextColor = GameLogic.generateColor()
    } else {
      nextColor = unref(this.cells)[nextCell.row][nextCell.col].color
    }

    const cell = unref(this.cells)[loc.row][loc.col]
    cell.move = {
      dir,
      color: nextColor
    }
    cell.hide = true
  }

  public getCell({row, col}: CellLoc) : CellState {
    return this.cells.value[row][col]
  }

  public finishMove ({ row, col }: CellLoc) {
    const cells = unref(this.cells)
    const cell = cells[row][col]

    if (cell.move) {
      const nextCell = GameLogic.getPrevLoc({ row, col }, cell.move.dir)

      if (this.inBounds(nextCell) && cells[nextCell.row][nextCell.col].color === CellColor.EMPTY) { cells[nextCell.row][nextCell.col].color = cell.color }
    }

    cell.color = cell.move?.color ?? CellColor.EMPTY
    cell.move = null
    cell.hide = false
  }

  public clearCell ({ row, col }: CellLoc) {
    this.cells.value[row][col].color = CellColor.EMPTY
  }

  public evaluateLines ({ row, col }: CellLoc) {
    const cells = unref(this.cells)
    const color = this.getCell({row, col}).color

    let rm = row
    let rM = row
    let cm = col
    let cM = col

    while(rm > 0 && cells[rm - 1][col].color === color) rm--;
    while(rM < this.rows - 1 && cells[rM + 1][col].color === color) rM++;
    while(cm > 0 && cells[row][cm - 1].color === color) cm--;
    while(cM < this.cols - 1 && cells[row][cM + 1].color === color) cM++;

    return [
      ...rM - rm >= 2 ? _.range(rm, rM + 1).map((row) => ({row, col})) : [],
      ...cM - cm >= 2 ? _.range(cm, cM + 1).map((col) => ({row, col})) : []
    ]
  }

  public selectCell({row, col}: CellLoc, selected = true): void {
    const cells = unref(this.cells)

    cells[row][col].selected = selected
  }
}
