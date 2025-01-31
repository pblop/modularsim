.area PROG (ABS)
.org 0x10e
.globl programa
programa:
  sta 0xFF01

.org 0xFFFE
.word programa
