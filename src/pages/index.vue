<script lang="ts" setup>
import type { Lang } from '~/types/Lang';
import type { Position } from '~/types/Position';

const config = useRuntimeConfig();
const router = useRouter();

const files: Ref<File[]> = ref<File[]>([]);
const showFile: Ref<string[]> = ref<string[]>([]);
const msgProcess: Ref<string> = ref("");

const uploadStore = useUploadStore();


const targetLang: Lang[] = LANG;
const sourceLang: Lang[] = LANG_SRC;
// const targetLangId: string[] = LANG_TO_ID;

const selectedLangSource: Ref<string> = ref("none");
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
    formData.append("langSrc", selectedLangSource.value);
    formData.append("langTo", selectedLang.value);

    for(let i: number = 0; i < f.length; i++){
        console.log(f[i].name + " " + f[i].size);
        formData.append("imgs", f[i]);
    }

    try{
        let res: Position[] | void = await $fetch<Position[]>(config.public.api.base + "/translate/upload", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJob29oMiIsImV4cCI6MTc0OTkxMDkyOCwiaWF0IjoxNzQ5OTAwMTI4fQ._o-yiS-am9P3paCAp6MN2QWDRam4IIsmQehagkSYpGY'
            },
            body: formData
        });

        if(res){
            console.log("res", res);
            uploadStore.setPosition(res);
            uploadStore.setFiles(files.value);
        
            msgProcess.value = "";
            router.push("/editor");
        }else{
            msgProcess.value = "Result not found";
        }

    }catch(err){
        console.log("req failed", err);
        msgProcess.value = "Upload failed";
    }
}

// onMounted(async () => {
//     const res: AxiosResponse<string> = await http.get<string>("/users/test");

//     console.log(res.data + " hooh");
// });

</script>

<template>
    <div>
        <Header></Header>
    </div>

    <div>
        <p>{{selectedLangSource}} {{selectedLang}}</p>
    </div>

    <div class="flex flex-col items-center mt-16">
        <label class="p-3 rounded-sm border-2 border-dotted w-150 text-center" for="select">
            <!-- style="display: none;" -->
            <input class="sr-only" id="select" type="file" accept="image/jpg|image/jpg" multiple @change="selectedFile">
            <!-- <label class="bg-blue-200 rounded-sm border-2 border-dotted" for="select">Select</label> -->
             Select
        </label>

        <div class="flex w-150">
            <div class="w-full border mb-5 mt-5 p-1 rounded">
                <select class="w-full" v-model="selectedLangSource">
                    <option value="none" selected>&lt;Letter type&gt;</option>
                    <option v-for="t in sourceLang" :value="t.id" :key="t.id">{{ t.lang }}</option>
                </select>
            </div>

            <div class="ml-5 border w-full mb-5 mt-5 p-1 rounded">
                <select class="w-full" v-model="selectedLang">
                    <option value="none" selected>&lt;Target&gt;</option>
                    <option v-for="t in targetLang" :value="t.id" :key="t.id">{{ t.lang }}</option>
                </select>
            </div>
            <div class="mt-5 ml-5 mb-5 border bg-red-50 px-5 rounded p-1">
                <button @click="translateClick">Translate</button>
            </div>
        </div>
        

        <div class="flex w-100">
            <ul class="w-full">
                <!-- <li v-for="index in Math.max(15, files.length)">
                    {{ files[index].name }}
                </li> -->

                <li class="w-full text-center" v-for="f in showFile"> {{f}} </li>

                <p v-if="files.length > 15">.... {{files.length}} files</p>
            </ul>
        </div>

        <div>
            <p>{{ msgProcess }}</p>
        </div>
    </div>
</template>