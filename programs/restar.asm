
        .area PROG (ABS)

        ; definimos una constante
fin     .equ 0xFF01

        .org 0x100
operando1: .word 0x2190
operando2: .word 0x7777

resta1:  .word 0
resta2:  .word 0

        .globl programa
programa:
        ; hagamos, primero, la suma con el registro D
        ldd operando1
        subd operando2
        std resta1

        ; ahora lo vamos a hacer solamente con el registro A
        lda operando1+1
        suba operando2+1
        sta resta2+1
        lda operando1
        sbca operando2
        sta resta2

        ; el programa acaba
        clra
        sta fin

        .org 0xFFFE     ; vector de RESET
        .word programa
