<template>
  <div class="w-auto h-full aspect-square m-auto">
    <board
      :board="gameBoard.cells.value"
      @select-cell="selectCell"
      @animation-finish="finishCellMove"
    />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { CellColor, CellLoc, MoveDir } from '~/types'
import { GameLogic } from '~/util/GameLogic'

const DEBOUNCE_TIME = 50

const rCount = ref(10)
const cCount = ref(10)
const gameBoard = new GameLogic()

const movingCells = ref<CellLoc[]>([])
let movingCellsCopy = [] as CellLoc[]
const cellsToCheck = ref<CellLoc[]>([])
const cellsToProgress = ref<CellLoc[]>([])

gameBoard.init(unref(rCount), unref(cCount))

const selectedCell = ref<CellLoc | null>(null)

const validateSwap = (loc1: CellLoc, loc2: CellLoc) => {
  // Same cell
  if (_.isMatch(loc1, loc2)) return false

  const rowDiff = Math.abs(loc2.row - loc1.row)
  const colDiff = Math.abs(loc2.col - loc1.col)

  // Not adjacent
  if (rowDiff > 1 || colDiff > 1) return false
  // Diagonal
  if (rowDiff > 0 && colDiff > 0) return false

  return true
}

const selectCell = (newSelectedCell: CellLoc) => {
  const currSelectedCell = unref(selectedCell)

  if (currSelectedCell == null) {
    selectedCell.value = newSelectedCell
    return
  }

  if (!validateSwap(currSelectedCell, newSelectedCell)) {
    selectedCell.value = null
    return
  }

  gameBoard.moveCell(newSelectedCell, GameLogic.dirTowards(currSelectedCell, newSelectedCell)!)
  gameBoard.moveCell(currSelectedCell, GameLogic.dirTowards(newSelectedCell, currSelectedCell)!)

  unref(movingCells).push(currSelectedCell, newSelectedCell)
  movingCellsCopy.push(currSelectedCell, newSelectedCell)

  selectedCell.value = null
}

watch(selectedCell, (newVal, oldVal) => {
  if(newVal) gameBoard.selectCell(newVal)
  if(oldVal) gameBoard.selectCell(oldVal, false)
})

watch(() => unref(movingCells).length == 0, _.debounce((newVal) => {
  if(!newVal) return

  const oldVal = movingCellsCopy
  const columns = _.groupBy(oldVal, 'col')

  const toContinueMoving = [] as CellLoc[]
  let toValidate = [] as CellLoc[]

  for(let col in columns) {
    const cells = columns[col]

    if(cells.some((loc) => gameBoard.getCell(loc).color === CellColor.EMPTY)) {
      toContinueMoving.push(_.maxBy(cells, 'row')!)
    } else {
      toValidate.push(...cells)
    }
  }

  movingCellsCopy = []
  cellsToCheck.value.push(..._.uniq(toValidate))
  cellsToProgress.value.push(...toContinueMoving)
}, DEBOUNCE_TIME))

watch(() => unref(cellsToCheck).length > 0, _.debounce((newVal: boolean) => {
  if (!newVal) { return }

  let cellsToClear: CellLoc[] = []

  for (const cell of unref(cellsToCheck))
    cellsToClear.push(...gameBoard.evaluateLines(cell))

  _.uniqWith(cellsToClear, _.isEqual).forEach(removeCell)

  cellsToCheck.value = []
}, DEBOUNCE_TIME))

watch(() => unref(cellsToProgress).length > 0, _.debounce((newVal: boolean) => {
  if (!newVal) { return }

  for (const cell of unref(cellsToProgress))
    for (let i = 0; i <= cell.row; i++) {
      gameBoard.moveCell({ row: i, col: cell.col }, MoveDir.DOWN)
      unref(movingCells).push(cell)
      movingCellsCopy.push(cell)
    }

  cellsToProgress.value = []
}, DEBOUNCE_TIME))

const removeCell = (loc: CellLoc) => {
  gameBoard.clearCell(loc)

  unref(cellsToProgress).push(loc)
}

const finishCellMove = (loc: CellLoc) => {
  gameBoard.finishMove(loc)

  if (_.find(unref(movingCells), loc))
    movingCells.value = _.reject(unref(movingCells), loc)
}
</script>
