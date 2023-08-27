<template>
  <div>
    <fieldset>
      <div>
        <input type="radio" id="Up" v-model="moveDir" :value="MoveDir.UP" />
        <label for="Up">Up</label>
      </div>
      <div>
        <input type="radio" id="Right" v-model="moveDir" :value="MoveDir.RIGHT" />
        <label for="Right">Right</label>
      </div>
      <div>
        <input type="radio" id="Down" v-model="moveDir" :value="MoveDir.DOWN" />
        <label for="Down">Down</label>
      </div>
      <div>
        <input type="radio" id="Left" v-model="moveDir" :value="MoveDir.LEFT" />
        <label for="Left">Left</label>
      </div>
    </fieldset>

    <div>
      <board
        :board="gameBoard.cells.value"
        @select-cell="moveCell"
        @animation-finish="resetCell"
        />
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import _throttle from 'lodash/throttle'
import { CellColor, MoveDir } from '~/types';
import {GameLogic} from '~/util/GameLogic'

const moveDir = ref(MoveDir.UP)

const gameBoard = new GameLogic();
gameBoard.init(4, 4);

let nextCell = GameLogic.generateCell()

const moveCell = (rIndex: number, cIndex: number) => {
  let dirR = 0, dirC = 0
  let last = null

  switch(unref(moveDir)) {
    case MoveDir.UP: {
      dirR = 1
      last = unref(gameBoard.cells).at(-1)![cIndex]
      break;
    }
    case MoveDir.DOWN: {
      dirR = -1
      last = unref(gameBoard.cells)[0][cIndex]
      break;
    }
    case MoveDir.LEFT: {
      dirC = 1
      last = unref(gameBoard.cells)[rIndex].at(-1)!
      break
    }
    case MoveDir.RIGHT: {
      dirC = -1
      last = unref(gameBoard.cells)[rIndex][0]
      break
    }
  }

  for(let i = 0; unref(gameBoard.cells)[rIndex + (i+1)*dirR]?.[cIndex + (i+1)*dirC] != undefined; i++) {
    gameBoard.moveCell(rIndex + i*dirR, cIndex + i*dirC, unref(moveDir))
  }

  // last!.move = {
  //   color:  nextCell.color,
  //   dir: unref(moveDir)
  // }
  // nextCell = GameLogic.generateCell()
}

const resetCell = (rIndex: number, cIndex: number) => {
  debugger
  unref(gameBoard.cells)[rIndex][cIndex].color = unref(gameBoard.cells)[rIndex][cIndex].move.color
  unref(gameBoard.cells)[rIndex][cIndex].move = null
}
</script>