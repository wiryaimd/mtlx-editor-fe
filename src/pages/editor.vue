<script setup lang="ts">

const uploadStore = useUploadStore();

const imgRaw = ref("");
const imgTl = ref("");

if(uploadStore.files){
    if(uploadStore.files[0]){
        imgRaw.value = URL.createObjectURL(uploadStore.files[0]);
        imgTl.value = URL.createObjectURL(uploadStore.files[0]);
    }
}

</script>

<template>
    <div>
        <h3>Editor</h3>
    </div>

    <div class="flex">
        <div>
            <img :src="imgRaw" alt="raw" width="350px">
        </div>
    
        <div>
            <img :src="imgTl" alt="tl" width="350px">
        </div>
    </div>
</template>