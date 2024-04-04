<template>
  <div
    class="
      aspect-square
      block  relative
      cell
      flex-grow
      m-0.5
    "
    :class="cellClass"
    @animationend="!!move && emit('animation-finish')"
  >
    <div
      class="
        w-full h-full
        hover:shadow-2xl hover:scale-105
        [&.selected]:shadow-2xl [&.selected]:scale-105
        box-border border-2 border-solid border-slate-100 rounded-md
      "
      :class="cellColor"
    />

    <div
      class="
        absolute inner top-0 left-0 w-full h-full
        box-border border-2 border-solid border-slate-100 rounded-md
      "
      :class="innerClass"
    />
  </div>
</template>

<script setup lang="ts">
import {CellColor, MoveDir} from '~/types'

const props = withDefaults(defineProps<{
    color: CellColor,
    selected?: boolean,
    move?: {
        dir: MoveDir,
        color: CellColor
    } | null,
    hide?: boolean
}>(), {
  selected: false,
  move: null,
  hide: false
})

const emit = defineEmits<{
  (e: 'animation-finish'): void
}>()

const colorMap = markRaw({
    [CellColor.RED]: 'bg-rose-600',
    [CellColor.GREEN]: 'bg-green-600',
    [CellColor.BLUE]: 'bg-sky-600',
    [CellColor.YELLOW]: 'bg-yellow-600',
    [CellColor.PINK]: 'bg-purple-600',
    [CellColor.EMPTY]: 'bg-zinc-800',
})

const cellColor = computed(() => {
  return {
    [colorMap[props.color]]: true,
    selected: props.selected,
    invisible: props.hide
  }
  // return (props.move && props.color != CellColor.EMPTY) ? '' : colorMap[props.color]
})

const cellAnimationTime = ref('.25s')

const cellClass = computed(() => {
  if(!props.move) return {}

  return {
    animate: true,
    [props.move?.dir]: true
  }
})

const innerClass = computed(() => {
  if(!props.move) return {
    hidden: true
  }

  return {
    [colorMap[props.move?.color]]: true
  }
})
</script>

<style scoped>
.cell.animate .inner {
  animation-duration: v-bind(cellAnimationTime);
  animation-timing-function: ease-in-out;
  z-index: 100;
}

.cell.down .inner {
  animation-name: moveDown;
}
.cell.up .inner {
  animation-name: moveUp;
}
.cell.right .inner {
  animation-name: moveRight;
}
.cell.left .inner {
  animation-name: moveLeft;
}

@keyframes moveDown {
  from {
    translate: 0 calc(-100% - 0.25rem);
  }

  to {
    translate: 0 0;
  }
}

@keyframes moveUp {
  from {
    translate: 0 calc(100% + 0.25rem);
  }

  to {
    translate: 0 0;
  }
}

@keyframes moveRight {
  from {
    translate: calc(-100% - 0.25rem) 0;
  }

  to {
    translate: 0 0;
  }
}

@keyframes moveLeft {
  from {
    translate: calc(100% + 0.25rem) 0;
  }

  to {
    translate: 0 0;
  }
}
</style>