.area PROG (ABS)

.org 0x100
.globl main
main:
  lda #1
  lbeq acabar
acabar:
  sta 0xFF01

.org 0xFFFE
.word main