<template>
  <div>
    <board
      :board="boardState"
      @swap="handleBoardSwap"
    />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { CellColor } from '~/types'
import Board from '~/components/Old/Board.vue'

useHead({
  title: 'Za me4enceto mi'
})

const colors = markRaw(Object.values(CellColor))
const FALL_SPEED = 250

function generateBoard (w = 10, h = 10) {
  const board = Array.from({ length: h })

  for (let y = 0; y < h; y++) {
    board[y] = Array.from({ length: w }).map(() => {
      return {
        color: colors[Math.floor(Math.random() * (colors.length - 1))]
      }
    })
  }

  return board
}

const boardState = ref<any>([])
const cellsToCheck = ref<any>([])
const cellsToMove = ref<any>([])

const boardWidth = ref(8)
const boardHeight = ref(8)

onMounted(() => {
  boardState.value = generateBoard(boardWidth.value, boardHeight.value)
  cellsToCheck.value = _.flatten(boardState.value.map((row, rIndex) => row.map((_, cIndex) => [rIndex, cIndex])))
})

function setBoardCell (row: number, col: number, val: CellColor) {
  boardState.value[row][col].color = val
}

function handleBoardSwap (first: any, second: any) {
  swapCells(first, second)
  const result = evaluateLines([first, second])
  if (!result.length) { swapCells(first, second) } else {
    cellsToCheck.value.push(first)
    cellsToCheck.value.push(second)
  }
}

function swapCells (first: any, second: any) {
  const a = boardState.value[first[0]][first[1]].color
  const b = boardState.value[second[0]][second[1]].color

  setBoardCell(first[0], first[1], b)
  setBoardCell(second[0], second[1], a)
}

function evaluateLines (c: any) {
  let res: any[] = []

  for (const [row, col] of c) {
    const { color } = boardState.value[row][col]
    const rr = []; const cc = []

    for (let i = col - 1; i >= 0 && boardState.value[row][i].color === color; i--) { rr.push([row, i]) }
    for (let i = col + 1; i < boardWidth.value && boardState.value[row][i].color === color; i++) { rr.push([row, i]) }

    for (let i = row - 1; i >= 0 && boardState.value[i][col].color === color; i--) { cc.push([i, col]) }
    for (let i = row + 1; i < boardHeight.value && boardState.value[i][col].color === color; i++) { cc.push([i, col]) }

    if (rr.length + 1 >= 3) { res = res.concat(rr, [[row, col]]) }
    if (cc.length + 1 >= 3) { res = res.concat(cc, [[row, col]]) }
  }

  return _.uniqWith(res, _.isEqual)
}

watch(computed(() => cellsToCheck.value.length > 0), _.debounce((newVal: boolean) => {
  if (!newVal) { return }

  const c = Array.from<any>(cellsToCheck.value)
  cellsToCheck.value = []

  const cellsToClear = evaluateLines(c)

  for (const [row, col] of cellsToClear) {
    setBoardCell(row, col, CellColor.EMPTY)
  }

  const cols = _.groupBy(cellsToClear, 1)
  for (const key in cols) {
    const lowest = _.sortBy(cols[key], 0).at(-1)
    for (let i = lowest[0]; i >= 0; i--) {
      if (boardState.value[i][lowest[1]].color === CellColor.EMPTY) { cellsToMove.value.push([i, lowest[1]]) }
    }
  }
}, 500))

let moveTimer: NodeJS.Timer | null = null

watch(computed(() => cellsToMove.value.length > 0), _.throttle((newVal: boolean) => {
  if (newVal) {
    moveTimer = setInterval(moveCells, FALL_SPEED)
  } else {
    clearInterval(moveTimer!)
    moveTimer = null
  }
}, 350))

function moveCells () {
  const cells = _.sortBy(Array.from(cellsToMove.value), 0).reverse()
  const updatedCells = []

  for (const [row, col] of cells) {
    if (row === 0) {
      boardState.value[row][col].color = colors[Math.floor(Math.random() * (colors.length - 1))]
      cellsToCheck.value.push([row, col])
    } else if (boardState.value[row - 1][col].color === CellColor.EMPTY) {
      updatedCells.push([row, col])
    } else {
      swapCells([row, col], [row - 1, col])
      updatedCells.push([row - 1, col])
      if (row + 1 === boardHeight.value || boardState.value[row + 1][col].color !== CellColor.EMPTY) { cellsToCheck.value.push([row, col]) }
    }
  }

  cellsToMove.value = _.sortBy(updatedCells, 0).reverse()
}
</script>
