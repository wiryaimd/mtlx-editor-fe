<script setup lang="ts">
import type { BoxPosition } from '~/types/BoxPosition';
import type { Position } from '~/types/Position';

const uploadStore = useUploadStore();

const imgRaw = ref("");
const imgTl = ref("");

const oriWidth = uploadStore.position?.width;
const oriHeight = uploadStore.position?.height;

const boxPosition: Ref<BoxPosition[] | undefined> = ref([]);
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
                const boxList: BoxPosition[] = [];
                for(let i = 0; i < position.details.length; i++){
                    console.log("pos: ", position.details[i].box.left);
                    console.log("pos: ", position.details[i].box.top);
                    let left: number = position.details[i].box.left;
                    let top: number = position.details[i].box.top;
                    boxList.push({
                        x: left * scaleX,
                        y: top * scaleY
                    });
                }

                boxPosition.value = boxList;
            }
        }
    }
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
    <div>
        <h3>Editor</h3>
    </div>

    <div class="flex bg1">
        <!-- <div class="img">
            <img ref="rawRef" :src="imgRaw" alt="raw" width="350px" height="500px">
        </div> -->
    
        <div class="img bg1">
            <img @load="onLoad" ref="tlRef" :src="imgTl" alt="tl" width="100%">
            <div v-if="boxPosition">
                <Box v-for="(box, index) in boxPosition" :key="index" v-model:box_position="boxPosition[index]"></Box>
            </div>
        </div>

    </div>
</template>

<style scoped>

.img{
    position: relative;
    display: inline-block;
}

.bg1{
    margin: 12px;
    background-color: rebeccapurple;
}

</style>