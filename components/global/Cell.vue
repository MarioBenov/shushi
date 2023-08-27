<template>
  <!-- <div
    class="
      w-20 h-20 inline-block m-0.5 relative
      cell
    "
    :class="{
      animate: !!props.move?.dir,
      [props.move?.dir]: true
    }"
    @transitionend="move.color && emit('animation-finish')"
    >
    <div
      class="
        w-full h-full
        hover:shadow-2xl hover:scale-105
        [&.selected]:shadow-2xl [&.selected]:scale-105
      "
      :class="tmpClasses"
    />
    <div
      v-if="!!props.move"
      class="w-20 h-20 absolute inner top-0 left-0"
      :class="colorMap[props.move.color]"
    />
  </div> -->
  <div
    class="
      w-20 h-20 inline-block m-0.5 relative
      cell
    "
    :class="{
      animate: !!move,
      [move?.dir]: true
    }"
    @transitionend="!!move && emit('animation-finish')"
  >
  <div
      class="
        w-full h-full
        hover:shadow-2xl hover:scale-105
        [&.selected]:shadow-2xl [&.selected]:scale-105
      "
      :class="colorMap[color]"
    />

    <div
      v-if="!!move"
      class="w-20 h-20 absolute inner top-0 left-0"
      :class="colorMap[move.color]"
    />
  </div>
</template>

<script setup lang="ts">
import {CellColor, CellState, MoveDir} from '~/types'

const props = defineProps<{
    color: CellColor,
    selected: boolean,
    move: {
        dir: MoveDir,
        color: CellColor
    } | null
}>()

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

// const tmpClasses = computed(() => (
//     [
//       colorMap[props.color],
//       props.selected ? 'selected' : ''
//     ].join(' ')
// ))
</script>

<style scoped>
.cell.animate {
  transition: translate 1s ease;
}

.cell.right {
  translate: calc(100% + 0.25rem);
}

.cell.right .inner {
  translate: calc(-100% - 0.25rem);
}

.cell.up {
  translate: 0 calc(-100% - 0.25rem);
}

.cell.up .inner {
  translate: 0 calc(100% + 0.25rem);
}
</style>