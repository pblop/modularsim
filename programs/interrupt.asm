.area PROG (ABS)

.org 0x100
cadenanmi: .ascii "nmi!"
        .byte 10
        .byte 0
cadenairq: .ascii "irq!"
        .byte 10
        .byte 0
cadenafirq: .ascii "firq!"
        .byte 10
        .byte 0
cadenaswi: .ascii "swi!"
        .byte 10
        .byte 0
cadenaswi2: .ascii "swi2!"
        .byte 10
        .byte 0
cadenaswi3: .ascii "swi3!"
        .byte 10
        .byte 0

.globl main
main:
  lds #0xA000
  ; andcc and orcc are not implemented yet, so we have to make do with what
  ; we have
  lda 0
  tfr a,cc ; clear the !FIRQ and !IRQ flags
main_loop:
  bra main_loop

; Interrupt handlers
.org 0x4000
.globl nmi_handler
nmi_handler:
  ldx #cadenanmi
  bra bucle
.globl irq_handler
irq_handler:
  ldx #cadenairq
  bra bucle
.globl firq_handler
firq_handler:
  ldx #cadenafirq
  bra bucle
.globl swi_handler
swi_handler:
  ldx #cadenaswi
  bra bucle
.globl swi2_handler
swi2_handler:
  ldx #cadenaswi2
  bra bucle
.globl swi3_handler
swi3_handler:
  ldx #cadenaswi3
  bra bucle
bucle:  lda ,x+
        beq acabar
        sta 0xFF00
        bra bucle
acabar: clra
  rti

.org 0xFFF2
.word swi3_handler ; 0xfff2 - swi3
.word swi2_handler ; 0xfff4 - swi2
.word firq_handler ; 0xfff6 - firq
.word irq_handler  ; 0xfff8 - irq
.word swi_handler  ; 0xfffa - swi
.word nmi_handler  ; 0xfffc - nmi
.word main         ; 0xfffe - reset