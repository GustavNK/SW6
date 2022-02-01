// Learn more about F# at http://docs.microsoft.com/dotnet/fsharp

open System

let rec fibonacci = function
    | 0L -> 0L
    | 1L -> 1L
    | n -> fibonacci (n-1L) + fibonacci (n-2L)


let rec func1 m n =
    match n with
    | 0 -> m
    | _ -> (m + n) + func1 m (n-1)


let rec pow s n =
    match n with
    | 0 -> ""
    | _ -> s + pow s (n-1)


let isIthChar (s:string, i:int, c:char) =
    if s.Chars(i) = c then true else false

let occInString (s:string, c:char) =
    s |> String.filter (fun c2 -> c=c2) |> String.length

[<EntryPoint>]
let main argv =
    let x = pow "XD" 1
    let y = isIthChar( x, 1, 'D')
    let j = occInString(x, 'D')
    printfn "%d" j
    0 // return an integer exit code