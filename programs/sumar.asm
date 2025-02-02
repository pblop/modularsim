
        .area PROG (ABS)

        ; definimos una constante
fin     .equ 0xFF01

        .org 0x100
sumando1: .word 0x2190
sumando2: .word 0x7777

suma1:  .word 0
suma2:  .word 0

        .globl programa
programa:
        ; hagamos, primero, la suma con el registro D
        ldd sumando1
        addd sumando2
        std suma1

        ; ahora lo vamos a hacer solamente con el registro A
        lda sumando1+1
        adda sumando2+1
        sta suma2+1
        lda sumando1
        adca sumando2
        sta suma2

        ; el programa acaba
        clra
        sta fin

        .org 0xFFFE     ; vector de RESET
        .word programa
