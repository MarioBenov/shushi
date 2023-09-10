<template>
  <div
    class="
      w-20 h-20 inline-block m-0.5 relative
      cell
    "
    :class="{
      animate: !!move,
      [move?.dir]: true
    }"
    @animationend="!!move && emit('animation-finish')"
  >
    <div
      class="
        w-full h-full
        hover:shadow-2xl hover:scale-105
        [&.selected]:shadow-2xl [&.selected]:scale-105
      "
      :class="cellColor"
    />

    <div
      class="w-20 h-20 absolute inner top-0 left-0"
      :class="innerClass"
    />
  </div>
</template>

<script setup lang="ts">
import { mergeProps } from 'nuxt/dist/app/compat/capi';
import {CellColor, MoveDir} from '~/types'

const props = withDefaults(defineProps<{
    color: CellColor,
    selected?: boolean,
    move?: {
        dir: MoveDir,
        color: CellColor
    } | null
}>(), {
  selected: false,
  move: null
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
  return (props.move && props.color != CellColor.EMPTY) ? '' : colorMap[props.color]
})

const innerClass = computed(() => {
  return {
    hidden: !props.move,
    [colorMap[props.move?.color]]: true
  }
})
</script>

<style scoped>
.cell.animate .inner {
  animation-duration: 0.5s;
  animation-timing-function: linear;
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