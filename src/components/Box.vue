<script setup lang="ts">
import type { BoxPosition } from '~/types/BoxPosition';
import type { Box, Detail } from '~/types/Position';

const detailPosition: Ref<Detail | undefined> = defineModel<Detail>('detail_position');
const boxPosition: Ref<BoxPosition | undefined> = ref<BoxPosition>();

const isDrag: Ref<boolean> = ref<boolean>(false);

let cleanWidth = 0;
if(detailPosition.value){
    const box: Box = detailPosition.value.box;
    cleanWidth = Math.floor((box.right - box.left) * 0.12); // default 0.08

    boxPosition.value = {
        x: (detailPosition.value.box.top - cleanWidth),
        y: (detailPosition.value.box.left - cleanWidth),
        width: (detailPosition.value.box.right - detailPosition.value.box.left + (cleanWidth * 2)),
        height: (detailPosition.value.box.bot - detailPosition.value.box.top + (cleanWidth * 2))
    };
}


console.log("oi", detailPosition.value?.box.left);
console.log(detailPosition.value?.box.top);

function startDrag(){

}

function onDrag(){

}

function stopDrag(){

}

</script>

<template>

    <div v-if="boxPosition" class="box" :style="{
        top: boxPosition.x + 'px',
        left: boxPosition.y + 'px',
        width: boxPosition.width + 'px',
        height: boxPosition.height + 'px'
    }">

    </div>

</template>

<style scoped>

.box{
    position: absolute;
    background-color: red;
    border-radius: 24px;
    cursor: grab;
}

</style>