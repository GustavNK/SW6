
open System

// TODO 8 take input from file/cmd and save it to a file
[<EntryPoint>]
let main argv =
    let score = "32.#D3 16#A2"
    match Assembler.assembleToPackedStream score with
            | Choice2Of2 ms -> WavePacker.Write "SoundFile.wav" ms
            | Choice1Of2 err -> failwith err
    0         