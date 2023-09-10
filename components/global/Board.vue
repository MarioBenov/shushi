<template>
  <div class="">
    <div
      v-for="(row, rIndex) in board"
      :key="`row-${rIndex}`"
      class="flex"
    >
      <cell
        v-for="(cell, cIndex) in row"
        v-bind="cell"
        @click="emit('select-cell', {row: rIndex, col: cIndex})"
        @animation-finish="emit('animation-finish', {row: rIndex, col: cIndex})"
      />
      <!-- :key="`${rIndex}-${cIndex}`"
              :color="cell.color"
              :selected="_isMatch(selectedCells[0], [rIndex, cIndex])"
              :row="rIndex"
              :col="cIndex" -->
    </div>
  </div>
</template>

<script setup lang="ts">
import _isMatch from 'lodash/isMatch'
import _ from 'lodash'
import type {CellLoc, CellState} from '~/types'

const props = defineProps<{
  board: CellState[][]
}>()

const emit = defineEmits<{
  (e: 'select-cell', loc: CellLoc): void
  (e: 'animation-finish', loc: CellLoc): void
}>()

// let selectedCells = ref<[number, number][]>([])

// function selectCell(rIndex: number, cIndex: number) {
//     if(_.includes(selectedCells, _.isEqual)) {
//         selectedCells.value = []
//         return
//     }

//     selectedCells.value.push([rIndex, cIndex])

//     if(selectedCells.value.length < 2) return

//     const diffX = Math.abs(cIndex - selectedCells.value[0][1])
//     const diffY = Math.abs(rIndex - selectedCells.value[0][0])

//     if(diffX + diffY == 1)
//         emit('swap', selectedCells.value[0], selectedCells.value[1])

//     selectedCells.value = []
// }
</script>