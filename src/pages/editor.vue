<script setup lang="ts">
import { BaseTransitionPropsValidators } from 'vue';
import type { BoxPosition } from '~/types/BoxPosition';
import type { Position, Detail, Box } from '~/types/Position';
import type { Scale } from '~/types/Scale';

const uploadStore = useUploadStore();

const imgTl = ref("");

const showBoxPosition = ref<Box>({
    left: 0,
    top: 0,
    right: 0,
    bot: 0
});

const previewStatus = ref<boolean>(true);
const indexBox = ref<number>(-1);
const indexText = ref<number>(-1);
const indexPage = ref<number>(0);

const tlRef = ref<HTMLImageElement | null>(null);

const positionList: Ref<Position[] | undefined> = ref(uploadStore.position);
// const currentPosition: Ref<Position | undefined> = ref();
const scale: Ref<Scale | undefined> = ref();

const imgList: string[] = [];
if(uploadStore.files){
    for(let i = 0; i < uploadStore.files.length; i++){
        imgList.push(URL.createObjectURL(uploadStore.files[i]));
    }

    // imgTl.value = imgList[0];
}

watch(indexPage, (val: number) => {
    if(val < 0 || val >= imgList.length) return;
    
    if(positionList.value){
        // currentPosition.value = positionList.value[val];
        imgTl.value = imgList[val];
        indexText.value = -1;
    }
}, {immediate: true});

// watch(currentPosition, (pos: Ref<Position | undefined>) => {

// })

function onLoad(){
    console.log("ckekkk")
    if (tlRef.value && positionList.value) {
        const rect: DOMRect | undefined = tlRef.value.getBoundingClientRect();

        console.log("rect img", rect);

        let position = positionList.value[indexPage.value];
        if(rect){
            let scaleX: number = rect.width / position.width;
            let scaleY: number = rect.height / position.height;

            scale.value = {
                scaleX: scaleX,
                scaleY: scaleY
            };

            // currentPosition.value = {...position};
            // console.log("call???", indexPage.value);
        }
            
            // let detailList: Detail[] = originalPosition.details.map((d) => {                
            //     return {
            //         ...d,
            //         box: {
            //             left: d.box.left * scaleX,
            //             right: d.box.right * scaleX,
            //             top: d.box.top * scaleY,
            //             bot: d.box.bot * scaleY
            //         }, 
            //         boxText: {
            //             left: d.boxText.left * scaleX,
            //             right: d.boxText.right * scaleX,
            //             top: d.boxText.top * scaleY,
            //             bot: d.boxText.bot * scaleY
            //         },
            //         wordSize: d.wordSize * scaleY
            //     };
            // });
            
            // currentPosition.value = {
            //     ...originalPosition,
            //     details: detailList
            // };

            // let position: Position[] = uploadStore.position;
            // let list: Position[] = positionList.value;
            // for(let i = 0; i < positionList.value.length; i++){
                

                // let position: Position = list[i];
                // positionList.value[i].details = detailList;
                // position.details = detailList;
                // list[i] = position;
            // }

            // positionList.value = list;
            // scaledPositionList.value = positionList.value;
            // currentPosition.value = positionList.value[0];

            // loadOnce.value = true;

            // console.log("sx", scaleX);
            // console.log("sy", scaleY);

            // if(position){
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
            // }
    }
}

function onBoxMove(boxPosition: BoxPosition){
    showBoxPosition.value = { // need to calcualte back to default scale
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

});

</script>

<template>
    <div class="flex flex-col h-screen">
        <div>
            <Header></Header>
        </div>
        
        <div class="flex flex-1 overflow-hidden justify-center">

            <div class="relative overflow-hidden mt-15 mb-15 inline-block">
                <img class="border h-full" @load="onLoad" ref="tlRef" :src="imgTl" alt="tl" height="100vh" draggable="false">
                <div v-if="positionList && scale">
                    {{ console.log("oi first") }}
                    <Box 
                        @box-move="onBoxMove"
                        @box-click="onBoxClick"
                        v-for="(box, index) in positionList[indexPage].details" 
                        :key="index"
                        :index="index"
                        v-model:preview_status="previewStatus"
                        v-model:detail_position="positionList[indexPage].details[index]"
                        v-model:scale_position="scale">
                    </Box>
                </div>

                <div v-if="positionList && scale">
                    <Dialog 
                        @text-click="onTextClick"
                        v-for="(dg, index) in positionList[indexPage].details" 
                        :index="index"
                        :key="index" 
                        v-model:preview_status="previewStatus"
                        v-model:detail_text="positionList[indexPage].details[index]"
                        v-model:scale_position="scale">
                    </Dialog>
                </div>
            </div>

            <div class="m-15">
                <div v-if="positionList && indexText !== -1">
                    <textarea class="bg-white p-2 w-full border rounded" v-model="positionList[indexPage].details[indexText].text" rows="10" cols="50"></textarea>
                </div>
    
                <div v-else>
                    <textarea class="bg-white p-2 w-full border rounded" rows="10" cols="50"></textarea>
                </div>

                <div>
                    <div>
                        Page {{ indexPage + 1 }}
                    </div>
                    <div class="mt-5">
                        <button @click="indexPage--" :disabled="indexPage <= 0" class="px-4 py-2 bg-white rounded border hover:bg-red-100 active:bg-red-200">Prev</button>
                        <button @click="indexPage++" :disabled="indexPage >= imgList.length - 1" class="mx-5 px-4 py-2 bg-white rounded border hover:bg-red-100 active:bg-red-200">Next</button>
                    </div>

                    <div>
                        <input type="checkbox" checked="true" v-model="previewStatus">Border {{ previewStatus }}</input>
                    </div>

                    <div v-if="indexBox !== -1">
                        <p>Index {{ indexBox }}</p>
                    </div>
        
                    <div v-if="indexText !== -1">
                        <p>Index text {{ indexText }}</p>
                    </div>
                </div>

                <div v-if="showBoxPosition" class="">
                    <p>{{ showBoxPosition.left.toFixed() }}</p>
                    <p>{{ showBoxPosition.top.toFixed() }}</p>
                </div>

            </div>
        </div>

    </div>
</template>