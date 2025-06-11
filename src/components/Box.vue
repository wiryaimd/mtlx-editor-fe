<script setup lang="ts">
import type { BoxPosition } from '~/types/BoxPosition';

const boxPosition: Ref<BoxPosition | undefined> = defineModel<BoxPosition>('box_position');

const isDrag: Ref<boolean> = ref<boolean>(false);

console.log("oi", boxPosition.value?.x);
console.log(boxPosition.value?.y);

function startDrag(){

}

function onDrag(){

}

function stopDrag(){

}

</script>

<template>

    <div class="box" :style="{
        top: boxPosition?.y + 'px',
        left: boxPosition?.x + 'px',
        width: '100px',
        height: '100px'
    }">

    </div>

</template>

<style scoped>

.box{
    position: absolute;
    background-color: red;
    cursor: grab;
}

</style>