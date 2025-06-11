import { defineStore } from 'pinia'
import type { Position } from '~/types/Position';

export const useUploadStore = defineStore('upload', () => {
    const position: Ref<Position | undefined> = ref<Position>();
    const files: Ref<File[] | undefined> = ref<File[]>([]);

    function setFiles (newFiles: File[]){ 
        files.value = newFiles 
    }

    function setPosition(newPosition: Position | void){
        if(newPosition){
            position.value = newPosition;
        }
    }

    return {files, setFiles, setPosition};
});