import type { Position } from "./Position";

export interface Translation{
    uid: string,
    sourceLang: string,
    targetLang: string,
    positions: Position[]
}