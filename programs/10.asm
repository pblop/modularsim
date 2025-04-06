.area PROG (ABS)

.org 0x100
.globl main
main:
  lda #0xff
  anda #0x01
  lda #0xff
  anda #0xf0
  ora #0x0f
  anda #0
  ora #0xff
  ldb #0xff
  andb #0x01
  ldb #0xff
  andb #0xf0
  orb #0x0f
  andb #0
  orb #0xff
  eora #0x01
  eora #0x01
  eora #0x0f
  eora #0x0f
  eora #0x00
  eora #0xff
  eora #0xff
  eora #0x00

  orcc #0xff
  andcc #0x01
  orcc #0xf0
  andcc #0x00

  lda #0xab
  asra
  asra
  asra
  asra
  lda #0xab
  asla
  asla
  asla
  asla
  lda #0xab
  rola
  rola
  rola
  rola
  lda #0xab
  rolb
  rolb
  rolb
  rolb
  lda #0xab
  rora
  rora
  rora
  rora

  lda #0x64
  adda #0x27 ; Produces binary result of $8B DAA
  daa ; Adjusts A to $91 (BCD result of 64 + 27)

  lbeq acabar
acabar:
  sta 0xFF01

.org 0xFFFE
.word main