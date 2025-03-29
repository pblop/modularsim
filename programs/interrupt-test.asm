.area PROG (ABS)


.org 0x100
.var: .byte 0x01
.globl main
main:
  lds #0xA000
  ; andcc and orcc are not implemented yet, so we have to make do with what
  ; we have
  ldb 0
  lda 0
  tfr a,cc ; clear the !FIRQ and !IRQ flags
main_loop:
  lda .var
  cmpa #0x00
  beq acabar
  bra main_loop
acabar:
  clra
  sta 0xff01

; Interrupt handlers
.org 0x4000
.globl nmi_handler
nmi_handler:
  stb .var
  stb 0x5000
  rti
.globl irq_handler
irq_handler:
  stb .var
  stb 0x5001
  rti
.globl firq_handler
firq_handler:
  stb .var
  stb 0x5002
  rti
.globl swi_handler
swi_handler:
  stb .var
  stb 0x5003
  rti
.globl swi2_handler
swi2_handler:
  stb .var
  stb 0x5004
  rti
.globl swi3_handler
swi3_handler:
  stb .var
  stb 0x5005
  rti

.org 0xFFF2
.word swi3_handler ; 0xfff2 - swi3
.word swi2_handler ; 0xfff4 - swi2
.word firq_handler ; 0xfff6 - firq
.word irq_handler  ; 0xfff8 - irq
.word swi_handler  ; 0xfffa - swi
.word nmi_handler  ; 0xfffc - nmi
.word main         ; 0xfffe - reset