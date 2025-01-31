.area PROG (ABS)
.org 0x10e
.globl programa
programa:
  ldx #programa
  lda ,x+
  sta 0x01
    
  clra
  sta 0xFF01

.org 0xFFFE
.word programa