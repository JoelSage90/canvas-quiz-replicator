## - Week 1: paradims

- paradigms defines the computation - how data is manipulated
- declarative - describes how results should look like
    - eg: functional, html, haskell
    - easy to reason, prove, test and debug
- imperative - steps to solve a problem (structured
    - OOP, concurrent

## - week 2: C basics

#### intro/history (probably optional)

- low-level thus close to hardware. can do more memory related things
- complied using gcc - src code

#### Variables, Types, Printing to the Console

- strongly typed variables eg: `int a = 6;` . variables are pointers to memory
- types: int, long, unsigned int, char, string( char array), float, double
- fprint used to print to console eg: `fprint(”number: %d”,a);`

#### Arrays, Strings, Command Line Arguments

- array is pointer. array will point to first address - all times are stored contiguously
    - when we do `array[i]` - same as array address + i*(size of items in array)
- Strings are arrays of chars.
    - string manipulation: strcpy/strncpy, strcmp/strncmp

### Conditionals and Loops

- `if (boolean) {…}`
- `for(int i =0; i<j; i++) {…}`

#### Functions

- `public void functionName(<type> parameter, ..) {…}`
    - variables can be passed in by ref or by val - change original value or make copy of variable

#### Custom Types and Data Structures

- custom types can be made - `typedef long long int new_int;`
- struct can be used to create data structures - have multiple parameters of different types

## – week 3: memory management in C and std library

#### Pointers

- variables are pointers to memory - can access address or value in address
    - we can refer to either the pointer to memory or the memory value itself
    
    ```c
    int a = 5;
    int *b = &a; //b points to a address
    int c = a; //c is copy of a
    b* += 1; //a= 6
    c += 1; //a= 5
    ```
    
- useful for functions (by val vs by ref) - `public void functionName(<type> *parameter){}`

#### Dynamic Memory Allocation

- memory used for programs: stack and heap
    - stack hold local variables and parameters
    - static mem holds global vars, constants - things that dont change
    - heap is allocated at run time
- dynamic mem allocation allows us to put things on heap
    - `malloc(size);` - put sum on heap       `free();` - take sum off heap
    - we need to handle this ourselves - can be unsafe

#### The C Standard Library

- memory
    - `memset(src,c,n)`,`memcopy(dest,src,n)`
- string manipulation
    - `strncpy(dest,src,n)`, `strcmp(s1,s2)`, `strncat(desc,src,n)`, `strleng(s1)`
- file
    - `fopen(path,mode)`, `fwrite(ptr,size,nmeb,file)`, `fread(ptr,size,nmeb,file)`,`fclose(stream)`

## – week 4: building C programs and use cases

#### Processing/Compilation

- precompilation - textually transforms c code before compilation
    - things in headers file are expanded
    - macros (like constants) are expanded
    - conditional compilation - remove or slip blocks based on coniditions
- modular compilation - get and use all the src files needed
    - linker used to link object files - each file becomes object file
- automatic compilation - use make file to automatically compile rather than having to compile multiple files.
    - make file will describe the dependancies

#### Type Conversion and Casting

- implicit conversion done with things like integer promotion (signed + unsigned)
    - lesser size is prompted to higher (depending on if signed or not)
    - this may cause issues with int overflow/underflow
- type casting forces conversion to specific type
    - solves some of the issues from int promotion
    - generic pointer: `void*` - can represent multiple types for a parameter

#### Debugging with GDB

- CLI used to find issues which may not appear during compilation
    - execute till crash happens
- allows to add breakpoints, view variable values and see call stack

#### Case Study’s

- high performance system, std library, OS kernel
    - OS kernel makes sys calls and context switching so needs to be close to hardware

## – week 5: memory safety + use cases

#### Memory Safety

- spacial safety - programmer has access to memory to w/r
    - out of bounds pointer, bad pointer deref
- temporal safety - Compiler can’t check something after freed
    - use after free causes undefined behaviour
- info leak - if variables overflow, it can cause other confidential ones to get leaked
    
    ```c
    char secret[] = "password123";
        char buf[8];
    
        memcpy(buf, secret, sizeof(secret)); // ❌ over-read into buf
        printf("%s\n", buf); // may print beyond buf, leaking data
    ```
    
- sensetive data tampering - similar to info leak, var can overflow and write over other things in memory
    
    ```c
    int isAdmin = 0;
    char buf[8];
    
    strcpy(buf, "AAAAAAAAAAAA"); // ❌ overflow
    // may overwrite isAdmin depending on layout
    
    if (isAdmin)
        printf("Admin access granted\n");
    ```
    
- stack smashing - when things on stack are made to overflow so that a return address can be accessed
    
    ```c
    void vuln() {
        char buf[8];
        gets(buf);  // ❌ no bounds checking
    }
    
    int main() {
        vuln();     // attacker input can overwrite return address
        return 0;
    }
    ```
    
- use after free - as the name implies
    - can overwrite memory and access other address to execute something else
    
    ```c
    int *p = malloc(sizeof(int));
    free(p);
    *p = 5;   // ❌ use-after-free
    ```
    

#### Secure Coding Practices

- keep track of size of arrays and buffers as well as data type sizes
- use the alternative methods, especially for string and memory related calls
    - `get()` → `fgets()`
    - `strcpy()` → `strncpy()`
    - `sprintf()`→ `snprintf()`
    - `scanf()` → `fgets() + sscanf()`
    - `strlen()` → ensure terminating char
    - `memcpy()` → `memmove()`
    - `bcopy()` → `memmove()`
- malloc - check return value to prevent use after free
    - calloc sets memory to zero when freed

#### Detecting Bugs

- static - while not running, trace and look through code
    - can have false positives and hard to scale
- dynamic - detect for bugs while the code is running
    - use sanitizers to check memory things which compiler doesn’t
- fuzzing - testing lots of inputs especially at boundaries and edge cases to see how program behaves

#### Runtime Defences

- parts of memory are made non-executable so ppl dont mess with it (using XOR)
- stack canaries - canary on the stack which is before the address
    - compare this to calle return
- address space layout randomisation - in each iteration program is placed kinda randomly
    - prevent people from finding where everyting is when running since it changes each time
- others
    - strip binary of symbols
    - readonly realloc
    - `_FORTIFY_SOURCE` - oveflow checks before sensetive methods
    - CFI
        - forward - functions have legit targets
        - backwards - return addresses have legit target
    - `checksec` - see if hardening techniques used

## – week 7: instruction to compliers

- **What is a Compiler?**
    - Takes program in once language and translate it to another target language
    - analysis of src and synthesis of target
- **Qualities of a Good Compiler**s
    - meaning of program must be preserved (functionally equvialent)
    - try to make it better in some way
    - correct + fast, matches new syntax, handles any inp size,etc
- **Two Major Phases**
    - Front end (Analysis) - Lexical, Syntax, Semantic, IC gen
        - understands and produces semantics
        - O(N) complexity
    - Back end (Synthesis) - Code optimisation and generation
        - each operation in IR implemented to target code
        - NP-complete complexity
- **Lexical Analysis**
    - characters are grouped into words (white spaces and comments removed)
    - outputs tokens → `<type, lexeme>`
        - eg: a=b+c → `<id,a>≤=,><id,b><+,><id,c>`
    - each id is kept in symbol table
- **Syntax Analysis**
    - checks order of tokens against the syntax of the language
    - uses context-free grammar to creates a parse tree of the tokens
- **Semantic Analysis**
    - checks for semantic errors
    - eg: type check, var declaration, name checks
- **Intermediate Code Generation**
    - AST translated to more general contrains
    - should be easy for target to generate from this
- **Code Optimisation**
    - improves intermediate code for better target code
- **Code Generation**
    - optimised IR + AST mapped to target code
        - AST mapped to linear list of instructions
    - instruction selection, register allocation , scheduling

## – week 8: lexical analysis

- **What is Lexical Analysis?**
    - token for a language are produced using a grammar
    - Grammar has S,T,N,P
        - start state, terminating state, non terminating state, prod rules
- **Formal Language Basics**
    - all languages are productions from grammar
    - can represent some languages using regex (but not all)
- **Regular Expressions (REs)**
    - describes pattern of language - Can be used to automate lexical analysis
- **Building a Scanner by Hand**
    - manually doing analysis using table
    - transition diagram  - table tells next case
- **Finite Automata (DFA/NFA)**
    - graph which shows states and trasitions between them
    - DFA - deteminanistic - one transtion between 2 states
    - NFA - non-determinastic - one or more transitions between 2 states
- **RE → NFA (Thompson's Construction)**
    
    ![image.png](attachment:fe47e23d-0e5d-4e3d-9911-c50926a865d3:image.png)
    
- **NFA → DFA (Subset Construction)**
    - Move(Si,a) → all states which can be reached from Si if a inputted
    - ε-closure(Si) → all states that can be reached with a ε transition
    - for each state we do ε-closure(move(Si,a))
- **DFA Minimisation (Hopcroft's Algorithm)**
    - if we can reach one group of states from another group for any input, we can merge those groups
- **Building Fast Scanners**
    - normally graph will be in tables - this slow
    - use table to make switch case - this fast (but messy)
- **Practical Complications**
    - Porr language design = complex lexical analysis
        - eg: template syntax in C++ (thing<type<typ2>>)
- **Flex/Lex**
    - used to generate lexical analyser - program which recoginses lex paterns in text
    - input: regex, C code, auxiliary C code
    - generates an output source file with yylex() in C → this will isolate tokens according to regex

## – week 9: syntax analysis

- **Limits of Regular Expressions**
    - not all languages can be represented in regex
    - some languages may need a form of memory
- **Chomsky's Grammar Hierarchy**
    - phrase → context → context-free →regular
- **Derivations & Parse Trees**
    - derivation - from start symbol, reach a sequence of terminal symbols
        - left-most - keep expanding left
        - right-most -expand right most
    - parse tree used to represent derivation
- **Ambiguity**
    - same sentence can be produced by multiple parse trees
    - not good
- **Eliminating Ambiguity**
    - change grammar
- **Top-Down Parsing**
    - start at root of tree and go down to deepest node in left
    - if incorrect, backtrack and check other node
    - pre-order/depth first - basically uses a stack
- **Left Recursion**
    - could get caught in a loop - if non termal A can do A → Aa
    - need to prevent this using extra state
        - A → Aa|b becomes A →bA’ A’→ aA’|**ε**
- **LL(1) & Predictive Parsing**
    - look ahead left
    - if A→B and A→C then B+C is next diferent terminal symbol
    - helps parser make correct choices - backtrack free
- **Bottom-Up Parsing**
    - reduction - derive S i-1 from S i
        - match the right side of S i-1 with the right side of Si
        - replace this b with the non terminal symbol b comes from (note the position)
        - handle = rule + position pair <A→b,k>
- **Shift-Reduce Parsing**
    - use stack holding grammar symbols + input buffer for the sentence to parse
    - shift - next input added to stack
    - reduce - check if top of stack matches right of rule + replace top of stack
- **Shift/Reduce & Reduce/Reduce Conflicts**
    - if we reduce too far, the rest of the sentence is not seen
- **LR(1) Parsing**
    - determine production rule by looking ahead to next symbol
    - right most derivation
    - when something is put on stack, put state after it
        - action [state, input]- use table to decide shift or reduce depending on state + input
        - goto[state, non-term]- return new sate on stack after reduction
- **Table Construction (LR/SLR/LALR)**
    - LR(1) - most poweful but largeest table
    - SLR(1) - simple table but more conflicts
    - LALR - compremise - same power as SLR but less conflicts
- **yacc/bison**
    - takes context-free grammar as input and produces LALR(1) - used with flex

## – week 10: the middle-end

- **Beyond Syntax — Semantic Errors**
    - need to check things like types, var declaration, memory allocation, function args, etc
    - syntax analysis can’t catch this
- **Context-Sensitive Analysis**
    - semantic based analysis will need some kind of context - context-free won’t work
    - but this is hard to do
- **Type Systems**
    - type system - set of types in system
    - values have type - need to check these and how they interact with others
        - type checking is this
    - compile time: staticially checking
    - run-time: dynamically checking
- **Symbol Tables**
    - instead of using context-sensetive analysis, use symbol table + ad hoc
    - table containing all variables and functions info
    - prefer hash function since we need to access alot O(1) - rather than list or tree
- **Lexical Scoping**
    - issue with symbol table is that in that lexical scopes cause issues
    - eg: different scopes can have same name and be fine but hard to do this in hash table
        - solution: have a global name for everything or table for each scope
- **IR Types**
    - intermediate representation: between front and back end
        - needs to be easy to get to target from this
    - 3 address code
        - each statement is 1 operations with 3 operands
        - close to machine code
    - auxiliary graphical representations
        - control flow: show how program control works (like a flow chart)
        - data dependent: shows the flow of data in the program
        - call graph: shows procedural dependencies
- **Abstract Syntax Trees (AST)**
    - parse tree → AST: only has terminal states
    - easy to get code from this - do in-order traversal
- **Code Optimisations**
    - sub-expansion elim: if x+y is repeated, use result from first time
    - direct code elim: remove unneeded code
    - constant folding: if value doesn't change make it a constant
    - copy propagation: if value is copied - use new value not old
    - constant propagation: replace constants with acc value
    - reduction in strength: replace expensive with cheaper operations
    - loop invariant code motion: if value in loop doesnt change - move it to outside
    - loop unrolling: reduce number of steps by taking larger steps

## – week 11: code generation

- **Back-End Overview**
    - one big step to go from IR to target code
        - instruction selection, reg allocation, instruction scheduling
- **Instruction Selection**
    - pattern match IR to src code - locally this is optimal but for global is NP-complete
    - Array References & Control Flow
        - arrays are stored contiguously either row-major or collumn-major order
        - ifs are made into branches with labels - same with loops (just branch to start of loop)
            - evaluate true and fall thru - if not then branch
    - Procedures & Functions
        - normally hardware doesnt support functions - need to replicate the behaviour
        - functions are treated as blocks of code and they will have a prologue and epilogue (as well as a pre-call before calling a function)
            - this is used to handling things like local vars for functions etc
- **Register Allocation** — Mapping unlimited virtual registers onto a limited set of physical registers; spilling to memory when needed
    - high level code treats as unlimited registers (virtual register). actually its limited
    - Liveness & Live Ranges
        - live range of variable is from when its made till its last use
        - MAXLLIVE - max values live for a function
            - if this is > number of regs - put in memory
    - Local vs Global Register Allocation
        - local - top-down - reserver regs most frequently used
            - issue: could have long live but barely used
        - global - bottom-up - have a pool of regs and assign
            - when full, remove the furtherest one (last one used)
    - graph colouring - graph which show how ranges interact
        - if no edge connect nodes - they are the same colour
- **Instruction Scheduling**
    - instructions can be reorder to reduce latency (since no instruction is immediate)
        - try to minimise latency by moving instructions to start as early as possible
    - List Scheduling
        - use a precedence graph of instructions with require others
        - compute priority function for each node - latency + weight(predecessors)
        - use this to make schedule
            - check cycle, check ready and schedule
            - update queue based on this
        
        ![image.png](attachment:a88904bf-d583-4e46-9270-b0aef40d73a9:image.png)
        
    - forward list scheduling - start with avaliable operations and work forwards
    - backward list scheduling - start at leaves and work backworks
    - Interactions Between Phases
        - reg alloc and instruction schudling will have different orders which they prefer so both need to be accomodated - trade off
            - one approach is a bigger building block

## – week 12: Object-oriented C++

#### C++ Overview

- pros: fast, 0-cost abstraction, static typed, tries to follow RAII, community support
- cons: lots of librarys, no garbage collection, managed by community, dangerous

#### Describe how the basic syntax of C++ differs from that of C

- most C code is valid C++ - but there are things C++ can do that C cant
- c++ uses g++ compiler rather than gcc
- printing
    
    ```cpp
    printf("fahh"); //C print
    std::cout << "yurr"; //c++ console out
    ```
    
- dynamic memory allocation
    
    ```cpp
    //C malloc + free
    *p = malloc(sizeof(int));
    free(p)
    // C++ new + delete
    *p = new int;
    delete p;
    ```
    
- C++ includes bool type rather than `return 1;`
- C++ initialisation: `int num(5);`
    - assignment done using =
- c++ also has references - basically a new handle for the same data
    - useful for functions

#### Write object-oriented code that follows the C++ philosophy

- Uses classes and objects
- basic class format
    
    ```cpp
    class myclass(){
    	public:
    		//attributes
    		//methods
    	private:
    		//attributes
    		//methods
    }
    ```
    
- polymorphism - function can have same name but implemented differently by different types
    - this is either determined at run time or compiler time depending on args inputted to function
- Objects can be stack-allocated or heap-allocated
- `class.attribute(); or class->attribute();`

#### Contrast the C++ to the Java/Python approach to inheritance

- c ++ inheritance
    - constructor of parent must be called in child
    - virtual functions -
- python/Java inheritance
    - java uses extends
    - Methods are virtual by default, unless marked `final`, `static`, or `private`

#### Reason about the benefits of following the RAII design pattern

- RAII - resource allocation is initisation
- detructor - destroys all class memebers
- special functions: default, move, copy, copy assignement
- constructor and destructor are part of RAII method
    - A resource is acquired in a constructor and released in a destructor
- pros: Prevents resource leaks, exception-safe, reduces manual cleanup, good with stack objects

## – week 13: Generic C++

#### Reason about the benefits of compile-time generic programming vs dynamic typing

- C++ uses compile time generic programming whereas java uses dynamic typing
- compile time vs dynamic:

|  | **Java** | **C++** |
| --- | --- | --- |
| **compilation** | once | for each type |
| **mechanism** | type erasure | code gen |
| **performance** | slow | optimal |
| **object creation** | no | yes |
| **abstraction cost** | high | zero |
- Java + python use object ref which is flexible but slow
- cons of compile time:
    - unpredicable behaviour - resolve by adding concepts

#### Describe the syntax of templated classes and functions

- used to allow for a function to take any type rather than having to rewrite each time for each type

```cpp
template<typename T>
T func(T& x){...}
```

- T can be any type and function will handle it in the way it needs to

#### Use standard library containers and utilities

- std lib functions and containers will use templates since alot of use
- containers - basically like data types
    - `std:vector<T>` - basically like a list
    - `std::array<T>` - basically like a fixed len array
- utils
    - `find()` and `find_if()` can be used instead of looping over a data struct
    - eg: `find(v.start(),v.end(),0)` or `find(v,0)`
- string stuff
    - `std::string` - like a char array but better
    - `std::string_value` - handle for string or char array
        - doesnt hold value just points to it
    - std:: format - like fstring
        - `std::format(”hello {}”, x);`
- streams
    - IO - <<IOStream>>
    - file - <<fstream>> - ifstream = input  ofstream = output
    - string - <<sstream>>
    - >> is out      <<is in

#### Write generic code using iterators

- iterator loop - has an i value which is used in the loop
- other loop
    - for(T& x:xs){}

## – week 14: Functional and Modern C++

#### Apply Standard Library Algorithms with lambda functions to solve programming problems using functional-like approaches

- modern c++ solves some issues
    - eg: unsafe mem, expensive copy,low level, poor optimisation
- functions are treated as data - can be used as arg for other functions and stored
- std lib takes advantage of this and lambda functions for range viewer
    - lamba function: `int x, int y { return x > y ? x : y; }`
        - here x and y are the captures
        - other captures:
            - [x] - copy x [&x] - ref x
            - [ ] - nothing [=] - copy everything [&] - ref everything
            - [&,x] - ref all execpt x
    - range viewer -  view doesnt store data, stores how to produce later
        - view can be seen as a container which is used in a pipeline
        
        ```cpp
        
        auto v = std::views::iota(1)
               | std::views::transform(int x{ return (1<<x) - 1; })
               | std::views::filter(is_prime)
               | std::views::take(8);
        
        std::vector<int> result(v.begin(), v.end());
        
        ```
        
- std view functions
    - std::transform - apply to all elms (map)
    - std::copy_if - keep elms which match (filter)
    - std::reduce. - combine into 1 value - (fold)

#### Describe move semantics and how they can be used to minimise runtime overhead when returning large data structures

- returning large objects is expensive - O(n)
    - also manual and error prone
- instead we can move resources - `Obj(Obj&&)` - O(1)
    - ownership can be transfered
    - Rvalue says if objects resources can be stolen from
- this uses RAII - constructor allocates, destructor frees
    - no use after free + forgetting to delete

#### Use smart pointers to automate memory management

- trackers ownership and uses RAII automatically
- `std::unique_ptr<T>` - exclusive ownership
- `std::shared_ptr<T>` - shared
- `std::weak_ptr<T>` - non-owning

#### List important capabilities of Modern C++ and demonstrate how to use them to make code faster and safer

- constexpr - compile time eval - use this for constant values
- nullptr - replaces NULL/0 with a typed null
- auto - used for type inferance
- decltype - extracts exact type of expression
- tuples + pairs - allows for multiple outputs for a function
    - structured binding means it will automatically assign results

#### Follow the C++ Core Guidelines

- C++ is a big language - use a small subset and follow core rules
- tools like clang tidy + sanitizers can be used to help with guidelines
- no ones knows the whole thing + backwards compatibility limits fixes

## – week 15:  defining functions haskell

#### [**Introduction**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4002108)

- functional programming - treats function as data
    - can pass a arg for other functions, have no name and return as output
- in order to run the thing it needs to be in our main function ( main :: IO() )
- variables are immutable

#### [**B](https://canvas.manchester.ac.uk/courses/43660/modules/items/4002109)asic Definitions**

- functions

```haskell
addn n = n + 7 --basic function

--function using cases
addn :: Int -> Int
addn 0 = 7
addn 1 = 8
...

f n = f (n - 1) + f (n - 2) --recursive function

\x -> x + 1 --lambda function 

f(x,_) = x --ignoring inputs in function
```

- other syntax

```haskell
b = (True && False) || True -- boolean operations
n==6 n/=7 --comparisions
v = if True then 6 else 7 -- command statements
```

#### [**Higher order functions**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4002110)

- we treat functions like in maths where inner most is applied first
    - eg: f(h(x)) = x → h → f → result

#### [**Useful forms of definition**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4002111)

- case notation made easier

```haskell
smalln n = case n of
0 -> True
1 -> True
_ -> False
```

- guard cases

```haskell
sideOfFive n
 | d > 0 = 1
 | d < 0 = -1
 | d == 0 = 1
 where d = n-5
```

- `let` is used for local definition
- shadowing - this is when the most recent value is used

#### [**Stuff that goes wrong!**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4002112)

- non-exhaustive pattern
- infinite loop
- self ref
- bad let handling

## – week 16: Haskell types

#### [**Types and Type Inferrence**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4009785)

- default types in haskell : `Int, Double, Bool, char, Integer, Float`
- haskell can usually infer type automatically
- functions can be given as input type for a function
    
    ```haskell
    applyTwice :: (a -> a) -> a -> a
    applyTwice f x = f (f x)
    ```
    
- generics types in haskell
    
    ```haskell
    id :: a -> a
    id x = x
    ```
    

#### [**Type Constructors**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4009786)

- can build new types using existing ones at the type level

#### [**Algebraic Datatypes**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4009787)

- data can be used like a enum
    - eg: `data Thing = Thing1 | Thing2`
- functions can take args as `Maybe, Just or Nothing`
    - maybe is a type:  `data Maybe a = Nothing | Just a`
    - just is a constructor

#### [**List syntax**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4009788)

- lists can be defined as `[Int]`
- `1:[2,3]` - preprend
    - this is the same as `[1,2,3]`
- list comprehension
    - [ expression | variable ← list]
    - eg: `[x*2 | x <- [1,2,3]]`
    - basically use a list to make a list - like mapping but more powerful

## – week 17: Haskell strictness

#### [**Error values**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4023191)

- errors in haskell are represented with bottom $\perp$
    - can occur in infinity lists, runtime error,
- This should only be used when experimenting

#### [**Reasoning with errors**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4023192)

- functions are strict depending on argument
    - if output depends on the input then this is a strict function
    - this means that if input is $\perp$ then output is $\perp$
- multiplication is strict
    - even in the case where `0 * undefined = 0` ← this actually is still invalid
- a pair can have bad value either as: ( $\perp$, $\perp$) or the data is $\perp$
- in a list, we can still have bad values in it
    - as long as the functions we use on the list dont interact with that value we wont get $\perp$
    - eg:
        
        ```haskell
        l = [1,2, undefined, 4]
        h = head l -- this will still return 1
        ```
        
- but if list has bad spine, functions like length will throw error

#### [**Infinite data**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4023193)

- infinite lists can be made by doing something like
    - ones = 1: ones ← infinite list of 1s
- haskell using lazy
    - values of list are only made when used
    - so if we wanted to get the first 5 values, then we only get that
    - but if we try print the whole list, it will go forever
- by using self refs, list can be made
    - nums = 0: [n+1 | n ← nums]
    - fibs = 1 : 1: [fibs!!n + fibs!!(n+1) | n ← [0…]]
    - prime numbers using sieve
        - sieve [] = []
        - sieve( x: xs) = x : sieve[y | y ← xs, y mod x /= 0]
        - primes = sieve[2..]

## – week 18: Haskell more about types

#### [**Parametric vs ad-hoc polymophism**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4024087)

- parametric polymophism - function that works for all types
    - same implementation regardless of type
    - `f :: a -> bool` ← regardless of input, output is always boolean
- but some things using generic vars are not parametric polymorpic
    - g :: (b → bool) → bool
    - for all types b if function f is b to bool then return bool
    - this cant check under haskells normal pp
- ad hoc polymophism - same name but different implementation for different types

#### [**Typeclasses**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4024088)

- type classes are collection of operations that type can implement
    - like interfaces in java
- type class definition:

```haskell
-- type a is defined as descriptive
-- the describe operation must be implemented if this type is used
class Descriptive a where
	describe :: a -> string
```

- implementation of typeclass:

```haskell
-- can do different implementations for different types
instance Descriptive bool where
	describe True = "yurr"
	describe False = "fah"
	
```

#### [**Functions with several class constraints**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4024089)

- type class constraints can be added to functions to make them polymorphic but only for certain types
    - descf :: Descriptive a ⇒ a → int
    - if a is descriptive then take a and return int
- for a list, it can only be descriptive if all elms are descriptive
- functions can be defined as symbols
    - haskell treats it like infix operations
    - eg: (===) is a function so we can do x === y
- default method impementation - when method is defined in typeclass
    - dont need to implement when using class

#### [**Built-in typeclasses**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4024090)

- show - converts values into strings
    - can manually implement this for our own data types
- eq - used for inequality checks
    - again we can derive this to do our own checks
- recursive data type - can call data type within itself
    - eg: Stick (Toy Cloud) Stick

## – week 19: Haskell I/O

#### [**IO in Haskell**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4029704)

- main is the entry point for IO
- main = (print “Hi!” :: IO()) ← output
    - print is just used to represent a value which main will then use to output
- main = getLine ← input

#### [**IO depending on a value**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4029705)

- return keyword allows for regular haskell types to become haskell IO types
- doesnt do anything in particular but just makes it into the type we need
    - for every type a, there is a IO a
- we cant go from IO a to a
    - but we can use binary operator to go from IO b to IO c
    - >> = :: IO b → (b → IO c) → IO c
    - eg:
        
        ```haskell
        greet :: String -> IO()
        greet n = print("hi " ++ n)
        main = getLine >>= (\n -> greet n)
        ```
        

#### [**Recursively defined IO**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4029706)

- by calling main within main, we can have a loop of IO which the program will stay in
- there is no control flow in haskell therefore the only way to loop is using functions

#### [**'Do' notation**](https://canvas.manchester.ac.uk/courses/43660/modules/items/4029707)

- do notation can replace binding and lamda

```haskell
--old notation
main = putStrLn "enter name: " >>
			getLine >>=
			\n ->
			putStrLn("Hi " ++ n)
		
--do notation
main = do
			putStrLn "enter name: "
			n <- getLine
			putStrLn("Hi " ++ n)
```

## – week 20: concurrency

#### Explain how unstructured concurrency breaks correctness

- concurrency - when multiple parts of computation happen at same time
- this breaks the assumtion we have that operations are atomic and in a predicatable order
- data race - mutliple concurrent operations access same data
    - one is writing and no coordination to control access
    - if one finishes earlier than other, the other is basically forgotten
- breaks correctness
    - shared state changed unexpectedly, instruction ordering unpredictable, multiple outcomes are possible
- for concurrency, we have
    - granularity of atomicity
    - interleaving

#### Describe how mutual exclusion can be used to structure thread communication and how it works at the machine instruction level

- thread based - independent streams of computations with a shared state (memory)
    - if one writes a var and other reads, it can be dangerous
- mutual exclusion - access to shared state is limited to critical sections
    - only 1 thread in critical section
    - before critial section, there is a preprotocol
        - checks if safe to enter - if not then threads waits
    - after critical section there is postprotocoll
        - announces critical section is free
- exchange, fetch-and-add, compare-and-swap

#### Use thread-based synchronisation primitives to coordinate thread and structure their communication

- lock() - controls acess to cricial section
    - if locked, then sleep rather than retry
- semaphores() - controls access to a limited resource
    - counter to represent how many units of resource available
    - wait() - aquire resource and decrement counter else sleep
    - signal() - release resource and increment counter
- monitors - combines mutex for object and signals using condition vars
    - wait() - called when a condition is false
        - thread joins queue, releases lock, and sleeps
    - signal()/notify() - called when another thread makes condition true
        - waiting thread wakes up

#### Contrast different types of message passing

- process-based concurrency - each process has its own internal state
    - no shared memory so communicate with message
- communicates over channels - can be implemented in memory objects, sockts, or other mechanisms
- types of message passing
    - RPC - remote procedure call
        - process calls function in other process and waits for result
        - simple to reason but little concurrency
    - synchronous messages
        - wait for sender to receive message then move on
        - easy to reason but still overhead
    - async message
        - send message and move on
        - low overhead + more concurrent but hard to reason

#### Recognise the different types of high-level concurrency bugs

- deadlock - everything is waiting for each other
- livelock - everything is doing something but with no progress
- starvation - when process waits forever and cannot proceed

#### Discuss high-level solutions to concurrency

- safety properties - something bad should never happen
    - prevent involved states
- liveness properties - something good should eventually happen
    - its about progress
- formal specification + verification - describe what program should do + verify with this
- behaviour types + static checking - not only what data passed but how communication happens
- transactional memory - keeps tracks of memory access
    - if another thread interferes - transaction rolls back
- automatic concurrency - compilier turns sequential into concurrent
    - hard for most cases and compiliers
- speculative parallelistion - run code concurrently that appears safe
    - try run concurrently, track memory and see if correct

## - Week 21: Rust Memory Management

#### Memory Management - Standard Approaches

- c/c++ uses malloc but this can cause issues
    - like user after free and forgetting to free
- java has garbage collector to resolve this
    - adds runtime overhead
- aliasing - when 2 variiables are to same value

#### Rust - Ownership

- value can only be owned by 1 variable
- data deadlock is out of scope

```rust
let s = String::from("fah");
let x = s;
println!("{}",x);
println!("{}",s); //throws error
```

#### Rust - Borrowing

- although one can own, many can borrow
- let x = &s; ← x is borrowing the value of s
- this is useful for functions to pass in values
    - rather than having to pass in then return and reassign
    - if we dont do this then scope of last var ends

#### Rust - Basic Types and Mutability

- for basic types don’t need to worry about borrowing
- varaibles are immutatable unless specified to be mutable
    - let mut x = …;
- good to use in functions when we want to pass by ref

#### Rust - Mutability and Borrowing

- if we allow mutability and borrowing, then we reintroduce aliasing
- resolve this by saying only one borrow can be mut
- At any time:
    - either ONE mutable reference
    - OR any number of immutable references
- &mut - can only use this outside scope of original var

## - Week 22: Rust Lifetimes

#### **Lifetime of a borrow**

- A lifetime is the scope during which a reference is valid.
    - usually from definition till last use
- cant have overlap between a mutuable and immutable borrow lifetimes
- we can give specific scopes using {}
- `let (x,y) = (&a,&b);` ← haskell can automatically assign pairs

#### **Lifetime annotations**

- the lifetime of variables can be specified using annotations
- important for function signatures
    - function may be logically correct but incorrect annotations can mess it up
    - this is cos rust is mem safe through practices like this
    - can cause learning curve but results in balance between modern features + mem safe
- compiler tracks lifetimes and will know if annotations is wrong
    - Lifetimes are needed when the compiler cannot infer relationships between references.

```rust
fn nice <'m,'n>(x: &'m Vec<i32>, y: &'n Vec<i32>) -> (&'n Vec<i32>,&'m Vec<i32>){
	//this function takes in a pair (x,y) and flips it (y,x)
} 
```

- Ownership = who owns data
Borrowing = temporary access
Lifetimes = how long the borrow is valid