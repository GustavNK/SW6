module Mainapp.actors

open System
open Akka.Actor
open Akka.FSharp
open Mainapp.Messages
open Messages

let inputActor boxOffice (mailbox:Actor<InputMessages>) msg =
    match msg with
    | BuyTicket(eventName,ticketAmount) ->
        boxOffice <! BoxOfficeMessages.BuyTickets(eventName, ticketAmount)
        Console.WriteLine("This is after buytickets/input")
    | CreateAnEvent(eventName,ticketAmount) ->
        Console.WriteLine("This is createevent/input")
        boxOffice <! BoxOfficeMessages.CreateEvent(eventName,ticketAmount)
    | CancelAnEvent txt -> Console.WriteLine(txt)
    

let ticketSellerActor (mailbox:Actor<TicketSellerMessages>) =    
    let mutable ticketCount = 0
    let rec authenticate () =
        actor {
            let! msg = mailbox.Receive()
            match msg with
            | Add(ticketAmount) ->
                ticketCount <- ticketCount + ticketAmount
                Console.WriteLine($"Created event with {ticketCount} of tickets.")
            | TicketSellerMessages.Buy(ticketAmount) ->
                Console.WriteLine("This is before the tickets are bought!!!!!!!")
                ticketCount <- ticketCount - ticketAmount
                Console.WriteLine($"There is now:{ticketCount} tickets available.")
            | _ -> failwith "Fak u!!!!"
            return! authenticate ()
            }
    authenticate ()
let boxOfficeActor (mailbox:Actor<BoxOfficeMessages>) msg =
    match msg with
    | BuyTickets(eventName,ticketAmount) ->
        let actor = select $"{eventName}TicketSeller" mailbox
        Console.WriteLine("This is after select")
        actor <! TicketSellerMessages.Buy(ticketAmount)
        Console.WriteLine("This is after-after select!!")
    | CreateEvent(eventName, ticketAmount) ->
        let actor = spawn mailbox.Context $"{eventName}TicketSeller" ticketSellerActor
        Console.WriteLine("This is before add/BoxOffice")
        actor <! TicketSellerMessages.Add(ticketAmount)
        Console.WriteLine("This is after add/BoxOffice")
    | _ -> failwith "Åh nej!"