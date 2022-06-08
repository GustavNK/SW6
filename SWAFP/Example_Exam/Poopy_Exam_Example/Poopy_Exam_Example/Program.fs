

// For more information see https://aka.ms/fsharp-console-apps

open System
open Poopy_Exam_Example.SmoosedMorseCode
open Poopy_Exam_Example.RPSLP

type Something =
    | Thing of int
    | Nothing

let bind f = function
    | Thing x -> f x
    | Nothing -> Nothing

//let map f x y = function
//    | (x,y) -> Thing(f x y)

let map f = function
    | Thing x -> Thing(f x)
    | Nothing -> Nothing

let Add x y = x + y
let ThingAdd x y =
        x |> map (Add y)
let ThingAdd2 x y =
    Thing(x + y)

[<EntryPoint>]
let main _ =
    //MorseCodeParser
    //PlayGame
        
    let test1 = Some(5)
    let test2 = Thing(6)
    
    let re = test1 |> Option.bind (fun x -> Some(x+1))
//    let er = bind (fun x -> Thing(x+1)) test2
    let er = test2 |> bind (ThingAdd test2)
    let er2 = test2 |> bind (ThingAdd2 5)
    
    let test3 = Thing(8)
    
//    let Add x y = x + y
    
    let m = Some(1) |> Option.map (Add 1)
    let me = Thing(8) |> map (Add 1)
    
    
//    let t = map + 4 
    
    0