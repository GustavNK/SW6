

//9.3 Declare an iterative solution to exercise 1.6.

// Declare a recursive function sum: int * int -> int, where
// sum(m, n) = m + (m + 1) + (m + 2) + · · · + (m + (n − 1)) + (m + n)
let rec sum = function
    | (0,m) -> m
    | (n,m) -> sum(n-1, n+m)
let result = sum (5,0)
printfn $"%d{result}"
//9.6 Declare a continuation-based version of the factorial function and compare the run time with
// the results in Section 9.4.

let rec fact n c =
    if n=1 then c 1
    else fact (n-1)  (fun res ->
           c(n*res)
        )
let result2 = fact 5 (fun a -> a)
printfn $"%d{result2}"
//9.7
//Develop the following three versions of functions computing Fibonacci numbers Fn (see Exercise
//1.5):
//1. A version fibA: int -> int -> int -> int with two accumulating parameters n1 and
//n2, where fibAnn1 n2 = Fn, when n1 = Fn−1 and n2 = Fn−2. Hint: consider suitable
//definitions of F−1 and F−2.
//2. A continuation-based version fibC: int -> (int -> int) -> int that is based on the
//definition of Fn given in Exercise 1.5.
//Compare these two functions using the directive #time, and compare this with the while-loop
//based solution of Exercise 8.6.

//Fibnoacci accumulating n1 og n2
let rec fibA = function
    | n when n=0 -> 0
    | n when n=1 -> 1
    | n -> fibA (n-1) + fibA (n-2)
let result3 = fibA 10
printfn $"%d{result3}"

//Fibonacci continuation version
let rec fibB n c =
    if n = 0 then c 0
    if n = 1 then c 1
    else
        let first = fun vl->
            let second = fun vr -> c(vl+vr)
            fibB (n-2) second
        fibB (n-1) first

let rec fibC n count =
    match n with
    | 1
    | 2 -> count (1)
    | _ ->
        let first x =
            let second y =
                count(x+y)
            fibC (n-2) second
        fibC (n-1) first
let result4 = fibC 10 (fun a -> a)
printfn $"%d{result4}"
//TODO: Create the following methods which works on the BST from week 4
//BST.map: ('a -> 'b) -> BST<'a> -> BST<'b>
//BST.fold: ('a -> 'b -> 'b) -> 'b -> BST<'a> -> 'b
//Check if your implementation is tail recursive? If not, can you transform the methods so they are?