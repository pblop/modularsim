; interrupter-test.asm
;
; This program tests the interrupter.ts module. It sets up the
; interrupt vector table and the interrupt handler. It also
; sets up the interrupt number and type.
; The program will hang in an infinite loop until an interrupt occurs, and
; then it will print the type of interrupt that occurred.
; The interrupter.ts module can thus be tested by trying out the different
; types and number of cycles between interrupts.

.area PROG (ABS)

; numloc and typeloc are the locations where the interrupter is mapped
; in the memory. They are used to set the interrupt number and type.
numloc  .equ 0xA000
typeloc .equ 0xA002
; these are the values that are used to set the interrupt number and type.
interrupt_num .equ 300 ; the number of cycles between interrupts (0-ffff)
interrupt_type .equ 0 ; the type of interrupt (0: nmi, 1: irq, 2: firq)

fin     	 .equ 0xFF01

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

  ldd #interrupt_num
  std numloc ; set the interrupt number
  lda #interrupt_type
  sta typeloc ; set the interrupt type
main_loop:
  bra main_loop

; Interrupt handlers
.org 0x4000
.globl nmi_handler
nmi_handler:
  ldx #cadenanmi
  bra imprimir
.globl irq_handler
irq_handler:
  ldx #cadenairq
  bra imprimir
.globl firq_handler
firq_handler:
  ldx #cadenafirq
  bra imprimir
.globl swi_handler
swi_handler:
  ldx #cadenaswi
  bra imprimir
.globl swi2_handler
swi2_handler:
  ldx #cadenaswi2
  bra imprimir
.globl swi3_handler
swi3_handler:
  ldx #cadenaswi3
  bra imprimir
imprimir:  lda ,x+
        beq acabar
        sta 0xFF00
        bra imprimir
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