// Learn more about F# at http://docs.microsoft.com/dotnet/fsharp

open System

// Define a function to construct a message to print
let from whom =
    sprintf "from %s" whom


let test (a:bool) (b:int) = 
    if a then b else 0;


let timeEarliest ((h1, m1, f1): int*int*string, (h2, m2, f2):int*int*string) =
    match f1 with
    | time when time = f2 -> 
        match h1 with
        | equal when h1 = h2 -> 
            match m1 with 
            | equal when m1 = m2 -> (h1, m1, f1)
            | greater when m1 > m2 -> (h2, m2, f2)
            | _ -> (h1, m1, f1)
        | greater when h1 > h2 -> (h2, m2, f2)
        | _ -> (h1, m1, f1)
    | "AM" -> (h1, m1, f1)
    | "PM" -> (h2, m2, f2)
    | _ -> failwith "Not correct match on 'AM' or 'PM'"

[<EntryPoint>]
let main argv =
    let time1 = (5, 25, "PM")
    let time2 = (4, 55, "AM")
    Console.WriteLine("{0}", timeEarliest (time1, time2))
    0 // return an integer exit code