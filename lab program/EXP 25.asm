ORG 100H

MOV SI, 1200H      ; SI points to first number's memory location
LODSW               ; Load word at [SI] into AX, then SI = SI+2 (AX = NUM1)
MOV BX, AX          ; BX = NUM1

LODSW               ; Load word at [SI] into AX (AX = NUM2, since SI moved to 1202H)
SUB BX, AX          ; BX = NUM1 - NUM2

MOV DI, 1300H       ; DI points to result location
MOV [DI], BX        ; Store result at 1300H

HLT                 ; Stop execution

END