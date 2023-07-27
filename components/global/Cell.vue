<template>
    <div 
        class="w-20 h-20 inline-block m-0.5 hover:shadow-2xl hover:scale-105 [selected]:shadow-2xl [selected]:scale-105" 
        :class="tmpClasses"
    />
</template>

<script setup lang="ts">
import {CellColor} from '~/types'

const props = defineProps<{
    color: CellColor,
    selected: boolean,
    row: number,
    col: number
}>()

const colorMap = {
    [CellColor.RED]: 'bg-red-600',
    [CellColor.GREEN]: 'bg-green-600',
    [CellColor.BLUE]: 'bg-blue-600',
    [CellColor.YELLOW]: 'bg-yellow-600',
    [CellColor.PINK]: 'bg-pink-600',
    [CellColor.EMPTY]: 'bg-zinc-600',
}

const tmpClasses = computed(() => (
    [colorMap[props.color], props.selected ? 'shadow-2xl scale-105' : ''].join(' ')
))
</script>

