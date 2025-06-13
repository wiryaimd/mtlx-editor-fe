<script setup lang="ts">
import Index from '~/pages/index.vue';
import type { BoxPosition } from '~/types/BoxPosition';
import type { Box, Detail } from '~/types/Position';
import type { SelectedBox } from '~/types/SelectedBox';

const props = defineProps<{
    index: number
}>();

const detailPosition: Ref<Detail | undefined> = defineModel<Detail>('detail_position');
const previewStatus: Ref<boolean | undefined> = defineModel<boolean>('preview_status');
const boxPosition: Ref<BoxPosition | undefined> = ref<BoxPosition>();

const isDrag: Ref<boolean> = ref<boolean>(false);

const emit = defineEmits(['boxMove', 'boxClick'])

let cleanWidth = 0;

let boxIndex: number = props.index;
let start = { x: 0, y: 0 };

let boxWidth = 0, boxHeight = 0;

if(detailPosition.value){
    const box: Box = detailPosition.value.box;
    cleanWidth = Math.floor((box.right - box.left) * 0.12); // default 0.08

    boxWidth = (box.right - box.left + (cleanWidth * 2));
    boxHeight = (box.bot - box.top + (cleanWidth * 2));

    boxPosition.value = {
        x: (box.left - cleanWidth),
        y: (box.top - cleanWidth),
        width: boxWidth,
        height: boxHeight
    };

    start = {
        x: (box.left - cleanWidth),
        y: (box.top - cleanWidth)
    }
}

// watch(previewStatus, (val) => {
//     console.log(val);
// });

function startDrag(e: MouseEvent){
    if(!boxPosition.value) return;

    emit('boxClick', boxIndex);
    
    isDrag.value = true

    start.x = e.clientX - boxPosition.value.x
    start.y = e.clientY - boxPosition.value.y

    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)

}

function onDrag(e: MouseEvent) {
    if(!isDrag.value) return
    if(!boxPosition.value) return;
    let newLeft = e.clientX - start.x;
    let newTop = e.clientY - start.y;

    boxPosition.value = {
        x: newLeft - cleanWidth,
        y: newTop - cleanWidth,
        width: boxWidth,
        height: boxHeight
    };

    emit('boxMove', boxPosition.value);
}

function stopDrag() {
    isDrag.value = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
}

</script>

<template>

    <div v-if="boxPosition" class="box" :style="{
        top: boxPosition.y + 'px',
        left: boxPosition.x + 'px',
        width: boxPosition.width + 'px',
        height: boxPosition.height + 'px',
        cursor: isDrag ? 'grabbing' : 'grab',
        border: previewStatus ? 'solid blue 1px' : 'none'
    }" @mousedown="startDrag">

    </div>

</template>

<style scoped>

.box{
    position: absolute;
    background-color: white;
    border-radius: 24px;
}

</style>