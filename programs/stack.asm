.area PROG (ABS)

.org 0x100
.globl main
main:
  lds #0x6666
  ldu #0x7777
  lda #0x01
  ldx #0x02
  pshs a,x,u
  pshu s
  ldx #0x03
  pulu x
  puls x
  puls d
  puls b
  lbeq acabar
acabar:
  sta 0xFF01

.org 0xFFFE
.word main