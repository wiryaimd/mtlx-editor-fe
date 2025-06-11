interface Box{
    left: number,
    right: number,
    top: number,
    bot: number,
}

interface Detail{
    text: string,
    confidence: number,
    wordSize: number,
    box: Box
}

export interface Position{
    text: string,
    details: Detail[]
}