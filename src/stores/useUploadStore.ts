import { defineStore } from 'pinia'
import type { Position } from '~/types/Position';

export const useUploadStore = defineStore('upload', () => {
    const uid: Ref<string | undefined> = ref<string>();
    const sourceLang: Ref<string | undefined> = ref<string>();
    const targetLang: Ref<string | undefined> = ref<string>();

    const position: Ref<Position[] | undefined> = ref<Position[]>();
    const files: Ref<File[] | undefined> = ref<File[]>([]);

    function setUid(newUid: string){
        uid.value = newUid;
    }

    function setSrc(newSrc: string){
        sourceLang.value = newSrc;
    }

    function setTarget(newTarget: string){
        targetLang.value = newTarget;
    }
    
    function setFiles (newFiles: File[]){ 
        files.value = newFiles 
    }

    function setPosition(newPosition: Position[] | void){
        if(newPosition){
            position.value = newPosition;
        }
    }

    return {uid, sourceLang, targetLang, files, position, setSrc, setTarget, setUid, setFiles, setPosition};
});