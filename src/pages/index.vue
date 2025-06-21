<script lang="ts" setup>
import type { Lang } from '~/types/Lang';
import type { Position } from '~/types/Position';
import type { Token } from '~/types/Token';
import type { Translation } from '~/types/Translation';

useSeoMeta({
    title: 'Mangatlx – Automatic comic translantion and editor',
    description: 'Automatic comic, manga, manhwa, manhua translantion and editor',
    ogTitle: 'Manga Translator',
    ogDescription: 'Automatic comic, manga, manhwa, manhua translantion and editor',
    ogImage: 'https://mangatlx.com/og-image.png'
});

useHead({
  link: [{ rel: 'canonical', href: 'https://mangatlx.com' }]
})

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
const turnstile: Ref<string | undefined> = ref();

const token = useState<string>("token");

function selectedFile(e: Event){
    const input: HTMLInputElement = e.target as HTMLInputElement;
    const f: FileList | null = input.files;
    if(f){ // shorthand for f !== null && f !== undefined
        files.value = Array.from(f); // FileList to File[]
        showFile.value = files.value.slice(0, 14).map((s) => s.name);
    }
}

async function translateClick(){
    if(!files.value || files.value.length === 0){
        msgProcess.value = "Please select image file...";
        return;
    }

    if(files.value.length > 15){
        msgProcess.value = "Cannot more than 15 image at same time...";
        return;
    }

    if(!token.value){
        msgProcess.value = "User not validated...";
        return;
    }

    msgProcess.value = "Uploading...";

    let f: File[] = files.value;
    let formData: FormData = new FormData();
    formData.append("langSrc", selectedLangSource.value);
    formData.append("langTo", selectedLang.value);

    for(let i: number = 0; i < f.length; i++){
        console.log(f[i].name + " " + f[i].size);
        formData.append("imgs", f[i]);
    }

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            let progress = Math.round((e.loaded / e.total) * 100);
            msgProcess.value = "Uploading... " + progress + "%";
            if (progress === 100) {
                msgProcess.value = "Processing...";
            }
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            msgProcess.value = "";

            let res: Translation = JSON.parse(xhr.responseText);

            uploadStore.setUid(res.uid);
            uploadStore.setSrc(res.sourceLang);
            uploadStore.setTarget(res.targetLang);
            uploadStore.setPosition(res.positions);
            uploadStore.setFiles(files.value);

            router.push("/editor");

        } else {
            msgProcess.value = "Failed to process";
        }
    }

    xhr.onerror = (e) => {
        console.log(e);
        msgProcess.value = "Something went wrong...";
    }

    xhr.open("POST", config.public.api.base + "/translate/upload");
    xhr.setRequestHeader("Authorization", "Bearer " + token.value);
    xhr.send(formData);

    // try{
    //     let res: Translation | void = await $fetch<Translation>(config.public.api.base + "/translate/upload", {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': 'Bearer ' + token.value
    //         },
    //         body: formData
    //     });

    //     if(res){
    //         console.log("res", res);
    //         uploadStore.setUid(res.uid);
    //         uploadStore.setSrc(res.sourceLang);
    //         uploadStore.setTarget(res.targetLang);
    //         uploadStore.setPosition(res.positions);
    //         uploadStore.setFiles(files.value);
        
    //         msgProcess.value = "";
    //         router.push("/editor");
    //     }else{
    //         msgProcess.value = "Result not found";
    //     }

    // }catch(err){
    //     console.log("req failed", err);
    //     msgProcess.value = "Upload failed";
    // }
}

watch(turnstile, async (token) => {
    msgProcess.value = "";

    const response: Token | undefined = await $fetch(config.public.api.base + '/auth/sign', {
        method: 'POST',
        body: { token: token },
    });

    if(response){
        useState('token').value = response.token;
    }
});

</script>

<template>
    <div class="flex flex-col min-h-screen">
        <Header></Header>

    <!-- <div>
        <p>{{selectedLangSource}} {{selectedLang}}</p>
    </div> -->

        <div class="flex flex-col items-center mt-16 ">
            <label class="px-3 py-16 rounded-sm border-2 border-dotted border-gray-400 w-150 text-center cursor-pointer" for="select">
                <!-- style="display: none;" -->
                <input class="sr-only" id="select" type="file" accept="image/jpg|image/jpg" multiple @change="selectedFile">
                <!-- <label class="bg-blue-200 rounded-sm border-2 border-dotted" for="select">Select</label> -->
                Select Image
            </label>

            <div class="flex w-150">
                <div class="w-full border border-gray-400 mb-5 mt-5 p-1 rounded">
                    <select class="w-full" v-model="selectedLangSource">
                        <option value="none" selected>&lt;Letter type&gt;</option>
                        <option v-for="t in sourceLang" :value="t.id" :key="t.id">{{ t.lang }}</option>
                    </select>
                </div>

                <div class="ml-5 border border-gray-400 w-full mb-5 mt-5 p-1 rounded">
                    <select class="w-full" v-model="selectedLang">
                        <option value="none" selected>&lt;Target&gt;</option>
                        <option v-for="t in targetLang" :value="t.id" :key="t.id">{{ t.lang }}</option>
                    </select>
                </div>
                <div>
                    <button @click="translateClick" class="mt-5 ml-5 mb-5 border border-gray-400 bg-red-100 px-5 rounded p-1 hover:bg-red-200 active:bg-red-300 cursor-pointer">Translate</button>
                </div>
            </div>

            <div>
                <NuxtTurnstile data-theme="light" v-model="turnstile"></NuxtTurnstile>
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

        <Footer class="mt-auto"></Footer>

    </div>
</template>