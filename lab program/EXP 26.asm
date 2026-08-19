ORG 100H

MOV SI, 1200H      ; SI points to first number's memory location
LODSW               ; Load word at [SI] into AX (AX = NUM1), SI = SI+2
MOV BX, AX          ; BX = NUM1

LODSW               ; Load word at [SI] into AX (AX = NUM2), SI = SI+2
MUL BX              ; AX = AX * BX ? Result: DX:AX (DX = high word, AX = low word)

MOV DI, 1300H       ; DI points to result location
MOV [DI], AX        ; Store low word of result at 1300H
MOV [DI+2], DX      ; Store high word of result at 1302H

HLT                 ; Stop execution

END