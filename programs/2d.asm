        .area PROG (ABS)

        .org 0x100
        .globl programa
programa:
	ldx #0xEF00
  	lda #0
bucle:
        sta ,x+
	adda #0x01
	cmpx #0xFF00
        beq acabar
        bra bucle
acabar: clra
        sta 0xFF01

        .org 0xFFFE     ; Vector de RESET
        .word programa
