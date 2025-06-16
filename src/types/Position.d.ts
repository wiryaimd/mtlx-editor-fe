export interface Box{
    left: number,
    right: number,
    top: number,
    bot: number
}

export interface Detail{
    text: string,
    confidence: number,
    wordSize: number,
    box: Box,
    boxText: Box
}

export interface Position{
    text: string,
    fileName: string,
    width: number,
    height: number,
    details: Detail[]
}