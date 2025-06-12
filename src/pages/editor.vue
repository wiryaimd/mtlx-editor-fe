<script setup lang="ts">
import type { Position, Detail, Box } from '~/types/Position';

const uploadStore = useUploadStore();

const imgRaw = ref("");
const imgTl = ref("");

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

                    d.box = box;
                    return d;
                });

                detailPositionList.value = detailList;
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
    <div class="flex flex-col h-screen bg-green-50">
        <div>
            <Header></Header>
        </div>

        <div>
            <h3>Editor</h3>
        </div>

        <!-- <div class="img">
            <img ref="rawRef" :src="imgRaw" alt="raw" width="350px" height="500px">
        </div> -->
    
        <div class="relative overflow-hidden m-15 inline-block">
            <img class="h-full" @load="onLoad" ref="tlRef" :src="imgTl" alt="tl" height="100vh">
            <div v-if="detailPositionList">
                <Box v-for="(box, index) in detailPositionList" :key="index" v-model:detail_position="detailPositionList[index]"></Box>
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