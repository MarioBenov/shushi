<template>
  <div>
    <fieldset>
      <div>
        <input type="radio" id="Up" v-model="moveDir" value="up" />
        <label for="Up">Up</label>
      </div>
      <div>
        <input type="radio" id="Right" v-model="moveDir" value="right" />
        <label for="Right">Right</label>
      </div>
      <div>
        <input type="radio" id="Down" v-model="moveDir" value="down" />
        <label for="Down">Down</label>
      </div>
      <div>
        <input type="radio" id="Left" v-model="moveDir" value="left" />
        <label for="Left">Left</label>
      </div>
    </fieldset>

    <div>
      <board
        :board="cells"
        @select-cell="moveCell"
        @animation-finish="resetCell"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import _throttle from 'lodash/throttle'
import { markAsUntransferable } from 'worker_threads';
import { CellColor } from '~/types';

const colors = markRaw(Object.values(CellColor))

const generateCell = () => ({
  color: colors[Math.floor(Math.random() * (colors.length - 1))],
  key: _.uniqueId('cell'),
  selected: false,
  swap: {}
})

const moveDir = ref('up')

const cells = reactive([
  Array.from({length: 4}).map(generateCell),
  Array.from({length: 4}).map(generateCell),
  Array.from({length: 4}).map(generateCell),
  Array.from({length: 4}).map(generateCell),
])
cells.at(-1)!.color = CellColor.EMPTY

let nextCell = generateCell()

const moveCell = (rIndex: number, cIndex: number) => {
  switch(unref(moveDir)) {
    case 'up': {
      for(let i = rIndex; i < 3; i++)
        cells[i][cIndex].swap = {
          dir: unref(moveDir),
          color: cells[i-1][cIndex].color
        }

      cells.at(-1)[cIndex].swap = {
        dir: unref(moveDir),
        color: nextCell.color
      }
      break;
    }
  }
  // for(let i = index; i > 0; i--)
  //   cells[i].swap = {
  //     dir: 'right',
  //     color: cells[i-1].color
  //   }

  // cells[0].swap = {
  //   dir: 'right',
  //   color: nextCell.color
  // }
}

const resetCell = (rIndex: number, cIndex: number) => {
  debugger
  switch( cells[rIndex][cIndex].swap.dir) {
    case 'up': {
      if(rIndex === 3) {
        cells[rIndex][cIndex] = nextCell
        nextCell = generateCell()
      } else {
        cells[rIndex][cIndex].color = ( cells[rIndex][cIndex].swap as any).color
        cells[rIndex][cIndex].swap = {}
      }
      break;
    }
  }

  // if(index === 0) {
  //   cells[0] = nextCell
  //   nextCell = generateCell()
  // } else {
  //   console.log(_.cloneDeep(cells[index]))
  //   cells[index].color = (cells[index].swap as any).color
  //   cells[index].swap = {}
  //   console.log(_.cloneDeep(cells[index]))
  // }
}
</script>