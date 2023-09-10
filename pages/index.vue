<template>
  <div>
    <div>
      <board
        :board="gameBoard.cells.value"
        @select-cell="selectCell"
        @animation-finish="resetCell"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { CellLoc, MoveDir } from '~/types'
import { GameLogic } from '~/util/GameLogic'

const rCount = ref(10)
const cCount = ref(10)
const nextColor = ref(GameLogic.generateColor())
const gameBoard = new GameLogic()

const cellsToMove = ref<CellLoc[]>([])
const cellsToCheck = ref<CellLoc[]>([])

gameBoard.init(unref(rCount), unref(cCount))

let selectedCell: CellLoc | null = null

const validateSwap = (loc1: CellLoc, loc2: CellLoc) => {
  // Same cell
  if (_.isMatch(loc1, loc2)) { return false }

  const rowDiff = Math.abs(loc2.row - loc1.row)
  const colDiff = Math.abs(loc2.col - loc1.col)

  // Not adjacent
  if (rowDiff > 1 || colDiff > 1) { return false }
  // Diagonal
  if (rowDiff > 0 && colDiff > 0) { return false }

  return true
}

const selectCell = (loc: CellLoc) => {
  if (selectedCell == null) {
    selectedCell = loc
    return
  }

  if (!validateSwap(selectedCell, loc)) {
    selectedCell = null
    return
  }

  gameBoard.moveCell(loc, GameLogic.dirTowards(selectedCell, loc)!)
  gameBoard.moveCell(selectedCell, GameLogic.dirTowards(loc, selectedCell)!)

  unref(cellsToMove).push(selectedCell, loc)

  selectedCell = null
}

watch(() => unref(cellsToCheck).length > 0, _.debounce((newVal: boolean) => {
  if (!newVal) { return }

  const cellsCopy = Array.from(unref(cellsToCheck))
  let cellsToClear: CellLoc[] = []

  for (const cell of cellsCopy) {
    cellsToClear.push(...gameBoard.evaluateLines(cell))
  }
  cellsToClear = _.uniqWith(cellsToClear, _.isEqual)

  cellsToClear.forEach(removeCell)

  cellsToCheck.value = []
}, 250))

const removeCell = ({ row, col }: CellLoc) => {
  gameBoard.clearCell({ row, col })

  for (let i = row; i >= 0; i--) {
    gameBoard.moveCell({ row: i, col }, MoveDir.DOWN, unref(nextColor))
  }

  nextColor.value = GameLogic.generateColor()
}

const resetCell = (loc: CellLoc) => {
  gameBoard.finishMove(loc)

  if (_.findIndex(unref(cellsToMove), loc) >= 0) {
    cellsToMove.value = _.reject(unref(cellsToMove), loc)
    unref(cellsToCheck).push(loc)
  }
}
</script>
