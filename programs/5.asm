.area PROG (ABS)

.org 0x100
.globl main
main:
  addd main
  sta 0xFF01

.org 0xFFFE
.word main