module Poopy_Exam_Example.RPSLP

open System

type Move =
    | Rock
    | Paper
    | Scissors
    | Lizard
    | Spock
    
type MoveAlt =
    | Move of string
    | Error
        
    
type GameResult =
    | Victory of Move*Move
    | Loss of Move*Move
    | Draw of Move*Move
let WeaponChoice cpuChoice =
    match cpuChoice with
    | 0 -> Rock
    | 1 -> Paper
    | 2 -> Scissors
    | 3 -> Lizard
    | 4 -> Spock
    | _ -> failwith "Moller"
    
let Fight userWeapon cpuWeapon =
    match userWeapon, cpuWeapon with
    | Move.Scissors, Move.Paper-> Victory(userWeapon, cpuWeapon)
    | Move.Scissors, Move.Lizard -> Victory(userWeapon, cpuWeapon)
    | Move.Scissors, Move.Rock -> Loss(userWeapon, cpuWeapon)
    | Move.Scissors, Move.Spock -> Loss(userWeapon, cpuWeapon)
    | Move.Lizard, Move.Paper -> Victory(userWeapon, cpuWeapon)
    | Move.Lizard, Move.Rock -> Loss(userWeapon, cpuWeapon)
    | Move.Lizard, Move.Scissors -> Loss(userWeapon, cpuWeapon)
    | Move.Lizard, Move.Spock -> Victory(userWeapon, cpuWeapon)
    | Move.Paper, Move.Lizard -> Victory(userWeapon, cpuWeapon)
    | Move.Paper, Move.Rock -> Loss(userWeapon, cpuWeapon)
    | Move.Paper, Move.Scissors -> Loss(userWeapon, cpuWeapon)
    | Move.Paper, Move.Spock -> Victory(userWeapon, cpuWeapon)
    | Move.Spock, Move.Paper -> Loss(userWeapon, cpuWeapon)
    | Move.Spock, Move.Rock -> Victory(userWeapon, cpuWeapon)
    | Move.Spock, Move.Scissors -> Victory(userWeapon, cpuWeapon)
    | Move.Spock, Move.Lizard -> Loss(userWeapon, cpuWeapon)
    | Move.Rock, Move.Paper -> Loss(userWeapon, cpuWeapon)
    | Move.Rock, Move.Spock -> Loss(userWeapon, cpuWeapon)
    | Move.Rock, Move.Scissors -> Victory(userWeapon, cpuWeapon)
    | Move.Rock, Move.Lizard -> Victory(userWeapon, cpuWeapon)
    | (x, y) when (x = y) -> Draw(userWeapon, cpuWeapon)
    | (_, _) -> failwith "Fuck you"
let RPSLP userWeapon =
    let rnd = Random()
    rnd.Next(4) |> WeaponChoice |> Fight userWeapon
let PlayGame =
    Console.WriteLine("Vælg ting, lol")
    let input = Console.ReadKey().KeyChar.ToString()
    Console.WriteLine()
    let choice = WeaponChoice (input |> int)
    
    let result = RPSLP choice 
    
    Console.WriteLine(result)