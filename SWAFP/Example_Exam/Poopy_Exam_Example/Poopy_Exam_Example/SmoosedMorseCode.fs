module Poopy_Exam_Example.SmoosedMorseCode

open System

let readLines filePath = System.IO.File.ReadLines(__SOURCE_DIRECTORY__ + filePath)

let morseTable = [
 'a', ".-"
 'b', "-..."
 'c', "-.-."
 'd', "-.."
 'e', "."
 'f', "..-."
 'g', "--."
 'h', "...."
 'i', ".."
 'j', ".---"
 'k', "-.-"
 'l', ".-.."
 'm', "--"
 'n', "-."
 'o', "---"
 'p', ".--."
 'q', "--.-"
 'r', ".-."
 's', "..."
 't', "-"
 'u', "..-"
 'v', "...-"
 'w', ".--"
 'x', "-..-"
 'y', "-.--"
 'z', "--.."
 ]

//let toMorse c morse = Map.find c morse

let morse = Map.ofList
                [('a', "._"); ('b', "_..."); ('c', "_._."); ('d', "_..");
                ('e', "."); ('f', ".._."); ('g', "__."); ('h', "....");
                ('i', ".."); ('j', ".___"); ('k', "_._"); ('l', "._..");
                ('m', "__"); ('n', "_."); ('o', "___"); ('p', ".__.");
                ('q', "__._"); ('r', "._."); ('s', "..."); ('t', "_");
                ('u', ".._"); ('v', "..._"); ('w', ".__"); ('x', "_.._");
                ('y', "_.__"); ('z', "__..");]

let toMorse c (morse:Map<char,string>) = Map.find c morse

//let send s = (s, String.collect (toMorse s morse))

let MorseCodeParser =
    let toMorse c = Map.find c morse
    let send s = (s, String.collect toMorse s)               
    let lines = readLines "./enable1.txt"
    //lines |> Seq.iter(fun x -> printfn $"%s{send x}")
    let stringList = Seq.map send lines
    let number = Seq.countBy snd stringList
    let word = Seq.filter (fun x -> snd x = 13) number
    word |> Seq.iter(fun x -> printfn $"%s{fst x}")
    let firstWord = Seq.head word 
    let result = Seq.filter (fun s -> snd s = (fst firstWord)) stringList
    result |> Seq.iter(fun x -> printfn $"%s{fst x}")