<script setup lang="ts">
import Index from '~/pages/index.vue';
import type { BoxPosition } from '~/types/BoxPosition';
import type { Box, Detail } from '~/types/Position';
import type { Scale } from '~/types/Scale';
import type { SelectedBox } from '~/types/SelectedBox';

const props = defineProps<{
    index: number
}>();

const detailPosition: Ref<Detail | undefined> = defineModel<Detail>('detail_position');
const scalePosition: Ref<Scale | undefined> = defineModel<Scale>('scale_position');
const previewStatus: Ref<boolean | undefined> = defineModel<boolean>('preview_status');
const boxPosition: Ref<BoxPosition | undefined> = ref<BoxPosition>();

const isDrag: Ref<boolean> = ref<boolean>(false);

const emit = defineEmits(['boxMove', 'boxClick'])

let cleanWidth = 0;
let left = 0, right = 0, top = 0, bot = 0;

let boxIndex: number = props.index;
let start = { x: 0, y: 0 };

let boxWidth = 0, boxHeight = 0;
let roundScale = 24;

watch([detailPosition, scalePosition], ([dp, sc]) => {
    if(!dp || !sc) return;

    const box: Box = dp.box;
    
    left = box.left * sc.scaleX;
    right = box.right * sc.scaleX;
    top = box.top * sc.scaleY;
    bot = box.bot * sc.scaleY;
    roundScale = 24 * sc.scaleY;
    
    // console.log(boxIndex, " lr ", left, right);
    cleanWidth = Math.floor((right - left) * 0.12); // default 0.08
    // console.log("cw", cleanWidth);

    boxWidth = (right - left + (cleanWidth * 2));
    boxHeight = (bot - top + (cleanWidth * 2));

    boxPosition.value = {
        x: (left - cleanWidth),
        y: (top - cleanWidth),
        width: boxWidth,
        height: boxHeight
    };

    start = {
        x: (left - cleanWidth),
        y: (top - cleanWidth)
    }
}, { immediate: true }); // immediate, make the code executed when first initialize

// watch(previewStatus, (val) => {
//     console.log(val);
// });

function startDrag(e: MouseEvent | TouchEvent){
    if(!boxPosition.value) return;

    emit('boxClick', boxIndex);
    
    isDrag.value = true

    let clientX: number;
    let clientY: number;

    if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        e.preventDefault(); // Prevent scroll while dragging
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    start.x = clientX - boxPosition.value.x
    start.y = clientY - boxPosition.value.y

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);
}

function onDrag(e: MouseEvent | TouchEvent) {
    if(!isDrag.value) return
    if(!boxPosition.value) return;

    let clientX: number;
    let clientY: number;

    if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        e.preventDefault(); // Prevent scroll while dragging
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    let newLeft = clientX - start.x;
    let newTop = clientY - start.y;

    boxPosition.value = {
        // x: newLeft - cleanWidth,
        // y: newTop - cleanWidth,
        x: newLeft, // try
        y: newTop,
        width: boxWidth,
        height: boxHeight
    };
}

function stopDrag() {
    if(!boxPosition.value) return;

    let rawPosition: BoxPosition = { // remove back cleanWidth position
        x: boxPosition.value.x + cleanWidth,
        y: boxPosition.value.y + cleanWidth,
        width: right - left,
        height: bot - top
    }
    
    emit('boxMove', { // keep positionList in original raw position, for final export
        index: boxIndex,
        boxPosition: rawPosition
    });

    isDrag.value = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', stopDrag);
}

</script>

<template>

    <div v-if="boxPosition" class="box" :style="{
        top: boxPosition.y + 'px',
        left: boxPosition.x + 'px',
        width: boxPosition.width + 'px',
        height: boxPosition.height + 'px',
        cursor: isDrag ? 'grabbing' : 'grab',
        border: previewStatus ? 'solid blue 1px' : 'none',
        borderRadius: roundScale + 'px'
    }" 
    @mousedown="startDrag" 
    @touchstart="startDrag">

    </div>

</template>

<style scoped>

.box{
    position: absolute;
    background-color: white;
    /* border-radius: 24px; */
}

</style>