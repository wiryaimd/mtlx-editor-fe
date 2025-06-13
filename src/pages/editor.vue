<script setup lang="ts">
import type { BoxPosition } from '~/types/BoxPosition';
import type { Position, Detail, Box } from '~/types/Position';
import type { SelectedBox } from '~/types/SelectedBox';

const uploadStore = useUploadStore();

const imgRaw = ref("");
const imgTl = ref("");

const showBoxPosition = ref<Box>({
    left: 0,
    top: 0,
    right: 0,
    bot: 0
});

const previewStatus = ref<boolean>(true);
const indexBox = ref<number>();
const indexText = ref<number>();

const oriWidth = uploadStore.position?.width;
const oriHeight = uploadStore.position?.height;

const detailPositionList: Ref<Detail[] | undefined> = ref([]);
const tlRef = ref<HTMLImageElement | null>(null);

if(uploadStore.files){
    if(uploadStore.files[0]){
        imgRaw.value = URL.createObjectURL(uploadStore.files[0]);
        imgTl.value = URL.createObjectURL(uploadStore.files[0]);
    }
}

function onLoad(){
    if (tlRef.value) {
        const rect: DOMRect | undefined = tlRef.value.getBoundingClientRect();
        console.log("rect img", rect);
        if(rect && oriWidth && oriHeight){
            let scaleX: number = rect.width / oriWidth;
            let scaleY: number = rect.height / oriHeight;
            console.log("sx", scaleX);
            console.log("sy", scaleY);

            let position: Position | undefined = uploadStore.position;
            if(position){
                // const boxList: BoxPosition[] = [];
                // for(let i = 0; i < position.details.length; i++){
                //     console.log("pos: ", position.details[i].box.left);
                //     console.log("pos: ", position.details[i].box.top);
                //     let left: number = position.details[i].box.left;
                //     let top: number = position.details[i].box.top;
                    
                //     // boxList.push({
                //     //     x: left * scaleX,
                //     //     y: top * scaleY
                //     // });
                // }

                let detailList: Detail[] = position.details.map((d) => {
                    const box: Box = {
                        left: d.box.left * scaleX,
                        right: d.box.right * scaleX,
                        top: d.box.top * scaleY,
                        bot: d.box.bot * scaleY
                    }

                    const boxText: Box = {
                        left: d.boxText.left * scaleX,
                        right: d.boxText.right * scaleX,
                        top: d.boxText.top * scaleY,
                        bot: d.boxText.bot * scaleY
                    }
                    
                    d.boxText = boxText;
                    d.box = box;
                    d.wordSize = d.wordSize * scaleY;
                    return d;
                });

                detailPositionList.value = detailList;
            }
        }
    }
}

function onBoxMove(boxPosition: BoxPosition){
    showBoxPosition.value = {
        left: boxPosition.x,
        top: boxPosition.y,
        right: boxPosition.x + boxPosition.width,
        bot: boxPosition.y + boxPosition.height
    }
}

function onBoxClick(index: number){
    indexBox.value = index;
}

function onTextClick(index: number){
    indexText.value = index;
}

onMounted(() => {
    // const observer = new ResizeObserver(() => {
    //     if (imageRef.value) {
    //         const rect = imageRef.value.getBoundingClientRect()
    //         console.log('Image resized to:', rect.width, rect.height)
    //     }
    // })

    // if (imageRef.value) observer.observe(imageRef.value)

    // onUnmounted(() => {
    //     observer.disconnect()
    // })
});

</script>

<template>
    <div class="flex flex-col bg-green-50 h-screen">
        <div>
            <Header></Header>
        </div>

        <div>
            <input type="checkbox" checked="true" v-model="previewStatus">Border {{ previewStatus }}</input>
        </div>
        
        <div class="flex flex-1 overflow-hidden">
            <div class="relative overflow-hidden ml-6 mr-6 mt-15 mb-15 inline-block">
                <img class="h-full" ref="tlRaw" :src="imgTl" alt="raw" height="100vh" draggable="false">
            </div>

            <div class="relative overflow-hidden mt-15 mb-15 inline-block">
                <img class="h-full" @load="onLoad" ref="tlRef" :src="imgTl" alt="tl" height="100vh" draggable="false">
                <div v-if="detailPositionList">
                    <Box 
                        @box-move="onBoxMove"
                        @box-click="onBoxClick"
                        v-for="(box, index) in detailPositionList" 
                        :key="index"
                        :index="index"
                        v-model:preview_status="previewStatus"
                        v-model:detail_position="detailPositionList[index]">
                    </Box>
                </div>

                <div v-if="detailPositionList">
                    <Dialog 
                        @text-click="onTextClick"
                        v-for="(dg, index) in detailPositionList" 
                        :index="index"
                        :key="index" 
                        v-model:preview_status="previewStatus"
                        v-model:detail_text="detailPositionList[index]">
                    </Dialog>
                </div>
            </div>

            <div>
                <div v-if="indexBox">
                    <p>Index {{ indexBox }}</p>
                </div>
    
                <div v-if="indexText">
                    <p>Index text {{ indexText }}</p>
                </div>
            </div>

            <div v-if="showBoxPosition" class="m-15">
                <p>{{ showBoxPosition.left.toFixed() }}</p>
                <p>{{ showBoxPosition.top.toFixed() }}</p>
            </div>

            <div v-if="detailPositionList && indexText">
                <textarea class="bg-blue-100 p-2 w-full border rounded" v-model="detailPositionList[indexText].text" rows="10" cols="50"></textarea>
            </div>

            <div v-else>
                <textarea class="bg-blue-100 p-2 w-full border rounded" rows="10" cols="50"></textarea>
            </div>

        </div>

    </div>
</template>

<style scoped>

/* .img{
    position: relative;
    display: inline-block;
}

.bg1{
    margin: 12px;
    background-color: rebeccapurple;
} */

</style>