<script lang="ts" setup>
import type { Store } from 'pinia';
import type { Lang } from '~/types/Lang';
import type { Position } from '~/types/Position';

const config = useRuntimeConfig();
const router = useRouter();

const files: Ref<File[]> = ref<File[]>([]);
const showFile: Ref<string[]> = ref<string[]>([]);
const msgProcess: Ref<string> = ref("");

const uploadStore = useUploadStore();


const targetLang: Lang[] = LANG;
// const targetLangId: string[] = LANG_TO_ID;

const selectedLang: Ref<string> = ref("none");

function selectedFile(e: Event){
    const input: HTMLInputElement = e.target as HTMLInputElement;
    const f: FileList | null = input.files;
    if(f){ // shorthand for f !== null && f !== undefined
        files.value = Array.from(f); // FileList to File[]
        showFile.value = files.value.slice(0, 14).map((s) => s.name);
    }
}

async function translateClick(){
    msgProcess.value = "Uploading...";

    let f: File[] = files.value;
    let formData: FormData = new FormData();
    formData.append("lang", selectedLang.value);

    for(let i: number = 0; i < f.length; i++){
        console.log(f[i].name + " " + f[i].size);
        formData.append("imgs", f[i]);
    }

    let res: Position | void = await $fetch<Position>(config.public.api.base + "/translate/upload", {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob29oMiIsImV4cCI6MTc0OTYzMTQ0OCwiaWF0IjoxNzQ5NjIwNjQ4fQ.ZgdPCN9a-le_CYiMjwRClXd1SCYmqwS5l_0e8osC5iQ'
        },
        body: formData
    }).catch((err: string) => {
        console.log(err);
        msgProcess.value = "Upload failed";
    });

    uploadStore.setPosition(res);
    uploadStore.setFiles(files.value);

    msgProcess.value = "";
    router.push("/editor");
}

// onMounted(async () => {
//     const res: AxiosResponse<string> = await http.get<string>("/users/test");

//     console.log(res.data + " hooh");
// });

</script>

<template>
    <div>
        <h3>Home</h3>
        <p>{{selectedLang}}</p>
    </div>

    <div class="main">
        <div>
            <!-- style="display: none;" -->
            <input id="select" type="file" accept="image/jpg|image/jpg" multiple @change="selectedFile">
            <!-- <label for="select">Select</label> -->
        </div>

        <div class="row">
            <div>
                <select v-model="selectedLang">
                    <option value="none" selected>&lt;Target&gt;</option>
                    <option v-for="t in targetLang" :value="t.id" :key="t.id">{{ t.lang }}</option>
                </select>
            </div>
            <div>
                <button @click="translateClick">Translate</button>
            </div>
        </div>

        <div class="file_list">
            <ul>
                <!-- <li v-for="index in Math.max(15, files.length)">
                    {{ files[index].name }}
                </li> -->

                <li v-for="f in showFile"> {{f}} </li>

                <p v-if="files.length > 15">.... {{files.length}} files</p>
            </ul>
        </div>

        <div>
            <p>{{ msgProcess }}</p>
        </div>
    </div>
</template>