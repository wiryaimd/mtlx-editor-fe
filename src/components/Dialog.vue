<script setup lang="ts">
import type { BoxPosition } from '~/types/BoxPosition';
import type { Box, Detail } from '~/types/Position';

const props = defineProps<{
    index: number
}>();

const detailPosition: Ref<Detail | undefined> = defineModel<Detail>('detail_text');
const previewStatus: Ref<boolean | undefined> = defineModel<boolean>('preview_status');
const boxPosition: Ref<BoxPosition | undefined> = ref<BoxPosition>();

const isDrag: Ref<boolean> = ref<boolean>(false);
const textIndex = props.index;

const emit = defineEmits(['textMove', 'textClick'])

let start = { x: 0, y: 0 };

if(detailPosition.value){
    const boxText: Box = detailPosition.value.boxText;
    const box: Box = detailPosition.value.box;
    console.log("text draw " + detailPosition.value.text);
    console.log("fnt size scale ", detailPosition.value.wordSize);

    boxPosition.value = {
        x: boxText.left,
        y: boxText.top,
        width: boxText.right - boxText.left,
        height: boxText.bot - boxText.top
    };

    // boxPosition.value = {
    //     x: box.left,
    //     y: box.top,
    //     width: boxText.right - boxText.left,
    //     height: boxText.bot - boxText.top
    // };

}

function startDrag(e: MouseEvent){
    if(!boxPosition.value) return;
    
    emit('textClick', textIndex);

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
        x: newLeft,
        y: newTop,
        width: -1,
        height: -1
    };

    emit('textMove', boxPosition.value);
}

function stopDrag() {
    isDrag.value = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
}

// function textClick(){
//     emit('textClick', textIndex);
// }

</script>

<template>

<div  class="dialog select-none" v-if="boxPosition && detailPosition" :style="{
        top: boxPosition.y + 'px',
        left: boxPosition.x + 'px',
        fontSize: detailPosition.wordSize + 'px',
        cursor: isDrag ? 'grabbing' : 'grab',
        border: previewStatus ? 'solid red 1px' : 'none',
        // boxSizing: 'border-box'
    }" @mousedown="startDrag">

    {{ detailPosition.text }}

</div>

</template>

<style>
.dialog{
    text-align: center;
    position: absolute;
    cursor: grab;
    white-space: pre-line;
    font-family: 'TlxFont', sans-serif;
    font-weight: bold;
    line-height: 1;
    text-shadow: 0.03px 0 white,
   -0.03px 0 white,
    0 0.03px white,
    0 -0.03px white;
}
</style>