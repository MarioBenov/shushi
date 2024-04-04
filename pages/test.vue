<template>
  <div>
    <fieldset>
      <div>
        <input
          id="rCount"
          v-model="rCount"
          type="number"
        >
        <label for="rCount">Rows</label>
      </div>
      <div>
        <input
          id="cCount"
          v-model="cCount"
          type="number"
        >
        <label for="cCount">Columns</label>
      </div>
      <div>
        <input
          id="Up"
          v-model="moveDir"
          type="radio"
          :value="MoveDir.UP"
        >
        <label for="Up">Up</label>
      </div>
      <div>
        <input
          id="Right"
          v-model="moveDir"
          type="radio"
          :value="MoveDir.RIGHT"
        >
        <label for="Right">Right</label>
      </div>
      <div>
        <input
          id="Down"
          v-model="moveDir"
          type="radio"
          :value="MoveDir.DOWN"
        >
        <label for="Down">Down</label>
      </div>
      <div>
        <input
          id="Left"
          v-model="moveDir"
          type="radio"
          :value="MoveDir.LEFT"
        >
        <label for="Left">Left</label>
      </div>
      <div>
        <input
          id="moveAll"
          v-model="moveAll"
          type="checkbox"
        >
        <label for="moveAll">Whole row/col</label>
      </div>
      <div>
        <label>Next:</label>
        <cell
          :color="nextColor"
          class="w-10 h-10 align-middle"
        />
      </div>
    </fieldset>

    <div>
      <board
        :board="gameBoard.cells.value"
        @select-cell="moveAll ? moveRowCol($event) : moveCell($event)"
        @animation-finish="resetCell"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CellLoc, MoveDir } from '~/types'
import { GameLogic } from '~/util/GameLogic'

const moveDir = ref(MoveDir.DOWN)
const moveAll = ref(false)
const rCount = ref(4)
const cCount = ref(4)
const nextColor = ref(GameLogic.generateColor())

const gameBoard = new GameLogic()

watch([rCount, cCount], () => {
  gameBoard.init(unref(rCount), unref(cCount))
}, {
  immediate: true
})

const moveRowCol = ({ row, col }: CellLoc) => {
  const dir = unref(moveDir)
  const cells = []

  gameBoard.clearCell(gameBoard.getLast({ row, col }, dir))

  if ([MoveDir.DOWN, MoveDir.UP].includes(dir)) {
    for (let i = 0; i < gameBoard.rows; i++) { cells.push({ row: i, col }) }
  } else {
    for (let i = 0; i < gameBoard.cols; i++) { cells.push({ row, col: i }) }
  }

  for (const cell of cells) { gameBoard.moveCell(cell, dir, unref(nextColor)) }

  nextColor.value = GameLogic.generateColor()
}

const moveCell = (loc: CellLoc) => {
  const dir = unref(moveDir)

  gameBoard.clearCell(loc)

  gameBoard.moveCell(loc, dir, unref(nextColor))

  if (!gameBoard.inBounds(GameLogic.getNextLoc(loc, dir)))
    nextColor.value = GameLogic.generateColor()

}

const resetCell = (loc: CellLoc) => {
  gameBoard.finishMove(loc)
}
</script>
