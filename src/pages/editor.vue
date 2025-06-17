<script setup lang="ts">
import { BaseTransitionPropsValidators } from 'vue';
import type { BoxPosition } from '~/types/BoxPosition';
import type { Position, Detail, Box } from '~/types/Position';
import type { Scale } from '~/types/Scale';
import type { SelectedBox } from '~/types/SelectedBox';

const config = useRuntimeConfig();
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
const token = useState<string>("token");

const positionList: Ref<Position[] | undefined> = ref(uploadStore.position);
// const currentPosition: Ref<Position | undefined> = ref();
const scale: Ref<Scale | undefined> = ref();

const imgList: string[] = [];
if(uploadStore.files){
    for(let i = 0; i < uploadStore.files.length; i++){
        imgList.push(URL.createObjectURL(uploadStore.files[i]));
    }
}

watch(indexPage, (val: number) => {
    if(val < 0 || val >= imgList.length) return;

    console.log("page", val);
    
    if(positionList.value){
        // currentPosition.value = positionList.value[val];
        scale.value = undefined;
        imgTl.value = imgList[val];
        indexText.value = -1;
        indexBox.value = -1;
    }
}, {immediate: true});

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
        }
    }
}

function onBoxMove(box: SelectedBox){
    if(!scale.value) return
    
    console.log("box move call");

    // nb, need to calcualte back to default scale
    showBoxPosition.value = {
        left: box.boxPosition.x / scale.value.scaleX,
        right: (box.boxPosition.x + box.boxPosition.width) / scale.value.scaleX,
        top: box.boxPosition.y / scale.value.scaleY,
        bot: (box.boxPosition.y + box.boxPosition.height) / scale.value.scaleY
    }

    if(!positionList.value) return;
    positionList.value[indexPage.value].details[box.index].box = showBoxPosition.value;
}

function onBoxClick(index: number){
    indexBox.value = index;
}

function onTextMove(box: SelectedBox){
    if(!positionList.value || !scale.value) return;

    positionList.value[indexPage.value].details[box.index].boxText = { // scaled back
        left: box.boxPosition.x / scale.value.scaleX,
        right: (box.boxPosition.x + box.boxPosition.width) / scale.value.scaleX,
        top: box.boxPosition.y / scale.value.scaleY,
        bot: (box.boxPosition.y + box.boxPosition.height) / scale.value.scaleY
    };
}

function onTextClick(index: number){
    indexText.value = index;
}

async function saveClick(e: Event){
    if(!token.value){
        console.log("Token not found");
        return;
    }

    try{
        const response: Response = await fetch(config.public.api.base + "/translate/save", {
            method: 'POST',
            body: JSON.stringify({
                uid: uploadStore.uid,
                sourceLang: uploadStore.sourceLang,
                targetLang: uploadStore.targetLang,
                positions: positionList.value,
            }),
            headers: {
                'Authorization': 'Bearer ' + token.value,
                'Content-Type': 'application/json'
            }
        });
    
        if (!response) {
            console.error('Download failed');
            return;
        }
    
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tlx' + crypto.randomUUID().substring(0, 8) + '.zip';
        link.click();
    
        window.URL.revokeObjectURL(url);
    }catch(err){
        console.log(err);
        // msgProcess.value = "Save failed";
    }
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
                        @text-move="onTextMove"
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
                    <div class="mt-5 flex">
                        <button @click="indexPage--" :disabled="indexPage <= 0" class="w-full mr-2 px-4 py-2 bg-white rounded border hover:bg-red-100 active:bg-red-200">Prev</button>
                        <button @click="indexPage++" :disabled="indexPage >= imgList.length - 1" class="w-full ml-2 px-4 py-2 bg-white rounded border hover:bg-red-100 active:bg-red-200">Next</button>
                    </div>

                    <div class="mt-2">
                        Page: {{ indexPage + 1 }}
                    </div>

                    <div class="mt-2">
                        <input class="m-2" type="checkbox" checked="true" v-model="previewStatus">Border preview: {{ previewStatus }}</input>
                    </div>

                    <div class="mt-5" v-if="indexBox">
                        <p>Index Box: {{ indexBox }}</p>
                    </div>
        
                    <div v-if="indexText">
                        <p>Index Text: {{ indexText }}</p>
                    </div>
                </div>

                <div v-if="showBoxPosition" class="mt-5">
                    <p>Box x: {{ showBoxPosition.left.toFixed() }}</p>
                    <p>Box y: {{ showBoxPosition.top.toFixed() }}</p>
                </div>

                <div>
                    <button @click="saveClick" class="w-full mt-5 mr-2 px-4 py-2 bg-red-100 rounded border hover:bg-red-200 active:bg-red-300">Save & Export All</button>
                </div>

            </div>
        </div>

    </div>
</template>