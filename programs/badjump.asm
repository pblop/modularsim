.area PROG (ABS)

.org 0x100
.globl main
main:
  lda #0x4f
  bne main+1
acabar:
  sta 0xFF01

.org 0xFFFE
.word main