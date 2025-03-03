.area PROG (ABS)

.org 0x100
.globl main
main:
  bra main

.org 0xFFFE
.word main