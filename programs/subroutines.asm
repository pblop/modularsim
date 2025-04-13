.area PROG (ABS)

.org 0x100
.globl main
main:
  lda #4
  lds #0xB000
  ldu #0xC000
loop:
  beq acabar

  bsr sub1
  jsr sub1
  lbsr sub1

  suba #1 
  bra loop

sub1:
  pshu a,b
  lda #0x04
  ldb #0x05
  pulu a,b
  rts

acabar:
  sta 0xFF01

.org 0xFFFE
.word main