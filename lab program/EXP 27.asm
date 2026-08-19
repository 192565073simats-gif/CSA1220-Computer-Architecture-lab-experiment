ORG 100H

MOV SI, 1200H      ; SI points to dividend's memory location
LODSW               ; Load word at [SI] into AX (AX = Dividend), SI = SI+2
MOV BX, AX          ; BX = Dividend (temporarily saved)

LODSW               ; Load word at [SI] into AX (AX = Divisor), SI = SI+2
MOV CX, AX          ; CX = Divisor

MOV AX, BX          ; AX = Dividend (restore into AX for division)
MOV DX, 0000H       ; DX = 0 (upper 16 bits of dividend, since dividend fits in 16 bits)

DIV CX              ; AX = AX/CX (Quotient), DX = AX%CX (Remainder)

MOV DI, 1300H       ; DI points to result location
MOV [DI], AX        ; Store Quotient at 1300H
MOV [DI+2], DX      ; Store Remainder at 1302H

HLT                 ; Stop execution

END