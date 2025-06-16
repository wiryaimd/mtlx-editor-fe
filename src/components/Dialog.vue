<script setup lang="ts">
import type { BoxPosition } from '~/types/BoxPosition';
import type { Box, Detail } from '~/types/Position';
import type { Scale } from '~/types/Scale';

const props = defineProps<{
    index: number
}>();

const detailPosition: Ref<Detail | undefined> = defineModel<Detail>('detail_text');
const scalePosition: Ref<Scale | undefined> = defineModel<Scale>('scale_position');
const previewStatus: Ref<boolean | undefined> = defineModel<boolean>('preview_status');
const boxPosition: Ref<BoxPosition | undefined> = ref<BoxPosition>();
const wordSize: Ref<number> = ref<number>(0);

const isDrag: Ref<boolean> = ref<boolean>(false);
const textIndex = props.index;

const emit = defineEmits(['textMove', 'textClick'])

let start = { x: 0, y: 0 };
let width = 0;
let height = 0;

watch([detailPosition, scalePosition], ([dp, sc]) => {
    if(!dp || !sc) return;

    const boxText: Box = dp.boxText;
    const box: Box = dp.box;
    // console.log("text draw " + dp.text);
    // console.log("fnt size scale ", dp.wordSize);

    let left = boxText.left * sc.scaleX;
    let right = boxText.right * sc.scaleX;
    let top = boxText.top * sc.scaleY;
    let bot = boxText.bot * sc.scaleY;

    width = right - left;
    height = bot - top;

    boxPosition.value = {
        x: left,
        y: top,
        width: width,
        height: height
    };

    wordSize.value = dp.wordSize * sc.scaleY;

    // boxPosition.value = {
    //     x: box.left,
    //     y: box.top,
    //     width: boxText.right - boxText.left,
    //     height: boxText.bot - boxText.top
    // };
}, {immediate: true});

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
        width: width,
        height: height
    };
}

function stopDrag() {
    emit('textMove', {
        index: textIndex,
        boxPosition: boxPosition.value
    });

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
        fontSize: wordSize + 'px',
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