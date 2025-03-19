.area PROG (ABS)

.org 0x100
.globl main
main:
  lda #1
  ldb #2
  ldx #0x3333
  ldy #0x5555
  lds #0x6666
  ldu #0x7777
  exg a,b
  exg x,y
  exg s,u
  ;exg a,d
  ;exg b,d
  exg x,d
  exg a,cc
  exg dp,b
  tfr a,b
  tfr x,y
  tfr s,u
  ; These SHOULD work on the simulator, but the assembler doesn't support them
  ; :shrug:
  ;tfr a,d
  ;tfr b,d
  lbeq acabar
acabar:
  sta 0xFF01

.org 0xFFFE
.word main