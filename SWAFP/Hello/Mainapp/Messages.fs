module Mainapp.Messages

type EventName = string
type TicketAmount = int

type InputMessages =
    | BuyTicket of EventName*TicketAmount
    | CreateAnEvent of EventName*TicketAmount
    | CancelAnEvent of EventName
    
type BoxOfficeMessages =
    | CreateEvent of EventName*TicketAmount
    | GetTickets
    | GetEvents
    | CancelEvent
    | BuyTickets of EventName*TicketAmount
    
type TicketSellerMessages =
    | Add of TicketAmount
    | Buy of TicketAmount
    | GetEvent
    | Cancel