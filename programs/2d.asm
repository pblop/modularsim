        .area PROG (ABS)

        .org 0x100
        .globl programa
programa:
	ldx #0xEF00
  	lda #1
bucle:
        beq acabar
        sta ,x+
	adda #0x01
        bra bucle
acabar: clra
        sta 0xFF01

        .org 0xFFFE     ; Vector de RESET
        .word programa
