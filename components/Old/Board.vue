<template>
  <div class="">
    <div
      v-for="(row, rIndex) in board"
      :key="`row-${rIndex}`"
      class="flex"
    >
      <cell
        v-for="(cell, cIndex) in row"
        :key="`${rIndex}-${cIndex}`"
        :color="cell.color"
        :selected="_isMatch(selectedCells[0], [rIndex, cIndex])"
        :row="rIndex"
        :col="cIndex"
        @click="selectCell(rIndex, cIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _isMatch from 'lodash/isMatch'
import _ from 'lodash'
import {CellColor} from '~/types'
import Cell from './Cell.vue'

const props = defineProps<{
  board: {color: CellColor}[][]
}>()

const emit = defineEmits<{
  (e: 'swap', first: [number, number], second: [number, number]): void
}>()

const selectedCells = ref<[number, number][]>([])

function selectCell(rIndex: number, cIndex: number) {
  if(_.includes(selectedCells, _.isEqual)) {
      selectedCells.value = []
      return
  }

  selectedCells.value.push([rIndex, cIndex])

  if(selectedCells.value.length < 2) return

  const diffX = Math.abs(cIndex - selectedCells.value[0][1])
  const diffY = Math.abs(rIndex - selectedCells.value[0][0])

  if(diffX + diffY == 1)
      emit('swap', selectedCells.value[0], selectedCells.value[1])

  selectedCells.value = []
}
</script>