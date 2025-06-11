<script setup lang="ts">

</script>

<template>
    <div>
        <Header></Header>
    </div>
    <div>
        <NuxtPage></NuxtPage>
    </div>
</template>

<style>
.main{
    justify-content: center;
    flex-direction: column;
    display: flex;
    /* background-color: red; */
    align-items: center;
    height: 50vh;
    column-count: 1;
}

.flex{
    display: flex;
}

.row{
    display: flex;
    padding: 12px;
    /* background-color: rebeccapurple; */
}

/* .file_list{
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
} */
</style>