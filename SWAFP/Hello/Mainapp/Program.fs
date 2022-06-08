// Learn more about F# at http://docs.microsoft.com/dotnet/fsharp

open System
open Akka.Actor
open Akka.FSharp
open Mainapp
open Mainapp.Messages
open actors
open Messages

// Define a function to construct a message to print
let from whom =
    sprintf "from %s" whom

[<EntryPoint>]
let main _ =
    let strategy () = Strategy.OneForOne(( fun error ->
            match error with
            | :? ArithmeticException -> Directive.Resume
            | :? NotSupportedException -> Directive.Stop
            | _ -> Directive.Restart), 10, TimeSpan.FromSeconds(30.))
    
    let actorSystem = System.create "MyActorSystem" (Configuration.load())
    let boxOffice = spawn actorSystem "BoxOfficeActor" (actorOf2 boxOfficeActor)
    let Input = spawn actorSystem "InputActor" (actorOf2 (inputActor boxOffice))
    
    Console.WriteLine("This is before create")
    Input <! InputMessages.CreateAnEvent("FunnyPoop", 50)
    Console.WriteLine("This is after create")
    Input <! InputMessages.BuyTicket("FunnyPoop", 3)
    Input <! InputMessages.BuyTicket("FunnyPoop", 15)
    Input <! InputMessages.BuyTicket("FunnyPoop", 30)    
    Console.WriteLine("This is the end!")
//    Input <! CreateAnEvent("r")
    
    
    
    
    
    
    actorSystem.WhenTerminated.Wait ()
    0 // return an integer exit code