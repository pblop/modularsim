.area PROG (ABS)

.org 0x100

cadena: .ascii "Interrupcion!"
        .byte 10
        .byte 0

.globl main
main:
  lds #0xA000
main_loop:
  bra main_loop

.org 0x5000
.globl nmi_handler
nmi_handler:
  ldx #cadena
bucle:  lda ,x+
        beq acabar
        sta 0xFF00
        bra bucle
acabar: clra
  rti

.org 0xFFFC
.word nmi_handler
.org 0xFFFE
.word main