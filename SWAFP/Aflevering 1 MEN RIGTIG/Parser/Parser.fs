module Parser

open FParsec
open System

type Duration = string
type Extended = string
type Rest = string
type Tone = string
type Octave = string

type Token = Duration * Extended * Rest * Tone * Octave

let pScore: Parser<Token list, unit> = 
    let isNote c = isLetter c || c = '#'
    let isPause c = c = '-'
    let isDot c = c = '.'
    
    let superParser:Parser<Token,unit> = tuple5 (many1Satisfy isDigit) (manySatisfy isDot) (manySatisfy isPause) (manySatisfy isNote) (manySatisfy isDigit)
    
    sepBy superParser spaces1

let parse (input: string): Choice<string, Token list> =
    match run pScore input with
    | Failure(errorMsg,_,_)-> Choice1Of2(errorMsg)
    | Success(result,_,_) -> Choice2Of2(result)

// Helper function to test parsers
let test (p: Parser<'a, unit>) (str: string): unit =
    match run p str with
    | Success(result, _, _) ->  printfn "Success: %A" result
    | Failure(errorMsg, _, _) -> printfn "Failure: %s" errorMsg


// TODO 3 calculate duration from token.
// bpm = 120 (bpm = beats per minute)
// 'Duration in seconds' * 1000 * 'seconds per beat' (if extended *1.5)
// Half note: 2 seconds
// Quarter note: 1 second
// Eight note: 1/2 second
// Sixteenth note 1/4 second
// thirty-second note: 1/8
let durationFromToken (token: Token): float =
    let (duration, extended,_,_,_) = token
    4.0 / (float duration) * 500.0 * if (extended = ".") then 1.5 else 1.0

// TODO 4 calculate overall index of octave
// note index + (#octave-1 * 12)
let overallIndex (note, octave) =
     match note with
        | note when note = "A"  -> 1. + (float octave)-1.*12.
        | note when note = "#A" -> 2. + (float octave)-2.*12.
        | note when note = "B"  -> 3. + (float octave)-3.*12.
        | note when note = "C"  -> 4. + (float octave)-4.*12.
        | note when note = "#C" -> 5. + (float octave)-5.*12.
        | note when note = "D"  -> 6. + (float octave)-6.*12.        
        | note when note = "#D" -> 7. + (float octave)-7.*12.
        | note when note = "E"  -> 8. + (float octave)-8.*12.
        | note when note = "F"  -> 9. + (float octave)-9.*12.
        | note when note = "#F" -> 10. + (float octave)-10.*12.
        | note when note = "G"  -> 11. + (float octave)-11.*12.
        | note when note = "#G" -> 12. + (float octave)-12.*12.
        | _                     -> failwith "That's not a tone, Bitsch!!!!"

// TODO 5 calculate semitones between to notes*octave
// [A; A#; B; C; C#; D; D#; E; F; F#; G; G#]
// overallIndex upper - overallIndex lower
let semitonesBetween (lower : Tone*Octave, upper: Tone*Octave) = overallIndex upper - overallIndex lower

// TODO 6
// For a tone frequency formula can be found here: http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
// 220 * 2^(1/12) * semitonesBetween (A1, Token.pitch) 
let frequency (token: Token): float =
     let (_,_,_,tone ,octave) = token
     220. * 2.**(1./12.) * semitonesBetween (("A","1"), (tone, octave))