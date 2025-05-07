.area PROG (ABS)

	.org 100
        .globl programa
       
cls:	.byte 134, 51, 141, 4, 141, 14, 134, 50, 52, 2, 141, 14, 53, 2, 141, 16, 134, 74, 32, 12
home:	.byte 141, 4, 134, 72, 32, 6, 134, 27, 141, 2, 138, 64, 183, 255, 0, 57

		;; ZONA DE VARIABLES
puntero_tablero:
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "      @@@       "
	.ascii "       @@@      "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	
puntero_tablero2:
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "	
	.ascii "                "
	.ascii "                "	
	.ascii "                "
	.ascii "                "	
	.ascii "                "
	.ascii "                "	
	.ascii "                "
	.ascii "                "
	.ascii "                "
	.ascii "                "
	
nPasos: .byte 100			; numero de iteraciones del juego
        
        
		;; COMIENZO PROGRAMA
programa:
	; inicializamos lo necesario
	lds #0xF000
	lbsr cls
	
bucleImpresion:
	leax puntero_tablero,pcr
	ldy #0xFF00
	clrb
	
	;; COMIENZO DE IMPRESIÓN DEL TABLERO
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 1
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 2
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 3
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 4
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 5
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 6
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 7
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 8
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 9
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 10
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 11
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 12
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 13
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 14
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 15
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda ,x+			
	sta ,y
	lda #'\n ; salto de línea
	sta ,y
	;; FIN IMPRESIÓN LÍNEA 16
	
	
	
	
	; Cargar valores de tablero para intercambiarlos
  	leax puntero_tablero,pcr
	leay puntero_tablero2,pcr

	; TODO: actualizacion entera
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 1
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 2
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 3
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 4
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 5
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 6
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 7
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 8
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 9
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 10
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 11
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 12
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 13
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 14
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 15
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 16
	
	
	  	; Casilla 0,1 (dirección 1)
  	clrb
  	; Analizar casilla 15,0 (dirección 240) 
  	lda puntero_tablero+240,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_15_0
  	incb
  	no_inc_0_1_15_0:
  	; Analizar casilla 15,1 (dirección 241) 
  	lda puntero_tablero+241,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_15_1
  	incb
  	no_inc_0_1_15_1:
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_15_2
  	incb
  	no_inc_0_1_15_2:
  	; Analizar casilla 0,0 (dirección 0) 
  	lda puntero_tablero+0,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_0_0
  	incb
  	no_inc_0_1_0_0:
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_0_2
  	incb
  	no_inc_0_1_0_2:
  	; Analizar casilla 1,0 (dirección 16) 
  	lda puntero_tablero+16,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_1_0
  	incb
  	no_inc_0_1_1_0:
  	; Analizar casilla 1,1 (dirección 17) 
  	lda puntero_tablero+17,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_1_1
  	incb
  	no_inc_0_1_1_1:
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_1_1_2
  	incb
  	no_inc_0_1_1_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+1,pcr
  	cmpa #'@
  	beq celda_viva_1
  	; Si está muerta
  	cmpb #3
  	beq nace_1
  	cmpb #6
  	beq nace_1
  	bra muere_1
  	celda_viva_1:
  	cmpb #2
  	beq vive_1
  	cmpb #3
  	beq vive_1
  	bra muere_1
  	nace_1:
  	lda #'@
  	sta puntero_tablero2+1,pcr
  	bra continuar_1
  	vive_1:
  	lda #'@
  	sta puntero_tablero2+1,pcr
  	bra continuar_1
  	muere_1:
  	lda #' 
  	sta puntero_tablero2+1,pcr
  	continuar_1:
  	
  	; Casilla 0,2 (dirección 2)
  	clrb
  	; Analizar casilla 15,1 (dirección 241) 
  	lda puntero_tablero+241,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_15_1
  	incb
  	no_inc_0_2_15_1:
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_15_2
  	incb
  	no_inc_0_2_15_2:
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_15_3
  	incb
  	no_inc_0_2_15_3:
  	; Analizar casilla 0,1 (dirección 1) 
  	lda puntero_tablero+1,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_0_1
  	incb
  	no_inc_0_2_0_1:
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_0_3
  	incb
  	no_inc_0_2_0_3:
  	; Analizar casilla 1,1 (dirección 17) 
  	lda puntero_tablero+17,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_1_1
  	incb
  	no_inc_0_2_1_1:
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_1_2
  	incb
  	no_inc_0_2_1_2:
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_2_1_3
  	incb
  	no_inc_0_2_1_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+2,pcr
  	cmpa #'@
  	beq celda_viva_2
  	; Si está muerta
  	cmpb #3
  	beq nace_2
  	cmpb #6
  	beq nace_2
  	bra muere_2
  	celda_viva_2:
  	cmpb #2
  	beq vive_2
  	cmpb #3
  	beq vive_2
  	bra muere_2
  	nace_2:
  	lda #'@
  	sta puntero_tablero2+2,pcr
  	bra continuar_2
  	vive_2:
  	lda #'@
  	sta puntero_tablero2+2,pcr
  	bra continuar_2
  	muere_2:
  	lda #' 
  	sta puntero_tablero2+2,pcr
  	continuar_2:
  	
  	; Casilla 0,3 (dirección 3)
  	clrb
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_15_2
  	incb
  	no_inc_0_3_15_2:
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_15_3
  	incb
  	no_inc_0_3_15_3:
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_15_4
  	incb
  	no_inc_0_3_15_4:
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_0_2
  	incb
  	no_inc_0_3_0_2:
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_0_4
  	incb
  	no_inc_0_3_0_4:
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_1_2
  	incb
  	no_inc_0_3_1_2:
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_1_3
  	incb
  	no_inc_0_3_1_3:
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_3_1_4
  	incb
  	no_inc_0_3_1_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+3,pcr
  	cmpa #'@
  	beq celda_viva_3
  	; Si está muerta
  	cmpb #3
  	beq nace_3
  	cmpb #6
  	beq nace_3
  	bra muere_3
  	celda_viva_3:
  	cmpb #2
  	beq vive_3
  	cmpb #3
  	beq vive_3
  	bra muere_3
  	nace_3:
  	lda #'@
  	sta puntero_tablero2+3,pcr
  	bra continuar_3
  	vive_3:
  	lda #'@
  	sta puntero_tablero2+3,pcr
  	bra continuar_3
  	muere_3:
  	lda #' 
  	sta puntero_tablero2+3,pcr
  	continuar_3:
  	
  	; Casilla 0,4 (dirección 4)
  	clrb
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_15_3
  	incb
  	no_inc_0_4_15_3:
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_15_4
  	incb
  	no_inc_0_4_15_4:
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_15_5
  	incb
  	no_inc_0_4_15_5:
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_0_3
  	incb
  	no_inc_0_4_0_3:
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_0_5
  	incb
  	no_inc_0_4_0_5:
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_1_3
  	incb
  	no_inc_0_4_1_3:
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_1_4
  	incb
  	no_inc_0_4_1_4:
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_4_1_5
  	incb
  	no_inc_0_4_1_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+4,pcr
  	cmpa #'@
  	beq celda_viva_4
  	; Si está muerta
  	cmpb #3
  	beq nace_4
  	cmpb #6
  	beq nace_4
  	bra muere_4
  	celda_viva_4:
  	cmpb #2
  	beq vive_4
  	cmpb #3
  	beq vive_4
  	bra muere_4
  	nace_4:
  	lda #'@
  	sta puntero_tablero2+4,pcr
  	bra continuar_4
  	vive_4:
  	lda #'@
  	sta puntero_tablero2+4,pcr
  	bra continuar_4
  	muere_4:
  	lda #' 
  	sta puntero_tablero2+4,pcr
  	continuar_4:
  	
  	; Casilla 0,5 (dirección 5)
  	clrb
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_15_4
  	incb
  	no_inc_0_5_15_4:
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_15_5
  	incb
  	no_inc_0_5_15_5:
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_15_6
  	incb
  	no_inc_0_5_15_6:
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_0_4
  	incb
  	no_inc_0_5_0_4:
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_0_6
  	incb
  	no_inc_0_5_0_6:
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_1_4
  	incb
  	no_inc_0_5_1_4:
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_1_5
  	incb
  	no_inc_0_5_1_5:
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_5_1_6
  	incb
  	no_inc_0_5_1_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+5,pcr
  	cmpa #'@
  	beq celda_viva_5
  	; Si está muerta
  	cmpb #3
  	beq nace_5
  	cmpb #6
  	beq nace_5
  	bra muere_5
  	celda_viva_5:
  	cmpb #2
  	beq vive_5
  	cmpb #3
  	beq vive_5
  	bra muere_5
  	nace_5:
  	lda #'@
  	sta puntero_tablero2+5,pcr
  	bra continuar_5
  	vive_5:
  	lda #'@
  	sta puntero_tablero2+5,pcr
  	bra continuar_5
  	muere_5:
  	lda #' 
  	sta puntero_tablero2+5,pcr
  	continuar_5:
  	
  	; Casilla 0,6 (dirección 6)
  	clrb
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_15_5
  	incb
  	no_inc_0_6_15_5:
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_15_6
  	incb
  	no_inc_0_6_15_6:
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_15_7
  	incb
  	no_inc_0_6_15_7:
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_0_5
  	incb
  	no_inc_0_6_0_5:
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_0_7
  	incb
  	no_inc_0_6_0_7:
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_1_5
  	incb
  	no_inc_0_6_1_5:
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_1_6
  	incb
  	no_inc_0_6_1_6:
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_6_1_7
  	incb
  	no_inc_0_6_1_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+6,pcr
  	cmpa #'@
  	beq celda_viva_6
  	; Si está muerta
  	cmpb #3
  	beq nace_6
  	cmpb #6
  	beq nace_6
  	bra muere_6
  	celda_viva_6:
  	cmpb #2
  	beq vive_6
  	cmpb #3
  	beq vive_6
  	bra muere_6
  	nace_6:
  	lda #'@
  	sta puntero_tablero2+6,pcr
  	bra continuar_6
  	vive_6:
  	lda #'@
  	sta puntero_tablero2+6,pcr
  	bra continuar_6
  	muere_6:
  	lda #' 
  	sta puntero_tablero2+6,pcr
  	continuar_6:
  	
  	; Casilla 0,7 (dirección 7)
  	clrb
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_15_6
  	incb
  	no_inc_0_7_15_6:
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_15_7
  	incb
  	no_inc_0_7_15_7:
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_15_8
  	incb
  	no_inc_0_7_15_8:
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_0_6
  	incb
  	no_inc_0_7_0_6:
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_0_8
  	incb
  	no_inc_0_7_0_8:
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_1_6
  	incb
  	no_inc_0_7_1_6:
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_1_7
  	incb
  	no_inc_0_7_1_7:
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_7_1_8
  	incb
  	no_inc_0_7_1_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+7,pcr
  	cmpa #'@
  	beq celda_viva_7
  	; Si está muerta
  	cmpb #3
  	beq nace_7
  	cmpb #6
  	beq nace_7
  	bra muere_7
  	celda_viva_7:
  	cmpb #2
  	beq vive_7
  	cmpb #3
  	beq vive_7
  	bra muere_7
  	nace_7:
  	lda #'@
  	sta puntero_tablero2+7,pcr
  	bra continuar_7
  	vive_7:
  	lda #'@
  	sta puntero_tablero2+7,pcr
  	bra continuar_7
  	muere_7:
  	lda #' 
  	sta puntero_tablero2+7,pcr
  	continuar_7:
  	
  	; Casilla 0,8 (dirección 8)
  	clrb
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_15_7
  	incb
  	no_inc_0_8_15_7:
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_15_8
  	incb
  	no_inc_0_8_15_8:
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_15_9
  	incb
  	no_inc_0_8_15_9:
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_0_7
  	incb
  	no_inc_0_8_0_7:
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_0_9
  	incb
  	no_inc_0_8_0_9:
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_1_7
  	incb
  	no_inc_0_8_1_7:
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_1_8
  	incb
  	no_inc_0_8_1_8:
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_8_1_9
  	incb
  	no_inc_0_8_1_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+8,pcr
  	cmpa #'@
  	beq celda_viva_8
  	; Si está muerta
  	cmpb #3
  	beq nace_8
  	cmpb #6
  	beq nace_8
  	bra muere_8
  	celda_viva_8:
  	cmpb #2
  	beq vive_8
  	cmpb #3
  	beq vive_8
  	bra muere_8
  	nace_8:
  	lda #'@
  	sta puntero_tablero2+8,pcr
  	bra continuar_8
  	vive_8:
  	lda #'@
  	sta puntero_tablero2+8,pcr
  	bra continuar_8
  	muere_8:
  	lda #' 
  	sta puntero_tablero2+8,pcr
  	continuar_8:
  	
  	; Casilla 0,9 (dirección 9)
  	clrb
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_15_8
  	incb
  	no_inc_0_9_15_8:
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_15_9
  	incb
  	no_inc_0_9_15_9:
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_15_10
  	incb
  	no_inc_0_9_15_10:
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_0_8
  	incb
  	no_inc_0_9_0_8:
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_0_10
  	incb
  	no_inc_0_9_0_10:
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_1_8
  	incb
  	no_inc_0_9_1_8:
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_1_9
  	incb
  	no_inc_0_9_1_9:
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_9_1_10
  	incb
  	no_inc_0_9_1_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+9,pcr
  	cmpa #'@
  	beq celda_viva_9
  	; Si está muerta
  	cmpb #3
  	beq nace_9
  	cmpb #6
  	beq nace_9
  	bra muere_9
  	celda_viva_9:
  	cmpb #2
  	beq vive_9
  	cmpb #3
  	beq vive_9
  	bra muere_9
  	nace_9:
  	lda #'@
  	sta puntero_tablero2+9,pcr
  	bra continuar_9
  	vive_9:
  	lda #'@
  	sta puntero_tablero2+9,pcr
  	bra continuar_9
  	muere_9:
  	lda #' 
  	sta puntero_tablero2+9,pcr
  	continuar_9:
  	
  	; Casilla 0,10 (dirección 10)
  	clrb
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_15_9
  	incb
  	no_inc_0_10_15_9:
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_15_10
  	incb
  	no_inc_0_10_15_10:
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_15_11
  	incb
  	no_inc_0_10_15_11:
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_0_9
  	incb
  	no_inc_0_10_0_9:
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_0_11
  	incb
  	no_inc_0_10_0_11:
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_1_9
  	incb
  	no_inc_0_10_1_9:
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_1_10
  	incb
  	no_inc_0_10_1_10:
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_10_1_11
  	incb
  	no_inc_0_10_1_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+10,pcr
  	cmpa #'@
  	beq celda_viva_10
  	; Si está muerta
  	cmpb #3
  	beq nace_10
  	cmpb #6
  	beq nace_10
  	bra muere_10
  	celda_viva_10:
  	cmpb #2
  	beq vive_10
  	cmpb #3
  	beq vive_10
  	bra muere_10
  	nace_10:
  	lda #'@
  	sta puntero_tablero2+10,pcr
  	bra continuar_10
  	vive_10:
  	lda #'@
  	sta puntero_tablero2+10,pcr
  	bra continuar_10
  	muere_10:
  	lda #' 
  	sta puntero_tablero2+10,pcr
  	continuar_10:
  	
  	; Casilla 0,11 (dirección 11)
  	clrb
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_15_10
  	incb
  	no_inc_0_11_15_10:
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_15_11
  	incb
  	no_inc_0_11_15_11:
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_15_12
  	incb
  	no_inc_0_11_15_12:
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_0_10
  	incb
  	no_inc_0_11_0_10:
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_0_12
  	incb
  	no_inc_0_11_0_12:
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_1_10
  	incb
  	no_inc_0_11_1_10:
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_1_11
  	incb
  	no_inc_0_11_1_11:
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_11_1_12
  	incb
  	no_inc_0_11_1_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+11,pcr
  	cmpa #'@
  	beq celda_viva_11
  	; Si está muerta
  	cmpb #3
  	beq nace_11
  	cmpb #6
  	beq nace_11
  	bra muere_11
  	celda_viva_11:
  	cmpb #2
  	beq vive_11
  	cmpb #3
  	beq vive_11
  	bra muere_11
  	nace_11:
  	lda #'@
  	sta puntero_tablero2+11,pcr
  	bra continuar_11
  	vive_11:
  	lda #'@
  	sta puntero_tablero2+11,pcr
  	bra continuar_11
  	muere_11:
  	lda #' 
  	sta puntero_tablero2+11,pcr
  	continuar_11:
  	
  	; Casilla 0,12 (dirección 12)
  	clrb
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_15_11
  	incb
  	no_inc_0_12_15_11:
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_15_12
  	incb
  	no_inc_0_12_15_12:
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_15_13
  	incb
  	no_inc_0_12_15_13:
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_0_11
  	incb
  	no_inc_0_12_0_11:
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_0_13
  	incb
  	no_inc_0_12_0_13:
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_1_11
  	incb
  	no_inc_0_12_1_11:
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_1_12
  	incb
  	no_inc_0_12_1_12:
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_12_1_13
  	incb
  	no_inc_0_12_1_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+12,pcr
  	cmpa #'@
  	beq celda_viva_12
  	; Si está muerta
  	cmpb #3
  	beq nace_12
  	cmpb #6
  	beq nace_12
  	bra muere_12
  	celda_viva_12:
  	cmpb #2
  	beq vive_12
  	cmpb #3
  	beq vive_12
  	bra muere_12
  	nace_12:
  	lda #'@
  	sta puntero_tablero2+12,pcr
  	bra continuar_12
  	vive_12:
  	lda #'@
  	sta puntero_tablero2+12,pcr
  	bra continuar_12
  	muere_12:
  	lda #' 
  	sta puntero_tablero2+12,pcr
  	continuar_12:
  	
  	; Casilla 0,13 (dirección 13)
  	clrb
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_15_12
  	incb
  	no_inc_0_13_15_12:
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_15_13
  	incb
  	no_inc_0_13_15_13:
  	; Analizar casilla 15,14 (dirección 254) 
  	lda puntero_tablero+254,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_15_14
  	incb
  	no_inc_0_13_15_14:
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_0_12
  	incb
  	no_inc_0_13_0_12:
  	; Analizar casilla 0,14 (dirección 14) 
  	lda puntero_tablero+14,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_0_14
  	incb
  	no_inc_0_13_0_14:
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_1_12
  	incb
  	no_inc_0_13_1_12:
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_1_13
  	incb
  	no_inc_0_13_1_13:
  	; Analizar casilla 1,14 (dirección 30) 
  	lda puntero_tablero+30,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_13_1_14
  	incb
  	no_inc_0_13_1_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+13,pcr
  	cmpa #'@
  	beq celda_viva_13
  	; Si está muerta
  	cmpb #3
  	beq nace_13
  	cmpb #6
  	beq nace_13
  	bra muere_13
  	celda_viva_13:
  	cmpb #2
  	beq vive_13
  	cmpb #3
  	beq vive_13
  	bra muere_13
  	nace_13:
  	lda #'@
  	sta puntero_tablero2+13,pcr
  	bra continuar_13
  	vive_13:
  	lda #'@
  	sta puntero_tablero2+13,pcr
  	bra continuar_13
  	muere_13:
  	lda #' 
  	sta puntero_tablero2+13,pcr
  	continuar_13:
  	
  	; Casilla 0,14 (dirección 14)
  	clrb
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_15_13
  	incb
  	no_inc_0_14_15_13:
  	; Analizar casilla 15,14 (dirección 254) 
  	lda puntero_tablero+254,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_15_14
  	incb
  	no_inc_0_14_15_14:
  	; Analizar casilla 15,15 (dirección 255) 
  	lda puntero_tablero+255,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_15_15
  	incb
  	no_inc_0_14_15_15:
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_0_13
  	incb
  	no_inc_0_14_0_13:
  	; Analizar casilla 0,15 (dirección 15) 
  	lda puntero_tablero+15,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_0_15
  	incb
  	no_inc_0_14_0_15:
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_1_13
  	incb
  	no_inc_0_14_1_13:
  	; Analizar casilla 1,14 (dirección 30) 
  	lda puntero_tablero+30,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_1_14
  	incb
  	no_inc_0_14_1_14:
  	; Analizar casilla 1,15 (dirección 31) 
  	lda puntero_tablero+31,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_0_14_1_15
  	incb
  	no_inc_0_14_1_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+14,pcr
  	cmpa #'@
  	beq celda_viva_14
  	; Si está muerta
  	cmpb #3
  	beq nace_14
  	cmpb #6
  	beq nace_14
  	bra muere_14
  	celda_viva_14:
  	cmpb #2
  	beq vive_14
  	cmpb #3
  	beq vive_14
  	bra muere_14
  	nace_14:
  	lda #'@
  	sta puntero_tablero2+14,pcr
  	bra continuar_14
  	vive_14:
  	lda #'@
  	sta puntero_tablero2+14,pcr
  	bra continuar_14
  	muere_14:
  	lda #' 
  	sta puntero_tablero2+14,pcr
  	continuar_14:
  	
  	; Casilla 1,0 (dirección 16)
  	clrb
  	; Analizar casilla 0,15 (dirección 15) 
  	lda puntero_tablero+15,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_0_15
  	incb
  	no_inc_1_0_0_15:
  	; Analizar casilla 0,0 (dirección 0) 
  	lda puntero_tablero+0,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_0_0
  	incb
  	no_inc_1_0_0_0:
  	; Analizar casilla 0,1 (dirección 1) 
  	lda puntero_tablero+1,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_0_1
  	incb
  	no_inc_1_0_0_1:
  	; Analizar casilla 1,15 (dirección 31) 
  	lda puntero_tablero+31,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_1_15
  	incb
  	no_inc_1_0_1_15:
  	; Analizar casilla 1,1 (dirección 17) 
  	lda puntero_tablero+17,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_1_1
  	incb
  	no_inc_1_0_1_1:
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_2_15
  	incb
  	no_inc_1_0_2_15:
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_2_0
  	incb
  	no_inc_1_0_2_0:
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_0_2_1
  	incb
  	no_inc_1_0_2_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+16,pcr
  	cmpa #'@
  	beq celda_viva_16
  	; Si está muerta
  	cmpb #3
  	beq nace_16
  	cmpb #6
  	beq nace_16
  	bra muere_16
  	celda_viva_16:
  	cmpb #2
  	beq vive_16
  	cmpb #3
  	beq vive_16
  	bra muere_16
  	nace_16:
  	lda #'@
  	sta puntero_tablero2+16,pcr
  	bra continuar_16
  	vive_16:
  	lda #'@
  	sta puntero_tablero2+16,pcr
  	bra continuar_16
  	muere_16:
  	lda #' 
  	sta puntero_tablero2+16,pcr
  	continuar_16:
  	
  	; Casilla 1,1 (dirección 17)
  	clrb
  	; Analizar casilla 0,0 (dirección 0) 
  	lda puntero_tablero+0,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_0_0
  	incb
  	no_inc_1_1_0_0:
  	; Analizar casilla 0,1 (dirección 1) 
  	lda puntero_tablero+1,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_0_1
  	incb
  	no_inc_1_1_0_1:
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_0_2
  	incb
  	no_inc_1_1_0_2:
  	; Analizar casilla 1,0 (dirección 16) 
  	lda puntero_tablero+16,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_1_0
  	incb
  	no_inc_1_1_1_0:
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_1_2
  	incb
  	no_inc_1_1_1_2:
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_2_0
  	incb
  	no_inc_1_1_2_0:
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_2_1
  	incb
  	no_inc_1_1_2_1:
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_1_2_2
  	incb
  	no_inc_1_1_2_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+17,pcr
  	cmpa #'@
  	beq celda_viva_17
  	; Si está muerta
  	cmpb #3
  	beq nace_17
  	cmpb #6
  	beq nace_17
  	bra muere_17
  	celda_viva_17:
  	cmpb #2
  	beq vive_17
  	cmpb #3
  	beq vive_17
  	bra muere_17
  	nace_17:
  	lda #'@
  	sta puntero_tablero2+17,pcr
  	bra continuar_17
  	vive_17:
  	lda #'@
  	sta puntero_tablero2+17,pcr
  	bra continuar_17
  	muere_17:
  	lda #' 
  	sta puntero_tablero2+17,pcr
  	continuar_17:
  	
  	; Casilla 1,2 (dirección 18)
  	clrb
  	; Analizar casilla 0,1 (dirección 1) 
  	lda puntero_tablero+1,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_0_1
  	incb
  	no_inc_1_2_0_1:
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_0_2
  	incb
  	no_inc_1_2_0_2:
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_0_3
  	incb
  	no_inc_1_2_0_3:
  	; Analizar casilla 1,1 (dirección 17) 
  	lda puntero_tablero+17,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_1_1
  	incb
  	no_inc_1_2_1_1:
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_1_3
  	incb
  	no_inc_1_2_1_3:
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_2_1
  	incb
  	no_inc_1_2_2_1:
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_2_2
  	incb
  	no_inc_1_2_2_2:
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_2_2_3
  	incb
  	no_inc_1_2_2_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+18,pcr
  	cmpa #'@
  	beq celda_viva_18
  	; Si está muerta
  	cmpb #3
  	beq nace_18
  	cmpb #6
  	beq nace_18
  	bra muere_18
  	celda_viva_18:
  	cmpb #2
  	beq vive_18
  	cmpb #3
  	beq vive_18
  	bra muere_18
  	nace_18:
  	lda #'@
  	sta puntero_tablero2+18,pcr
  	bra continuar_18
  	vive_18:
  	lda #'@
  	sta puntero_tablero2+18,pcr
  	bra continuar_18
  	muere_18:
  	lda #' 
  	sta puntero_tablero2+18,pcr
  	continuar_18:
  	
  	; Casilla 1,3 (dirección 19)
  	clrb
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_0_2
  	incb
  	no_inc_1_3_0_2:
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_0_3
  	incb
  	no_inc_1_3_0_3:
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_0_4
  	incb
  	no_inc_1_3_0_4:
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_1_2
  	incb
  	no_inc_1_3_1_2:
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_1_4
  	incb
  	no_inc_1_3_1_4:
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_2_2
  	incb
  	no_inc_1_3_2_2:
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_2_3
  	incb
  	no_inc_1_3_2_3:
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_3_2_4
  	incb
  	no_inc_1_3_2_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+19,pcr
  	cmpa #'@
  	beq celda_viva_19
  	; Si está muerta
  	cmpb #3
  	beq nace_19
  	cmpb #6
  	beq nace_19
  	bra muere_19
  	celda_viva_19:
  	cmpb #2
  	beq vive_19
  	cmpb #3
  	beq vive_19
  	bra muere_19
  	nace_19:
  	lda #'@
  	sta puntero_tablero2+19,pcr
  	bra continuar_19
  	vive_19:
  	lda #'@
  	sta puntero_tablero2+19,pcr
  	bra continuar_19
  	muere_19:
  	lda #' 
  	sta puntero_tablero2+19,pcr
  	continuar_19:
  	
  	; Casilla 1,4 (dirección 20)
  	clrb
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_0_3
  	incb
  	no_inc_1_4_0_3:
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_0_4
  	incb
  	no_inc_1_4_0_4:
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_0_5
  	incb
  	no_inc_1_4_0_5:
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_1_3
  	incb
  	no_inc_1_4_1_3:
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_1_5
  	incb
  	no_inc_1_4_1_5:
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_2_3
  	incb
  	no_inc_1_4_2_3:
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_2_4
  	incb
  	no_inc_1_4_2_4:
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_4_2_5
  	incb
  	no_inc_1_4_2_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+20,pcr
  	cmpa #'@
  	beq celda_viva_20
  	; Si está muerta
  	cmpb #3
  	beq nace_20
  	cmpb #6
  	beq nace_20
  	bra muere_20
  	celda_viva_20:
  	cmpb #2
  	beq vive_20
  	cmpb #3
  	beq vive_20
  	bra muere_20
  	nace_20:
  	lda #'@
  	sta puntero_tablero2+20,pcr
  	bra continuar_20
  	vive_20:
  	lda #'@
  	sta puntero_tablero2+20,pcr
  	bra continuar_20
  	muere_20:
  	lda #' 
  	sta puntero_tablero2+20,pcr
  	continuar_20:
  	
  	; Casilla 1,5 (dirección 21)
  	clrb
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_0_4
  	incb
  	no_inc_1_5_0_4:
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_0_5
  	incb
  	no_inc_1_5_0_5:
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_0_6
  	incb
  	no_inc_1_5_0_6:
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_1_4
  	incb
  	no_inc_1_5_1_4:
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_1_6
  	incb
  	no_inc_1_5_1_6:
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_2_4
  	incb
  	no_inc_1_5_2_4:
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_2_5
  	incb
  	no_inc_1_5_2_5:
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_5_2_6
  	incb
  	no_inc_1_5_2_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+21,pcr
  	cmpa #'@
  	beq celda_viva_21
  	; Si está muerta
  	cmpb #3
  	beq nace_21
  	cmpb #6
  	beq nace_21
  	bra muere_21
  	celda_viva_21:
  	cmpb #2
  	beq vive_21
  	cmpb #3
  	beq vive_21
  	bra muere_21
  	nace_21:
  	lda #'@
  	sta puntero_tablero2+21,pcr
  	bra continuar_21
  	vive_21:
  	lda #'@
  	sta puntero_tablero2+21,pcr
  	bra continuar_21
  	muere_21:
  	lda #' 
  	sta puntero_tablero2+21,pcr
  	continuar_21:
  	
  	; Casilla 1,6 (dirección 22)
  	clrb
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_0_5
  	incb
  	no_inc_1_6_0_5:
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_0_6
  	incb
  	no_inc_1_6_0_6:
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_0_7
  	incb
  	no_inc_1_6_0_7:
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_1_5
  	incb
  	no_inc_1_6_1_5:
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_1_7
  	incb
  	no_inc_1_6_1_7:
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_2_5
  	incb
  	no_inc_1_6_2_5:
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_2_6
  	incb
  	no_inc_1_6_2_6:
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_6_2_7
  	incb
  	no_inc_1_6_2_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+22,pcr
  	cmpa #'@
  	beq celda_viva_22
  	; Si está muerta
  	cmpb #3
  	beq nace_22
  	cmpb #6
  	beq nace_22
  	bra muere_22
  	celda_viva_22:
  	cmpb #2
  	beq vive_22
  	cmpb #3
  	beq vive_22
  	bra muere_22
  	nace_22:
  	lda #'@
  	sta puntero_tablero2+22,pcr
  	bra continuar_22
  	vive_22:
  	lda #'@
  	sta puntero_tablero2+22,pcr
  	bra continuar_22
  	muere_22:
  	lda #' 
  	sta puntero_tablero2+22,pcr
  	continuar_22:
  	
  	; Casilla 1,7 (dirección 23)
  	clrb
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_0_6
  	incb
  	no_inc_1_7_0_6:
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_0_7
  	incb
  	no_inc_1_7_0_7:
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_0_8
  	incb
  	no_inc_1_7_0_8:
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_1_6
  	incb
  	no_inc_1_7_1_6:
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_1_8
  	incb
  	no_inc_1_7_1_8:
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_2_6
  	incb
  	no_inc_1_7_2_6:
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_2_7
  	incb
  	no_inc_1_7_2_7:
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_7_2_8
  	incb
  	no_inc_1_7_2_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+23,pcr
  	cmpa #'@
  	beq celda_viva_23
  	; Si está muerta
  	cmpb #3
  	beq nace_23
  	cmpb #6
  	beq nace_23
  	bra muere_23
  	celda_viva_23:
  	cmpb #2
  	beq vive_23
  	cmpb #3
  	beq vive_23
  	bra muere_23
  	nace_23:
  	lda #'@
  	sta puntero_tablero2+23,pcr
  	bra continuar_23
  	vive_23:
  	lda #'@
  	sta puntero_tablero2+23,pcr
  	bra continuar_23
  	muere_23:
  	lda #' 
  	sta puntero_tablero2+23,pcr
  	continuar_23:
  	
  	; Casilla 1,8 (dirección 24)
  	clrb
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_0_7
  	incb
  	no_inc_1_8_0_7:
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_0_8
  	incb
  	no_inc_1_8_0_8:
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_0_9
  	incb
  	no_inc_1_8_0_9:
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_1_7
  	incb
  	no_inc_1_8_1_7:
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_1_9
  	incb
  	no_inc_1_8_1_9:
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_2_7
  	incb
  	no_inc_1_8_2_7:
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_2_8
  	incb
  	no_inc_1_8_2_8:
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_8_2_9
  	incb
  	no_inc_1_8_2_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+24,pcr
  	cmpa #'@
  	beq celda_viva_24
  	; Si está muerta
  	cmpb #3
  	beq nace_24
  	cmpb #6
  	beq nace_24
  	bra muere_24
  	celda_viva_24:
  	cmpb #2
  	beq vive_24
  	cmpb #3
  	beq vive_24
  	bra muere_24
  	nace_24:
  	lda #'@
  	sta puntero_tablero2+24,pcr
  	bra continuar_24
  	vive_24:
  	lda #'@
  	sta puntero_tablero2+24,pcr
  	bra continuar_24
  	muere_24:
  	lda #' 
  	sta puntero_tablero2+24,pcr
  	continuar_24:
  	
  	; Casilla 1,9 (dirección 25)
  	clrb
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_0_8
  	incb
  	no_inc_1_9_0_8:
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_0_9
  	incb
  	no_inc_1_9_0_9:
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_0_10
  	incb
  	no_inc_1_9_0_10:
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_1_8
  	incb
  	no_inc_1_9_1_8:
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_1_10
  	incb
  	no_inc_1_9_1_10:
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_2_8
  	incb
  	no_inc_1_9_2_8:
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_2_9
  	incb
  	no_inc_1_9_2_9:
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_9_2_10
  	incb
  	no_inc_1_9_2_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+25,pcr
  	cmpa #'@
  	beq celda_viva_25
  	; Si está muerta
  	cmpb #3
  	beq nace_25
  	cmpb #6
  	beq nace_25
  	bra muere_25
  	celda_viva_25:
  	cmpb #2
  	beq vive_25
  	cmpb #3
  	beq vive_25
  	bra muere_25
  	nace_25:
  	lda #'@
  	sta puntero_tablero2+25,pcr
  	bra continuar_25
  	vive_25:
  	lda #'@
  	sta puntero_tablero2+25,pcr
  	bra continuar_25
  	muere_25:
  	lda #' 
  	sta puntero_tablero2+25,pcr
  	continuar_25:
  	
  	; Casilla 1,10 (dirección 26)
  	clrb
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_0_9
  	incb
  	no_inc_1_10_0_9:
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_0_10
  	incb
  	no_inc_1_10_0_10:
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_0_11
  	incb
  	no_inc_1_10_0_11:
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_1_9
  	incb
  	no_inc_1_10_1_9:
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_1_11
  	incb
  	no_inc_1_10_1_11:
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_2_9
  	incb
  	no_inc_1_10_2_9:
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_2_10
  	incb
  	no_inc_1_10_2_10:
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_10_2_11
  	incb
  	no_inc_1_10_2_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+26,pcr
  	cmpa #'@
  	beq celda_viva_26
  	; Si está muerta
  	cmpb #3
  	beq nace_26
  	cmpb #6
  	beq nace_26
  	bra muere_26
  	celda_viva_26:
  	cmpb #2
  	beq vive_26
  	cmpb #3
  	beq vive_26
  	bra muere_26
  	nace_26:
  	lda #'@
  	sta puntero_tablero2+26,pcr
  	bra continuar_26
  	vive_26:
  	lda #'@
  	sta puntero_tablero2+26,pcr
  	bra continuar_26
  	muere_26:
  	lda #' 
  	sta puntero_tablero2+26,pcr
  	continuar_26:
  	
  	; Casilla 1,11 (dirección 27)
  	clrb
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_0_10
  	incb
  	no_inc_1_11_0_10:
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_0_11
  	incb
  	no_inc_1_11_0_11:
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_0_12
  	incb
  	no_inc_1_11_0_12:
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_1_10
  	incb
  	no_inc_1_11_1_10:
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_1_12
  	incb
  	no_inc_1_11_1_12:
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_2_10
  	incb
  	no_inc_1_11_2_10:
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_2_11
  	incb
  	no_inc_1_11_2_11:
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_11_2_12
  	incb
  	no_inc_1_11_2_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+27,pcr
  	cmpa #'@
  	beq celda_viva_27
  	; Si está muerta
  	cmpb #3
  	beq nace_27
  	cmpb #6
  	beq nace_27
  	bra muere_27
  	celda_viva_27:
  	cmpb #2
  	beq vive_27
  	cmpb #3
  	beq vive_27
  	bra muere_27
  	nace_27:
  	lda #'@
  	sta puntero_tablero2+27,pcr
  	bra continuar_27
  	vive_27:
  	lda #'@
  	sta puntero_tablero2+27,pcr
  	bra continuar_27
  	muere_27:
  	lda #' 
  	sta puntero_tablero2+27,pcr
  	continuar_27:
  	
  	; Casilla 1,12 (dirección 28)
  	clrb
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_0_11
  	incb
  	no_inc_1_12_0_11:
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_0_12
  	incb
  	no_inc_1_12_0_12:
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_0_13
  	incb
  	no_inc_1_12_0_13:
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_1_11
  	incb
  	no_inc_1_12_1_11:
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_1_13
  	incb
  	no_inc_1_12_1_13:
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_2_11
  	incb
  	no_inc_1_12_2_11:
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_2_12
  	incb
  	no_inc_1_12_2_12:
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_12_2_13
  	incb
  	no_inc_1_12_2_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+28,pcr
  	cmpa #'@
  	beq celda_viva_28
  	; Si está muerta
  	cmpb #3
  	beq nace_28
  	cmpb #6
  	beq nace_28
  	bra muere_28
  	celda_viva_28:
  	cmpb #2
  	beq vive_28
  	cmpb #3
  	beq vive_28
  	bra muere_28
  	nace_28:
  	lda #'@
  	sta puntero_tablero2+28,pcr
  	bra continuar_28
  	vive_28:
  	lda #'@
  	sta puntero_tablero2+28,pcr
  	bra continuar_28
  	muere_28:
  	lda #' 
  	sta puntero_tablero2+28,pcr
  	continuar_28:
  	
  	; Casilla 1,13 (dirección 29)
  	clrb
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_0_12
  	incb
  	no_inc_1_13_0_12:
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_0_13
  	incb
  	no_inc_1_13_0_13:
  	; Analizar casilla 0,14 (dirección 14) 
  	lda puntero_tablero+14,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_0_14
  	incb
  	no_inc_1_13_0_14:
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_1_12
  	incb
  	no_inc_1_13_1_12:
  	; Analizar casilla 1,14 (dirección 30) 
  	lda puntero_tablero+30,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_1_14
  	incb
  	no_inc_1_13_1_14:
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_2_12
  	incb
  	no_inc_1_13_2_12:
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_2_13
  	incb
  	no_inc_1_13_2_13:
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_13_2_14
  	incb
  	no_inc_1_13_2_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+29,pcr
  	cmpa #'@
  	beq celda_viva_29
  	; Si está muerta
  	cmpb #3
  	beq nace_29
  	cmpb #6
  	beq nace_29
  	bra muere_29
  	celda_viva_29:
  	cmpb #2
  	beq vive_29
  	cmpb #3
  	beq vive_29
  	bra muere_29
  	nace_29:
  	lda #'@
  	sta puntero_tablero2+29,pcr
  	bra continuar_29
  	vive_29:
  	lda #'@
  	sta puntero_tablero2+29,pcr
  	bra continuar_29
  	muere_29:
  	lda #' 
  	sta puntero_tablero2+29,pcr
  	continuar_29:
  	
  	; Casilla 1,14 (dirección 30)
  	clrb
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_0_13
  	incb
  	no_inc_1_14_0_13:
  	; Analizar casilla 0,14 (dirección 14) 
  	lda puntero_tablero+14,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_0_14
  	incb
  	no_inc_1_14_0_14:
  	; Analizar casilla 0,15 (dirección 15) 
  	lda puntero_tablero+15,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_0_15
  	incb
  	no_inc_1_14_0_15:
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_1_13
  	incb
  	no_inc_1_14_1_13:
  	; Analizar casilla 1,15 (dirección 31) 
  	lda puntero_tablero+31,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_1_15
  	incb
  	no_inc_1_14_1_15:
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_2_13
  	incb
  	no_inc_1_14_2_13:
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_2_14
  	incb
  	no_inc_1_14_2_14:
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_14_2_15
  	incb
  	no_inc_1_14_2_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+30,pcr
  	cmpa #'@
  	beq celda_viva_30
  	; Si está muerta
  	cmpb #3
  	beq nace_30
  	cmpb #6
  	beq nace_30
  	bra muere_30
  	celda_viva_30:
  	cmpb #2
  	beq vive_30
  	cmpb #3
  	beq vive_30
  	bra muere_30
  	nace_30:
  	lda #'@
  	sta puntero_tablero2+30,pcr
  	bra continuar_30
  	vive_30:
  	lda #'@
  	sta puntero_tablero2+30,pcr
  	bra continuar_30
  	muere_30:
  	lda #' 
  	sta puntero_tablero2+30,pcr
  	continuar_30:
  	
  	; Casilla 1,15 (dirección 31)
  	clrb
  	; Analizar casilla 0,14 (dirección 14) 
  	lda puntero_tablero+14,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_0_14
  	incb
  	no_inc_1_15_0_14:
  	; Analizar casilla 0,15 (dirección 15) 
  	lda puntero_tablero+15,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_0_15
  	incb
  	no_inc_1_15_0_15:
  	; Analizar casilla 0,0 (dirección 0) 
  	lda puntero_tablero+0,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_0_0
  	incb
  	no_inc_1_15_0_0:
  	; Analizar casilla 1,14 (dirección 30) 
  	lda puntero_tablero+30,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_1_14
  	incb
  	no_inc_1_15_1_14:
  	; Analizar casilla 1,0 (dirección 16) 
  	lda puntero_tablero+16,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_1_0
  	incb
  	no_inc_1_15_1_0:
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_2_14
  	incb
  	no_inc_1_15_2_14:
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_2_15
  	incb
  	no_inc_1_15_2_15:
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_1_15_2_0
  	incb
  	no_inc_1_15_2_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+31,pcr
  	cmpa #'@
  	beq celda_viva_31
  	; Si está muerta
  	cmpb #3
  	beq nace_31
  	cmpb #6
  	beq nace_31
  	bra muere_31
  	celda_viva_31:
  	cmpb #2
  	beq vive_31
  	cmpb #3
  	beq vive_31
  	bra muere_31
  	nace_31:
  	lda #'@
  	sta puntero_tablero2+31,pcr
  	bra continuar_31
  	vive_31:
  	lda #'@
  	sta puntero_tablero2+31,pcr
  	bra continuar_31
  	muere_31:
  	lda #' 
  	sta puntero_tablero2+31,pcr
  	continuar_31:
  	
  	; Casilla 2,0 (dirección 32)
  	clrb
  	; Analizar casilla 1,15 (dirección 31) 
  	lda puntero_tablero+31,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_1_15
  	incb
  	no_inc_2_0_1_15:
  	; Analizar casilla 1,0 (dirección 16) 
  	lda puntero_tablero+16,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_1_0
  	incb
  	no_inc_2_0_1_0:
  	; Analizar casilla 1,1 (dirección 17) 
  	lda puntero_tablero+17,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_1_1
  	incb
  	no_inc_2_0_1_1:
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_2_15
  	incb
  	no_inc_2_0_2_15:
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_2_1
  	incb
  	no_inc_2_0_2_1:
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_3_15
  	incb
  	no_inc_2_0_3_15:
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_3_0
  	incb
  	no_inc_2_0_3_0:
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_0_3_1
  	incb
  	no_inc_2_0_3_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+32,pcr
  	cmpa #'@
  	beq celda_viva_32
  	; Si está muerta
  	cmpb #3
  	beq nace_32
  	cmpb #6
  	beq nace_32
  	bra muere_32
  	celda_viva_32:
  	cmpb #2
  	beq vive_32
  	cmpb #3
  	beq vive_32
  	bra muere_32
  	nace_32:
  	lda #'@
  	sta puntero_tablero2+32,pcr
  	bra continuar_32
  	vive_32:
  	lda #'@
  	sta puntero_tablero2+32,pcr
  	bra continuar_32
  	muere_32:
  	lda #' 
  	sta puntero_tablero2+32,pcr
  	continuar_32:
  	
  	; Casilla 2,1 (dirección 33)
  	clrb
  	; Analizar casilla 1,0 (dirección 16) 
  	lda puntero_tablero+16,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_1_0
  	incb
  	no_inc_2_1_1_0:
  	; Analizar casilla 1,1 (dirección 17) 
  	lda puntero_tablero+17,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_1_1
  	incb
  	no_inc_2_1_1_1:
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_1_2
  	incb
  	no_inc_2_1_1_2:
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_2_0
  	incb
  	no_inc_2_1_2_0:
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_2_2
  	incb
  	no_inc_2_1_2_2:
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_3_0
  	incb
  	no_inc_2_1_3_0:
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_3_1
  	incb
  	no_inc_2_1_3_1:
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_1_3_2
  	incb
  	no_inc_2_1_3_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+33,pcr
  	cmpa #'@
  	beq celda_viva_33
  	; Si está muerta
  	cmpb #3
  	beq nace_33
  	cmpb #6
  	beq nace_33
  	bra muere_33
  	celda_viva_33:
  	cmpb #2
  	beq vive_33
  	cmpb #3
  	beq vive_33
  	bra muere_33
  	nace_33:
  	lda #'@
  	sta puntero_tablero2+33,pcr
  	bra continuar_33
  	vive_33:
  	lda #'@
  	sta puntero_tablero2+33,pcr
  	bra continuar_33
  	muere_33:
  	lda #' 
  	sta puntero_tablero2+33,pcr
  	continuar_33:
  	
  	; Casilla 2,2 (dirección 34)
  	clrb
  	; Analizar casilla 1,1 (dirección 17) 
  	lda puntero_tablero+17,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_1_1
  	incb
  	no_inc_2_2_1_1:
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_1_2
  	incb
  	no_inc_2_2_1_2:
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_1_3
  	incb
  	no_inc_2_2_1_3:
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_2_1
  	incb
  	no_inc_2_2_2_1:
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_2_3
  	incb
  	no_inc_2_2_2_3:
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_3_1
  	incb
  	no_inc_2_2_3_1:
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_3_2
  	incb
  	no_inc_2_2_3_2:
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_2_3_3
  	incb
  	no_inc_2_2_3_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+34,pcr
  	cmpa #'@
  	beq celda_viva_34
  	; Si está muerta
  	cmpb #3
  	beq nace_34
  	cmpb #6
  	beq nace_34
  	bra muere_34
  	celda_viva_34:
  	cmpb #2
  	beq vive_34
  	cmpb #3
  	beq vive_34
  	bra muere_34
  	nace_34:
  	lda #'@
  	sta puntero_tablero2+34,pcr
  	bra continuar_34
  	vive_34:
  	lda #'@
  	sta puntero_tablero2+34,pcr
  	bra continuar_34
  	muere_34:
  	lda #' 
  	sta puntero_tablero2+34,pcr
  	continuar_34:
  	
  	; Casilla 2,3 (dirección 35)
  	clrb
  	; Analizar casilla 1,2 (dirección 18) 
  	lda puntero_tablero+18,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_1_2
  	incb
  	no_inc_2_3_1_2:
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_1_3
  	incb
  	no_inc_2_3_1_3:
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_1_4
  	incb
  	no_inc_2_3_1_4:
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_2_2
  	incb
  	no_inc_2_3_2_2:
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_2_4
  	incb
  	no_inc_2_3_2_4:
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_3_2
  	incb
  	no_inc_2_3_3_2:
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_3_3
  	incb
  	no_inc_2_3_3_3:
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_3_3_4
  	incb
  	no_inc_2_3_3_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+35,pcr
  	cmpa #'@
  	beq celda_viva_35
  	; Si está muerta
  	cmpb #3
  	beq nace_35
  	cmpb #6
  	beq nace_35
  	bra muere_35
  	celda_viva_35:
  	cmpb #2
  	beq vive_35
  	cmpb #3
  	beq vive_35
  	bra muere_35
  	nace_35:
  	lda #'@
  	sta puntero_tablero2+35,pcr
  	bra continuar_35
  	vive_35:
  	lda #'@
  	sta puntero_tablero2+35,pcr
  	bra continuar_35
  	muere_35:
  	lda #' 
  	sta puntero_tablero2+35,pcr
  	continuar_35:
  	
  	; Casilla 2,4 (dirección 36)
  	clrb
  	; Analizar casilla 1,3 (dirección 19) 
  	lda puntero_tablero+19,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_1_3
  	incb
  	no_inc_2_4_1_3:
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_1_4
  	incb
  	no_inc_2_4_1_4:
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_1_5
  	incb
  	no_inc_2_4_1_5:
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_2_3
  	incb
  	no_inc_2_4_2_3:
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_2_5
  	incb
  	no_inc_2_4_2_5:
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_3_3
  	incb
  	no_inc_2_4_3_3:
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_3_4
  	incb
  	no_inc_2_4_3_4:
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_4_3_5
  	incb
  	no_inc_2_4_3_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+36,pcr
  	cmpa #'@
  	beq celda_viva_36
  	; Si está muerta
  	cmpb #3
  	beq nace_36
  	cmpb #6
  	beq nace_36
  	bra muere_36
  	celda_viva_36:
  	cmpb #2
  	beq vive_36
  	cmpb #3
  	beq vive_36
  	bra muere_36
  	nace_36:
  	lda #'@
  	sta puntero_tablero2+36,pcr
  	bra continuar_36
  	vive_36:
  	lda #'@
  	sta puntero_tablero2+36,pcr
  	bra continuar_36
  	muere_36:
  	lda #' 
  	sta puntero_tablero2+36,pcr
  	continuar_36:
  	
  	; Casilla 2,5 (dirección 37)
  	clrb
  	; Analizar casilla 1,4 (dirección 20) 
  	lda puntero_tablero+20,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_1_4
  	incb
  	no_inc_2_5_1_4:
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_1_5
  	incb
  	no_inc_2_5_1_5:
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_1_6
  	incb
  	no_inc_2_5_1_6:
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_2_4
  	incb
  	no_inc_2_5_2_4:
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_2_6
  	incb
  	no_inc_2_5_2_6:
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_3_4
  	incb
  	no_inc_2_5_3_4:
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_3_5
  	incb
  	no_inc_2_5_3_5:
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_5_3_6
  	incb
  	no_inc_2_5_3_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+37,pcr
  	cmpa #'@
  	beq celda_viva_37
  	; Si está muerta
  	cmpb #3
  	beq nace_37
  	cmpb #6
  	beq nace_37
  	bra muere_37
  	celda_viva_37:
  	cmpb #2
  	beq vive_37
  	cmpb #3
  	beq vive_37
  	bra muere_37
  	nace_37:
  	lda #'@
  	sta puntero_tablero2+37,pcr
  	bra continuar_37
  	vive_37:
  	lda #'@
  	sta puntero_tablero2+37,pcr
  	bra continuar_37
  	muere_37:
  	lda #' 
  	sta puntero_tablero2+37,pcr
  	continuar_37:
  	
  	; Casilla 2,6 (dirección 38)
  	clrb
  	; Analizar casilla 1,5 (dirección 21) 
  	lda puntero_tablero+21,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_1_5
  	incb
  	no_inc_2_6_1_5:
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_1_6
  	incb
  	no_inc_2_6_1_6:
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_1_7
  	incb
  	no_inc_2_6_1_7:
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_2_5
  	incb
  	no_inc_2_6_2_5:
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_2_7
  	incb
  	no_inc_2_6_2_7:
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_3_5
  	incb
  	no_inc_2_6_3_5:
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_3_6
  	incb
  	no_inc_2_6_3_6:
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_6_3_7
  	incb
  	no_inc_2_6_3_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+38,pcr
  	cmpa #'@
  	beq celda_viva_38
  	; Si está muerta
  	cmpb #3
  	beq nace_38
  	cmpb #6
  	beq nace_38
  	bra muere_38
  	celda_viva_38:
  	cmpb #2
  	beq vive_38
  	cmpb #3
  	beq vive_38
  	bra muere_38
  	nace_38:
  	lda #'@
  	sta puntero_tablero2+38,pcr
  	bra continuar_38
  	vive_38:
  	lda #'@
  	sta puntero_tablero2+38,pcr
  	bra continuar_38
  	muere_38:
  	lda #' 
  	sta puntero_tablero2+38,pcr
  	continuar_38:
  	
  	; Casilla 2,7 (dirección 39)
  	clrb
  	; Analizar casilla 1,6 (dirección 22) 
  	lda puntero_tablero+22,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_1_6
  	incb
  	no_inc_2_7_1_6:
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_1_7
  	incb
  	no_inc_2_7_1_7:
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_1_8
  	incb
  	no_inc_2_7_1_8:
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_2_6
  	incb
  	no_inc_2_7_2_6:
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_2_8
  	incb
  	no_inc_2_7_2_8:
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_3_6
  	incb
  	no_inc_2_7_3_6:
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_3_7
  	incb
  	no_inc_2_7_3_7:
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_7_3_8
  	incb
  	no_inc_2_7_3_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+39,pcr
  	cmpa #'@
  	beq celda_viva_39
  	; Si está muerta
  	cmpb #3
  	beq nace_39
  	cmpb #6
  	beq nace_39
  	bra muere_39
  	celda_viva_39:
  	cmpb #2
  	beq vive_39
  	cmpb #3
  	beq vive_39
  	bra muere_39
  	nace_39:
  	lda #'@
  	sta puntero_tablero2+39,pcr
  	bra continuar_39
  	vive_39:
  	lda #'@
  	sta puntero_tablero2+39,pcr
  	bra continuar_39
  	muere_39:
  	lda #' 
  	sta puntero_tablero2+39,pcr
  	continuar_39:
  	
  	; Casilla 2,8 (dirección 40)
  	clrb
  	; Analizar casilla 1,7 (dirección 23) 
  	lda puntero_tablero+23,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_1_7
  	incb
  	no_inc_2_8_1_7:
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_1_8
  	incb
  	no_inc_2_8_1_8:
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_1_9
  	incb
  	no_inc_2_8_1_9:
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_2_7
  	incb
  	no_inc_2_8_2_7:
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_2_9
  	incb
  	no_inc_2_8_2_9:
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_3_7
  	incb
  	no_inc_2_8_3_7:
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_3_8
  	incb
  	no_inc_2_8_3_8:
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_8_3_9
  	incb
  	no_inc_2_8_3_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+40,pcr
  	cmpa #'@
  	beq celda_viva_40
  	; Si está muerta
  	cmpb #3
  	beq nace_40
  	cmpb #6
  	beq nace_40
  	bra muere_40
  	celda_viva_40:
  	cmpb #2
  	beq vive_40
  	cmpb #3
  	beq vive_40
  	bra muere_40
  	nace_40:
  	lda #'@
  	sta puntero_tablero2+40,pcr
  	bra continuar_40
  	vive_40:
  	lda #'@
  	sta puntero_tablero2+40,pcr
  	bra continuar_40
  	muere_40:
  	lda #' 
  	sta puntero_tablero2+40,pcr
  	continuar_40:
  	
  	; Casilla 2,9 (dirección 41)
  	clrb
  	; Analizar casilla 1,8 (dirección 24) 
  	lda puntero_tablero+24,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_1_8
  	incb
  	no_inc_2_9_1_8:
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_1_9
  	incb
  	no_inc_2_9_1_9:
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_1_10
  	incb
  	no_inc_2_9_1_10:
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_2_8
  	incb
  	no_inc_2_9_2_8:
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_2_10
  	incb
  	no_inc_2_9_2_10:
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_3_8
  	incb
  	no_inc_2_9_3_8:
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_3_9
  	incb
  	no_inc_2_9_3_9:
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_9_3_10
  	incb
  	no_inc_2_9_3_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+41,pcr
  	cmpa #'@
  	beq celda_viva_41
  	; Si está muerta
  	cmpb #3
  	beq nace_41
  	cmpb #6
  	beq nace_41
  	bra muere_41
  	celda_viva_41:
  	cmpb #2
  	beq vive_41
  	cmpb #3
  	beq vive_41
  	bra muere_41
  	nace_41:
  	lda #'@
  	sta puntero_tablero2+41,pcr
  	bra continuar_41
  	vive_41:
  	lda #'@
  	sta puntero_tablero2+41,pcr
  	bra continuar_41
  	muere_41:
  	lda #' 
  	sta puntero_tablero2+41,pcr
  	continuar_41:
  	
  	; Casilla 2,10 (dirección 42)
  	clrb
  	; Analizar casilla 1,9 (dirección 25) 
  	lda puntero_tablero+25,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_1_9
  	incb
  	no_inc_2_10_1_9:
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_1_10
  	incb
  	no_inc_2_10_1_10:
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_1_11
  	incb
  	no_inc_2_10_1_11:
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_2_9
  	incb
  	no_inc_2_10_2_9:
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_2_11
  	incb
  	no_inc_2_10_2_11:
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_3_9
  	incb
  	no_inc_2_10_3_9:
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_3_10
  	incb
  	no_inc_2_10_3_10:
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_10_3_11
  	incb
  	no_inc_2_10_3_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+42,pcr
  	cmpa #'@
  	beq celda_viva_42
  	; Si está muerta
  	cmpb #3
  	beq nace_42
  	cmpb #6
  	beq nace_42
  	bra muere_42
  	celda_viva_42:
  	cmpb #2
  	beq vive_42
  	cmpb #3
  	beq vive_42
  	bra muere_42
  	nace_42:
  	lda #'@
  	sta puntero_tablero2+42,pcr
  	bra continuar_42
  	vive_42:
  	lda #'@
  	sta puntero_tablero2+42,pcr
  	bra continuar_42
  	muere_42:
  	lda #' 
  	sta puntero_tablero2+42,pcr
  	continuar_42:
  	
  	; Casilla 2,11 (dirección 43)
  	clrb
  	; Analizar casilla 1,10 (dirección 26) 
  	lda puntero_tablero+26,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_1_10
  	incb
  	no_inc_2_11_1_10:
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_1_11
  	incb
  	no_inc_2_11_1_11:
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_1_12
  	incb
  	no_inc_2_11_1_12:
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_2_10
  	incb
  	no_inc_2_11_2_10:
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_2_12
  	incb
  	no_inc_2_11_2_12:
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_3_10
  	incb
  	no_inc_2_11_3_10:
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_3_11
  	incb
  	no_inc_2_11_3_11:
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_11_3_12
  	incb
  	no_inc_2_11_3_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+43,pcr
  	cmpa #'@
  	beq celda_viva_43
  	; Si está muerta
  	cmpb #3
  	beq nace_43
  	cmpb #6
  	beq nace_43
  	bra muere_43
  	celda_viva_43:
  	cmpb #2
  	beq vive_43
  	cmpb #3
  	beq vive_43
  	bra muere_43
  	nace_43:
  	lda #'@
  	sta puntero_tablero2+43,pcr
  	bra continuar_43
  	vive_43:
  	lda #'@
  	sta puntero_tablero2+43,pcr
  	bra continuar_43
  	muere_43:
  	lda #' 
  	sta puntero_tablero2+43,pcr
  	continuar_43:
  	
  	; Casilla 2,12 (dirección 44)
  	clrb
  	; Analizar casilla 1,11 (dirección 27) 
  	lda puntero_tablero+27,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_1_11
  	incb
  	no_inc_2_12_1_11:
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_1_12
  	incb
  	no_inc_2_12_1_12:
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_1_13
  	incb
  	no_inc_2_12_1_13:
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_2_11
  	incb
  	no_inc_2_12_2_11:
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_2_13
  	incb
  	no_inc_2_12_2_13:
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_3_11
  	incb
  	no_inc_2_12_3_11:
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_3_12
  	incb
  	no_inc_2_12_3_12:
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_12_3_13
  	incb
  	no_inc_2_12_3_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+44,pcr
  	cmpa #'@
  	beq celda_viva_44
  	; Si está muerta
  	cmpb #3
  	beq nace_44
  	cmpb #6
  	beq nace_44
  	bra muere_44
  	celda_viva_44:
  	cmpb #2
  	beq vive_44
  	cmpb #3
  	beq vive_44
  	bra muere_44
  	nace_44:
  	lda #'@
  	sta puntero_tablero2+44,pcr
  	bra continuar_44
  	vive_44:
  	lda #'@
  	sta puntero_tablero2+44,pcr
  	bra continuar_44
  	muere_44:
  	lda #' 
  	sta puntero_tablero2+44,pcr
  	continuar_44:
  	
  	; Casilla 2,13 (dirección 45)
  	clrb
  	; Analizar casilla 1,12 (dirección 28) 
  	lda puntero_tablero+28,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_1_12
  	incb
  	no_inc_2_13_1_12:
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_1_13
  	incb
  	no_inc_2_13_1_13:
  	; Analizar casilla 1,14 (dirección 30) 
  	lda puntero_tablero+30,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_1_14
  	incb
  	no_inc_2_13_1_14:
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_2_12
  	incb
  	no_inc_2_13_2_12:
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_2_14
  	incb
  	no_inc_2_13_2_14:
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_3_12
  	incb
  	no_inc_2_13_3_12:
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_3_13
  	incb
  	no_inc_2_13_3_13:
  	; Analizar casilla 3,14 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_13_3_14
  	incb
  	no_inc_2_13_3_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+45,pcr
  	cmpa #'@
  	beq celda_viva_45
  	; Si está muerta
  	cmpb #3
  	beq nace_45
  	cmpb #6
  	beq nace_45
  	bra muere_45
  	celda_viva_45:
  	cmpb #2
  	beq vive_45
  	cmpb #3
  	beq vive_45
  	bra muere_45
  	nace_45:
  	lda #'@
  	sta puntero_tablero2+45,pcr
  	bra continuar_45
  	vive_45:
  	lda #'@
  	sta puntero_tablero2+45,pcr
  	bra continuar_45
  	muere_45:
  	lda #' 
  	sta puntero_tablero2+45,pcr
  	continuar_45:
  	
  	; Casilla 2,14 (dirección 46)
  	clrb
  	; Analizar casilla 1,13 (dirección 29) 
  	lda puntero_tablero+29,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_1_13
  	incb
  	no_inc_2_14_1_13:
  	; Analizar casilla 1,14 (dirección 30) 
  	lda puntero_tablero+30,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_1_14
  	incb
  	no_inc_2_14_1_14:
  	; Analizar casilla 1,15 (dirección 31) 
  	lda puntero_tablero+31,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_1_15
  	incb
  	no_inc_2_14_1_15:
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_2_13
  	incb
  	no_inc_2_14_2_13:
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_2_15
  	incb
  	no_inc_2_14_2_15:
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_3_13
  	incb
  	no_inc_2_14_3_13:
  	; Analizar casilla 3,14 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_3_14
  	incb
  	no_inc_2_14_3_14:
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_14_3_15
  	incb
  	no_inc_2_14_3_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+46,pcr
  	cmpa #'@
  	beq celda_viva_46
  	; Si está muerta
  	cmpb #3
  	beq nace_46
  	cmpb #6
  	beq nace_46
  	bra muere_46
  	celda_viva_46:
  	cmpb #2
  	beq vive_46
  	cmpb #3
  	beq vive_46
  	bra muere_46
  	nace_46:
  	lda #'@
  	sta puntero_tablero2+46,pcr
  	bra continuar_46
  	vive_46:
  	lda #'@
  	sta puntero_tablero2+46,pcr
  	bra continuar_46
  	muere_46:
  	lda #' 
  	sta puntero_tablero2+46,pcr
  	continuar_46:
  	
  	; Casilla 2,15 (dirección 47)
  	clrb
  	; Analizar casilla 1,14 (dirección 30) 
  	lda puntero_tablero+30,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_1_14
  	incb
  	no_inc_2_15_1_14:
  	; Analizar casilla 1,15 (dirección 31) 
  	lda puntero_tablero+31,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_1_15
  	incb
  	no_inc_2_15_1_15:
  	; Analizar casilla 1,0 (dirección 16) 
  	lda puntero_tablero+16,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_1_0
  	incb
  	no_inc_2_15_1_0:
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_2_14
  	incb
  	no_inc_2_15_2_14:
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_2_0
  	incb
  	no_inc_2_15_2_0:
  	; Analizar casilla 3,2 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_3_2
  	incb
  	no_inc_2_15_3_2:
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_3_15
  	incb
  	no_inc_2_15_3_15:
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_2_15_3_0
  	incb
  	no_inc_2_15_3_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+47,pcr
  	cmpa #'@
  	beq celda_viva_47
  	; Si está muerta
  	cmpb #3
  	beq nace_47
  	cmpb #6
  	beq nace_47
  	bra muere_47
  	celda_viva_47:
  	cmpb #2
  	beq vive_47
  	cmpb #3
  	beq vive_47
  	bra muere_47
  	nace_47:
  	lda #'@
  	sta puntero_tablero2+47,pcr
  	bra continuar_47
  	vive_47:
  	lda #'@
  	sta puntero_tablero2+47,pcr
  	bra continuar_47
  	muere_47:
  	lda #' 
  	sta puntero_tablero2+47,pcr
  	continuar_47:
  	
  	; Casilla 3,0 (dirección 48)
  	clrb
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_2_15
  	incb
  	no_inc_3_0_2_15:
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_2_0
  	incb
  	no_inc_3_0_2_0:
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_2_1
  	incb
  	no_inc_3_0_2_1:
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_3_15
  	incb
  	no_inc_3_0_3_15:
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_3_1
  	incb
  	no_inc_3_0_3_1:
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_4_15
  	incb
  	no_inc_3_0_4_15:
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_4_0
  	incb
  	no_inc_3_0_4_0:
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_0_4_1
  	incb
  	no_inc_3_0_4_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+48,pcr
  	cmpa #'@
  	beq celda_viva_48
  	; Si está muerta
  	cmpb #3
  	beq nace_48
  	cmpb #6
  	beq nace_48
  	bra muere_48
  	celda_viva_48:
  	cmpb #2
  	beq vive_48
  	cmpb #3
  	beq vive_48
  	bra muere_48
  	nace_48:
  	lda #'@
  	sta puntero_tablero2+48,pcr
  	bra continuar_48
  	vive_48:
  	lda #'@
  	sta puntero_tablero2+48,pcr
  	bra continuar_48
  	muere_48:
  	lda #' 
  	sta puntero_tablero2+48,pcr
  	continuar_48:
  	
  	; Casilla 3,1 (dirección 49)
  	clrb
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_2_0
  	incb
  	no_inc_3_1_2_0:
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_2_1
  	incb
  	no_inc_3_1_2_1:
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_2_2
  	incb
  	no_inc_3_1_2_2:
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_3_0
  	incb
  	no_inc_3_1_3_0:
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_3_2
  	incb
  	no_inc_3_1_3_2:
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_4_0
  	incb
  	no_inc_3_1_4_0:
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_4_1
  	incb
  	no_inc_3_1_4_1:
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_1_4_2
  	incb
  	no_inc_3_1_4_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+49,pcr
  	cmpa #'@
  	beq celda_viva_49
  	; Si está muerta
  	cmpb #3
  	beq nace_49
  	cmpb #6
  	beq nace_49
  	bra muere_49
  	celda_viva_49:
  	cmpb #2
  	beq vive_49
  	cmpb #3
  	beq vive_49
  	bra muere_49
  	nace_49:
  	lda #'@
  	sta puntero_tablero2+49,pcr
  	bra continuar_49
  	vive_49:
  	lda #'@
  	sta puntero_tablero2+49,pcr
  	bra continuar_49
  	muere_49:
  	lda #' 
  	sta puntero_tablero2+49,pcr
  	continuar_49:
  	
  	; Casilla 3,2 (dirección 50)
  	clrb
  	; Analizar casilla 2,1 (dirección 33) 
  	lda puntero_tablero+33,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_2_1
  	incb
  	no_inc_3_2_2_1:
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_2_2
  	incb
  	no_inc_3_2_2_2:
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_2_3
  	incb
  	no_inc_3_2_2_3:
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_3_1
  	incb
  	no_inc_3_2_3_1:
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_3_3
  	incb
  	no_inc_3_2_3_3:
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_4_1
  	incb
  	no_inc_3_2_4_1:
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_4_2
  	incb
  	no_inc_3_2_4_2:
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_2_4_3
  	incb
  	no_inc_3_2_4_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+50,pcr
  	cmpa #'@
  	beq celda_viva_50
  	; Si está muerta
  	cmpb #3
  	beq nace_50
  	cmpb #6
  	beq nace_50
  	bra muere_50
  	celda_viva_50:
  	cmpb #2
  	beq vive_50
  	cmpb #3
  	beq vive_50
  	bra muere_50
  	nace_50:
  	lda #'@
  	sta puntero_tablero2+50,pcr
  	bra continuar_50
  	vive_50:
  	lda #'@
  	sta puntero_tablero2+50,pcr
  	bra continuar_50
  	muere_50:
  	lda #' 
  	sta puntero_tablero2+50,pcr
  	continuar_50:
  	
  	; Casilla 3,3 (dirección 51)
  	clrb
  	; Analizar casilla 2,2 (dirección 34) 
  	lda puntero_tablero+34,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_2_2
  	incb
  	no_inc_3_3_2_2:
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_2_3
  	incb
  	no_inc_3_3_2_3:
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_2_4
  	incb
  	no_inc_3_3_2_4:
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_3_2
  	incb
  	no_inc_3_3_3_2:
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_3_4
  	incb
  	no_inc_3_3_3_4:
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_4_2
  	incb
  	no_inc_3_3_4_2:
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_4_3
  	incb
  	no_inc_3_3_4_3:
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_3_4_4
  	incb
  	no_inc_3_3_4_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+51,pcr
  	cmpa #'@
  	beq celda_viva_51
  	; Si está muerta
  	cmpb #3
  	beq nace_51
  	cmpb #6
  	beq nace_51
  	bra muere_51
  	celda_viva_51:
  	cmpb #2
  	beq vive_51
  	cmpb #3
  	beq vive_51
  	bra muere_51
  	nace_51:
  	lda #'@
  	sta puntero_tablero2+51,pcr
  	bra continuar_51
  	vive_51:
  	lda #'@
  	sta puntero_tablero2+51,pcr
  	bra continuar_51
  	muere_51:
  	lda #' 
  	sta puntero_tablero2+51,pcr
  	continuar_51:
  	
  	; Casilla 3,4 (dirección 52)
  	clrb
  	; Analizar casilla 2,3 (dirección 35) 
  	lda puntero_tablero+35,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_2_3
  	incb
  	no_inc_3_4_2_3:
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_2_4
  	incb
  	no_inc_3_4_2_4:
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_2_5
  	incb
  	no_inc_3_4_2_5:
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_3_3
  	incb
  	no_inc_3_4_3_3:
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_3_5
  	incb
  	no_inc_3_4_3_5:
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_4_3
  	incb
  	no_inc_3_4_4_3:
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_4_4
  	incb
  	no_inc_3_4_4_4:
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_4_4_5
  	incb
  	no_inc_3_4_4_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+52,pcr
  	cmpa #'@
  	beq celda_viva_52
  	; Si está muerta
  	cmpb #3
  	beq nace_52
  	cmpb #6
  	beq nace_52
  	bra muere_52
  	celda_viva_52:
  	cmpb #2
  	beq vive_52
  	cmpb #3
  	beq vive_52
  	bra muere_52
  	nace_52:
  	lda #'@
  	sta puntero_tablero2+52,pcr
  	bra continuar_52
  	vive_52:
  	lda #'@
  	sta puntero_tablero2+52,pcr
  	bra continuar_52
  	muere_52:
  	lda #' 
  	sta puntero_tablero2+52,pcr
  	continuar_52:
  	
  	; Casilla 3,5 (dirección 53)
  	clrb
  	; Analizar casilla 2,4 (dirección 36) 
  	lda puntero_tablero+36,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_2_4
  	incb
  	no_inc_3_5_2_4:
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_2_5
  	incb
  	no_inc_3_5_2_5:
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_2_6
  	incb
  	no_inc_3_5_2_6:
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_3_4
  	incb
  	no_inc_3_5_3_4:
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_3_6
  	incb
  	no_inc_3_5_3_6:
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_4_4
  	incb
  	no_inc_3_5_4_4:
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_4_5
  	incb
  	no_inc_3_5_4_5:
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_5_4_6
  	incb
  	no_inc_3_5_4_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+53,pcr
  	cmpa #'@
  	beq celda_viva_53
  	; Si está muerta
  	cmpb #3
  	beq nace_53
  	cmpb #6
  	beq nace_53
  	bra muere_53
  	celda_viva_53:
  	cmpb #2
  	beq vive_53
  	cmpb #3
  	beq vive_53
  	bra muere_53
  	nace_53:
  	lda #'@
  	sta puntero_tablero2+53,pcr
  	bra continuar_53
  	vive_53:
  	lda #'@
  	sta puntero_tablero2+53,pcr
  	bra continuar_53
  	muere_53:
  	lda #' 
  	sta puntero_tablero2+53,pcr
  	continuar_53:
  	
  	; Casilla 3,6 (dirección 54)
  	clrb
  	; Analizar casilla 2,5 (dirección 37) 
  	lda puntero_tablero+37,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_2_5
  	incb
  	no_inc_3_6_2_5:
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_2_6
  	incb
  	no_inc_3_6_2_6:
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_2_7
  	incb
  	no_inc_3_6_2_7:
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_3_5
  	incb
  	no_inc_3_6_3_5:
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_3_7
  	incb
  	no_inc_3_6_3_7:
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_4_5
  	incb
  	no_inc_3_6_4_5:
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_4_6
  	incb
  	no_inc_3_6_4_6:
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_6_4_7
  	incb
  	no_inc_3_6_4_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+54,pcr
  	cmpa #'@
  	beq celda_viva_54
  	; Si está muerta
  	cmpb #3
  	beq nace_54
  	cmpb #6
  	beq nace_54
  	bra muere_54
  	celda_viva_54:
  	cmpb #2
  	beq vive_54
  	cmpb #3
  	beq vive_54
  	bra muere_54
  	nace_54:
  	lda #'@
  	sta puntero_tablero2+54,pcr
  	bra continuar_54
  	vive_54:
  	lda #'@
  	sta puntero_tablero2+54,pcr
  	bra continuar_54
  	muere_54:
  	lda #' 
  	sta puntero_tablero2+54,pcr
  	continuar_54:
  	
  	; Casilla 3,7 (dirección 55)
  	clrb
  	; Analizar casilla 2,6 (dirección 38) 
  	lda puntero_tablero+38,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_2_6
  	incb
  	no_inc_3_7_2_6:
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_2_7
  	incb
  	no_inc_3_7_2_7:
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_2_8
  	incb
  	no_inc_3_7_2_8:
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_3_6
  	incb
  	no_inc_3_7_3_6:
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_3_8
  	incb
  	no_inc_3_7_3_8:
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_4_6
  	incb
  	no_inc_3_7_4_6:
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_4_7
  	incb
  	no_inc_3_7_4_7:
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_7_4_8
  	incb
  	no_inc_3_7_4_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+55,pcr
  	cmpa #'@
  	beq celda_viva_55
  	; Si está muerta
  	cmpb #3
  	beq nace_55
  	cmpb #6
  	beq nace_55
  	bra muere_55
  	celda_viva_55:
  	cmpb #2
  	beq vive_55
  	cmpb #3
  	beq vive_55
  	bra muere_55
  	nace_55:
  	lda #'@
  	sta puntero_tablero2+55,pcr
  	bra continuar_55
  	vive_55:
  	lda #'@
  	sta puntero_tablero2+55,pcr
  	bra continuar_55
  	muere_55:
  	lda #' 
  	sta puntero_tablero2+55,pcr
  	continuar_55:
  	
  	; Casilla 3,8 (dirección 56)
  	clrb
  	; Analizar casilla 2,7 (dirección 39) 
  	lda puntero_tablero+39,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_2_7
  	incb
  	no_inc_3_8_2_7:
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_2_8
  	incb
  	no_inc_3_8_2_8:
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_2_9
  	incb
  	no_inc_3_8_2_9:
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_3_7
  	incb
  	no_inc_3_8_3_7:
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_3_9
  	incb
  	no_inc_3_8_3_9:
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_4_7
  	incb
  	no_inc_3_8_4_7:
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_4_8
  	incb
  	no_inc_3_8_4_8:
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_8_4_9
  	incb
  	no_inc_3_8_4_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+56,pcr
  	cmpa #'@
  	beq celda_viva_56
  	; Si está muerta
  	cmpb #3
  	beq nace_56
  	cmpb #6
  	beq nace_56
  	bra muere_56
  	celda_viva_56:
  	cmpb #2
  	beq vive_56
  	cmpb #3
  	beq vive_56
  	bra muere_56
  	nace_56:
  	lda #'@
  	sta puntero_tablero2+56,pcr
  	bra continuar_56
  	vive_56:
  	lda #'@
  	sta puntero_tablero2+56,pcr
  	bra continuar_56
  	muere_56:
  	lda #' 
  	sta puntero_tablero2+56,pcr
  	continuar_56:
  	
  	; Casilla 3,9 (dirección 57)
  	clrb
  	; Analizar casilla 2,8 (dirección 40) 
  	lda puntero_tablero+40,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_2_8
  	incb
  	no_inc_3_9_2_8:
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_2_9
  	incb
  	no_inc_3_9_2_9:
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_2_10
  	incb
  	no_inc_3_9_2_10:
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_3_8
  	incb
  	no_inc_3_9_3_8:
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_3_10
  	incb
  	no_inc_3_9_3_10:
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_4_8
  	incb
  	no_inc_3_9_4_8:
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_4_9
  	incb
  	no_inc_3_9_4_9:
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_9_4_10
  	incb
  	no_inc_3_9_4_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+57,pcr
  	cmpa #'@
  	beq celda_viva_57
  	; Si está muerta
  	cmpb #3
  	beq nace_57
  	cmpb #6
  	beq nace_57
  	bra muere_57
  	celda_viva_57:
  	cmpb #2
  	beq vive_57
  	cmpb #3
  	beq vive_57
  	bra muere_57
  	nace_57:
  	lda #'@
  	sta puntero_tablero2+57,pcr
  	bra continuar_57
  	vive_57:
  	lda #'@
  	sta puntero_tablero2+57,pcr
  	bra continuar_57
  	muere_57:
  	lda #' 
  	sta puntero_tablero2+57,pcr
  	continuar_57:
  	
  	; Casilla 3,10 (dirección 58)
  	clrb
  	; Analizar casilla 2,9 (dirección 41) 
  	lda puntero_tablero+41,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_2_9
  	incb
  	no_inc_3_10_2_9:
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_2_10
  	incb
  	no_inc_3_10_2_10:
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_2_11
  	incb
  	no_inc_3_10_2_11:
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_3_9
  	incb
  	no_inc_3_10_3_9:
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_3_11
  	incb
  	no_inc_3_10_3_11:
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_4_9
  	incb
  	no_inc_3_10_4_9:
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_4_10
  	incb
  	no_inc_3_10_4_10:
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_10_4_11
  	incb
  	no_inc_3_10_4_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+58,pcr
  	cmpa #'@
  	beq celda_viva_58
  	; Si está muerta
  	cmpb #3
  	beq nace_58
  	cmpb #6
  	beq nace_58
  	bra muere_58
  	celda_viva_58:
  	cmpb #2
  	beq vive_58
  	cmpb #3
  	beq vive_58
  	bra muere_58
  	nace_58:
  	lda #'@
  	sta puntero_tablero2+58,pcr
  	bra continuar_58
  	vive_58:
  	lda #'@
  	sta puntero_tablero2+58,pcr
  	bra continuar_58
  	muere_58:
  	lda #' 
  	sta puntero_tablero2+58,pcr
  	continuar_58:
  	
  	; Casilla 3,11 (dirección 59)
  	clrb
  	; Analizar casilla 2,10 (dirección 42) 
  	lda puntero_tablero+42,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_2_10
  	incb
  	no_inc_3_11_2_10:
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_2_11
  	incb
  	no_inc_3_11_2_11:
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_2_12
  	incb
  	no_inc_3_11_2_12:
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_3_10
  	incb
  	no_inc_3_11_3_10:
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_3_12
  	incb
  	no_inc_3_11_3_12:
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_4_10
  	incb
  	no_inc_3_11_4_10:
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_4_11
  	incb
  	no_inc_3_11_4_11:
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_11_4_12
  	incb
  	no_inc_3_11_4_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+59,pcr
  	cmpa #'@
  	beq celda_viva_59
  	; Si está muerta
  	cmpb #3
  	beq nace_59
  	cmpb #6
  	beq nace_59
  	bra muere_59
  	celda_viva_59:
  	cmpb #2
  	beq vive_59
  	cmpb #3
  	beq vive_59
  	bra muere_59
  	nace_59:
  	lda #'@
  	sta puntero_tablero2+59,pcr
  	bra continuar_59
  	vive_59:
  	lda #'@
  	sta puntero_tablero2+59,pcr
  	bra continuar_59
  	muere_59:
  	lda #' 
  	sta puntero_tablero2+59,pcr
  	continuar_59:
  	
  	; Casilla 3,12 (dirección 60)
  	clrb
  	; Analizar casilla 2,11 (dirección 43) 
  	lda puntero_tablero+43,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_2_11
  	incb
  	no_inc_3_12_2_11:
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_2_12
  	incb
  	no_inc_3_12_2_12:
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_2_13
  	incb
  	no_inc_3_12_2_13:
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_3_11
  	incb
  	no_inc_3_12_3_11:
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_3_13
  	incb
  	no_inc_3_12_3_13:
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_4_11
  	incb
  	no_inc_3_12_4_11:
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_4_12
  	incb
  	no_inc_3_12_4_12:
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_12_4_13
  	incb
  	no_inc_3_12_4_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+60,pcr
  	cmpa #'@
  	beq celda_viva_60
  	; Si está muerta
  	cmpb #3
  	beq nace_60
  	cmpb #6
  	beq nace_60
  	bra muere_60
  	celda_viva_60:
  	cmpb #2
  	beq vive_60
  	cmpb #3
  	beq vive_60
  	bra muere_60
  	nace_60:
  	lda #'@
  	sta puntero_tablero2+60,pcr
  	bra continuar_60
  	vive_60:
  	lda #'@
  	sta puntero_tablero2+60,pcr
  	bra continuar_60
  	muere_60:
  	lda #' 
  	sta puntero_tablero2+60,pcr
  	continuar_60:
  	
  	; Casilla 3,13 (dirección 61)
  	clrb
  	; Analizar casilla 2,12 (dirección 44) 
  	lda puntero_tablero+44,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_2_12
  	incb
  	no_inc_3_13_2_12:
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_2_13
  	incb
  	no_inc_3_13_2_13:
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_2_14
  	incb
  	no_inc_3_13_2_14:
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_3_12
  	incb
  	no_inc_3_13_3_12:
  	; Analizar casilla 3,14 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_3_14
  	incb
  	no_inc_3_13_3_14:
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_4_12
  	incb
  	no_inc_3_13_4_12:
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_4_13
  	incb
  	no_inc_3_13_4_13:
  	; Analizar casilla 4,14 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_13_4_14
  	incb
  	no_inc_3_13_4_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+61,pcr
  	cmpa #'@
  	beq celda_viva_61
  	; Si está muerta
  	cmpb #3
  	beq nace_61
  	cmpb #6
  	beq nace_61
  	bra muere_61
  	celda_viva_61:
  	cmpb #2
  	beq vive_61
  	cmpb #3
  	beq vive_61
  	bra muere_61
  	nace_61:
  	lda #'@
  	sta puntero_tablero2+61,pcr
  	bra continuar_61
  	vive_61:
  	lda #'@
  	sta puntero_tablero2+61,pcr
  	bra continuar_61
  	muere_61:
  	lda #' 
  	sta puntero_tablero2+61,pcr
  	continuar_61:
  	
  	; Casilla 3,14 (dirección 62)
  	clrb
  	; Analizar casilla 2,13 (dirección 45) 
  	lda puntero_tablero+45,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_2_13
  	incb
  	no_inc_3_14_2_13:
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_2_14
  	incb
  	no_inc_3_14_2_14:
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_2_15
  	incb
  	no_inc_3_14_2_15:
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_3_13
  	incb
  	no_inc_3_14_3_13:
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_3_15
  	incb
  	no_inc_3_14_3_15:
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_4_13
  	incb
  	no_inc_3_14_4_13:
  	; Analizar casilla 4,14 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_4_14
  	incb
  	no_inc_3_14_4_14:
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_14_4_15
  	incb
  	no_inc_3_14_4_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+62,pcr
  	cmpa #'@
  	beq celda_viva_62
  	; Si está muerta
  	cmpb #3
  	beq nace_62
  	cmpb #6
  	beq nace_62
  	bra muere_62
  	celda_viva_62:
  	cmpb #2
  	beq vive_62
  	cmpb #3
  	beq vive_62
  	bra muere_62
  	nace_62:
  	lda #'@
  	sta puntero_tablero2+62,pcr
  	bra continuar_62
  	vive_62:
  	lda #'@
  	sta puntero_tablero2+62,pcr
  	bra continuar_62
  	muere_62:
  	lda #' 
  	sta puntero_tablero2+62,pcr
  	continuar_62:
  	
  	; Casilla 3,15 (dirección 63)
  	clrb
  	; Analizar casilla 2,14 (dirección 46) 
  	lda puntero_tablero+46,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_2_14
  	incb
  	no_inc_3_15_2_14:
  	; Analizar casilla 2,15 (dirección 47) 
  	lda puntero_tablero+47,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_2_15
  	incb
  	no_inc_3_15_2_15:
  	; Analizar casilla 2,0 (dirección 32) 
  	lda puntero_tablero+32,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_2_0
  	incb
  	no_inc_3_15_2_0:
  	; Analizar casilla 3,14 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_3_14
  	incb
  	no_inc_3_15_3_14:
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_3_0
  	incb
  	no_inc_3_15_3_0:
  	; Analizar casilla 4,2 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_4_2
  	incb
  	no_inc_3_15_4_2:
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_4_15
  	incb
  	no_inc_3_15_4_15:
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_3_15_4_0
  	incb
  	no_inc_3_15_4_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+63,pcr
  	cmpa #'@
  	beq celda_viva_63
  	; Si está muerta
  	cmpb #3
  	beq nace_63
  	cmpb #6
  	beq nace_63
  	bra muere_63
  	celda_viva_63:
  	cmpb #2
  	beq vive_63
  	cmpb #3
  	beq vive_63
  	bra muere_63
  	nace_63:
  	lda #'@
  	sta puntero_tablero2+63,pcr
  	bra continuar_63
  	vive_63:
  	lda #'@
  	sta puntero_tablero2+63,pcr
  	bra continuar_63
  	muere_63:
  	lda #' 
  	sta puntero_tablero2+63,pcr
  	continuar_63:
  	
  	; Casilla 4,0 (dirección 64)
  	clrb
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_3_15
  	incb
  	no_inc_4_0_3_15:
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_3_0
  	incb
  	no_inc_4_0_3_0:
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_3_1
  	incb
  	no_inc_4_0_3_1:
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_4_15
  	incb
  	no_inc_4_0_4_15:
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_4_1
  	incb
  	no_inc_4_0_4_1:
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_5_15
  	incb
  	no_inc_4_0_5_15:
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_5_0
  	incb
  	no_inc_4_0_5_0:
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_0_5_1
  	incb
  	no_inc_4_0_5_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+64,pcr
  	cmpa #'@
  	beq celda_viva_64
  	; Si está muerta
  	cmpb #3
  	beq nace_64
  	cmpb #6
  	beq nace_64
  	bra muere_64
  	celda_viva_64:
  	cmpb #2
  	beq vive_64
  	cmpb #3
  	beq vive_64
  	bra muere_64
  	nace_64:
  	lda #'@
  	sta puntero_tablero2+64,pcr
  	bra continuar_64
  	vive_64:
  	lda #'@
  	sta puntero_tablero2+64,pcr
  	bra continuar_64
  	muere_64:
  	lda #' 
  	sta puntero_tablero2+64,pcr
  	continuar_64:
  	
  	; Casilla 4,1 (dirección 65)
  	clrb
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_3_0
  	incb
  	no_inc_4_1_3_0:
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_3_1
  	incb
  	no_inc_4_1_3_1:
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_3_2
  	incb
  	no_inc_4_1_3_2:
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_4_0
  	incb
  	no_inc_4_1_4_0:
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_4_2
  	incb
  	no_inc_4_1_4_2:
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_5_0
  	incb
  	no_inc_4_1_5_0:
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_5_1
  	incb
  	no_inc_4_1_5_1:
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_1_5_2
  	incb
  	no_inc_4_1_5_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+65,pcr
  	cmpa #'@
  	beq celda_viva_65
  	; Si está muerta
  	cmpb #3
  	beq nace_65
  	cmpb #6
  	beq nace_65
  	bra muere_65
  	celda_viva_65:
  	cmpb #2
  	beq vive_65
  	cmpb #3
  	beq vive_65
  	bra muere_65
  	nace_65:
  	lda #'@
  	sta puntero_tablero2+65,pcr
  	bra continuar_65
  	vive_65:
  	lda #'@
  	sta puntero_tablero2+65,pcr
  	bra continuar_65
  	muere_65:
  	lda #' 
  	sta puntero_tablero2+65,pcr
  	continuar_65:
  	
  	; Casilla 4,2 (dirección 66)
  	clrb
  	; Analizar casilla 3,1 (dirección 49) 
  	lda puntero_tablero+49,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_3_1
  	incb
  	no_inc_4_2_3_1:
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_3_2
  	incb
  	no_inc_4_2_3_2:
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_3_3
  	incb
  	no_inc_4_2_3_3:
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_4_1
  	incb
  	no_inc_4_2_4_1:
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_4_3
  	incb
  	no_inc_4_2_4_3:
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_5_1
  	incb
  	no_inc_4_2_5_1:
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_5_2
  	incb
  	no_inc_4_2_5_2:
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_2_5_3
  	incb
  	no_inc_4_2_5_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+66,pcr
  	cmpa #'@
  	beq celda_viva_66
  	; Si está muerta
  	cmpb #3
  	beq nace_66
  	cmpb #6
  	beq nace_66
  	bra muere_66
  	celda_viva_66:
  	cmpb #2
  	beq vive_66
  	cmpb #3
  	beq vive_66
  	bra muere_66
  	nace_66:
  	lda #'@
  	sta puntero_tablero2+66,pcr
  	bra continuar_66
  	vive_66:
  	lda #'@
  	sta puntero_tablero2+66,pcr
  	bra continuar_66
  	muere_66:
  	lda #' 
  	sta puntero_tablero2+66,pcr
  	continuar_66:
  	
  	; Casilla 4,3 (dirección 67)
  	clrb
  	; Analizar casilla 3,2 (dirección 50) 
  	lda puntero_tablero+50,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_3_2
  	incb
  	no_inc_4_3_3_2:
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_3_3
  	incb
  	no_inc_4_3_3_3:
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_3_4
  	incb
  	no_inc_4_3_3_4:
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_4_2
  	incb
  	no_inc_4_3_4_2:
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_4_4
  	incb
  	no_inc_4_3_4_4:
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_5_2
  	incb
  	no_inc_4_3_5_2:
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_5_3
  	incb
  	no_inc_4_3_5_3:
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_3_5_4
  	incb
  	no_inc_4_3_5_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+67,pcr
  	cmpa #'@
  	beq celda_viva_67
  	; Si está muerta
  	cmpb #3
  	beq nace_67
  	cmpb #6
  	beq nace_67
  	bra muere_67
  	celda_viva_67:
  	cmpb #2
  	beq vive_67
  	cmpb #3
  	beq vive_67
  	bra muere_67
  	nace_67:
  	lda #'@
  	sta puntero_tablero2+67,pcr
  	bra continuar_67
  	vive_67:
  	lda #'@
  	sta puntero_tablero2+67,pcr
  	bra continuar_67
  	muere_67:
  	lda #' 
  	sta puntero_tablero2+67,pcr
  	continuar_67:
  	
  	; Casilla 4,4 (dirección 68)
  	clrb
  	; Analizar casilla 3,3 (dirección 51) 
  	lda puntero_tablero+51,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_3_3
  	incb
  	no_inc_4_4_3_3:
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_3_4
  	incb
  	no_inc_4_4_3_4:
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_3_5
  	incb
  	no_inc_4_4_3_5:
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_4_3
  	incb
  	no_inc_4_4_4_3:
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_4_5
  	incb
  	no_inc_4_4_4_5:
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_5_3
  	incb
  	no_inc_4_4_5_3:
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_5_4
  	incb
  	no_inc_4_4_5_4:
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_4_5_5
  	incb
  	no_inc_4_4_5_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+68,pcr
  	cmpa #'@
  	beq celda_viva_68
  	; Si está muerta
  	cmpb #3
  	beq nace_68
  	cmpb #6
  	beq nace_68
  	bra muere_68
  	celda_viva_68:
  	cmpb #2
  	beq vive_68
  	cmpb #3
  	beq vive_68
  	bra muere_68
  	nace_68:
  	lda #'@
  	sta puntero_tablero2+68,pcr
  	bra continuar_68
  	vive_68:
  	lda #'@
  	sta puntero_tablero2+68,pcr
  	bra continuar_68
  	muere_68:
  	lda #' 
  	sta puntero_tablero2+68,pcr
  	continuar_68:
  	
  	; Casilla 4,5 (dirección 69)
  	clrb
  	; Analizar casilla 3,4 (dirección 52) 
  	lda puntero_tablero+52,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_3_4
  	incb
  	no_inc_4_5_3_4:
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_3_5
  	incb
  	no_inc_4_5_3_5:
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_3_6
  	incb
  	no_inc_4_5_3_6:
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_4_4
  	incb
  	no_inc_4_5_4_4:
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_4_6
  	incb
  	no_inc_4_5_4_6:
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_5_4
  	incb
  	no_inc_4_5_5_4:
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_5_5
  	incb
  	no_inc_4_5_5_5:
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_5_5_6
  	incb
  	no_inc_4_5_5_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+69,pcr
  	cmpa #'@
  	beq celda_viva_69
  	; Si está muerta
  	cmpb #3
  	beq nace_69
  	cmpb #6
  	beq nace_69
  	bra muere_69
  	celda_viva_69:
  	cmpb #2
  	beq vive_69
  	cmpb #3
  	beq vive_69
  	bra muere_69
  	nace_69:
  	lda #'@
  	sta puntero_tablero2+69,pcr
  	bra continuar_69
  	vive_69:
  	lda #'@
  	sta puntero_tablero2+69,pcr
  	bra continuar_69
  	muere_69:
  	lda #' 
  	sta puntero_tablero2+69,pcr
  	continuar_69:
  	
  	; Casilla 4,6 (dirección 70)
  	clrb
  	; Analizar casilla 3,5 (dirección 53) 
  	lda puntero_tablero+53,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_3_5
  	incb
  	no_inc_4_6_3_5:
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_3_6
  	incb
  	no_inc_4_6_3_6:
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_3_7
  	incb
  	no_inc_4_6_3_7:
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_4_5
  	incb
  	no_inc_4_6_4_5:
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_4_7
  	incb
  	no_inc_4_6_4_7:
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_5_5
  	incb
  	no_inc_4_6_5_5:
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_5_6
  	incb
  	no_inc_4_6_5_6:
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_6_5_7
  	incb
  	no_inc_4_6_5_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+70,pcr
  	cmpa #'@
  	beq celda_viva_70
  	; Si está muerta
  	cmpb #3
  	beq nace_70
  	cmpb #6
  	beq nace_70
  	bra muere_70
  	celda_viva_70:
  	cmpb #2
  	beq vive_70
  	cmpb #3
  	beq vive_70
  	bra muere_70
  	nace_70:
  	lda #'@
  	sta puntero_tablero2+70,pcr
  	bra continuar_70
  	vive_70:
  	lda #'@
  	sta puntero_tablero2+70,pcr
  	bra continuar_70
  	muere_70:
  	lda #' 
  	sta puntero_tablero2+70,pcr
  	continuar_70:
  	
  	; Casilla 4,7 (dirección 71)
  	clrb
  	; Analizar casilla 3,6 (dirección 54) 
  	lda puntero_tablero+54,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_3_6
  	incb
  	no_inc_4_7_3_6:
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_3_7
  	incb
  	no_inc_4_7_3_7:
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_3_8
  	incb
  	no_inc_4_7_3_8:
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_4_6
  	incb
  	no_inc_4_7_4_6:
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_4_8
  	incb
  	no_inc_4_7_4_8:
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_5_6
  	incb
  	no_inc_4_7_5_6:
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_5_7
  	incb
  	no_inc_4_7_5_7:
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_7_5_8
  	incb
  	no_inc_4_7_5_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+71,pcr
  	cmpa #'@
  	beq celda_viva_71
  	; Si está muerta
  	cmpb #3
  	beq nace_71
  	cmpb #6
  	beq nace_71
  	bra muere_71
  	celda_viva_71:
  	cmpb #2
  	beq vive_71
  	cmpb #3
  	beq vive_71
  	bra muere_71
  	nace_71:
  	lda #'@
  	sta puntero_tablero2+71,pcr
  	bra continuar_71
  	vive_71:
  	lda #'@
  	sta puntero_tablero2+71,pcr
  	bra continuar_71
  	muere_71:
  	lda #' 
  	sta puntero_tablero2+71,pcr
  	continuar_71:
  	
  	; Casilla 4,8 (dirección 72)
  	clrb
  	; Analizar casilla 3,7 (dirección 55) 
  	lda puntero_tablero+55,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_3_7
  	incb
  	no_inc_4_8_3_7:
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_3_8
  	incb
  	no_inc_4_8_3_8:
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_3_9
  	incb
  	no_inc_4_8_3_9:
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_4_7
  	incb
  	no_inc_4_8_4_7:
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_4_9
  	incb
  	no_inc_4_8_4_9:
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_5_7
  	incb
  	no_inc_4_8_5_7:
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_5_8
  	incb
  	no_inc_4_8_5_8:
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_8_5_9
  	incb
  	no_inc_4_8_5_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+72,pcr
  	cmpa #'@
  	beq celda_viva_72
  	; Si está muerta
  	cmpb #3
  	beq nace_72
  	cmpb #6
  	beq nace_72
  	bra muere_72
  	celda_viva_72:
  	cmpb #2
  	beq vive_72
  	cmpb #3
  	beq vive_72
  	bra muere_72
  	nace_72:
  	lda #'@
  	sta puntero_tablero2+72,pcr
  	bra continuar_72
  	vive_72:
  	lda #'@
  	sta puntero_tablero2+72,pcr
  	bra continuar_72
  	muere_72:
  	lda #' 
  	sta puntero_tablero2+72,pcr
  	continuar_72:
  	
  	; Casilla 4,9 (dirección 73)
  	clrb
  	; Analizar casilla 3,8 (dirección 56) 
  	lda puntero_tablero+56,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_3_8
  	incb
  	no_inc_4_9_3_8:
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_3_9
  	incb
  	no_inc_4_9_3_9:
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_3_10
  	incb
  	no_inc_4_9_3_10:
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_4_8
  	incb
  	no_inc_4_9_4_8:
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_4_10
  	incb
  	no_inc_4_9_4_10:
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_5_8
  	incb
  	no_inc_4_9_5_8:
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_5_9
  	incb
  	no_inc_4_9_5_9:
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_9_5_10
  	incb
  	no_inc_4_9_5_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+73,pcr
  	cmpa #'@
  	beq celda_viva_73
  	; Si está muerta
  	cmpb #3
  	beq nace_73
  	cmpb #6
  	beq nace_73
  	bra muere_73
  	celda_viva_73:
  	cmpb #2
  	beq vive_73
  	cmpb #3
  	beq vive_73
  	bra muere_73
  	nace_73:
  	lda #'@
  	sta puntero_tablero2+73,pcr
  	bra continuar_73
  	vive_73:
  	lda #'@
  	sta puntero_tablero2+73,pcr
  	bra continuar_73
  	muere_73:
  	lda #' 
  	sta puntero_tablero2+73,pcr
  	continuar_73:
  	
  	; Casilla 4,10 (dirección 74)
  	clrb
  	; Analizar casilla 3,9 (dirección 57) 
  	lda puntero_tablero+57,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_3_9
  	incb
  	no_inc_4_10_3_9:
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_3_10
  	incb
  	no_inc_4_10_3_10:
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_3_11
  	incb
  	no_inc_4_10_3_11:
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_4_9
  	incb
  	no_inc_4_10_4_9:
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_4_11
  	incb
  	no_inc_4_10_4_11:
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_5_9
  	incb
  	no_inc_4_10_5_9:
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_5_10
  	incb
  	no_inc_4_10_5_10:
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_10_5_11
  	incb
  	no_inc_4_10_5_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+74,pcr
  	cmpa #'@
  	beq celda_viva_74
  	; Si está muerta
  	cmpb #3
  	beq nace_74
  	cmpb #6
  	beq nace_74
  	bra muere_74
  	celda_viva_74:
  	cmpb #2
  	beq vive_74
  	cmpb #3
  	beq vive_74
  	bra muere_74
  	nace_74:
  	lda #'@
  	sta puntero_tablero2+74,pcr
  	bra continuar_74
  	vive_74:
  	lda #'@
  	sta puntero_tablero2+74,pcr
  	bra continuar_74
  	muere_74:
  	lda #' 
  	sta puntero_tablero2+74,pcr
  	continuar_74:
  	
  	; Casilla 4,11 (dirección 75)
  	clrb
  	; Analizar casilla 3,10 (dirección 58) 
  	lda puntero_tablero+58,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_3_10
  	incb
  	no_inc_4_11_3_10:
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_3_11
  	incb
  	no_inc_4_11_3_11:
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_3_12
  	incb
  	no_inc_4_11_3_12:
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_4_10
  	incb
  	no_inc_4_11_4_10:
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_4_12
  	incb
  	no_inc_4_11_4_12:
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_5_10
  	incb
  	no_inc_4_11_5_10:
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_5_11
  	incb
  	no_inc_4_11_5_11:
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_11_5_12
  	incb
  	no_inc_4_11_5_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+75,pcr
  	cmpa #'@
  	beq celda_viva_75
  	; Si está muerta
  	cmpb #3
  	beq nace_75
  	cmpb #6
  	beq nace_75
  	bra muere_75
  	celda_viva_75:
  	cmpb #2
  	beq vive_75
  	cmpb #3
  	beq vive_75
  	bra muere_75
  	nace_75:
  	lda #'@
  	sta puntero_tablero2+75,pcr
  	bra continuar_75
  	vive_75:
  	lda #'@
  	sta puntero_tablero2+75,pcr
  	bra continuar_75
  	muere_75:
  	lda #' 
  	sta puntero_tablero2+75,pcr
  	continuar_75:
  	
  	; Casilla 4,12 (dirección 76)
  	clrb
  	; Analizar casilla 3,11 (dirección 59) 
  	lda puntero_tablero+59,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_3_11
  	incb
  	no_inc_4_12_3_11:
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_3_12
  	incb
  	no_inc_4_12_3_12:
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_3_13
  	incb
  	no_inc_4_12_3_13:
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_4_11
  	incb
  	no_inc_4_12_4_11:
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_4_13
  	incb
  	no_inc_4_12_4_13:
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_5_11
  	incb
  	no_inc_4_12_5_11:
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_5_12
  	incb
  	no_inc_4_12_5_12:
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_12_5_13
  	incb
  	no_inc_4_12_5_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+76,pcr
  	cmpa #'@
  	beq celda_viva_76
  	; Si está muerta
  	cmpb #3
  	beq nace_76
  	cmpb #6
  	beq nace_76
  	bra muere_76
  	celda_viva_76:
  	cmpb #2
  	beq vive_76
  	cmpb #3
  	beq vive_76
  	bra muere_76
  	nace_76:
  	lda #'@
  	sta puntero_tablero2+76,pcr
  	bra continuar_76
  	vive_76:
  	lda #'@
  	sta puntero_tablero2+76,pcr
  	bra continuar_76
  	muere_76:
  	lda #' 
  	sta puntero_tablero2+76,pcr
  	continuar_76:
  	
  	; Casilla 4,13 (dirección 77)
  	clrb
  	; Analizar casilla 3,12 (dirección 60) 
  	lda puntero_tablero+60,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_3_12
  	incb
  	no_inc_4_13_3_12:
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_3_13
  	incb
  	no_inc_4_13_3_13:
  	; Analizar casilla 3,14 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_3_14
  	incb
  	no_inc_4_13_3_14:
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_4_12
  	incb
  	no_inc_4_13_4_12:
  	; Analizar casilla 4,14 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_4_14
  	incb
  	no_inc_4_13_4_14:
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_5_12
  	incb
  	no_inc_4_13_5_12:
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_5_13
  	incb
  	no_inc_4_13_5_13:
  	; Analizar casilla 5,14 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_13_5_14
  	incb
  	no_inc_4_13_5_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+77,pcr
  	cmpa #'@
  	beq celda_viva_77
  	; Si está muerta
  	cmpb #3
  	beq nace_77
  	cmpb #6
  	beq nace_77
  	bra muere_77
  	celda_viva_77:
  	cmpb #2
  	beq vive_77
  	cmpb #3
  	beq vive_77
  	bra muere_77
  	nace_77:
  	lda #'@
  	sta puntero_tablero2+77,pcr
  	bra continuar_77
  	vive_77:
  	lda #'@
  	sta puntero_tablero2+77,pcr
  	bra continuar_77
  	muere_77:
  	lda #' 
  	sta puntero_tablero2+77,pcr
  	continuar_77:
  	
  	; Casilla 4,14 (dirección 78)
  	clrb
  	; Analizar casilla 3,13 (dirección 61) 
  	lda puntero_tablero+61,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_3_13
  	incb
  	no_inc_4_14_3_13:
  	; Analizar casilla 3,14 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_3_14
  	incb
  	no_inc_4_14_3_14:
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_3_15
  	incb
  	no_inc_4_14_3_15:
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_4_13
  	incb
  	no_inc_4_14_4_13:
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_4_15
  	incb
  	no_inc_4_14_4_15:
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_5_13
  	incb
  	no_inc_4_14_5_13:
  	; Analizar casilla 5,14 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_5_14
  	incb
  	no_inc_4_14_5_14:
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_14_5_15
  	incb
  	no_inc_4_14_5_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+78,pcr
  	cmpa #'@
  	beq celda_viva_78
  	; Si está muerta
  	cmpb #3
  	beq nace_78
  	cmpb #6
  	beq nace_78
  	bra muere_78
  	celda_viva_78:
  	cmpb #2
  	beq vive_78
  	cmpb #3
  	beq vive_78
  	bra muere_78
  	nace_78:
  	lda #'@
  	sta puntero_tablero2+78,pcr
  	bra continuar_78
  	vive_78:
  	lda #'@
  	sta puntero_tablero2+78,pcr
  	bra continuar_78
  	muere_78:
  	lda #' 
  	sta puntero_tablero2+78,pcr
  	continuar_78:
  	
  	; Casilla 4,15 (dirección 79)
  	clrb
  	; Analizar casilla 3,14 (dirección 62) 
  	lda puntero_tablero+62,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_3_14
  	incb
  	no_inc_4_15_3_14:
  	; Analizar casilla 3,15 (dirección 63) 
  	lda puntero_tablero+63,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_3_15
  	incb
  	no_inc_4_15_3_15:
  	; Analizar casilla 3,0 (dirección 48) 
  	lda puntero_tablero+48,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_3_0
  	incb
  	no_inc_4_15_3_0:
  	; Analizar casilla 4,14 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_4_14
  	incb
  	no_inc_4_15_4_14:
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_4_0
  	incb
  	no_inc_4_15_4_0:
  	; Analizar casilla 5,4 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_5_4
  	incb
  	no_inc_4_15_5_4:
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_5_15
  	incb
  	no_inc_4_15_5_15:
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_4_15_5_0
  	incb
  	no_inc_4_15_5_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+79,pcr
  	cmpa #'@
  	beq celda_viva_79
  	; Si está muerta
  	cmpb #3
  	beq nace_79
  	cmpb #6
  	beq nace_79
  	bra muere_79
  	celda_viva_79:
  	cmpb #2
  	beq vive_79
  	cmpb #3
  	beq vive_79
  	bra muere_79
  	nace_79:
  	lda #'@
  	sta puntero_tablero2+79,pcr
  	bra continuar_79
  	vive_79:
  	lda #'@
  	sta puntero_tablero2+79,pcr
  	bra continuar_79
  	muere_79:
  	lda #' 
  	sta puntero_tablero2+79,pcr
  	continuar_79:
  	
  	; Casilla 5,0 (dirección 80)
  	clrb
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_4_15
  	incb
  	no_inc_5_0_4_15:
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_4_0
  	incb
  	no_inc_5_0_4_0:
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_4_1
  	incb
  	no_inc_5_0_4_1:
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_5_15
  	incb
  	no_inc_5_0_5_15:
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_5_1
  	incb
  	no_inc_5_0_5_1:
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_6_15
  	incb
  	no_inc_5_0_6_15:
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_6_0
  	incb
  	no_inc_5_0_6_0:
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_0_6_1
  	incb
  	no_inc_5_0_6_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+80,pcr
  	cmpa #'@
  	beq celda_viva_80
  	; Si está muerta
  	cmpb #3
  	beq nace_80
  	cmpb #6
  	beq nace_80
  	bra muere_80
  	celda_viva_80:
  	cmpb #2
  	beq vive_80
  	cmpb #3
  	beq vive_80
  	bra muere_80
  	nace_80:
  	lda #'@
  	sta puntero_tablero2+80,pcr
  	bra continuar_80
  	vive_80:
  	lda #'@
  	sta puntero_tablero2+80,pcr
  	bra continuar_80
  	muere_80:
  	lda #' 
  	sta puntero_tablero2+80,pcr
  	continuar_80:
  	
  	; Casilla 5,1 (dirección 81)
  	clrb
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_4_0
  	incb
  	no_inc_5_1_4_0:
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_4_1
  	incb
  	no_inc_5_1_4_1:
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_4_2
  	incb
  	no_inc_5_1_4_2:
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_5_0
  	incb
  	no_inc_5_1_5_0:
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_5_2
  	incb
  	no_inc_5_1_5_2:
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_6_0
  	incb
  	no_inc_5_1_6_0:
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_6_1
  	incb
  	no_inc_5_1_6_1:
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_1_6_2
  	incb
  	no_inc_5_1_6_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+81,pcr
  	cmpa #'@
  	beq celda_viva_81
  	; Si está muerta
  	cmpb #3
  	beq nace_81
  	cmpb #6
  	beq nace_81
  	bra muere_81
  	celda_viva_81:
  	cmpb #2
  	beq vive_81
  	cmpb #3
  	beq vive_81
  	bra muere_81
  	nace_81:
  	lda #'@
  	sta puntero_tablero2+81,pcr
  	bra continuar_81
  	vive_81:
  	lda #'@
  	sta puntero_tablero2+81,pcr
  	bra continuar_81
  	muere_81:
  	lda #' 
  	sta puntero_tablero2+81,pcr
  	continuar_81:
  	
  	; Casilla 5,2 (dirección 82)
  	clrb
  	; Analizar casilla 4,1 (dirección 65) 
  	lda puntero_tablero+65,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_4_1
  	incb
  	no_inc_5_2_4_1:
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_4_2
  	incb
  	no_inc_5_2_4_2:
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_4_3
  	incb
  	no_inc_5_2_4_3:
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_5_1
  	incb
  	no_inc_5_2_5_1:
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_5_3
  	incb
  	no_inc_5_2_5_3:
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_6_1
  	incb
  	no_inc_5_2_6_1:
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_6_2
  	incb
  	no_inc_5_2_6_2:
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_2_6_3
  	incb
  	no_inc_5_2_6_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+82,pcr
  	cmpa #'@
  	beq celda_viva_82
  	; Si está muerta
  	cmpb #3
  	beq nace_82
  	cmpb #6
  	beq nace_82
  	bra muere_82
  	celda_viva_82:
  	cmpb #2
  	beq vive_82
  	cmpb #3
  	beq vive_82
  	bra muere_82
  	nace_82:
  	lda #'@
  	sta puntero_tablero2+82,pcr
  	bra continuar_82
  	vive_82:
  	lda #'@
  	sta puntero_tablero2+82,pcr
  	bra continuar_82
  	muere_82:
  	lda #' 
  	sta puntero_tablero2+82,pcr
  	continuar_82:
  	
  	; Casilla 5,3 (dirección 83)
  	clrb
  	; Analizar casilla 4,2 (dirección 66) 
  	lda puntero_tablero+66,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_4_2
  	incb
  	no_inc_5_3_4_2:
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_4_3
  	incb
  	no_inc_5_3_4_3:
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_4_4
  	incb
  	no_inc_5_3_4_4:
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_5_2
  	incb
  	no_inc_5_3_5_2:
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_5_4
  	incb
  	no_inc_5_3_5_4:
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_6_2
  	incb
  	no_inc_5_3_6_2:
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_6_3
  	incb
  	no_inc_5_3_6_3:
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_3_6_4
  	incb
  	no_inc_5_3_6_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+83,pcr
  	cmpa #'@
  	beq celda_viva_83
  	; Si está muerta
  	cmpb #3
  	beq nace_83
  	cmpb #6
  	beq nace_83
  	bra muere_83
  	celda_viva_83:
  	cmpb #2
  	beq vive_83
  	cmpb #3
  	beq vive_83
  	bra muere_83
  	nace_83:
  	lda #'@
  	sta puntero_tablero2+83,pcr
  	bra continuar_83
  	vive_83:
  	lda #'@
  	sta puntero_tablero2+83,pcr
  	bra continuar_83
  	muere_83:
  	lda #' 
  	sta puntero_tablero2+83,pcr
  	continuar_83:
  	
  	; Casilla 5,4 (dirección 84)
  	clrb
  	; Analizar casilla 4,3 (dirección 67) 
  	lda puntero_tablero+67,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_4_3
  	incb
  	no_inc_5_4_4_3:
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_4_4
  	incb
  	no_inc_5_4_4_4:
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_4_5
  	incb
  	no_inc_5_4_4_5:
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_5_3
  	incb
  	no_inc_5_4_5_3:
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_5_5
  	incb
  	no_inc_5_4_5_5:
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_6_3
  	incb
  	no_inc_5_4_6_3:
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_6_4
  	incb
  	no_inc_5_4_6_4:
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_4_6_5
  	incb
  	no_inc_5_4_6_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+84,pcr
  	cmpa #'@
  	beq celda_viva_84
  	; Si está muerta
  	cmpb #3
  	beq nace_84
  	cmpb #6
  	beq nace_84
  	bra muere_84
  	celda_viva_84:
  	cmpb #2
  	beq vive_84
  	cmpb #3
  	beq vive_84
  	bra muere_84
  	nace_84:
  	lda #'@
  	sta puntero_tablero2+84,pcr
  	bra continuar_84
  	vive_84:
  	lda #'@
  	sta puntero_tablero2+84,pcr
  	bra continuar_84
  	muere_84:
  	lda #' 
  	sta puntero_tablero2+84,pcr
  	continuar_84:
  	
  	; Casilla 5,5 (dirección 85)
  	clrb
  	; Analizar casilla 4,4 (dirección 68) 
  	lda puntero_tablero+68,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_4_4
  	incb
  	no_inc_5_5_4_4:
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_4_5
  	incb
  	no_inc_5_5_4_5:
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_4_6
  	incb
  	no_inc_5_5_4_6:
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_5_4
  	incb
  	no_inc_5_5_5_4:
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_5_6
  	incb
  	no_inc_5_5_5_6:
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_6_4
  	incb
  	no_inc_5_5_6_4:
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_6_5
  	incb
  	no_inc_5_5_6_5:
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_5_6_6
  	incb
  	no_inc_5_5_6_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+85,pcr
  	cmpa #'@
  	beq celda_viva_85
  	; Si está muerta
  	cmpb #3
  	beq nace_85
  	cmpb #6
  	beq nace_85
  	bra muere_85
  	celda_viva_85:
  	cmpb #2
  	beq vive_85
  	cmpb #3
  	beq vive_85
  	bra muere_85
  	nace_85:
  	lda #'@
  	sta puntero_tablero2+85,pcr
  	bra continuar_85
  	vive_85:
  	lda #'@
  	sta puntero_tablero2+85,pcr
  	bra continuar_85
  	muere_85:
  	lda #' 
  	sta puntero_tablero2+85,pcr
  	continuar_85:
  	
  	; Casilla 5,6 (dirección 86)
  	clrb
  	; Analizar casilla 4,5 (dirección 69) 
  	lda puntero_tablero+69,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_4_5
  	incb
  	no_inc_5_6_4_5:
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_4_6
  	incb
  	no_inc_5_6_4_6:
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_4_7
  	incb
  	no_inc_5_6_4_7:
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_5_5
  	incb
  	no_inc_5_6_5_5:
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_5_7
  	incb
  	no_inc_5_6_5_7:
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_6_5
  	incb
  	no_inc_5_6_6_5:
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_6_6
  	incb
  	no_inc_5_6_6_6:
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_6_6_7
  	incb
  	no_inc_5_6_6_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+86,pcr
  	cmpa #'@
  	beq celda_viva_86
  	; Si está muerta
  	cmpb #3
  	beq nace_86
  	cmpb #6
  	beq nace_86
  	bra muere_86
  	celda_viva_86:
  	cmpb #2
  	beq vive_86
  	cmpb #3
  	beq vive_86
  	bra muere_86
  	nace_86:
  	lda #'@
  	sta puntero_tablero2+86,pcr
  	bra continuar_86
  	vive_86:
  	lda #'@
  	sta puntero_tablero2+86,pcr
  	bra continuar_86
  	muere_86:
  	lda #' 
  	sta puntero_tablero2+86,pcr
  	continuar_86:
  	
  	; Casilla 5,7 (dirección 87)
  	clrb
  	; Analizar casilla 4,6 (dirección 70) 
  	lda puntero_tablero+70,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_4_6
  	incb
  	no_inc_5_7_4_6:
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_4_7
  	incb
  	no_inc_5_7_4_7:
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_4_8
  	incb
  	no_inc_5_7_4_8:
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_5_6
  	incb
  	no_inc_5_7_5_6:
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_5_8
  	incb
  	no_inc_5_7_5_8:
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_6_6
  	incb
  	no_inc_5_7_6_6:
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_6_7
  	incb
  	no_inc_5_7_6_7:
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_7_6_8
  	incb
  	no_inc_5_7_6_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+87,pcr
  	cmpa #'@
  	beq celda_viva_87
  	; Si está muerta
  	cmpb #3
  	beq nace_87
  	cmpb #6
  	beq nace_87
  	bra muere_87
  	celda_viva_87:
  	cmpb #2
  	beq vive_87
  	cmpb #3
  	beq vive_87
  	bra muere_87
  	nace_87:
  	lda #'@
  	sta puntero_tablero2+87,pcr
  	bra continuar_87
  	vive_87:
  	lda #'@
  	sta puntero_tablero2+87,pcr
  	bra continuar_87
  	muere_87:
  	lda #' 
  	sta puntero_tablero2+87,pcr
  	continuar_87:
  	
  	; Casilla 5,8 (dirección 88)
  	clrb
  	; Analizar casilla 4,7 (dirección 71) 
  	lda puntero_tablero+71,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_4_7
  	incb
  	no_inc_5_8_4_7:
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_4_8
  	incb
  	no_inc_5_8_4_8:
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_4_9
  	incb
  	no_inc_5_8_4_9:
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_5_7
  	incb
  	no_inc_5_8_5_7:
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_5_9
  	incb
  	no_inc_5_8_5_9:
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_6_7
  	incb
  	no_inc_5_8_6_7:
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_6_8
  	incb
  	no_inc_5_8_6_8:
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_8_6_9
  	incb
  	no_inc_5_8_6_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+88,pcr
  	cmpa #'@
  	beq celda_viva_88
  	; Si está muerta
  	cmpb #3
  	beq nace_88
  	cmpb #6
  	beq nace_88
  	bra muere_88
  	celda_viva_88:
  	cmpb #2
  	beq vive_88
  	cmpb #3
  	beq vive_88
  	bra muere_88
  	nace_88:
  	lda #'@
  	sta puntero_tablero2+88,pcr
  	bra continuar_88
  	vive_88:
  	lda #'@
  	sta puntero_tablero2+88,pcr
  	bra continuar_88
  	muere_88:
  	lda #' 
  	sta puntero_tablero2+88,pcr
  	continuar_88:
  	
  	; Casilla 5,9 (dirección 89)
  	clrb
  	; Analizar casilla 4,8 (dirección 72) 
  	lda puntero_tablero+72,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_4_8
  	incb
  	no_inc_5_9_4_8:
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_4_9
  	incb
  	no_inc_5_9_4_9:
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_4_10
  	incb
  	no_inc_5_9_4_10:
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_5_8
  	incb
  	no_inc_5_9_5_8:
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_5_10
  	incb
  	no_inc_5_9_5_10:
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_6_8
  	incb
  	no_inc_5_9_6_8:
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_6_9
  	incb
  	no_inc_5_9_6_9:
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_9_6_10
  	incb
  	no_inc_5_9_6_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+89,pcr
  	cmpa #'@
  	beq celda_viva_89
  	; Si está muerta
  	cmpb #3
  	beq nace_89
  	cmpb #6
  	beq nace_89
  	bra muere_89
  	celda_viva_89:
  	cmpb #2
  	beq vive_89
  	cmpb #3
  	beq vive_89
  	bra muere_89
  	nace_89:
  	lda #'@
  	sta puntero_tablero2+89,pcr
  	bra continuar_89
  	vive_89:
  	lda #'@
  	sta puntero_tablero2+89,pcr
  	bra continuar_89
  	muere_89:
  	lda #' 
  	sta puntero_tablero2+89,pcr
  	continuar_89:
  	
  	; Casilla 5,10 (dirección 90)
  	clrb
  	; Analizar casilla 4,9 (dirección 73) 
  	lda puntero_tablero+73,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_4_9
  	incb
  	no_inc_5_10_4_9:
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_4_10
  	incb
  	no_inc_5_10_4_10:
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_4_11
  	incb
  	no_inc_5_10_4_11:
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_5_9
  	incb
  	no_inc_5_10_5_9:
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_5_11
  	incb
  	no_inc_5_10_5_11:
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_6_9
  	incb
  	no_inc_5_10_6_9:
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_6_10
  	incb
  	no_inc_5_10_6_10:
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_10_6_11
  	incb
  	no_inc_5_10_6_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+90,pcr
  	cmpa #'@
  	beq celda_viva_90
  	; Si está muerta
  	cmpb #3
  	beq nace_90
  	cmpb #6
  	beq nace_90
  	bra muere_90
  	celda_viva_90:
  	cmpb #2
  	beq vive_90
  	cmpb #3
  	beq vive_90
  	bra muere_90
  	nace_90:
  	lda #'@
  	sta puntero_tablero2+90,pcr
  	bra continuar_90
  	vive_90:
  	lda #'@
  	sta puntero_tablero2+90,pcr
  	bra continuar_90
  	muere_90:
  	lda #' 
  	sta puntero_tablero2+90,pcr
  	continuar_90:
  	
  	; Casilla 5,11 (dirección 91)
  	clrb
  	; Analizar casilla 4,10 (dirección 74) 
  	lda puntero_tablero+74,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_4_10
  	incb
  	no_inc_5_11_4_10:
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_4_11
  	incb
  	no_inc_5_11_4_11:
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_4_12
  	incb
  	no_inc_5_11_4_12:
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_5_10
  	incb
  	no_inc_5_11_5_10:
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_5_12
  	incb
  	no_inc_5_11_5_12:
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_6_10
  	incb
  	no_inc_5_11_6_10:
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_6_11
  	incb
  	no_inc_5_11_6_11:
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_11_6_12
  	incb
  	no_inc_5_11_6_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+91,pcr
  	cmpa #'@
  	beq celda_viva_91
  	; Si está muerta
  	cmpb #3
  	beq nace_91
  	cmpb #6
  	beq nace_91
  	bra muere_91
  	celda_viva_91:
  	cmpb #2
  	beq vive_91
  	cmpb #3
  	beq vive_91
  	bra muere_91
  	nace_91:
  	lda #'@
  	sta puntero_tablero2+91,pcr
  	bra continuar_91
  	vive_91:
  	lda #'@
  	sta puntero_tablero2+91,pcr
  	bra continuar_91
  	muere_91:
  	lda #' 
  	sta puntero_tablero2+91,pcr
  	continuar_91:
  	
  	; Casilla 5,12 (dirección 92)
  	clrb
  	; Analizar casilla 4,11 (dirección 75) 
  	lda puntero_tablero+75,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_4_11
  	incb
  	no_inc_5_12_4_11:
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_4_12
  	incb
  	no_inc_5_12_4_12:
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_4_13
  	incb
  	no_inc_5_12_4_13:
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_5_11
  	incb
  	no_inc_5_12_5_11:
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_5_13
  	incb
  	no_inc_5_12_5_13:
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_6_11
  	incb
  	no_inc_5_12_6_11:
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_6_12
  	incb
  	no_inc_5_12_6_12:
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_12_6_13
  	incb
  	no_inc_5_12_6_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+92,pcr
  	cmpa #'@
  	beq celda_viva_92
  	; Si está muerta
  	cmpb #3
  	beq nace_92
  	cmpb #6
  	beq nace_92
  	bra muere_92
  	celda_viva_92:
  	cmpb #2
  	beq vive_92
  	cmpb #3
  	beq vive_92
  	bra muere_92
  	nace_92:
  	lda #'@
  	sta puntero_tablero2+92,pcr
  	bra continuar_92
  	vive_92:
  	lda #'@
  	sta puntero_tablero2+92,pcr
  	bra continuar_92
  	muere_92:
  	lda #' 
  	sta puntero_tablero2+92,pcr
  	continuar_92:
  	
  	; Casilla 5,13 (dirección 93)
  	clrb
  	; Analizar casilla 4,12 (dirección 76) 
  	lda puntero_tablero+76,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_4_12
  	incb
  	no_inc_5_13_4_12:
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_4_13
  	incb
  	no_inc_5_13_4_13:
  	; Analizar casilla 4,14 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_4_14
  	incb
  	no_inc_5_13_4_14:
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_5_12
  	incb
  	no_inc_5_13_5_12:
  	; Analizar casilla 5,14 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_5_14
  	incb
  	no_inc_5_13_5_14:
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_6_12
  	incb
  	no_inc_5_13_6_12:
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_6_13
  	incb
  	no_inc_5_13_6_13:
  	; Analizar casilla 6,14 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_13_6_14
  	incb
  	no_inc_5_13_6_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+93,pcr
  	cmpa #'@
  	beq celda_viva_93
  	; Si está muerta
  	cmpb #3
  	beq nace_93
  	cmpb #6
  	beq nace_93
  	bra muere_93
  	celda_viva_93:
  	cmpb #2
  	beq vive_93
  	cmpb #3
  	beq vive_93
  	bra muere_93
  	nace_93:
  	lda #'@
  	sta puntero_tablero2+93,pcr
  	bra continuar_93
  	vive_93:
  	lda #'@
  	sta puntero_tablero2+93,pcr
  	bra continuar_93
  	muere_93:
  	lda #' 
  	sta puntero_tablero2+93,pcr
  	continuar_93:
  	
  	; Casilla 5,14 (dirección 94)
  	clrb
  	; Analizar casilla 4,13 (dirección 77) 
  	lda puntero_tablero+77,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_4_13
  	incb
  	no_inc_5_14_4_13:
  	; Analizar casilla 4,14 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_4_14
  	incb
  	no_inc_5_14_4_14:
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_4_15
  	incb
  	no_inc_5_14_4_15:
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_5_13
  	incb
  	no_inc_5_14_5_13:
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_5_15
  	incb
  	no_inc_5_14_5_15:
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_6_13
  	incb
  	no_inc_5_14_6_13:
  	; Analizar casilla 6,14 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_6_14
  	incb
  	no_inc_5_14_6_14:
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_14_6_15
  	incb
  	no_inc_5_14_6_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+94,pcr
  	cmpa #'@
  	beq celda_viva_94
  	; Si está muerta
  	cmpb #3
  	beq nace_94
  	cmpb #6
  	beq nace_94
  	bra muere_94
  	celda_viva_94:
  	cmpb #2
  	beq vive_94
  	cmpb #3
  	beq vive_94
  	bra muere_94
  	nace_94:
  	lda #'@
  	sta puntero_tablero2+94,pcr
  	bra continuar_94
  	vive_94:
  	lda #'@
  	sta puntero_tablero2+94,pcr
  	bra continuar_94
  	muere_94:
  	lda #' 
  	sta puntero_tablero2+94,pcr
  	continuar_94:
  	
  	; Casilla 5,15 (dirección 95)
  	clrb
  	; Analizar casilla 4,14 (dirección 78) 
  	lda puntero_tablero+78,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_4_14
  	incb
  	no_inc_5_15_4_14:
  	; Analizar casilla 4,15 (dirección 79) 
  	lda puntero_tablero+79,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_4_15
  	incb
  	no_inc_5_15_4_15:
  	; Analizar casilla 4,0 (dirección 64) 
  	lda puntero_tablero+64,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_4_0
  	incb
  	no_inc_5_15_4_0:
  	; Analizar casilla 5,14 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_5_14
  	incb
  	no_inc_5_15_5_14:
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_5_0
  	incb
  	no_inc_5_15_5_0:
  	; Analizar casilla 6,2 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_6_2
  	incb
  	no_inc_5_15_6_2:
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_6_15
  	incb
  	no_inc_5_15_6_15:
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_5_15_6_0
  	incb
  	no_inc_5_15_6_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+95,pcr
  	cmpa #'@
  	beq celda_viva_95
  	; Si está muerta
  	cmpb #3
  	beq nace_95
  	cmpb #6
  	beq nace_95
  	bra muere_95
  	celda_viva_95:
  	cmpb #2
  	beq vive_95
  	cmpb #3
  	beq vive_95
  	bra muere_95
  	nace_95:
  	lda #'@
  	sta puntero_tablero2+95,pcr
  	bra continuar_95
  	vive_95:
  	lda #'@
  	sta puntero_tablero2+95,pcr
  	bra continuar_95
  	muere_95:
  	lda #' 
  	sta puntero_tablero2+95,pcr
  	continuar_95:
  	
  	; Casilla 6,0 (dirección 96)
  	clrb
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_5_15
  	incb
  	no_inc_6_0_5_15:
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_5_0
  	incb
  	no_inc_6_0_5_0:
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_5_1
  	incb
  	no_inc_6_0_5_1:
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_6_15
  	incb
  	no_inc_6_0_6_15:
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_6_1
  	incb
  	no_inc_6_0_6_1:
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_7_15
  	incb
  	no_inc_6_0_7_15:
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_7_0
  	incb
  	no_inc_6_0_7_0:
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_0_7_1
  	incb
  	no_inc_6_0_7_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+96,pcr
  	cmpa #'@
  	beq celda_viva_96
  	; Si está muerta
  	cmpb #3
  	beq nace_96
  	cmpb #6
  	beq nace_96
  	bra muere_96
  	celda_viva_96:
  	cmpb #2
  	beq vive_96
  	cmpb #3
  	beq vive_96
  	bra muere_96
  	nace_96:
  	lda #'@
  	sta puntero_tablero2+96,pcr
  	bra continuar_96
  	vive_96:
  	lda #'@
  	sta puntero_tablero2+96,pcr
  	bra continuar_96
  	muere_96:
  	lda #' 
  	sta puntero_tablero2+96,pcr
  	continuar_96:
  	
  	; Casilla 6,1 (dirección 97)
  	clrb
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_5_0
  	incb
  	no_inc_6_1_5_0:
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_5_1
  	incb
  	no_inc_6_1_5_1:
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_5_2
  	incb
  	no_inc_6_1_5_2:
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_6_0
  	incb
  	no_inc_6_1_6_0:
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_6_2
  	incb
  	no_inc_6_1_6_2:
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_7_0
  	incb
  	no_inc_6_1_7_0:
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_7_1
  	incb
  	no_inc_6_1_7_1:
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_1_7_2
  	incb
  	no_inc_6_1_7_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+97,pcr
  	cmpa #'@
  	beq celda_viva_97
  	; Si está muerta
  	cmpb #3
  	beq nace_97
  	cmpb #6
  	beq nace_97
  	bra muere_97
  	celda_viva_97:
  	cmpb #2
  	beq vive_97
  	cmpb #3
  	beq vive_97
  	bra muere_97
  	nace_97:
  	lda #'@
  	sta puntero_tablero2+97,pcr
  	bra continuar_97
  	vive_97:
  	lda #'@
  	sta puntero_tablero2+97,pcr
  	bra continuar_97
  	muere_97:
  	lda #' 
  	sta puntero_tablero2+97,pcr
  	continuar_97:
  	
  	; Casilla 6,2 (dirección 98)
  	clrb
  	; Analizar casilla 5,1 (dirección 81) 
  	lda puntero_tablero+81,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_5_1
  	incb
  	no_inc_6_2_5_1:
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_5_2
  	incb
  	no_inc_6_2_5_2:
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_5_3
  	incb
  	no_inc_6_2_5_3:
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_6_1
  	incb
  	no_inc_6_2_6_1:
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_6_3
  	incb
  	no_inc_6_2_6_3:
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_7_1
  	incb
  	no_inc_6_2_7_1:
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_7_2
  	incb
  	no_inc_6_2_7_2:
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_2_7_3
  	incb
  	no_inc_6_2_7_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+98,pcr
  	cmpa #'@
  	beq celda_viva_98
  	; Si está muerta
  	cmpb #3
  	beq nace_98
  	cmpb #6
  	beq nace_98
  	bra muere_98
  	celda_viva_98:
  	cmpb #2
  	beq vive_98
  	cmpb #3
  	beq vive_98
  	bra muere_98
  	nace_98:
  	lda #'@
  	sta puntero_tablero2+98,pcr
  	bra continuar_98
  	vive_98:
  	lda #'@
  	sta puntero_tablero2+98,pcr
  	bra continuar_98
  	muere_98:
  	lda #' 
  	sta puntero_tablero2+98,pcr
  	continuar_98:
  	
  	; Casilla 6,3 (dirección 99)
  	clrb
  	; Analizar casilla 5,2 (dirección 82) 
  	lda puntero_tablero+82,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_5_2
  	incb
  	no_inc_6_3_5_2:
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_5_3
  	incb
  	no_inc_6_3_5_3:
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_5_4
  	incb
  	no_inc_6_3_5_4:
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_6_2
  	incb
  	no_inc_6_3_6_2:
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_6_4
  	incb
  	no_inc_6_3_6_4:
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_7_2
  	incb
  	no_inc_6_3_7_2:
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_7_3
  	incb
  	no_inc_6_3_7_3:
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_3_7_4
  	incb
  	no_inc_6_3_7_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+99,pcr
  	cmpa #'@
  	beq celda_viva_99
  	; Si está muerta
  	cmpb #3
  	beq nace_99
  	cmpb #6
  	beq nace_99
  	bra muere_99
  	celda_viva_99:
  	cmpb #2
  	beq vive_99
  	cmpb #3
  	beq vive_99
  	bra muere_99
  	nace_99:
  	lda #'@
  	sta puntero_tablero2+99,pcr
  	bra continuar_99
  	vive_99:
  	lda #'@
  	sta puntero_tablero2+99,pcr
  	bra continuar_99
  	muere_99:
  	lda #' 
  	sta puntero_tablero2+99,pcr
  	continuar_99:
  	
  	; Casilla 6,4 (dirección 100)
  	clrb
  	; Analizar casilla 5,3 (dirección 83) 
  	lda puntero_tablero+83,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_5_3
  	incb
  	no_inc_6_4_5_3:
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_5_4
  	incb
  	no_inc_6_4_5_4:
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_5_5
  	incb
  	no_inc_6_4_5_5:
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_6_3
  	incb
  	no_inc_6_4_6_3:
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_6_5
  	incb
  	no_inc_6_4_6_5:
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_7_3
  	incb
  	no_inc_6_4_7_3:
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_7_4
  	incb
  	no_inc_6_4_7_4:
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_4_7_5
  	incb
  	no_inc_6_4_7_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+100,pcr
  	cmpa #'@
  	beq celda_viva_100
  	; Si está muerta
  	cmpb #3
  	beq nace_100
  	cmpb #6
  	beq nace_100
  	bra muere_100
  	celda_viva_100:
  	cmpb #2
  	beq vive_100
  	cmpb #3
  	beq vive_100
  	bra muere_100
  	nace_100:
  	lda #'@
  	sta puntero_tablero2+100,pcr
  	bra continuar_100
  	vive_100:
  	lda #'@
  	sta puntero_tablero2+100,pcr
  	bra continuar_100
  	muere_100:
  	lda #' 
  	sta puntero_tablero2+100,pcr
  	continuar_100:
  	
  	; Casilla 6,5 (dirección 101)
  	clrb
  	; Analizar casilla 5,4 (dirección 84) 
  	lda puntero_tablero+84,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_5_4
  	incb
  	no_inc_6_5_5_4:
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_5_5
  	incb
  	no_inc_6_5_5_5:
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_5_6
  	incb
  	no_inc_6_5_5_6:
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_6_4
  	incb
  	no_inc_6_5_6_4:
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_6_6
  	incb
  	no_inc_6_5_6_6:
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_7_4
  	incb
  	no_inc_6_5_7_4:
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_7_5
  	incb
  	no_inc_6_5_7_5:
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_5_7_6
  	incb
  	no_inc_6_5_7_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+101,pcr
  	cmpa #'@
  	beq celda_viva_101
  	; Si está muerta
  	cmpb #3
  	beq nace_101
  	cmpb #6
  	beq nace_101
  	bra muere_101
  	celda_viva_101:
  	cmpb #2
  	beq vive_101
  	cmpb #3
  	beq vive_101
  	bra muere_101
  	nace_101:
  	lda #'@
  	sta puntero_tablero2+101,pcr
  	bra continuar_101
  	vive_101:
  	lda #'@
  	sta puntero_tablero2+101,pcr
  	bra continuar_101
  	muere_101:
  	lda #' 
  	sta puntero_tablero2+101,pcr
  	continuar_101:
  	
  	; Casilla 6,6 (dirección 102)
  	clrb
  	; Analizar casilla 5,5 (dirección 85) 
  	lda puntero_tablero+85,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_5_5
  	incb
  	no_inc_6_6_5_5:
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_5_6
  	incb
  	no_inc_6_6_5_6:
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_5_7
  	incb
  	no_inc_6_6_5_7:
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_6_5
  	incb
  	no_inc_6_6_6_5:
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_6_7
  	incb
  	no_inc_6_6_6_7:
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_7_5
  	incb
  	no_inc_6_6_7_5:
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_7_6
  	incb
  	no_inc_6_6_7_6:
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_6_7_7
  	incb
  	no_inc_6_6_7_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+102,pcr
  	cmpa #'@
  	beq celda_viva_102
  	; Si está muerta
  	cmpb #3
  	beq nace_102
  	cmpb #6
  	beq nace_102
  	bra muere_102
  	celda_viva_102:
  	cmpb #2
  	beq vive_102
  	cmpb #3
  	beq vive_102
  	bra muere_102
  	nace_102:
  	lda #'@
  	sta puntero_tablero2+102,pcr
  	bra continuar_102
  	vive_102:
  	lda #'@
  	sta puntero_tablero2+102,pcr
  	bra continuar_102
  	muere_102:
  	lda #' 
  	sta puntero_tablero2+102,pcr
  	continuar_102:
  	
  	; Casilla 6,7 (dirección 103)
  	clrb
  	; Analizar casilla 5,6 (dirección 86) 
  	lda puntero_tablero+86,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_5_6
  	incb
  	no_inc_6_7_5_6:
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_5_7
  	incb
  	no_inc_6_7_5_7:
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_5_8
  	incb
  	no_inc_6_7_5_8:
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_6_6
  	incb
  	no_inc_6_7_6_6:
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_6_8
  	incb
  	no_inc_6_7_6_8:
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_7_6
  	incb
  	no_inc_6_7_7_6:
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_7_7
  	incb
  	no_inc_6_7_7_7:
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_7_7_8
  	incb
  	no_inc_6_7_7_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+103,pcr
  	cmpa #'@
  	beq celda_viva_103
  	; Si está muerta
  	cmpb #3
  	beq nace_103
  	cmpb #6
  	beq nace_103
  	bra muere_103
  	celda_viva_103:
  	cmpb #2
  	beq vive_103
  	cmpb #3
  	beq vive_103
  	bra muere_103
  	nace_103:
  	lda #'@
  	sta puntero_tablero2+103,pcr
  	bra continuar_103
  	vive_103:
  	lda #'@
  	sta puntero_tablero2+103,pcr
  	bra continuar_103
  	muere_103:
  	lda #' 
  	sta puntero_tablero2+103,pcr
  	continuar_103:
  	
  	; Casilla 6,8 (dirección 104)
  	clrb
  	; Analizar casilla 5,7 (dirección 87) 
  	lda puntero_tablero+87,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_5_7
  	incb
  	no_inc_6_8_5_7:
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_5_8
  	incb
  	no_inc_6_8_5_8:
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_5_9
  	incb
  	no_inc_6_8_5_9:
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_6_7
  	incb
  	no_inc_6_8_6_7:
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_6_9
  	incb
  	no_inc_6_8_6_9:
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_7_7
  	incb
  	no_inc_6_8_7_7:
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_7_8
  	incb
  	no_inc_6_8_7_8:
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_8_7_9
  	incb
  	no_inc_6_8_7_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+104,pcr
  	cmpa #'@
  	beq celda_viva_104
  	; Si está muerta
  	cmpb #3
  	beq nace_104
  	cmpb #6
  	beq nace_104
  	bra muere_104
  	celda_viva_104:
  	cmpb #2
  	beq vive_104
  	cmpb #3
  	beq vive_104
  	bra muere_104
  	nace_104:
  	lda #'@
  	sta puntero_tablero2+104,pcr
  	bra continuar_104
  	vive_104:
  	lda #'@
  	sta puntero_tablero2+104,pcr
  	bra continuar_104
  	muere_104:
  	lda #' 
  	sta puntero_tablero2+104,pcr
  	continuar_104:
  	
  	; Casilla 6,9 (dirección 105)
  	clrb
  	; Analizar casilla 5,8 (dirección 88) 
  	lda puntero_tablero+88,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_5_8
  	incb
  	no_inc_6_9_5_8:
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_5_9
  	incb
  	no_inc_6_9_5_9:
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_5_10
  	incb
  	no_inc_6_9_5_10:
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_6_8
  	incb
  	no_inc_6_9_6_8:
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_6_10
  	incb
  	no_inc_6_9_6_10:
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_7_8
  	incb
  	no_inc_6_9_7_8:
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_7_9
  	incb
  	no_inc_6_9_7_9:
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_9_7_10
  	incb
  	no_inc_6_9_7_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+105,pcr
  	cmpa #'@
  	beq celda_viva_105
  	; Si está muerta
  	cmpb #3
  	beq nace_105
  	cmpb #6
  	beq nace_105
  	bra muere_105
  	celda_viva_105:
  	cmpb #2
  	beq vive_105
  	cmpb #3
  	beq vive_105
  	bra muere_105
  	nace_105:
  	lda #'@
  	sta puntero_tablero2+105,pcr
  	bra continuar_105
  	vive_105:
  	lda #'@
  	sta puntero_tablero2+105,pcr
  	bra continuar_105
  	muere_105:
  	lda #' 
  	sta puntero_tablero2+105,pcr
  	continuar_105:
  	
  	; Casilla 6,10 (dirección 106)
  	clrb
  	; Analizar casilla 5,9 (dirección 89) 
  	lda puntero_tablero+89,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_5_9
  	incb
  	no_inc_6_10_5_9:
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_5_10
  	incb
  	no_inc_6_10_5_10:
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_5_11
  	incb
  	no_inc_6_10_5_11:
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_6_9
  	incb
  	no_inc_6_10_6_9:
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_6_11
  	incb
  	no_inc_6_10_6_11:
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_7_9
  	incb
  	no_inc_6_10_7_9:
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_7_10
  	incb
  	no_inc_6_10_7_10:
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_10_7_11
  	incb
  	no_inc_6_10_7_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+106,pcr
  	cmpa #'@
  	beq celda_viva_106
  	; Si está muerta
  	cmpb #3
  	beq nace_106
  	cmpb #6
  	beq nace_106
  	bra muere_106
  	celda_viva_106:
  	cmpb #2
  	beq vive_106
  	cmpb #3
  	beq vive_106
  	bra muere_106
  	nace_106:
  	lda #'@
  	sta puntero_tablero2+106,pcr
  	bra continuar_106
  	vive_106:
  	lda #'@
  	sta puntero_tablero2+106,pcr
  	bra continuar_106
  	muere_106:
  	lda #' 
  	sta puntero_tablero2+106,pcr
  	continuar_106:
  	
  	; Casilla 6,11 (dirección 107)
  	clrb
  	; Analizar casilla 5,10 (dirección 90) 
  	lda puntero_tablero+90,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_5_10
  	incb
  	no_inc_6_11_5_10:
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_5_11
  	incb
  	no_inc_6_11_5_11:
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_5_12
  	incb
  	no_inc_6_11_5_12:
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_6_10
  	incb
  	no_inc_6_11_6_10:
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_6_12
  	incb
  	no_inc_6_11_6_12:
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_7_10
  	incb
  	no_inc_6_11_7_10:
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_7_11
  	incb
  	no_inc_6_11_7_11:
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_11_7_12
  	incb
  	no_inc_6_11_7_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+107,pcr
  	cmpa #'@
  	beq celda_viva_107
  	; Si está muerta
  	cmpb #3
  	beq nace_107
  	cmpb #6
  	beq nace_107
  	bra muere_107
  	celda_viva_107:
  	cmpb #2
  	beq vive_107
  	cmpb #3
  	beq vive_107
  	bra muere_107
  	nace_107:
  	lda #'@
  	sta puntero_tablero2+107,pcr
  	bra continuar_107
  	vive_107:
  	lda #'@
  	sta puntero_tablero2+107,pcr
  	bra continuar_107
  	muere_107:
  	lda #' 
  	sta puntero_tablero2+107,pcr
  	continuar_107:
  	
  	; Casilla 6,12 (dirección 108)
  	clrb
  	; Analizar casilla 5,11 (dirección 91) 
  	lda puntero_tablero+91,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_5_11
  	incb
  	no_inc_6_12_5_11:
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_5_12
  	incb
  	no_inc_6_12_5_12:
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_5_13
  	incb
  	no_inc_6_12_5_13:
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_6_11
  	incb
  	no_inc_6_12_6_11:
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_6_13
  	incb
  	no_inc_6_12_6_13:
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_7_11
  	incb
  	no_inc_6_12_7_11:
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_7_12
  	incb
  	no_inc_6_12_7_12:
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_12_7_13
  	incb
  	no_inc_6_12_7_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+108,pcr
  	cmpa #'@
  	beq celda_viva_108
  	; Si está muerta
  	cmpb #3
  	beq nace_108
  	cmpb #6
  	beq nace_108
  	bra muere_108
  	celda_viva_108:
  	cmpb #2
  	beq vive_108
  	cmpb #3
  	beq vive_108
  	bra muere_108
  	nace_108:
  	lda #'@
  	sta puntero_tablero2+108,pcr
  	bra continuar_108
  	vive_108:
  	lda #'@
  	sta puntero_tablero2+108,pcr
  	bra continuar_108
  	muere_108:
  	lda #' 
  	sta puntero_tablero2+108,pcr
  	continuar_108:
  	
  	; Casilla 6,13 (dirección 109)
  	clrb
  	; Analizar casilla 5,12 (dirección 92) 
  	lda puntero_tablero+92,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_5_12
  	incb
  	no_inc_6_13_5_12:
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_5_13
  	incb
  	no_inc_6_13_5_13:
  	; Analizar casilla 5,14 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_5_14
  	incb
  	no_inc_6_13_5_14:
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_6_12
  	incb
  	no_inc_6_13_6_12:
  	; Analizar casilla 6,14 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_6_14
  	incb
  	no_inc_6_13_6_14:
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_7_12
  	incb
  	no_inc_6_13_7_12:
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_7_13
  	incb
  	no_inc_6_13_7_13:
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_13_7_14
  	incb
  	no_inc_6_13_7_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+109,pcr
  	cmpa #'@
  	beq celda_viva_109
  	; Si está muerta
  	cmpb #3
  	beq nace_109
  	cmpb #6
  	beq nace_109
  	bra muere_109
  	celda_viva_109:
  	cmpb #2
  	beq vive_109
  	cmpb #3
  	beq vive_109
  	bra muere_109
  	nace_109:
  	lda #'@
  	sta puntero_tablero2+109,pcr
  	bra continuar_109
  	vive_109:
  	lda #'@
  	sta puntero_tablero2+109,pcr
  	bra continuar_109
  	muere_109:
  	lda #' 
  	sta puntero_tablero2+109,pcr
  	continuar_109:
  	
  	; Casilla 6,14 (dirección 110)
  	clrb
  	; Analizar casilla 5,13 (dirección 93) 
  	lda puntero_tablero+93,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_5_13
  	incb
  	no_inc_6_14_5_13:
  	; Analizar casilla 5,14 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_5_14
  	incb
  	no_inc_6_14_5_14:
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_5_15
  	incb
  	no_inc_6_14_5_15:
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_6_13
  	incb
  	no_inc_6_14_6_13:
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_6_15
  	incb
  	no_inc_6_14_6_15:
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_7_13
  	incb
  	no_inc_6_14_7_13:
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_7_14
  	incb
  	no_inc_6_14_7_14:
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_14_7_15
  	incb
  	no_inc_6_14_7_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+110,pcr
  	cmpa #'@
  	beq celda_viva_110
  	; Si está muerta
  	cmpb #3
  	beq nace_110
  	cmpb #6
  	beq nace_110
  	bra muere_110
  	celda_viva_110:
  	cmpb #2
  	beq vive_110
  	cmpb #3
  	beq vive_110
  	bra muere_110
  	nace_110:
  	lda #'@
  	sta puntero_tablero2+110,pcr
  	bra continuar_110
  	vive_110:
  	lda #'@
  	sta puntero_tablero2+110,pcr
  	bra continuar_110
  	muere_110:
  	lda #' 
  	sta puntero_tablero2+110,pcr
  	continuar_110:
  	
  	; Casilla 6,15 (dirección 111)
  	clrb
  	; Analizar casilla 5,14 (dirección 94) 
  	lda puntero_tablero+94,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_5_14
  	incb
  	no_inc_6_15_5_14:
  	; Analizar casilla 5,15 (dirección 95) 
  	lda puntero_tablero+95,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_5_15
  	incb
  	no_inc_6_15_5_15:
  	; Analizar casilla 5,0 (dirección 80) 
  	lda puntero_tablero+80,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_5_0
  	incb
  	no_inc_6_15_5_0:
  	; Analizar casilla 6,14 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_6_14
  	incb
  	no_inc_6_15_6_14:
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_6_0
  	incb
  	no_inc_6_15_6_0:
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_7_14
  	incb
  	no_inc_6_15_7_14:
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_7_15
  	incb
  	no_inc_6_15_7_15:
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_6_15_7_0
  	incb
  	no_inc_6_15_7_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+111,pcr
  	cmpa #'@
  	beq celda_viva_111
  	; Si está muerta
  	cmpb #3
  	beq nace_111
  	cmpb #6
  	beq nace_111
  	bra muere_111
  	celda_viva_111:
  	cmpb #2
  	beq vive_111
  	cmpb #3
  	beq vive_111
  	bra muere_111
  	nace_111:
  	lda #'@
  	sta puntero_tablero2+111,pcr
  	bra continuar_111
  	vive_111:
  	lda #'@
  	sta puntero_tablero2+111,pcr
  	bra continuar_111
  	muere_111:
  	lda #' 
  	sta puntero_tablero2+111,pcr
  	continuar_111:
  	
  	; Casilla 7,0 (dirección 112)
  	clrb
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_6_15
  	incb
  	no_inc_7_0_6_15:
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_6_0
  	incb
  	no_inc_7_0_6_0:
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_6_1
  	incb
  	no_inc_7_0_6_1:
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_7_15
  	incb
  	no_inc_7_0_7_15:
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_7_1
  	incb
  	no_inc_7_0_7_1:
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_8_15
  	incb
  	no_inc_7_0_8_15:
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_8_0
  	incb
  	no_inc_7_0_8_0:
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_0_8_1
  	incb
  	no_inc_7_0_8_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+112,pcr
  	cmpa #'@
  	beq celda_viva_112
  	; Si está muerta
  	cmpb #3
  	beq nace_112
  	cmpb #6
  	beq nace_112
  	bra muere_112
  	celda_viva_112:
  	cmpb #2
  	beq vive_112
  	cmpb #3
  	beq vive_112
  	bra muere_112
  	nace_112:
  	lda #'@
  	sta puntero_tablero2+112,pcr
  	bra continuar_112
  	vive_112:
  	lda #'@
  	sta puntero_tablero2+112,pcr
  	bra continuar_112
  	muere_112:
  	lda #' 
  	sta puntero_tablero2+112,pcr
  	continuar_112:
  	
  	; Casilla 7,1 (dirección 113)
  	clrb
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_6_0
  	incb
  	no_inc_7_1_6_0:
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_6_1
  	incb
  	no_inc_7_1_6_1:
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_6_2
  	incb
  	no_inc_7_1_6_2:
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_7_0
  	incb
  	no_inc_7_1_7_0:
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_7_2
  	incb
  	no_inc_7_1_7_2:
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_8_0
  	incb
  	no_inc_7_1_8_0:
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_8_1
  	incb
  	no_inc_7_1_8_1:
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_1_8_2
  	incb
  	no_inc_7_1_8_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+113,pcr
  	cmpa #'@
  	beq celda_viva_113
  	; Si está muerta
  	cmpb #3
  	beq nace_113
  	cmpb #6
  	beq nace_113
  	bra muere_113
  	celda_viva_113:
  	cmpb #2
  	beq vive_113
  	cmpb #3
  	beq vive_113
  	bra muere_113
  	nace_113:
  	lda #'@
  	sta puntero_tablero2+113,pcr
  	bra continuar_113
  	vive_113:
  	lda #'@
  	sta puntero_tablero2+113,pcr
  	bra continuar_113
  	muere_113:
  	lda #' 
  	sta puntero_tablero2+113,pcr
  	continuar_113:
  	
  	; Casilla 7,2 (dirección 114)
  	clrb
  	; Analizar casilla 6,1 (dirección 97) 
  	lda puntero_tablero+97,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_6_1
  	incb
  	no_inc_7_2_6_1:
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_6_2
  	incb
  	no_inc_7_2_6_2:
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_6_3
  	incb
  	no_inc_7_2_6_3:
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_7_1
  	incb
  	no_inc_7_2_7_1:
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_7_3
  	incb
  	no_inc_7_2_7_3:
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_8_1
  	incb
  	no_inc_7_2_8_1:
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_8_2
  	incb
  	no_inc_7_2_8_2:
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_2_8_3
  	incb
  	no_inc_7_2_8_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+114,pcr
  	cmpa #'@
  	beq celda_viva_114
  	; Si está muerta
  	cmpb #3
  	beq nace_114
  	cmpb #6
  	beq nace_114
  	bra muere_114
  	celda_viva_114:
  	cmpb #2
  	beq vive_114
  	cmpb #3
  	beq vive_114
  	bra muere_114
  	nace_114:
  	lda #'@
  	sta puntero_tablero2+114,pcr
  	bra continuar_114
  	vive_114:
  	lda #'@
  	sta puntero_tablero2+114,pcr
  	bra continuar_114
  	muere_114:
  	lda #' 
  	sta puntero_tablero2+114,pcr
  	continuar_114:
  	
  	; Casilla 7,3 (dirección 115)
  	clrb
  	; Analizar casilla 6,2 (dirección 98) 
  	lda puntero_tablero+98,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_6_2
  	incb
  	no_inc_7_3_6_2:
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_6_3
  	incb
  	no_inc_7_3_6_3:
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_6_4
  	incb
  	no_inc_7_3_6_4:
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_7_2
  	incb
  	no_inc_7_3_7_2:
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_7_4
  	incb
  	no_inc_7_3_7_4:
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_8_2
  	incb
  	no_inc_7_3_8_2:
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_8_3
  	incb
  	no_inc_7_3_8_3:
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_3_8_4
  	incb
  	no_inc_7_3_8_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+115,pcr
  	cmpa #'@
  	beq celda_viva_115
  	; Si está muerta
  	cmpb #3
  	beq nace_115
  	cmpb #6
  	beq nace_115
  	bra muere_115
  	celda_viva_115:
  	cmpb #2
  	beq vive_115
  	cmpb #3
  	beq vive_115
  	bra muere_115
  	nace_115:
  	lda #'@
  	sta puntero_tablero2+115,pcr
  	bra continuar_115
  	vive_115:
  	lda #'@
  	sta puntero_tablero2+115,pcr
  	bra continuar_115
  	muere_115:
  	lda #' 
  	sta puntero_tablero2+115,pcr
  	continuar_115:
  	
  	; Casilla 7,4 (dirección 116)
  	clrb
  	; Analizar casilla 6,3 (dirección 99) 
  	lda puntero_tablero+99,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_6_3
  	incb
  	no_inc_7_4_6_3:
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_6_4
  	incb
  	no_inc_7_4_6_4:
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_6_5
  	incb
  	no_inc_7_4_6_5:
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_7_3
  	incb
  	no_inc_7_4_7_3:
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_7_5
  	incb
  	no_inc_7_4_7_5:
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_8_3
  	incb
  	no_inc_7_4_8_3:
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_8_4
  	incb
  	no_inc_7_4_8_4:
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_4_8_5
  	incb
  	no_inc_7_4_8_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+116,pcr
  	cmpa #'@
  	beq celda_viva_116
  	; Si está muerta
  	cmpb #3
  	beq nace_116
  	cmpb #6
  	beq nace_116
  	bra muere_116
  	celda_viva_116:
  	cmpb #2
  	beq vive_116
  	cmpb #3
  	beq vive_116
  	bra muere_116
  	nace_116:
  	lda #'@
  	sta puntero_tablero2+116,pcr
  	bra continuar_116
  	vive_116:
  	lda #'@
  	sta puntero_tablero2+116,pcr
  	bra continuar_116
  	muere_116:
  	lda #' 
  	sta puntero_tablero2+116,pcr
  	continuar_116:
  	
  	; Casilla 7,5 (dirección 117)
  	clrb
  	; Analizar casilla 6,4 (dirección 100) 
  	lda puntero_tablero+100,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_6_4
  	incb
  	no_inc_7_5_6_4:
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_6_5
  	incb
  	no_inc_7_5_6_5:
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_6_6
  	incb
  	no_inc_7_5_6_6:
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_7_4
  	incb
  	no_inc_7_5_7_4:
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_7_6
  	incb
  	no_inc_7_5_7_6:
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_8_4
  	incb
  	no_inc_7_5_8_4:
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_8_5
  	incb
  	no_inc_7_5_8_5:
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_5_8_6
  	incb
  	no_inc_7_5_8_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+117,pcr
  	cmpa #'@
  	beq celda_viva_117
  	; Si está muerta
  	cmpb #3
  	beq nace_117
  	cmpb #6
  	beq nace_117
  	bra muere_117
  	celda_viva_117:
  	cmpb #2
  	beq vive_117
  	cmpb #3
  	beq vive_117
  	bra muere_117
  	nace_117:
  	lda #'@
  	sta puntero_tablero2+117,pcr
  	bra continuar_117
  	vive_117:
  	lda #'@
  	sta puntero_tablero2+117,pcr
  	bra continuar_117
  	muere_117:
  	lda #' 
  	sta puntero_tablero2+117,pcr
  	continuar_117:
  	
  	; Casilla 7,6 (dirección 118)
  	clrb
  	; Analizar casilla 6,5 (dirección 101) 
  	lda puntero_tablero+101,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_6_5
  	incb
  	no_inc_7_6_6_5:
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_6_6
  	incb
  	no_inc_7_6_6_6:
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_6_7
  	incb
  	no_inc_7_6_6_7:
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_7_5
  	incb
  	no_inc_7_6_7_5:
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_7_7
  	incb
  	no_inc_7_6_7_7:
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_8_5
  	incb
  	no_inc_7_6_8_5:
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_8_6
  	incb
  	no_inc_7_6_8_6:
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_6_8_7
  	incb
  	no_inc_7_6_8_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+118,pcr
  	cmpa #'@
  	beq celda_viva_118
  	; Si está muerta
  	cmpb #3
  	beq nace_118
  	cmpb #6
  	beq nace_118
  	bra muere_118
  	celda_viva_118:
  	cmpb #2
  	beq vive_118
  	cmpb #3
  	beq vive_118
  	bra muere_118
  	nace_118:
  	lda #'@
  	sta puntero_tablero2+118,pcr
  	bra continuar_118
  	vive_118:
  	lda #'@
  	sta puntero_tablero2+118,pcr
  	bra continuar_118
  	muere_118:
  	lda #' 
  	sta puntero_tablero2+118,pcr
  	continuar_118:
  	
  	; Casilla 7,7 (dirección 119)
  	clrb
  	; Analizar casilla 6,6 (dirección 102) 
  	lda puntero_tablero+102,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_6_6
  	incb
  	no_inc_7_7_6_6:
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_6_7
  	incb
  	no_inc_7_7_6_7:
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_6_8
  	incb
  	no_inc_7_7_6_8:
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_7_6
  	incb
  	no_inc_7_7_7_6:
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_7_8
  	incb
  	no_inc_7_7_7_8:
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_8_6
  	incb
  	no_inc_7_7_8_6:
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_8_7
  	incb
  	no_inc_7_7_8_7:
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_7_8_8
  	incb
  	no_inc_7_7_8_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+119,pcr
  	cmpa #'@
  	beq celda_viva_119
  	; Si está muerta
  	cmpb #3
  	beq nace_119
  	cmpb #6
  	beq nace_119
  	bra muere_119
  	celda_viva_119:
  	cmpb #2
  	beq vive_119
  	cmpb #3
  	beq vive_119
  	bra muere_119
  	nace_119:
  	lda #'@
  	sta puntero_tablero2+119,pcr
  	bra continuar_119
  	vive_119:
  	lda #'@
  	sta puntero_tablero2+119,pcr
  	bra continuar_119
  	muere_119:
  	lda #' 
  	sta puntero_tablero2+119,pcr
  	continuar_119:
  	
  	; Casilla 7,8 (dirección 120)
  	clrb
  	; Analizar casilla 6,7 (dirección 103) 
  	lda puntero_tablero+103,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_6_7
  	incb
  	no_inc_7_8_6_7:
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_6_8
  	incb
  	no_inc_7_8_6_8:
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_6_9
  	incb
  	no_inc_7_8_6_9:
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_7_7
  	incb
  	no_inc_7_8_7_7:
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_7_9
  	incb
  	no_inc_7_8_7_9:
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_8_7
  	incb
  	no_inc_7_8_8_7:
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_8_8
  	incb
  	no_inc_7_8_8_8:
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_8_8_9
  	incb
  	no_inc_7_8_8_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+120,pcr
  	cmpa #'@
  	beq celda_viva_120
  	; Si está muerta
  	cmpb #3
  	beq nace_120
  	cmpb #6
  	beq nace_120
  	bra muere_120
  	celda_viva_120:
  	cmpb #2
  	beq vive_120
  	cmpb #3
  	beq vive_120
  	bra muere_120
  	nace_120:
  	lda #'@
  	sta puntero_tablero2+120,pcr
  	bra continuar_120
  	vive_120:
  	lda #'@
  	sta puntero_tablero2+120,pcr
  	bra continuar_120
  	muere_120:
  	lda #' 
  	sta puntero_tablero2+120,pcr
  	continuar_120:
  	
  	; Casilla 7,9 (dirección 121)
  	clrb
  	; Analizar casilla 6,8 (dirección 104) 
  	lda puntero_tablero+104,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_6_8
  	incb
  	no_inc_7_9_6_8:
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_6_9
  	incb
  	no_inc_7_9_6_9:
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_6_10
  	incb
  	no_inc_7_9_6_10:
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_7_8
  	incb
  	no_inc_7_9_7_8:
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_7_10
  	incb
  	no_inc_7_9_7_10:
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_8_8
  	incb
  	no_inc_7_9_8_8:
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_8_9
  	incb
  	no_inc_7_9_8_9:
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_9_8_10
  	incb
  	no_inc_7_9_8_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+121,pcr
  	cmpa #'@
  	beq celda_viva_121
  	; Si está muerta
  	cmpb #3
  	beq nace_121
  	cmpb #6
  	beq nace_121
  	bra muere_121
  	celda_viva_121:
  	cmpb #2
  	beq vive_121
  	cmpb #3
  	beq vive_121
  	bra muere_121
  	nace_121:
  	lda #'@
  	sta puntero_tablero2+121,pcr
  	bra continuar_121
  	vive_121:
  	lda #'@
  	sta puntero_tablero2+121,pcr
  	bra continuar_121
  	muere_121:
  	lda #' 
  	sta puntero_tablero2+121,pcr
  	continuar_121:
  	
  	; Casilla 7,10 (dirección 122)
  	clrb
  	; Analizar casilla 6,9 (dirección 105) 
  	lda puntero_tablero+105,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_6_9
  	incb
  	no_inc_7_10_6_9:
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_6_10
  	incb
  	no_inc_7_10_6_10:
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_6_11
  	incb
  	no_inc_7_10_6_11:
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_7_9
  	incb
  	no_inc_7_10_7_9:
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_7_11
  	incb
  	no_inc_7_10_7_11:
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_8_9
  	incb
  	no_inc_7_10_8_9:
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_8_10
  	incb
  	no_inc_7_10_8_10:
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_10_8_11
  	incb
  	no_inc_7_10_8_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+122,pcr
  	cmpa #'@
  	beq celda_viva_122
  	; Si está muerta
  	cmpb #3
  	beq nace_122
  	cmpb #6
  	beq nace_122
  	bra muere_122
  	celda_viva_122:
  	cmpb #2
  	beq vive_122
  	cmpb #3
  	beq vive_122
  	bra muere_122
  	nace_122:
  	lda #'@
  	sta puntero_tablero2+122,pcr
  	bra continuar_122
  	vive_122:
  	lda #'@
  	sta puntero_tablero2+122,pcr
  	bra continuar_122
  	muere_122:
  	lda #' 
  	sta puntero_tablero2+122,pcr
  	continuar_122:
  	
  	; Casilla 7,11 (dirección 123)
  	clrb
  	; Analizar casilla 6,10 (dirección 106) 
  	lda puntero_tablero+106,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_6_10
  	incb
  	no_inc_7_11_6_10:
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_6_11
  	incb
  	no_inc_7_11_6_11:
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_6_12
  	incb
  	no_inc_7_11_6_12:
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_7_10
  	incb
  	no_inc_7_11_7_10:
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_7_12
  	incb
  	no_inc_7_11_7_12:
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_8_10
  	incb
  	no_inc_7_11_8_10:
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_8_11
  	incb
  	no_inc_7_11_8_11:
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_11_8_12
  	incb
  	no_inc_7_11_8_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+123,pcr
  	cmpa #'@
  	beq celda_viva_123
  	; Si está muerta
  	cmpb #3
  	beq nace_123
  	cmpb #6
  	beq nace_123
  	bra muere_123
  	celda_viva_123:
  	cmpb #2
  	beq vive_123
  	cmpb #3
  	beq vive_123
  	bra muere_123
  	nace_123:
  	lda #'@
  	sta puntero_tablero2+123,pcr
  	bra continuar_123
  	vive_123:
  	lda #'@
  	sta puntero_tablero2+123,pcr
  	bra continuar_123
  	muere_123:
  	lda #' 
  	sta puntero_tablero2+123,pcr
  	continuar_123:
  	
  	; Casilla 7,12 (dirección 124)
  	clrb
  	; Analizar casilla 6,11 (dirección 107) 
  	lda puntero_tablero+107,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_6_11
  	incb
  	no_inc_7_12_6_11:
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_6_12
  	incb
  	no_inc_7_12_6_12:
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_6_13
  	incb
  	no_inc_7_12_6_13:
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_7_11
  	incb
  	no_inc_7_12_7_11:
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_7_13
  	incb
  	no_inc_7_12_7_13:
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_8_11
  	incb
  	no_inc_7_12_8_11:
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_8_12
  	incb
  	no_inc_7_12_8_12:
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_12_8_13
  	incb
  	no_inc_7_12_8_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+124,pcr
  	cmpa #'@
  	beq celda_viva_124
  	; Si está muerta
  	cmpb #3
  	beq nace_124
  	cmpb #6
  	beq nace_124
  	bra muere_124
  	celda_viva_124:
  	cmpb #2
  	beq vive_124
  	cmpb #3
  	beq vive_124
  	bra muere_124
  	nace_124:
  	lda #'@
  	sta puntero_tablero2+124,pcr
  	bra continuar_124
  	vive_124:
  	lda #'@
  	sta puntero_tablero2+124,pcr
  	bra continuar_124
  	muere_124:
  	lda #' 
  	sta puntero_tablero2+124,pcr
  	continuar_124:
  	
  	; Casilla 7,13 (dirección 125)
  	clrb
  	; Analizar casilla 6,12 (dirección 108) 
  	lda puntero_tablero+108,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_6_12
  	incb
  	no_inc_7_13_6_12:
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_6_13
  	incb
  	no_inc_7_13_6_13:
  	; Analizar casilla 6,14 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_6_14
  	incb
  	no_inc_7_13_6_14:
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_7_12
  	incb
  	no_inc_7_13_7_12:
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_7_14
  	incb
  	no_inc_7_13_7_14:
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_8_12
  	incb
  	no_inc_7_13_8_12:
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_8_13
  	incb
  	no_inc_7_13_8_13:
  	; Analizar casilla 8,14 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_13_8_14
  	incb
  	no_inc_7_13_8_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+125,pcr
  	cmpa #'@
  	beq celda_viva_125
  	; Si está muerta
  	cmpb #3
  	beq nace_125
  	cmpb #6
  	beq nace_125
  	bra muere_125
  	celda_viva_125:
  	cmpb #2
  	beq vive_125
  	cmpb #3
  	beq vive_125
  	bra muere_125
  	nace_125:
  	lda #'@
  	sta puntero_tablero2+125,pcr
  	bra continuar_125
  	vive_125:
  	lda #'@
  	sta puntero_tablero2+125,pcr
  	bra continuar_125
  	muere_125:
  	lda #' 
  	sta puntero_tablero2+125,pcr
  	continuar_125:
  	
  	; Casilla 7,14 (dirección 126)
  	clrb
  	; Analizar casilla 6,13 (dirección 109) 
  	lda puntero_tablero+109,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_6_13
  	incb
  	no_inc_7_14_6_13:
  	; Analizar casilla 6,14 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_6_14
  	incb
  	no_inc_7_14_6_14:
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_6_15
  	incb
  	no_inc_7_14_6_15:
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_7_13
  	incb
  	no_inc_7_14_7_13:
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_7_15
  	incb
  	no_inc_7_14_7_15:
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_8_13
  	incb
  	no_inc_7_14_8_13:
  	; Analizar casilla 8,14 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_8_14
  	incb
  	no_inc_7_14_8_14:
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_14_8_15
  	incb
  	no_inc_7_14_8_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+126,pcr
  	cmpa #'@
  	beq celda_viva_126
  	; Si está muerta
  	cmpb #3
  	beq nace_126
  	cmpb #6
  	beq nace_126
  	bra muere_126
  	celda_viva_126:
  	cmpb #2
  	beq vive_126
  	cmpb #3
  	beq vive_126
  	bra muere_126
  	nace_126:
  	lda #'@
  	sta puntero_tablero2+126,pcr
  	bra continuar_126
  	vive_126:
  	lda #'@
  	sta puntero_tablero2+126,pcr
  	bra continuar_126
  	muere_126:
  	lda #' 
  	sta puntero_tablero2+126,pcr
  	continuar_126:
  	
  	; Casilla 7,15 (dirección 127)
  	clrb
  	; Analizar casilla 6,14 (dirección 110) 
  	lda puntero_tablero+110,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_6_14
  	incb
  	no_inc_7_15_6_14:
  	; Analizar casilla 6,15 (dirección 111) 
  	lda puntero_tablero+111,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_6_15
  	incb
  	no_inc_7_15_6_15:
  	; Analizar casilla 6,0 (dirección 96) 
  	lda puntero_tablero+96,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_6_0
  	incb
  	no_inc_7_15_6_0:
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_7_14
  	incb
  	no_inc_7_15_7_14:
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_7_0
  	incb
  	no_inc_7_15_7_0:
  	; Analizar casilla 8,6 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_8_6
  	incb
  	no_inc_7_15_8_6:
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_8_15
  	incb
  	no_inc_7_15_8_15:
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_7_15_8_0
  	incb
  	no_inc_7_15_8_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+127,pcr
  	cmpa #'@
  	beq celda_viva_127
  	; Si está muerta
  	cmpb #3
  	beq nace_127
  	cmpb #6
  	beq nace_127
  	bra muere_127
  	celda_viva_127:
  	cmpb #2
  	beq vive_127
  	cmpb #3
  	beq vive_127
  	bra muere_127
  	nace_127:
  	lda #'@
  	sta puntero_tablero2+127,pcr
  	bra continuar_127
  	vive_127:
  	lda #'@
  	sta puntero_tablero2+127,pcr
  	bra continuar_127
  	muere_127:
  	lda #' 
  	sta puntero_tablero2+127,pcr
  	continuar_127:
  	
  	; Casilla 8,0 (dirección 128)
  	clrb
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_7_15
  	incb
  	no_inc_8_0_7_15:
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_7_0
  	incb
  	no_inc_8_0_7_0:
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_7_1
  	incb
  	no_inc_8_0_7_1:
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_8_15
  	incb
  	no_inc_8_0_8_15:
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_8_1
  	incb
  	no_inc_8_0_8_1:
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_9_15
  	incb
  	no_inc_8_0_9_15:
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_9_0
  	incb
  	no_inc_8_0_9_0:
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_0_9_1
  	incb
  	no_inc_8_0_9_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+128,pcr
  	cmpa #'@
  	beq celda_viva_128
  	; Si está muerta
  	cmpb #3
  	beq nace_128
  	cmpb #6
  	beq nace_128
  	bra muere_128
  	celda_viva_128:
  	cmpb #2
  	beq vive_128
  	cmpb #3
  	beq vive_128
  	bra muere_128
  	nace_128:
  	lda #'@
  	sta puntero_tablero2+128,pcr
  	bra continuar_128
  	vive_128:
  	lda #'@
  	sta puntero_tablero2+128,pcr
  	bra continuar_128
  	muere_128:
  	lda #' 
  	sta puntero_tablero2+128,pcr
  	continuar_128:
  	
  	; Casilla 8,1 (dirección 129)
  	clrb
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_7_0
  	incb
  	no_inc_8_1_7_0:
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_7_1
  	incb
  	no_inc_8_1_7_1:
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_7_2
  	incb
  	no_inc_8_1_7_2:
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_8_0
  	incb
  	no_inc_8_1_8_0:
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_8_2
  	incb
  	no_inc_8_1_8_2:
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_9_0
  	incb
  	no_inc_8_1_9_0:
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_9_1
  	incb
  	no_inc_8_1_9_1:
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_1_9_2
  	incb
  	no_inc_8_1_9_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+129,pcr
  	cmpa #'@
  	beq celda_viva_129
  	; Si está muerta
  	cmpb #3
  	beq nace_129
  	cmpb #6
  	beq nace_129
  	bra muere_129
  	celda_viva_129:
  	cmpb #2
  	beq vive_129
  	cmpb #3
  	beq vive_129
  	bra muere_129
  	nace_129:
  	lda #'@
  	sta puntero_tablero2+129,pcr
  	bra continuar_129
  	vive_129:
  	lda #'@
  	sta puntero_tablero2+129,pcr
  	bra continuar_129
  	muere_129:
  	lda #' 
  	sta puntero_tablero2+129,pcr
  	continuar_129:
  	
  	; Casilla 8,2 (dirección 130)
  	clrb
  	; Analizar casilla 7,1 (dirección 113) 
  	lda puntero_tablero+113,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_7_1
  	incb
  	no_inc_8_2_7_1:
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_7_2
  	incb
  	no_inc_8_2_7_2:
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_7_3
  	incb
  	no_inc_8_2_7_3:
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_8_1
  	incb
  	no_inc_8_2_8_1:
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_8_3
  	incb
  	no_inc_8_2_8_3:
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_9_1
  	incb
  	no_inc_8_2_9_1:
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_9_2
  	incb
  	no_inc_8_2_9_2:
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_2_9_3
  	incb
  	no_inc_8_2_9_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+130,pcr
  	cmpa #'@
  	beq celda_viva_130
  	; Si está muerta
  	cmpb #3
  	beq nace_130
  	cmpb #6
  	beq nace_130
  	bra muere_130
  	celda_viva_130:
  	cmpb #2
  	beq vive_130
  	cmpb #3
  	beq vive_130
  	bra muere_130
  	nace_130:
  	lda #'@
  	sta puntero_tablero2+130,pcr
  	bra continuar_130
  	vive_130:
  	lda #'@
  	sta puntero_tablero2+130,pcr
  	bra continuar_130
  	muere_130:
  	lda #' 
  	sta puntero_tablero2+130,pcr
  	continuar_130:
  	
  	; Casilla 8,3 (dirección 131)
  	clrb
  	; Analizar casilla 7,2 (dirección 114) 
  	lda puntero_tablero+114,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_7_2
  	incb
  	no_inc_8_3_7_2:
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_7_3
  	incb
  	no_inc_8_3_7_3:
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_7_4
  	incb
  	no_inc_8_3_7_4:
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_8_2
  	incb
  	no_inc_8_3_8_2:
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_8_4
  	incb
  	no_inc_8_3_8_4:
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_9_2
  	incb
  	no_inc_8_3_9_2:
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_9_3
  	incb
  	no_inc_8_3_9_3:
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_3_9_4
  	incb
  	no_inc_8_3_9_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+131,pcr
  	cmpa #'@
  	beq celda_viva_131
  	; Si está muerta
  	cmpb #3
  	beq nace_131
  	cmpb #6
  	beq nace_131
  	bra muere_131
  	celda_viva_131:
  	cmpb #2
  	beq vive_131
  	cmpb #3
  	beq vive_131
  	bra muere_131
  	nace_131:
  	lda #'@
  	sta puntero_tablero2+131,pcr
  	bra continuar_131
  	vive_131:
  	lda #'@
  	sta puntero_tablero2+131,pcr
  	bra continuar_131
  	muere_131:
  	lda #' 
  	sta puntero_tablero2+131,pcr
  	continuar_131:
  	
  	; Casilla 8,4 (dirección 132)
  	clrb
  	; Analizar casilla 7,3 (dirección 115) 
  	lda puntero_tablero+115,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_7_3
  	incb
  	no_inc_8_4_7_3:
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_7_4
  	incb
  	no_inc_8_4_7_4:
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_7_5
  	incb
  	no_inc_8_4_7_5:
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_8_3
  	incb
  	no_inc_8_4_8_3:
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_8_5
  	incb
  	no_inc_8_4_8_5:
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_9_3
  	incb
  	no_inc_8_4_9_3:
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_9_4
  	incb
  	no_inc_8_4_9_4:
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_4_9_5
  	incb
  	no_inc_8_4_9_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+132,pcr
  	cmpa #'@
  	beq celda_viva_132
  	; Si está muerta
  	cmpb #3
  	beq nace_132
  	cmpb #6
  	beq nace_132
  	bra muere_132
  	celda_viva_132:
  	cmpb #2
  	beq vive_132
  	cmpb #3
  	beq vive_132
  	bra muere_132
  	nace_132:
  	lda #'@
  	sta puntero_tablero2+132,pcr
  	bra continuar_132
  	vive_132:
  	lda #'@
  	sta puntero_tablero2+132,pcr
  	bra continuar_132
  	muere_132:
  	lda #' 
  	sta puntero_tablero2+132,pcr
  	continuar_132:
  	
  	; Casilla 8,5 (dirección 133)
  	clrb
  	; Analizar casilla 7,4 (dirección 116) 
  	lda puntero_tablero+116,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_7_4
  	incb
  	no_inc_8_5_7_4:
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_7_5
  	incb
  	no_inc_8_5_7_5:
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_7_6
  	incb
  	no_inc_8_5_7_6:
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_8_4
  	incb
  	no_inc_8_5_8_4:
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_8_6
  	incb
  	no_inc_8_5_8_6:
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_9_4
  	incb
  	no_inc_8_5_9_4:
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_9_5
  	incb
  	no_inc_8_5_9_5:
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_5_9_6
  	incb
  	no_inc_8_5_9_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+133,pcr
  	cmpa #'@
  	beq celda_viva_133
  	; Si está muerta
  	cmpb #3
  	beq nace_133
  	cmpb #6
  	beq nace_133
  	bra muere_133
  	celda_viva_133:
  	cmpb #2
  	beq vive_133
  	cmpb #3
  	beq vive_133
  	bra muere_133
  	nace_133:
  	lda #'@
  	sta puntero_tablero2+133,pcr
  	bra continuar_133
  	vive_133:
  	lda #'@
  	sta puntero_tablero2+133,pcr
  	bra continuar_133
  	muere_133:
  	lda #' 
  	sta puntero_tablero2+133,pcr
  	continuar_133:
  	
  	; Casilla 8,6 (dirección 134)
  	clrb
  	; Analizar casilla 7,5 (dirección 117) 
  	lda puntero_tablero+117,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_7_5
  	incb
  	no_inc_8_6_7_5:
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_7_6
  	incb
  	no_inc_8_6_7_6:
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_7_7
  	incb
  	no_inc_8_6_7_7:
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_8_5
  	incb
  	no_inc_8_6_8_5:
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_8_7
  	incb
  	no_inc_8_6_8_7:
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_9_5
  	incb
  	no_inc_8_6_9_5:
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_9_6
  	incb
  	no_inc_8_6_9_6:
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_6_9_7
  	incb
  	no_inc_8_6_9_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+134,pcr
  	cmpa #'@
  	beq celda_viva_134
  	; Si está muerta
  	cmpb #3
  	beq nace_134
  	cmpb #6
  	beq nace_134
  	bra muere_134
  	celda_viva_134:
  	cmpb #2
  	beq vive_134
  	cmpb #3
  	beq vive_134
  	bra muere_134
  	nace_134:
  	lda #'@
  	sta puntero_tablero2+134,pcr
  	bra continuar_134
  	vive_134:
  	lda #'@
  	sta puntero_tablero2+134,pcr
  	bra continuar_134
  	muere_134:
  	lda #' 
  	sta puntero_tablero2+134,pcr
  	continuar_134:
  	
  	; Casilla 8,7 (dirección 135)
  	clrb
  	; Analizar casilla 7,6 (dirección 118) 
  	lda puntero_tablero+118,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_7_6
  	incb
  	no_inc_8_7_7_6:
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_7_7
  	incb
  	no_inc_8_7_7_7:
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_7_8
  	incb
  	no_inc_8_7_7_8:
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_8_6
  	incb
  	no_inc_8_7_8_6:
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_8_8
  	incb
  	no_inc_8_7_8_8:
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_9_6
  	incb
  	no_inc_8_7_9_6:
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_9_7
  	incb
  	no_inc_8_7_9_7:
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_7_9_8
  	incb
  	no_inc_8_7_9_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+135,pcr
  	cmpa #'@
  	beq celda_viva_135
  	; Si está muerta
  	cmpb #3
  	beq nace_135
  	cmpb #6
  	beq nace_135
  	bra muere_135
  	celda_viva_135:
  	cmpb #2
  	beq vive_135
  	cmpb #3
  	beq vive_135
  	bra muere_135
  	nace_135:
  	lda #'@
  	sta puntero_tablero2+135,pcr
  	bra continuar_135
  	vive_135:
  	lda #'@
  	sta puntero_tablero2+135,pcr
  	bra continuar_135
  	muere_135:
  	lda #' 
  	sta puntero_tablero2+135,pcr
  	continuar_135:
  	
  	; Casilla 8,8 (dirección 136)
  	clrb
  	; Analizar casilla 7,7 (dirección 119) 
  	lda puntero_tablero+119,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_7_7
  	incb
  	no_inc_8_8_7_7:
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_7_8
  	incb
  	no_inc_8_8_7_8:
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_7_9
  	incb
  	no_inc_8_8_7_9:
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_8_7
  	incb
  	no_inc_8_8_8_7:
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_8_9
  	incb
  	no_inc_8_8_8_9:
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_9_7
  	incb
  	no_inc_8_8_9_7:
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_9_8
  	incb
  	no_inc_8_8_9_8:
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_8_9_9
  	incb
  	no_inc_8_8_9_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+136,pcr
  	cmpa #'@
  	beq celda_viva_136
  	; Si está muerta
  	cmpb #3
  	beq nace_136
  	cmpb #6
  	beq nace_136
  	bra muere_136
  	celda_viva_136:
  	cmpb #2
  	beq vive_136
  	cmpb #3
  	beq vive_136
  	bra muere_136
  	nace_136:
  	lda #'@
  	sta puntero_tablero2+136,pcr
  	bra continuar_136
  	vive_136:
  	lda #'@
  	sta puntero_tablero2+136,pcr
  	bra continuar_136
  	muere_136:
  	lda #' 
  	sta puntero_tablero2+136,pcr
  	continuar_136:
  	
  	; Casilla 8,9 (dirección 137)
  	clrb
  	; Analizar casilla 7,8 (dirección 120) 
  	lda puntero_tablero+120,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_7_8
  	incb
  	no_inc_8_9_7_8:
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_7_9
  	incb
  	no_inc_8_9_7_9:
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_7_10
  	incb
  	no_inc_8_9_7_10:
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_8_8
  	incb
  	no_inc_8_9_8_8:
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_8_10
  	incb
  	no_inc_8_9_8_10:
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_9_8
  	incb
  	no_inc_8_9_9_8:
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_9_9
  	incb
  	no_inc_8_9_9_9:
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_9_9_10
  	incb
  	no_inc_8_9_9_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+137,pcr
  	cmpa #'@
  	beq celda_viva_137
  	; Si está muerta
  	cmpb #3
  	beq nace_137
  	cmpb #6
  	beq nace_137
  	bra muere_137
  	celda_viva_137:
  	cmpb #2
  	beq vive_137
  	cmpb #3
  	beq vive_137
  	bra muere_137
  	nace_137:
  	lda #'@
  	sta puntero_tablero2+137,pcr
  	bra continuar_137
  	vive_137:
  	lda #'@
  	sta puntero_tablero2+137,pcr
  	bra continuar_137
  	muere_137:
  	lda #' 
  	sta puntero_tablero2+137,pcr
  	continuar_137:
  	
  	; Casilla 8,10 (dirección 138)
  	clrb
  	; Analizar casilla 7,9 (dirección 121) 
  	lda puntero_tablero+121,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_7_9
  	incb
  	no_inc_8_10_7_9:
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_7_10
  	incb
  	no_inc_8_10_7_10:
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_7_11
  	incb
  	no_inc_8_10_7_11:
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_8_9
  	incb
  	no_inc_8_10_8_9:
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_8_11
  	incb
  	no_inc_8_10_8_11:
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_9_9
  	incb
  	no_inc_8_10_9_9:
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_9_10
  	incb
  	no_inc_8_10_9_10:
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_10_9_11
  	incb
  	no_inc_8_10_9_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+138,pcr
  	cmpa #'@
  	beq celda_viva_138
  	; Si está muerta
  	cmpb #3
  	beq nace_138
  	cmpb #6
  	beq nace_138
  	bra muere_138
  	celda_viva_138:
  	cmpb #2
  	beq vive_138
  	cmpb #3
  	beq vive_138
  	bra muere_138
  	nace_138:
  	lda #'@
  	sta puntero_tablero2+138,pcr
  	bra continuar_138
  	vive_138:
  	lda #'@
  	sta puntero_tablero2+138,pcr
  	bra continuar_138
  	muere_138:
  	lda #' 
  	sta puntero_tablero2+138,pcr
  	continuar_138:
  	
  	; Casilla 8,11 (dirección 139)
  	clrb
  	; Analizar casilla 7,10 (dirección 122) 
  	lda puntero_tablero+122,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_7_10
  	incb
  	no_inc_8_11_7_10:
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_7_11
  	incb
  	no_inc_8_11_7_11:
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_7_12
  	incb
  	no_inc_8_11_7_12:
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_8_10
  	incb
  	no_inc_8_11_8_10:
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_8_12
  	incb
  	no_inc_8_11_8_12:
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_9_10
  	incb
  	no_inc_8_11_9_10:
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_9_11
  	incb
  	no_inc_8_11_9_11:
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_11_9_12
  	incb
  	no_inc_8_11_9_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+139,pcr
  	cmpa #'@
  	beq celda_viva_139
  	; Si está muerta
  	cmpb #3
  	beq nace_139
  	cmpb #6
  	beq nace_139
  	bra muere_139
  	celda_viva_139:
  	cmpb #2
  	beq vive_139
  	cmpb #3
  	beq vive_139
  	bra muere_139
  	nace_139:
  	lda #'@
  	sta puntero_tablero2+139,pcr
  	bra continuar_139
  	vive_139:
  	lda #'@
  	sta puntero_tablero2+139,pcr
  	bra continuar_139
  	muere_139:
  	lda #' 
  	sta puntero_tablero2+139,pcr
  	continuar_139:
  	
  	; Casilla 8,12 (dirección 140)
  	clrb
  	; Analizar casilla 7,11 (dirección 123) 
  	lda puntero_tablero+123,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_7_11
  	incb
  	no_inc_8_12_7_11:
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_7_12
  	incb
  	no_inc_8_12_7_12:
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_7_13
  	incb
  	no_inc_8_12_7_13:
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_8_11
  	incb
  	no_inc_8_12_8_11:
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_8_13
  	incb
  	no_inc_8_12_8_13:
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_9_11
  	incb
  	no_inc_8_12_9_11:
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_9_12
  	incb
  	no_inc_8_12_9_12:
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_12_9_13
  	incb
  	no_inc_8_12_9_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+140,pcr
  	cmpa #'@
  	beq celda_viva_140
  	; Si está muerta
  	cmpb #3
  	beq nace_140
  	cmpb #6
  	beq nace_140
  	bra muere_140
  	celda_viva_140:
  	cmpb #2
  	beq vive_140
  	cmpb #3
  	beq vive_140
  	bra muere_140
  	nace_140:
  	lda #'@
  	sta puntero_tablero2+140,pcr
  	bra continuar_140
  	vive_140:
  	lda #'@
  	sta puntero_tablero2+140,pcr
  	bra continuar_140
  	muere_140:
  	lda #' 
  	sta puntero_tablero2+140,pcr
  	continuar_140:
  	
  	; Casilla 8,13 (dirección 141)
  	clrb
  	; Analizar casilla 7,12 (dirección 124) 
  	lda puntero_tablero+124,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_7_12
  	incb
  	no_inc_8_13_7_12:
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_7_13
  	incb
  	no_inc_8_13_7_13:
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_7_14
  	incb
  	no_inc_8_13_7_14:
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_8_12
  	incb
  	no_inc_8_13_8_12:
  	; Analizar casilla 8,14 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_8_14
  	incb
  	no_inc_8_13_8_14:
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_9_12
  	incb
  	no_inc_8_13_9_12:
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_9_13
  	incb
  	no_inc_8_13_9_13:
  	; Analizar casilla 9,14 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_13_9_14
  	incb
  	no_inc_8_13_9_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+141,pcr
  	cmpa #'@
  	beq celda_viva_141
  	; Si está muerta
  	cmpb #3
  	beq nace_141
  	cmpb #6
  	beq nace_141
  	bra muere_141
  	celda_viva_141:
  	cmpb #2
  	beq vive_141
  	cmpb #3
  	beq vive_141
  	bra muere_141
  	nace_141:
  	lda #'@
  	sta puntero_tablero2+141,pcr
  	bra continuar_141
  	vive_141:
  	lda #'@
  	sta puntero_tablero2+141,pcr
  	bra continuar_141
  	muere_141:
  	lda #' 
  	sta puntero_tablero2+141,pcr
  	continuar_141:
  	
  	; Casilla 8,14 (dirección 142)
  	clrb
  	; Analizar casilla 7,13 (dirección 125) 
  	lda puntero_tablero+125,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_7_13
  	incb
  	no_inc_8_14_7_13:
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_7_14
  	incb
  	no_inc_8_14_7_14:
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_7_15
  	incb
  	no_inc_8_14_7_15:
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_8_13
  	incb
  	no_inc_8_14_8_13:
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_8_15
  	incb
  	no_inc_8_14_8_15:
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_9_13
  	incb
  	no_inc_8_14_9_13:
  	; Analizar casilla 9,14 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_9_14
  	incb
  	no_inc_8_14_9_14:
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_14_9_15
  	incb
  	no_inc_8_14_9_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+142,pcr
  	cmpa #'@
  	beq celda_viva_142
  	; Si está muerta
  	cmpb #3
  	beq nace_142
  	cmpb #6
  	beq nace_142
  	bra muere_142
  	celda_viva_142:
  	cmpb #2
  	beq vive_142
  	cmpb #3
  	beq vive_142
  	bra muere_142
  	nace_142:
  	lda #'@
  	sta puntero_tablero2+142,pcr
  	bra continuar_142
  	vive_142:
  	lda #'@
  	sta puntero_tablero2+142,pcr
  	bra continuar_142
  	muere_142:
  	lda #' 
  	sta puntero_tablero2+142,pcr
  	continuar_142:
  	
  	; Casilla 8,15 (dirección 143)
  	clrb
  	; Analizar casilla 7,14 (dirección 126) 
  	lda puntero_tablero+126,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_7_14
  	incb
  	no_inc_8_15_7_14:
  	; Analizar casilla 7,15 (dirección 127) 
  	lda puntero_tablero+127,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_7_15
  	incb
  	no_inc_8_15_7_15:
  	; Analizar casilla 7,0 (dirección 112) 
  	lda puntero_tablero+112,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_7_0
  	incb
  	no_inc_8_15_7_0:
  	; Analizar casilla 8,14 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_8_14
  	incb
  	no_inc_8_15_8_14:
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_8_0
  	incb
  	no_inc_8_15_8_0:
  	; Analizar casilla 9,5 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_9_5
  	incb
  	no_inc_8_15_9_5:
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_9_15
  	incb
  	no_inc_8_15_9_15:
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_8_15_9_0
  	incb
  	no_inc_8_15_9_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+143,pcr
  	cmpa #'@
  	beq celda_viva_143
  	; Si está muerta
  	cmpb #3
  	beq nace_143
  	cmpb #6
  	beq nace_143
  	bra muere_143
  	celda_viva_143:
  	cmpb #2
  	beq vive_143
  	cmpb #3
  	beq vive_143
  	bra muere_143
  	nace_143:
  	lda #'@
  	sta puntero_tablero2+143,pcr
  	bra continuar_143
  	vive_143:
  	lda #'@
  	sta puntero_tablero2+143,pcr
  	bra continuar_143
  	muere_143:
  	lda #' 
  	sta puntero_tablero2+143,pcr
  	continuar_143:
  	
  	; Casilla 9,0 (dirección 144)
  	clrb
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_8_15
  	incb
  	no_inc_9_0_8_15:
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_8_0
  	incb
  	no_inc_9_0_8_0:
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_8_1
  	incb
  	no_inc_9_0_8_1:
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_9_15
  	incb
  	no_inc_9_0_9_15:
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_9_1
  	incb
  	no_inc_9_0_9_1:
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_10_15
  	incb
  	no_inc_9_0_10_15:
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_10_0
  	incb
  	no_inc_9_0_10_0:
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_0_10_1
  	incb
  	no_inc_9_0_10_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+144,pcr
  	cmpa #'@
  	beq celda_viva_144
  	; Si está muerta
  	cmpb #3
  	beq nace_144
  	cmpb #6
  	beq nace_144
  	bra muere_144
  	celda_viva_144:
  	cmpb #2
  	beq vive_144
  	cmpb #3
  	beq vive_144
  	bra muere_144
  	nace_144:
  	lda #'@
  	sta puntero_tablero2+144,pcr
  	bra continuar_144
  	vive_144:
  	lda #'@
  	sta puntero_tablero2+144,pcr
  	bra continuar_144
  	muere_144:
  	lda #' 
  	sta puntero_tablero2+144,pcr
  	continuar_144:
  	
  	; Casilla 9,1 (dirección 145)
  	clrb
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_8_0
  	incb
  	no_inc_9_1_8_0:
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_8_1
  	incb
  	no_inc_9_1_8_1:
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_8_2
  	incb
  	no_inc_9_1_8_2:
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_9_0
  	incb
  	no_inc_9_1_9_0:
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_9_2
  	incb
  	no_inc_9_1_9_2:
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_10_0
  	incb
  	no_inc_9_1_10_0:
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_10_1
  	incb
  	no_inc_9_1_10_1:
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_1_10_2
  	incb
  	no_inc_9_1_10_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+145,pcr
  	cmpa #'@
  	beq celda_viva_145
  	; Si está muerta
  	cmpb #3
  	beq nace_145
  	cmpb #6
  	beq nace_145
  	bra muere_145
  	celda_viva_145:
  	cmpb #2
  	beq vive_145
  	cmpb #3
  	beq vive_145
  	bra muere_145
  	nace_145:
  	lda #'@
  	sta puntero_tablero2+145,pcr
  	bra continuar_145
  	vive_145:
  	lda #'@
  	sta puntero_tablero2+145,pcr
  	bra continuar_145
  	muere_145:
  	lda #' 
  	sta puntero_tablero2+145,pcr
  	continuar_145:
  	
  	; Casilla 9,2 (dirección 146)
  	clrb
  	; Analizar casilla 8,1 (dirección 129) 
  	lda puntero_tablero+129,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_8_1
  	incb
  	no_inc_9_2_8_1:
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_8_2
  	incb
  	no_inc_9_2_8_2:
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_8_3
  	incb
  	no_inc_9_2_8_3:
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_9_1
  	incb
  	no_inc_9_2_9_1:
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_9_3
  	incb
  	no_inc_9_2_9_3:
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_10_1
  	incb
  	no_inc_9_2_10_1:
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_10_2
  	incb
  	no_inc_9_2_10_2:
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_2_10_3
  	incb
  	no_inc_9_2_10_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+146,pcr
  	cmpa #'@
  	beq celda_viva_146
  	; Si está muerta
  	cmpb #3
  	beq nace_146
  	cmpb #6
  	beq nace_146
  	bra muere_146
  	celda_viva_146:
  	cmpb #2
  	beq vive_146
  	cmpb #3
  	beq vive_146
  	bra muere_146
  	nace_146:
  	lda #'@
  	sta puntero_tablero2+146,pcr
  	bra continuar_146
  	vive_146:
  	lda #'@
  	sta puntero_tablero2+146,pcr
  	bra continuar_146
  	muere_146:
  	lda #' 
  	sta puntero_tablero2+146,pcr
  	continuar_146:
  	
  	; Casilla 9,3 (dirección 147)
  	clrb
  	; Analizar casilla 8,2 (dirección 130) 
  	lda puntero_tablero+130,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_8_2
  	incb
  	no_inc_9_3_8_2:
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_8_3
  	incb
  	no_inc_9_3_8_3:
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_8_4
  	incb
  	no_inc_9_3_8_4:
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_9_2
  	incb
  	no_inc_9_3_9_2:
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_9_4
  	incb
  	no_inc_9_3_9_4:
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_10_2
  	incb
  	no_inc_9_3_10_2:
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_10_3
  	incb
  	no_inc_9_3_10_3:
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_3_10_4
  	incb
  	no_inc_9_3_10_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+147,pcr
  	cmpa #'@
  	beq celda_viva_147
  	; Si está muerta
  	cmpb #3
  	beq nace_147
  	cmpb #6
  	beq nace_147
  	bra muere_147
  	celda_viva_147:
  	cmpb #2
  	beq vive_147
  	cmpb #3
  	beq vive_147
  	bra muere_147
  	nace_147:
  	lda #'@
  	sta puntero_tablero2+147,pcr
  	bra continuar_147
  	vive_147:
  	lda #'@
  	sta puntero_tablero2+147,pcr
  	bra continuar_147
  	muere_147:
  	lda #' 
  	sta puntero_tablero2+147,pcr
  	continuar_147:
  	
  	; Casilla 9,4 (dirección 148)
  	clrb
  	; Analizar casilla 8,3 (dirección 131) 
  	lda puntero_tablero+131,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_8_3
  	incb
  	no_inc_9_4_8_3:
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_8_4
  	incb
  	no_inc_9_4_8_4:
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_8_5
  	incb
  	no_inc_9_4_8_5:
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_9_3
  	incb
  	no_inc_9_4_9_3:
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_9_5
  	incb
  	no_inc_9_4_9_5:
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_10_3
  	incb
  	no_inc_9_4_10_3:
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_10_4
  	incb
  	no_inc_9_4_10_4:
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_4_10_5
  	incb
  	no_inc_9_4_10_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+148,pcr
  	cmpa #'@
  	beq celda_viva_148
  	; Si está muerta
  	cmpb #3
  	beq nace_148
  	cmpb #6
  	beq nace_148
  	bra muere_148
  	celda_viva_148:
  	cmpb #2
  	beq vive_148
  	cmpb #3
  	beq vive_148
  	bra muere_148
  	nace_148:
  	lda #'@
  	sta puntero_tablero2+148,pcr
  	bra continuar_148
  	vive_148:
  	lda #'@
  	sta puntero_tablero2+148,pcr
  	bra continuar_148
  	muere_148:
  	lda #' 
  	sta puntero_tablero2+148,pcr
  	continuar_148:
  	
  	; Casilla 9,5 (dirección 149)
  	clrb
  	; Analizar casilla 8,4 (dirección 132) 
  	lda puntero_tablero+132,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_8_4
  	incb
  	no_inc_9_5_8_4:
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_8_5
  	incb
  	no_inc_9_5_8_5:
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_8_6
  	incb
  	no_inc_9_5_8_6:
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_9_4
  	incb
  	no_inc_9_5_9_4:
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_9_6
  	incb
  	no_inc_9_5_9_6:
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_10_4
  	incb
  	no_inc_9_5_10_4:
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_10_5
  	incb
  	no_inc_9_5_10_5:
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_5_10_6
  	incb
  	no_inc_9_5_10_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+149,pcr
  	cmpa #'@
  	beq celda_viva_149
  	; Si está muerta
  	cmpb #3
  	beq nace_149
  	cmpb #6
  	beq nace_149
  	bra muere_149
  	celda_viva_149:
  	cmpb #2
  	beq vive_149
  	cmpb #3
  	beq vive_149
  	bra muere_149
  	nace_149:
  	lda #'@
  	sta puntero_tablero2+149,pcr
  	bra continuar_149
  	vive_149:
  	lda #'@
  	sta puntero_tablero2+149,pcr
  	bra continuar_149
  	muere_149:
  	lda #' 
  	sta puntero_tablero2+149,pcr
  	continuar_149:
  	
  	; Casilla 9,6 (dirección 150)
  	clrb
  	; Analizar casilla 8,5 (dirección 133) 
  	lda puntero_tablero+133,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_8_5
  	incb
  	no_inc_9_6_8_5:
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_8_6
  	incb
  	no_inc_9_6_8_6:
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_8_7
  	incb
  	no_inc_9_6_8_7:
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_9_5
  	incb
  	no_inc_9_6_9_5:
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_9_7
  	incb
  	no_inc_9_6_9_7:
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_10_5
  	incb
  	no_inc_9_6_10_5:
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_10_6
  	incb
  	no_inc_9_6_10_6:
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_6_10_7
  	incb
  	no_inc_9_6_10_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+150,pcr
  	cmpa #'@
  	beq celda_viva_150
  	; Si está muerta
  	cmpb #3
  	beq nace_150
  	cmpb #6
  	beq nace_150
  	bra muere_150
  	celda_viva_150:
  	cmpb #2
  	beq vive_150
  	cmpb #3
  	beq vive_150
  	bra muere_150
  	nace_150:
  	lda #'@
  	sta puntero_tablero2+150,pcr
  	bra continuar_150
  	vive_150:
  	lda #'@
  	sta puntero_tablero2+150,pcr
  	bra continuar_150
  	muere_150:
  	lda #' 
  	sta puntero_tablero2+150,pcr
  	continuar_150:
  	
  	; Casilla 9,7 (dirección 151)
  	clrb
  	; Analizar casilla 8,6 (dirección 134) 
  	lda puntero_tablero+134,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_8_6
  	incb
  	no_inc_9_7_8_6:
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_8_7
  	incb
  	no_inc_9_7_8_7:
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_8_8
  	incb
  	no_inc_9_7_8_8:
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_9_6
  	incb
  	no_inc_9_7_9_6:
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_9_8
  	incb
  	no_inc_9_7_9_8:
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_10_6
  	incb
  	no_inc_9_7_10_6:
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_10_7
  	incb
  	no_inc_9_7_10_7:
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_7_10_8
  	incb
  	no_inc_9_7_10_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+151,pcr
  	cmpa #'@
  	beq celda_viva_151
  	; Si está muerta
  	cmpb #3
  	beq nace_151
  	cmpb #6
  	beq nace_151
  	bra muere_151
  	celda_viva_151:
  	cmpb #2
  	beq vive_151
  	cmpb #3
  	beq vive_151
  	bra muere_151
  	nace_151:
  	lda #'@
  	sta puntero_tablero2+151,pcr
  	bra continuar_151
  	vive_151:
  	lda #'@
  	sta puntero_tablero2+151,pcr
  	bra continuar_151
  	muere_151:
  	lda #' 
  	sta puntero_tablero2+151,pcr
  	continuar_151:
  	
  	; Casilla 9,8 (dirección 152)
  	clrb
  	; Analizar casilla 8,7 (dirección 135) 
  	lda puntero_tablero+135,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_8_7
  	incb
  	no_inc_9_8_8_7:
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_8_8
  	incb
  	no_inc_9_8_8_8:
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_8_9
  	incb
  	no_inc_9_8_8_9:
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_9_7
  	incb
  	no_inc_9_8_9_7:
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_9_9
  	incb
  	no_inc_9_8_9_9:
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_10_7
  	incb
  	no_inc_9_8_10_7:
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_10_8
  	incb
  	no_inc_9_8_10_8:
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_8_10_9
  	incb
  	no_inc_9_8_10_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+152,pcr
  	cmpa #'@
  	beq celda_viva_152
  	; Si está muerta
  	cmpb #3
  	beq nace_152
  	cmpb #6
  	beq nace_152
  	bra muere_152
  	celda_viva_152:
  	cmpb #2
  	beq vive_152
  	cmpb #3
  	beq vive_152
  	bra muere_152
  	nace_152:
  	lda #'@
  	sta puntero_tablero2+152,pcr
  	bra continuar_152
  	vive_152:
  	lda #'@
  	sta puntero_tablero2+152,pcr
  	bra continuar_152
  	muere_152:
  	lda #' 
  	sta puntero_tablero2+152,pcr
  	continuar_152:
  	
  	; Casilla 9,9 (dirección 153)
  	clrb
  	; Analizar casilla 8,8 (dirección 136) 
  	lda puntero_tablero+136,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_8_8
  	incb
  	no_inc_9_9_8_8:
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_8_9
  	incb
  	no_inc_9_9_8_9:
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_8_10
  	incb
  	no_inc_9_9_8_10:
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_9_8
  	incb
  	no_inc_9_9_9_8:
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_9_10
  	incb
  	no_inc_9_9_9_10:
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_10_8
  	incb
  	no_inc_9_9_10_8:
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_10_9
  	incb
  	no_inc_9_9_10_9:
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_9_10_10
  	incb
  	no_inc_9_9_10_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+153,pcr
  	cmpa #'@
  	beq celda_viva_153
  	; Si está muerta
  	cmpb #3
  	beq nace_153
  	cmpb #6
  	beq nace_153
  	bra muere_153
  	celda_viva_153:
  	cmpb #2
  	beq vive_153
  	cmpb #3
  	beq vive_153
  	bra muere_153
  	nace_153:
  	lda #'@
  	sta puntero_tablero2+153,pcr
  	bra continuar_153
  	vive_153:
  	lda #'@
  	sta puntero_tablero2+153,pcr
  	bra continuar_153
  	muere_153:
  	lda #' 
  	sta puntero_tablero2+153,pcr
  	continuar_153:
  	
  	; Casilla 9,10 (dirección 154)
  	clrb
  	; Analizar casilla 8,9 (dirección 137) 
  	lda puntero_tablero+137,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_8_9
  	incb
  	no_inc_9_10_8_9:
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_8_10
  	incb
  	no_inc_9_10_8_10:
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_8_11
  	incb
  	no_inc_9_10_8_11:
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_9_9
  	incb
  	no_inc_9_10_9_9:
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_9_11
  	incb
  	no_inc_9_10_9_11:
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_10_9
  	incb
  	no_inc_9_10_10_9:
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_10_10
  	incb
  	no_inc_9_10_10_10:
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_10_10_11
  	incb
  	no_inc_9_10_10_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+154,pcr
  	cmpa #'@
  	beq celda_viva_154
  	; Si está muerta
  	cmpb #3
  	beq nace_154
  	cmpb #6
  	beq nace_154
  	bra muere_154
  	celda_viva_154:
  	cmpb #2
  	beq vive_154
  	cmpb #3
  	beq vive_154
  	bra muere_154
  	nace_154:
  	lda #'@
  	sta puntero_tablero2+154,pcr
  	bra continuar_154
  	vive_154:
  	lda #'@
  	sta puntero_tablero2+154,pcr
  	bra continuar_154
  	muere_154:
  	lda #' 
  	sta puntero_tablero2+154,pcr
  	continuar_154:
  	
  	; Casilla 9,11 (dirección 155)
  	clrb
  	; Analizar casilla 8,10 (dirección 138) 
  	lda puntero_tablero+138,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_8_10
  	incb
  	no_inc_9_11_8_10:
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_8_11
  	incb
  	no_inc_9_11_8_11:
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_8_12
  	incb
  	no_inc_9_11_8_12:
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_9_10
  	incb
  	no_inc_9_11_9_10:
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_9_12
  	incb
  	no_inc_9_11_9_12:
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_10_10
  	incb
  	no_inc_9_11_10_10:
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_10_11
  	incb
  	no_inc_9_11_10_11:
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_11_10_12
  	incb
  	no_inc_9_11_10_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+155,pcr
  	cmpa #'@
  	beq celda_viva_155
  	; Si está muerta
  	cmpb #3
  	beq nace_155
  	cmpb #6
  	beq nace_155
  	bra muere_155
  	celda_viva_155:
  	cmpb #2
  	beq vive_155
  	cmpb #3
  	beq vive_155
  	bra muere_155
  	nace_155:
  	lda #'@
  	sta puntero_tablero2+155,pcr
  	bra continuar_155
  	vive_155:
  	lda #'@
  	sta puntero_tablero2+155,pcr
  	bra continuar_155
  	muere_155:
  	lda #' 
  	sta puntero_tablero2+155,pcr
  	continuar_155:
  	
  	; Casilla 9,12 (dirección 156)
  	clrb
  	; Analizar casilla 8,11 (dirección 139) 
  	lda puntero_tablero+139,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_8_11
  	incb
  	no_inc_9_12_8_11:
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_8_12
  	incb
  	no_inc_9_12_8_12:
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_8_13
  	incb
  	no_inc_9_12_8_13:
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_9_11
  	incb
  	no_inc_9_12_9_11:
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_9_13
  	incb
  	no_inc_9_12_9_13:
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_10_11
  	incb
  	no_inc_9_12_10_11:
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_10_12
  	incb
  	no_inc_9_12_10_12:
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_12_10_13
  	incb
  	no_inc_9_12_10_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+156,pcr
  	cmpa #'@
  	beq celda_viva_156
  	; Si está muerta
  	cmpb #3
  	beq nace_156
  	cmpb #6
  	beq nace_156
  	bra muere_156
  	celda_viva_156:
  	cmpb #2
  	beq vive_156
  	cmpb #3
  	beq vive_156
  	bra muere_156
  	nace_156:
  	lda #'@
  	sta puntero_tablero2+156,pcr
  	bra continuar_156
  	vive_156:
  	lda #'@
  	sta puntero_tablero2+156,pcr
  	bra continuar_156
  	muere_156:
  	lda #' 
  	sta puntero_tablero2+156,pcr
  	continuar_156:
  	
  	; Casilla 9,13 (dirección 157)
  	clrb
  	; Analizar casilla 8,12 (dirección 140) 
  	lda puntero_tablero+140,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_8_12
  	incb
  	no_inc_9_13_8_12:
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_8_13
  	incb
  	no_inc_9_13_8_13:
  	; Analizar casilla 8,14 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_8_14
  	incb
  	no_inc_9_13_8_14:
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_9_12
  	incb
  	no_inc_9_13_9_12:
  	; Analizar casilla 9,14 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_9_14
  	incb
  	no_inc_9_13_9_14:
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_10_12
  	incb
  	no_inc_9_13_10_12:
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_10_13
  	incb
  	no_inc_9_13_10_13:
  	; Analizar casilla 10,14 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_13_10_14
  	incb
  	no_inc_9_13_10_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+157,pcr
  	cmpa #'@
  	beq celda_viva_157
  	; Si está muerta
  	cmpb #3
  	beq nace_157
  	cmpb #6
  	beq nace_157
  	bra muere_157
  	celda_viva_157:
  	cmpb #2
  	beq vive_157
  	cmpb #3
  	beq vive_157
  	bra muere_157
  	nace_157:
  	lda #'@
  	sta puntero_tablero2+157,pcr
  	bra continuar_157
  	vive_157:
  	lda #'@
  	sta puntero_tablero2+157,pcr
  	bra continuar_157
  	muere_157:
  	lda #' 
  	sta puntero_tablero2+157,pcr
  	continuar_157:
  	
  	; Casilla 9,14 (dirección 158)
  	clrb
  	; Analizar casilla 8,13 (dirección 141) 
  	lda puntero_tablero+141,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_8_13
  	incb
  	no_inc_9_14_8_13:
  	; Analizar casilla 8,14 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_8_14
  	incb
  	no_inc_9_14_8_14:
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_8_15
  	incb
  	no_inc_9_14_8_15:
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_9_13
  	incb
  	no_inc_9_14_9_13:
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_9_15
  	incb
  	no_inc_9_14_9_15:
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_10_13
  	incb
  	no_inc_9_14_10_13:
  	; Analizar casilla 10,14 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_10_14
  	incb
  	no_inc_9_14_10_14:
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_14_10_15
  	incb
  	no_inc_9_14_10_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+158,pcr
  	cmpa #'@
  	beq celda_viva_158
  	; Si está muerta
  	cmpb #3
  	beq nace_158
  	cmpb #6
  	beq nace_158
  	bra muere_158
  	celda_viva_158:
  	cmpb #2
  	beq vive_158
  	cmpb #3
  	beq vive_158
  	bra muere_158
  	nace_158:
  	lda #'@
  	sta puntero_tablero2+158,pcr
  	bra continuar_158
  	vive_158:
  	lda #'@
  	sta puntero_tablero2+158,pcr
  	bra continuar_158
  	muere_158:
  	lda #' 
  	sta puntero_tablero2+158,pcr
  	continuar_158:
  	
  	; Casilla 9,15 (dirección 159)
  	clrb
  	; Analizar casilla 8,14 (dirección 142) 
  	lda puntero_tablero+142,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_8_14
  	incb
  	no_inc_9_15_8_14:
  	; Analizar casilla 8,15 (dirección 143) 
  	lda puntero_tablero+143,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_8_15
  	incb
  	no_inc_9_15_8_15:
  	; Analizar casilla 8,0 (dirección 128) 
  	lda puntero_tablero+128,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_8_0
  	incb
  	no_inc_9_15_8_0:
  	; Analizar casilla 9,14 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_9_14
  	incb
  	no_inc_9_15_9_14:
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_9_0
  	incb
  	no_inc_9_15_9_0:
  	; Analizar casilla 10,4 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_10_4
  	incb
  	no_inc_9_15_10_4:
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_10_15
  	incb
  	no_inc_9_15_10_15:
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_9_15_10_0
  	incb
  	no_inc_9_15_10_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+159,pcr
  	cmpa #'@
  	beq celda_viva_159
  	; Si está muerta
  	cmpb #3
  	beq nace_159
  	cmpb #6
  	beq nace_159
  	bra muere_159
  	celda_viva_159:
  	cmpb #2
  	beq vive_159
  	cmpb #3
  	beq vive_159
  	bra muere_159
  	nace_159:
  	lda #'@
  	sta puntero_tablero2+159,pcr
  	bra continuar_159
  	vive_159:
  	lda #'@
  	sta puntero_tablero2+159,pcr
  	bra continuar_159
  	muere_159:
  	lda #' 
  	sta puntero_tablero2+159,pcr
  	continuar_159:
  	
  	; Casilla 10,0 (dirección 160)
  	clrb
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_9_15
  	incb
  	no_inc_10_0_9_15:
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_9_0
  	incb
  	no_inc_10_0_9_0:
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_9_1
  	incb
  	no_inc_10_0_9_1:
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_10_15
  	incb
  	no_inc_10_0_10_15:
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_10_1
  	incb
  	no_inc_10_0_10_1:
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_11_15
  	incb
  	no_inc_10_0_11_15:
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_11_0
  	incb
  	no_inc_10_0_11_0:
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_0_11_1
  	incb
  	no_inc_10_0_11_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+160,pcr
  	cmpa #'@
  	beq celda_viva_160
  	; Si está muerta
  	cmpb #3
  	beq nace_160
  	cmpb #6
  	beq nace_160
  	bra muere_160
  	celda_viva_160:
  	cmpb #2
  	beq vive_160
  	cmpb #3
  	beq vive_160
  	bra muere_160
  	nace_160:
  	lda #'@
  	sta puntero_tablero2+160,pcr
  	bra continuar_160
  	vive_160:
  	lda #'@
  	sta puntero_tablero2+160,pcr
  	bra continuar_160
  	muere_160:
  	lda #' 
  	sta puntero_tablero2+160,pcr
  	continuar_160:
  	
  	; Casilla 10,1 (dirección 161)
  	clrb
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_9_0
  	incb
  	no_inc_10_1_9_0:
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_9_1
  	incb
  	no_inc_10_1_9_1:
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_9_2
  	incb
  	no_inc_10_1_9_2:
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_10_0
  	incb
  	no_inc_10_1_10_0:
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_10_2
  	incb
  	no_inc_10_1_10_2:
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_11_0
  	incb
  	no_inc_10_1_11_0:
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_11_1
  	incb
  	no_inc_10_1_11_1:
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_1_11_2
  	incb
  	no_inc_10_1_11_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+161,pcr
  	cmpa #'@
  	beq celda_viva_161
  	; Si está muerta
  	cmpb #3
  	beq nace_161
  	cmpb #6
  	beq nace_161
  	bra muere_161
  	celda_viva_161:
  	cmpb #2
  	beq vive_161
  	cmpb #3
  	beq vive_161
  	bra muere_161
  	nace_161:
  	lda #'@
  	sta puntero_tablero2+161,pcr
  	bra continuar_161
  	vive_161:
  	lda #'@
  	sta puntero_tablero2+161,pcr
  	bra continuar_161
  	muere_161:
  	lda #' 
  	sta puntero_tablero2+161,pcr
  	continuar_161:
  	
  	; Casilla 10,2 (dirección 162)
  	clrb
  	; Analizar casilla 9,1 (dirección 145) 
  	lda puntero_tablero+145,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_9_1
  	incb
  	no_inc_10_2_9_1:
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_9_2
  	incb
  	no_inc_10_2_9_2:
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_9_3
  	incb
  	no_inc_10_2_9_3:
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_10_1
  	incb
  	no_inc_10_2_10_1:
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_10_3
  	incb
  	no_inc_10_2_10_3:
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_11_1
  	incb
  	no_inc_10_2_11_1:
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_11_2
  	incb
  	no_inc_10_2_11_2:
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_2_11_3
  	incb
  	no_inc_10_2_11_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+162,pcr
  	cmpa #'@
  	beq celda_viva_162
  	; Si está muerta
  	cmpb #3
  	beq nace_162
  	cmpb #6
  	beq nace_162
  	bra muere_162
  	celda_viva_162:
  	cmpb #2
  	beq vive_162
  	cmpb #3
  	beq vive_162
  	bra muere_162
  	nace_162:
  	lda #'@
  	sta puntero_tablero2+162,pcr
  	bra continuar_162
  	vive_162:
  	lda #'@
  	sta puntero_tablero2+162,pcr
  	bra continuar_162
  	muere_162:
  	lda #' 
  	sta puntero_tablero2+162,pcr
  	continuar_162:
  	
  	; Casilla 10,3 (dirección 163)
  	clrb
  	; Analizar casilla 9,2 (dirección 146) 
  	lda puntero_tablero+146,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_9_2
  	incb
  	no_inc_10_3_9_2:
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_9_3
  	incb
  	no_inc_10_3_9_3:
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_9_4
  	incb
  	no_inc_10_3_9_4:
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_10_2
  	incb
  	no_inc_10_3_10_2:
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_10_4
  	incb
  	no_inc_10_3_10_4:
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_11_2
  	incb
  	no_inc_10_3_11_2:
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_11_3
  	incb
  	no_inc_10_3_11_3:
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_3_11_4
  	incb
  	no_inc_10_3_11_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+163,pcr
  	cmpa #'@
  	beq celda_viva_163
  	; Si está muerta
  	cmpb #3
  	beq nace_163
  	cmpb #6
  	beq nace_163
  	bra muere_163
  	celda_viva_163:
  	cmpb #2
  	beq vive_163
  	cmpb #3
  	beq vive_163
  	bra muere_163
  	nace_163:
  	lda #'@
  	sta puntero_tablero2+163,pcr
  	bra continuar_163
  	vive_163:
  	lda #'@
  	sta puntero_tablero2+163,pcr
  	bra continuar_163
  	muere_163:
  	lda #' 
  	sta puntero_tablero2+163,pcr
  	continuar_163:
  	
  	; Casilla 10,4 (dirección 164)
  	clrb
  	; Analizar casilla 9,3 (dirección 147) 
  	lda puntero_tablero+147,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_9_3
  	incb
  	no_inc_10_4_9_3:
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_9_4
  	incb
  	no_inc_10_4_9_4:
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_9_5
  	incb
  	no_inc_10_4_9_5:
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_10_3
  	incb
  	no_inc_10_4_10_3:
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_10_5
  	incb
  	no_inc_10_4_10_5:
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_11_3
  	incb
  	no_inc_10_4_11_3:
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_11_4
  	incb
  	no_inc_10_4_11_4:
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_4_11_5
  	incb
  	no_inc_10_4_11_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+164,pcr
  	cmpa #'@
  	beq celda_viva_164
  	; Si está muerta
  	cmpb #3
  	beq nace_164
  	cmpb #6
  	beq nace_164
  	bra muere_164
  	celda_viva_164:
  	cmpb #2
  	beq vive_164
  	cmpb #3
  	beq vive_164
  	bra muere_164
  	nace_164:
  	lda #'@
  	sta puntero_tablero2+164,pcr
  	bra continuar_164
  	vive_164:
  	lda #'@
  	sta puntero_tablero2+164,pcr
  	bra continuar_164
  	muere_164:
  	lda #' 
  	sta puntero_tablero2+164,pcr
  	continuar_164:
  	
  	; Casilla 10,5 (dirección 165)
  	clrb
  	; Analizar casilla 9,4 (dirección 148) 
  	lda puntero_tablero+148,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_9_4
  	incb
  	no_inc_10_5_9_4:
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_9_5
  	incb
  	no_inc_10_5_9_5:
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_9_6
  	incb
  	no_inc_10_5_9_6:
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_10_4
  	incb
  	no_inc_10_5_10_4:
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_10_6
  	incb
  	no_inc_10_5_10_6:
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_11_4
  	incb
  	no_inc_10_5_11_4:
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_11_5
  	incb
  	no_inc_10_5_11_5:
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_5_11_6
  	incb
  	no_inc_10_5_11_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+165,pcr
  	cmpa #'@
  	beq celda_viva_165
  	; Si está muerta
  	cmpb #3
  	beq nace_165
  	cmpb #6
  	beq nace_165
  	bra muere_165
  	celda_viva_165:
  	cmpb #2
  	beq vive_165
  	cmpb #3
  	beq vive_165
  	bra muere_165
  	nace_165:
  	lda #'@
  	sta puntero_tablero2+165,pcr
  	bra continuar_165
  	vive_165:
  	lda #'@
  	sta puntero_tablero2+165,pcr
  	bra continuar_165
  	muere_165:
  	lda #' 
  	sta puntero_tablero2+165,pcr
  	continuar_165:
  	
  	; Casilla 10,6 (dirección 166)
  	clrb
  	; Analizar casilla 9,5 (dirección 149) 
  	lda puntero_tablero+149,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_9_5
  	incb
  	no_inc_10_6_9_5:
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_9_6
  	incb
  	no_inc_10_6_9_6:
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_9_7
  	incb
  	no_inc_10_6_9_7:
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_10_5
  	incb
  	no_inc_10_6_10_5:
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_10_7
  	incb
  	no_inc_10_6_10_7:
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_11_5
  	incb
  	no_inc_10_6_11_5:
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_11_6
  	incb
  	no_inc_10_6_11_6:
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_6_11_7
  	incb
  	no_inc_10_6_11_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+166,pcr
  	cmpa #'@
  	beq celda_viva_166
  	; Si está muerta
  	cmpb #3
  	beq nace_166
  	cmpb #6
  	beq nace_166
  	bra muere_166
  	celda_viva_166:
  	cmpb #2
  	beq vive_166
  	cmpb #3
  	beq vive_166
  	bra muere_166
  	nace_166:
  	lda #'@
  	sta puntero_tablero2+166,pcr
  	bra continuar_166
  	vive_166:
  	lda #'@
  	sta puntero_tablero2+166,pcr
  	bra continuar_166
  	muere_166:
  	lda #' 
  	sta puntero_tablero2+166,pcr
  	continuar_166:
  	
  	; Casilla 10,7 (dirección 167)
  	clrb
  	; Analizar casilla 9,6 (dirección 150) 
  	lda puntero_tablero+150,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_9_6
  	incb
  	no_inc_10_7_9_6:
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_9_7
  	incb
  	no_inc_10_7_9_7:
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_9_8
  	incb
  	no_inc_10_7_9_8:
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_10_6
  	incb
  	no_inc_10_7_10_6:
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_10_8
  	incb
  	no_inc_10_7_10_8:
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_11_6
  	incb
  	no_inc_10_7_11_6:
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_11_7
  	incb
  	no_inc_10_7_11_7:
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_7_11_8
  	incb
  	no_inc_10_7_11_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+167,pcr
  	cmpa #'@
  	beq celda_viva_167
  	; Si está muerta
  	cmpb #3
  	beq nace_167
  	cmpb #6
  	beq nace_167
  	bra muere_167
  	celda_viva_167:
  	cmpb #2
  	beq vive_167
  	cmpb #3
  	beq vive_167
  	bra muere_167
  	nace_167:
  	lda #'@
  	sta puntero_tablero2+167,pcr
  	bra continuar_167
  	vive_167:
  	lda #'@
  	sta puntero_tablero2+167,pcr
  	bra continuar_167
  	muere_167:
  	lda #' 
  	sta puntero_tablero2+167,pcr
  	continuar_167:
  	
  	; Casilla 10,8 (dirección 168)
  	clrb
  	; Analizar casilla 9,7 (dirección 151) 
  	lda puntero_tablero+151,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_9_7
  	incb
  	no_inc_10_8_9_7:
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_9_8
  	incb
  	no_inc_10_8_9_8:
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_9_9
  	incb
  	no_inc_10_8_9_9:
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_10_7
  	incb
  	no_inc_10_8_10_7:
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_10_9
  	incb
  	no_inc_10_8_10_9:
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_11_7
  	incb
  	no_inc_10_8_11_7:
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_11_8
  	incb
  	no_inc_10_8_11_8:
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_8_11_9
  	incb
  	no_inc_10_8_11_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+168,pcr
  	cmpa #'@
  	beq celda_viva_168
  	; Si está muerta
  	cmpb #3
  	beq nace_168
  	cmpb #6
  	beq nace_168
  	bra muere_168
  	celda_viva_168:
  	cmpb #2
  	beq vive_168
  	cmpb #3
  	beq vive_168
  	bra muere_168
  	nace_168:
  	lda #'@
  	sta puntero_tablero2+168,pcr
  	bra continuar_168
  	vive_168:
  	lda #'@
  	sta puntero_tablero2+168,pcr
  	bra continuar_168
  	muere_168:
  	lda #' 
  	sta puntero_tablero2+168,pcr
  	continuar_168:
  	
  	; Casilla 10,9 (dirección 169)
  	clrb
  	; Analizar casilla 9,8 (dirección 152) 
  	lda puntero_tablero+152,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_9_8
  	incb
  	no_inc_10_9_9_8:
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_9_9
  	incb
  	no_inc_10_9_9_9:
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_9_10
  	incb
  	no_inc_10_9_9_10:
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_10_8
  	incb
  	no_inc_10_9_10_8:
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_10_10
  	incb
  	no_inc_10_9_10_10:
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_11_8
  	incb
  	no_inc_10_9_11_8:
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_11_9
  	incb
  	no_inc_10_9_11_9:
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_9_11_10
  	incb
  	no_inc_10_9_11_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+169,pcr
  	cmpa #'@
  	beq celda_viva_169
  	; Si está muerta
  	cmpb #3
  	beq nace_169
  	cmpb #6
  	beq nace_169
  	bra muere_169
  	celda_viva_169:
  	cmpb #2
  	beq vive_169
  	cmpb #3
  	beq vive_169
  	bra muere_169
  	nace_169:
  	lda #'@
  	sta puntero_tablero2+169,pcr
  	bra continuar_169
  	vive_169:
  	lda #'@
  	sta puntero_tablero2+169,pcr
  	bra continuar_169
  	muere_169:
  	lda #' 
  	sta puntero_tablero2+169,pcr
  	continuar_169:
  	
  	; Casilla 10,10 (dirección 170)
  	clrb
  	; Analizar casilla 9,9 (dirección 153) 
  	lda puntero_tablero+153,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_9_9
  	incb
  	no_inc_10_10_9_9:
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_9_10
  	incb
  	no_inc_10_10_9_10:
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_9_11
  	incb
  	no_inc_10_10_9_11:
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_10_9
  	incb
  	no_inc_10_10_10_9:
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_10_11
  	incb
  	no_inc_10_10_10_11:
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_11_9
  	incb
  	no_inc_10_10_11_9:
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_11_10
  	incb
  	no_inc_10_10_11_10:
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_10_11_11
  	incb
  	no_inc_10_10_11_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+170,pcr
  	cmpa #'@
  	beq celda_viva_170
  	; Si está muerta
  	cmpb #3
  	beq nace_170
  	cmpb #6
  	beq nace_170
  	bra muere_170
  	celda_viva_170:
  	cmpb #2
  	beq vive_170
  	cmpb #3
  	beq vive_170
  	bra muere_170
  	nace_170:
  	lda #'@
  	sta puntero_tablero2+170,pcr
  	bra continuar_170
  	vive_170:
  	lda #'@
  	sta puntero_tablero2+170,pcr
  	bra continuar_170
  	muere_170:
  	lda #' 
  	sta puntero_tablero2+170,pcr
  	continuar_170:
  	
  	; Casilla 10,11 (dirección 171)
  	clrb
  	; Analizar casilla 9,10 (dirección 154) 
  	lda puntero_tablero+154,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_9_10
  	incb
  	no_inc_10_11_9_10:
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_9_11
  	incb
  	no_inc_10_11_9_11:
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_9_12
  	incb
  	no_inc_10_11_9_12:
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_10_10
  	incb
  	no_inc_10_11_10_10:
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_10_12
  	incb
  	no_inc_10_11_10_12:
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_11_10
  	incb
  	no_inc_10_11_11_10:
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_11_11
  	incb
  	no_inc_10_11_11_11:
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_11_11_12
  	incb
  	no_inc_10_11_11_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+171,pcr
  	cmpa #'@
  	beq celda_viva_171
  	; Si está muerta
  	cmpb #3
  	beq nace_171
  	cmpb #6
  	beq nace_171
  	bra muere_171
  	celda_viva_171:
  	cmpb #2
  	beq vive_171
  	cmpb #3
  	beq vive_171
  	bra muere_171
  	nace_171:
  	lda #'@
  	sta puntero_tablero2+171,pcr
  	bra continuar_171
  	vive_171:
  	lda #'@
  	sta puntero_tablero2+171,pcr
  	bra continuar_171
  	muere_171:
  	lda #' 
  	sta puntero_tablero2+171,pcr
  	continuar_171:
  	
  	; Casilla 10,12 (dirección 172)
  	clrb
  	; Analizar casilla 9,11 (dirección 155) 
  	lda puntero_tablero+155,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_9_11
  	incb
  	no_inc_10_12_9_11:
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_9_12
  	incb
  	no_inc_10_12_9_12:
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_9_13
  	incb
  	no_inc_10_12_9_13:
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_10_11
  	incb
  	no_inc_10_12_10_11:
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_10_13
  	incb
  	no_inc_10_12_10_13:
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_11_11
  	incb
  	no_inc_10_12_11_11:
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_11_12
  	incb
  	no_inc_10_12_11_12:
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_12_11_13
  	incb
  	no_inc_10_12_11_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+172,pcr
  	cmpa #'@
  	beq celda_viva_172
  	; Si está muerta
  	cmpb #3
  	beq nace_172
  	cmpb #6
  	beq nace_172
  	bra muere_172
  	celda_viva_172:
  	cmpb #2
  	beq vive_172
  	cmpb #3
  	beq vive_172
  	bra muere_172
  	nace_172:
  	lda #'@
  	sta puntero_tablero2+172,pcr
  	bra continuar_172
  	vive_172:
  	lda #'@
  	sta puntero_tablero2+172,pcr
  	bra continuar_172
  	muere_172:
  	lda #' 
  	sta puntero_tablero2+172,pcr
  	continuar_172:
  	
  	; Casilla 10,13 (dirección 173)
  	clrb
  	; Analizar casilla 9,12 (dirección 156) 
  	lda puntero_tablero+156,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_9_12
  	incb
  	no_inc_10_13_9_12:
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_9_13
  	incb
  	no_inc_10_13_9_13:
  	; Analizar casilla 9,14 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_9_14
  	incb
  	no_inc_10_13_9_14:
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_10_12
  	incb
  	no_inc_10_13_10_12:
  	; Analizar casilla 10,14 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_10_14
  	incb
  	no_inc_10_13_10_14:
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_11_12
  	incb
  	no_inc_10_13_11_12:
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_11_13
  	incb
  	no_inc_10_13_11_13:
  	; Analizar casilla 11,14 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_13_11_14
  	incb
  	no_inc_10_13_11_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+173,pcr
  	cmpa #'@
  	beq celda_viva_173
  	; Si está muerta
  	cmpb #3
  	beq nace_173
  	cmpb #6
  	beq nace_173
  	bra muere_173
  	celda_viva_173:
  	cmpb #2
  	beq vive_173
  	cmpb #3
  	beq vive_173
  	bra muere_173
  	nace_173:
  	lda #'@
  	sta puntero_tablero2+173,pcr
  	bra continuar_173
  	vive_173:
  	lda #'@
  	sta puntero_tablero2+173,pcr
  	bra continuar_173
  	muere_173:
  	lda #' 
  	sta puntero_tablero2+173,pcr
  	continuar_173:
  	
  	; Casilla 10,14 (dirección 174)
  	clrb
  	; Analizar casilla 9,13 (dirección 157) 
  	lda puntero_tablero+157,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_9_13
  	incb
  	no_inc_10_14_9_13:
  	; Analizar casilla 9,14 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_9_14
  	incb
  	no_inc_10_14_9_14:
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_9_15
  	incb
  	no_inc_10_14_9_15:
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_10_13
  	incb
  	no_inc_10_14_10_13:
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_10_15
  	incb
  	no_inc_10_14_10_15:
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_11_13
  	incb
  	no_inc_10_14_11_13:
  	; Analizar casilla 11,14 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_11_14
  	incb
  	no_inc_10_14_11_14:
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_14_11_15
  	incb
  	no_inc_10_14_11_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+174,pcr
  	cmpa #'@
  	beq celda_viva_174
  	; Si está muerta
  	cmpb #3
  	beq nace_174
  	cmpb #6
  	beq nace_174
  	bra muere_174
  	celda_viva_174:
  	cmpb #2
  	beq vive_174
  	cmpb #3
  	beq vive_174
  	bra muere_174
  	nace_174:
  	lda #'@
  	sta puntero_tablero2+174,pcr
  	bra continuar_174
  	vive_174:
  	lda #'@
  	sta puntero_tablero2+174,pcr
  	bra continuar_174
  	muere_174:
  	lda #' 
  	sta puntero_tablero2+174,pcr
  	continuar_174:
  	
  	; Casilla 10,15 (dirección 175)
  	clrb
  	; Analizar casilla 9,14 (dirección 158) 
  	lda puntero_tablero+158,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_9_14
  	incb
  	no_inc_10_15_9_14:
  	; Analizar casilla 9,15 (dirección 159) 
  	lda puntero_tablero+159,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_9_15
  	incb
  	no_inc_10_15_9_15:
  	; Analizar casilla 9,0 (dirección 144) 
  	lda puntero_tablero+144,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_9_0
  	incb
  	no_inc_10_15_9_0:
  	; Analizar casilla 10,14 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_10_14
  	incb
  	no_inc_10_15_10_14:
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_10_0
  	incb
  	no_inc_10_15_10_0:
  	; Analizar casilla 11,3 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_11_3
  	incb
  	no_inc_10_15_11_3:
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_11_15
  	incb
  	no_inc_10_15_11_15:
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_10_15_11_0
  	incb
  	no_inc_10_15_11_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+175,pcr
  	cmpa #'@
  	beq celda_viva_175
  	; Si está muerta
  	cmpb #3
  	beq nace_175
  	cmpb #6
  	beq nace_175
  	bra muere_175
  	celda_viva_175:
  	cmpb #2
  	beq vive_175
  	cmpb #3
  	beq vive_175
  	bra muere_175
  	nace_175:
  	lda #'@
  	sta puntero_tablero2+175,pcr
  	bra continuar_175
  	vive_175:
  	lda #'@
  	sta puntero_tablero2+175,pcr
  	bra continuar_175
  	muere_175:
  	lda #' 
  	sta puntero_tablero2+175,pcr
  	continuar_175:
  	
  	; Casilla 11,0 (dirección 176)
  	clrb
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_10_15
  	incb
  	no_inc_11_0_10_15:
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_10_0
  	incb
  	no_inc_11_0_10_0:
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_10_1
  	incb
  	no_inc_11_0_10_1:
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_11_15
  	incb
  	no_inc_11_0_11_15:
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_11_1
  	incb
  	no_inc_11_0_11_1:
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_12_15
  	incb
  	no_inc_11_0_12_15:
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_12_0
  	incb
  	no_inc_11_0_12_0:
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_0_12_1
  	incb
  	no_inc_11_0_12_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+176,pcr
  	cmpa #'@
  	beq celda_viva_176
  	; Si está muerta
  	cmpb #3
  	beq nace_176
  	cmpb #6
  	beq nace_176
  	bra muere_176
  	celda_viva_176:
  	cmpb #2
  	beq vive_176
  	cmpb #3
  	beq vive_176
  	bra muere_176
  	nace_176:
  	lda #'@
  	sta puntero_tablero2+176,pcr
  	bra continuar_176
  	vive_176:
  	lda #'@
  	sta puntero_tablero2+176,pcr
  	bra continuar_176
  	muere_176:
  	lda #' 
  	sta puntero_tablero2+176,pcr
  	continuar_176:
  	
  	; Casilla 11,1 (dirección 177)
  	clrb
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_10_0
  	incb
  	no_inc_11_1_10_0:
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_10_1
  	incb
  	no_inc_11_1_10_1:
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_10_2
  	incb
  	no_inc_11_1_10_2:
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_11_0
  	incb
  	no_inc_11_1_11_0:
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_11_2
  	incb
  	no_inc_11_1_11_2:
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_12_0
  	incb
  	no_inc_11_1_12_0:
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_12_1
  	incb
  	no_inc_11_1_12_1:
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_1_12_2
  	incb
  	no_inc_11_1_12_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+177,pcr
  	cmpa #'@
  	beq celda_viva_177
  	; Si está muerta
  	cmpb #3
  	beq nace_177
  	cmpb #6
  	beq nace_177
  	bra muere_177
  	celda_viva_177:
  	cmpb #2
  	beq vive_177
  	cmpb #3
  	beq vive_177
  	bra muere_177
  	nace_177:
  	lda #'@
  	sta puntero_tablero2+177,pcr
  	bra continuar_177
  	vive_177:
  	lda #'@
  	sta puntero_tablero2+177,pcr
  	bra continuar_177
  	muere_177:
  	lda #' 
  	sta puntero_tablero2+177,pcr
  	continuar_177:
  	
  	; Casilla 11,2 (dirección 178)
  	clrb
  	; Analizar casilla 10,1 (dirección 161) 
  	lda puntero_tablero+161,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_10_1
  	incb
  	no_inc_11_2_10_1:
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_10_2
  	incb
  	no_inc_11_2_10_2:
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_10_3
  	incb
  	no_inc_11_2_10_3:
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_11_1
  	incb
  	no_inc_11_2_11_1:
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_11_3
  	incb
  	no_inc_11_2_11_3:
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_12_1
  	incb
  	no_inc_11_2_12_1:
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_12_2
  	incb
  	no_inc_11_2_12_2:
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_2_12_3
  	incb
  	no_inc_11_2_12_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+178,pcr
  	cmpa #'@
  	beq celda_viva_178
  	; Si está muerta
  	cmpb #3
  	beq nace_178
  	cmpb #6
  	beq nace_178
  	bra muere_178
  	celda_viva_178:
  	cmpb #2
  	beq vive_178
  	cmpb #3
  	beq vive_178
  	bra muere_178
  	nace_178:
  	lda #'@
  	sta puntero_tablero2+178,pcr
  	bra continuar_178
  	vive_178:
  	lda #'@
  	sta puntero_tablero2+178,pcr
  	bra continuar_178
  	muere_178:
  	lda #' 
  	sta puntero_tablero2+178,pcr
  	continuar_178:
  	
  	; Casilla 11,3 (dirección 179)
  	clrb
  	; Analizar casilla 10,2 (dirección 162) 
  	lda puntero_tablero+162,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_10_2
  	incb
  	no_inc_11_3_10_2:
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_10_3
  	incb
  	no_inc_11_3_10_3:
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_10_4
  	incb
  	no_inc_11_3_10_4:
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_11_2
  	incb
  	no_inc_11_3_11_2:
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_11_4
  	incb
  	no_inc_11_3_11_4:
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_12_2
  	incb
  	no_inc_11_3_12_2:
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_12_3
  	incb
  	no_inc_11_3_12_3:
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_3_12_4
  	incb
  	no_inc_11_3_12_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+179,pcr
  	cmpa #'@
  	beq celda_viva_179
  	; Si está muerta
  	cmpb #3
  	beq nace_179
  	cmpb #6
  	beq nace_179
  	bra muere_179
  	celda_viva_179:
  	cmpb #2
  	beq vive_179
  	cmpb #3
  	beq vive_179
  	bra muere_179
  	nace_179:
  	lda #'@
  	sta puntero_tablero2+179,pcr
  	bra continuar_179
  	vive_179:
  	lda #'@
  	sta puntero_tablero2+179,pcr
  	bra continuar_179
  	muere_179:
  	lda #' 
  	sta puntero_tablero2+179,pcr
  	continuar_179:
  	
  	; Casilla 11,4 (dirección 180)
  	clrb
  	; Analizar casilla 10,3 (dirección 163) 
  	lda puntero_tablero+163,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_10_3
  	incb
  	no_inc_11_4_10_3:
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_10_4
  	incb
  	no_inc_11_4_10_4:
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_10_5
  	incb
  	no_inc_11_4_10_5:
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_11_3
  	incb
  	no_inc_11_4_11_3:
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_11_5
  	incb
  	no_inc_11_4_11_5:
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_12_3
  	incb
  	no_inc_11_4_12_3:
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_12_4
  	incb
  	no_inc_11_4_12_4:
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_4_12_5
  	incb
  	no_inc_11_4_12_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+180,pcr
  	cmpa #'@
  	beq celda_viva_180
  	; Si está muerta
  	cmpb #3
  	beq nace_180
  	cmpb #6
  	beq nace_180
  	bra muere_180
  	celda_viva_180:
  	cmpb #2
  	beq vive_180
  	cmpb #3
  	beq vive_180
  	bra muere_180
  	nace_180:
  	lda #'@
  	sta puntero_tablero2+180,pcr
  	bra continuar_180
  	vive_180:
  	lda #'@
  	sta puntero_tablero2+180,pcr
  	bra continuar_180
  	muere_180:
  	lda #' 
  	sta puntero_tablero2+180,pcr
  	continuar_180:
  	
  	; Casilla 11,5 (dirección 181)
  	clrb
  	; Analizar casilla 10,4 (dirección 164) 
  	lda puntero_tablero+164,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_10_4
  	incb
  	no_inc_11_5_10_4:
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_10_5
  	incb
  	no_inc_11_5_10_5:
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_10_6
  	incb
  	no_inc_11_5_10_6:
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_11_4
  	incb
  	no_inc_11_5_11_4:
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_11_6
  	incb
  	no_inc_11_5_11_6:
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_12_4
  	incb
  	no_inc_11_5_12_4:
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_12_5
  	incb
  	no_inc_11_5_12_5:
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_5_12_6
  	incb
  	no_inc_11_5_12_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+181,pcr
  	cmpa #'@
  	beq celda_viva_181
  	; Si está muerta
  	cmpb #3
  	beq nace_181
  	cmpb #6
  	beq nace_181
  	bra muere_181
  	celda_viva_181:
  	cmpb #2
  	beq vive_181
  	cmpb #3
  	beq vive_181
  	bra muere_181
  	nace_181:
  	lda #'@
  	sta puntero_tablero2+181,pcr
  	bra continuar_181
  	vive_181:
  	lda #'@
  	sta puntero_tablero2+181,pcr
  	bra continuar_181
  	muere_181:
  	lda #' 
  	sta puntero_tablero2+181,pcr
  	continuar_181:
  	
  	; Casilla 11,6 (dirección 182)
  	clrb
  	; Analizar casilla 10,5 (dirección 165) 
  	lda puntero_tablero+165,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_10_5
  	incb
  	no_inc_11_6_10_5:
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_10_6
  	incb
  	no_inc_11_6_10_6:
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_10_7
  	incb
  	no_inc_11_6_10_7:
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_11_5
  	incb
  	no_inc_11_6_11_5:
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_11_7
  	incb
  	no_inc_11_6_11_7:
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_12_5
  	incb
  	no_inc_11_6_12_5:
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_12_6
  	incb
  	no_inc_11_6_12_6:
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_6_12_7
  	incb
  	no_inc_11_6_12_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+182,pcr
  	cmpa #'@
  	beq celda_viva_182
  	; Si está muerta
  	cmpb #3
  	beq nace_182
  	cmpb #6
  	beq nace_182
  	bra muere_182
  	celda_viva_182:
  	cmpb #2
  	beq vive_182
  	cmpb #3
  	beq vive_182
  	bra muere_182
  	nace_182:
  	lda #'@
  	sta puntero_tablero2+182,pcr
  	bra continuar_182
  	vive_182:
  	lda #'@
  	sta puntero_tablero2+182,pcr
  	bra continuar_182
  	muere_182:
  	lda #' 
  	sta puntero_tablero2+182,pcr
  	continuar_182:
  	
  	; Casilla 11,7 (dirección 183)
  	clrb
  	; Analizar casilla 10,6 (dirección 166) 
  	lda puntero_tablero+166,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_10_6
  	incb
  	no_inc_11_7_10_6:
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_10_7
  	incb
  	no_inc_11_7_10_7:
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_10_8
  	incb
  	no_inc_11_7_10_8:
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_11_6
  	incb
  	no_inc_11_7_11_6:
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_11_8
  	incb
  	no_inc_11_7_11_8:
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_12_6
  	incb
  	no_inc_11_7_12_6:
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_12_7
  	incb
  	no_inc_11_7_12_7:
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_7_12_8
  	incb
  	no_inc_11_7_12_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+183,pcr
  	cmpa #'@
  	beq celda_viva_183
  	; Si está muerta
  	cmpb #3
  	beq nace_183
  	cmpb #6
  	beq nace_183
  	bra muere_183
  	celda_viva_183:
  	cmpb #2
  	beq vive_183
  	cmpb #3
  	beq vive_183
  	bra muere_183
  	nace_183:
  	lda #'@
  	sta puntero_tablero2+183,pcr
  	bra continuar_183
  	vive_183:
  	lda #'@
  	sta puntero_tablero2+183,pcr
  	bra continuar_183
  	muere_183:
  	lda #' 
  	sta puntero_tablero2+183,pcr
  	continuar_183:
  	
  	; Casilla 11,8 (dirección 184)
  	clrb
  	; Analizar casilla 10,7 (dirección 167) 
  	lda puntero_tablero+167,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_10_7
  	incb
  	no_inc_11_8_10_7:
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_10_8
  	incb
  	no_inc_11_8_10_8:
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_10_9
  	incb
  	no_inc_11_8_10_9:
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_11_7
  	incb
  	no_inc_11_8_11_7:
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_11_9
  	incb
  	no_inc_11_8_11_9:
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_12_7
  	incb
  	no_inc_11_8_12_7:
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_12_8
  	incb
  	no_inc_11_8_12_8:
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_8_12_9
  	incb
  	no_inc_11_8_12_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+184,pcr
  	cmpa #'@
  	beq celda_viva_184
  	; Si está muerta
  	cmpb #3
  	beq nace_184
  	cmpb #6
  	beq nace_184
  	bra muere_184
  	celda_viva_184:
  	cmpb #2
  	beq vive_184
  	cmpb #3
  	beq vive_184
  	bra muere_184
  	nace_184:
  	lda #'@
  	sta puntero_tablero2+184,pcr
  	bra continuar_184
  	vive_184:
  	lda #'@
  	sta puntero_tablero2+184,pcr
  	bra continuar_184
  	muere_184:
  	lda #' 
  	sta puntero_tablero2+184,pcr
  	continuar_184:
  	
  	; Casilla 11,9 (dirección 185)
  	clrb
  	; Analizar casilla 10,8 (dirección 168) 
  	lda puntero_tablero+168,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_10_8
  	incb
  	no_inc_11_9_10_8:
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_10_9
  	incb
  	no_inc_11_9_10_9:
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_10_10
  	incb
  	no_inc_11_9_10_10:
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_11_8
  	incb
  	no_inc_11_9_11_8:
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_11_10
  	incb
  	no_inc_11_9_11_10:
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_12_8
  	incb
  	no_inc_11_9_12_8:
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_12_9
  	incb
  	no_inc_11_9_12_9:
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_9_12_10
  	incb
  	no_inc_11_9_12_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+185,pcr
  	cmpa #'@
  	beq celda_viva_185
  	; Si está muerta
  	cmpb #3
  	beq nace_185
  	cmpb #6
  	beq nace_185
  	bra muere_185
  	celda_viva_185:
  	cmpb #2
  	beq vive_185
  	cmpb #3
  	beq vive_185
  	bra muere_185
  	nace_185:
  	lda #'@
  	sta puntero_tablero2+185,pcr
  	bra continuar_185
  	vive_185:
  	lda #'@
  	sta puntero_tablero2+185,pcr
  	bra continuar_185
  	muere_185:
  	lda #' 
  	sta puntero_tablero2+185,pcr
  	continuar_185:
  	
  	; Casilla 11,10 (dirección 186)
  	clrb
  	; Analizar casilla 10,9 (dirección 169) 
  	lda puntero_tablero+169,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_10_9
  	incb
  	no_inc_11_10_10_9:
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_10_10
  	incb
  	no_inc_11_10_10_10:
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_10_11
  	incb
  	no_inc_11_10_10_11:
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_11_9
  	incb
  	no_inc_11_10_11_9:
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_11_11
  	incb
  	no_inc_11_10_11_11:
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_12_9
  	incb
  	no_inc_11_10_12_9:
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_12_10
  	incb
  	no_inc_11_10_12_10:
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_10_12_11
  	incb
  	no_inc_11_10_12_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+186,pcr
  	cmpa #'@
  	beq celda_viva_186
  	; Si está muerta
  	cmpb #3
  	beq nace_186
  	cmpb #6
  	beq nace_186
  	bra muere_186
  	celda_viva_186:
  	cmpb #2
  	beq vive_186
  	cmpb #3
  	beq vive_186
  	bra muere_186
  	nace_186:
  	lda #'@
  	sta puntero_tablero2+186,pcr
  	bra continuar_186
  	vive_186:
  	lda #'@
  	sta puntero_tablero2+186,pcr
  	bra continuar_186
  	muere_186:
  	lda #' 
  	sta puntero_tablero2+186,pcr
  	continuar_186:
  	
  	; Casilla 11,11 (dirección 187)
  	clrb
  	; Analizar casilla 10,10 (dirección 170) 
  	lda puntero_tablero+170,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_10_10
  	incb
  	no_inc_11_11_10_10:
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_10_11
  	incb
  	no_inc_11_11_10_11:
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_10_12
  	incb
  	no_inc_11_11_10_12:
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_11_10
  	incb
  	no_inc_11_11_11_10:
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_11_12
  	incb
  	no_inc_11_11_11_12:
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_12_10
  	incb
  	no_inc_11_11_12_10:
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_12_11
  	incb
  	no_inc_11_11_12_11:
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_11_12_12
  	incb
  	no_inc_11_11_12_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+187,pcr
  	cmpa #'@
  	beq celda_viva_187
  	; Si está muerta
  	cmpb #3
  	beq nace_187
  	cmpb #6
  	beq nace_187
  	bra muere_187
  	celda_viva_187:
  	cmpb #2
  	beq vive_187
  	cmpb #3
  	beq vive_187
  	bra muere_187
  	nace_187:
  	lda #'@
  	sta puntero_tablero2+187,pcr
  	bra continuar_187
  	vive_187:
  	lda #'@
  	sta puntero_tablero2+187,pcr
  	bra continuar_187
  	muere_187:
  	lda #' 
  	sta puntero_tablero2+187,pcr
  	continuar_187:
  	
  	; Casilla 11,12 (dirección 188)
  	clrb
  	; Analizar casilla 10,11 (dirección 171) 
  	lda puntero_tablero+171,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_10_11
  	incb
  	no_inc_11_12_10_11:
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_10_12
  	incb
  	no_inc_11_12_10_12:
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_10_13
  	incb
  	no_inc_11_12_10_13:
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_11_11
  	incb
  	no_inc_11_12_11_11:
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_11_13
  	incb
  	no_inc_11_12_11_13:
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_12_11
  	incb
  	no_inc_11_12_12_11:
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_12_12
  	incb
  	no_inc_11_12_12_12:
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_12_12_13
  	incb
  	no_inc_11_12_12_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+188,pcr
  	cmpa #'@
  	beq celda_viva_188
  	; Si está muerta
  	cmpb #3
  	beq nace_188
  	cmpb #6
  	beq nace_188
  	bra muere_188
  	celda_viva_188:
  	cmpb #2
  	beq vive_188
  	cmpb #3
  	beq vive_188
  	bra muere_188
  	nace_188:
  	lda #'@
  	sta puntero_tablero2+188,pcr
  	bra continuar_188
  	vive_188:
  	lda #'@
  	sta puntero_tablero2+188,pcr
  	bra continuar_188
  	muere_188:
  	lda #' 
  	sta puntero_tablero2+188,pcr
  	continuar_188:
  	
  	; Casilla 11,13 (dirección 189)
  	clrb
  	; Analizar casilla 10,12 (dirección 172) 
  	lda puntero_tablero+172,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_10_12
  	incb
  	no_inc_11_13_10_12:
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_10_13
  	incb
  	no_inc_11_13_10_13:
  	; Analizar casilla 10,14 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_10_14
  	incb
  	no_inc_11_13_10_14:
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_11_12
  	incb
  	no_inc_11_13_11_12:
  	; Analizar casilla 11,14 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_11_14
  	incb
  	no_inc_11_13_11_14:
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_12_12
  	incb
  	no_inc_11_13_12_12:
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_12_13
  	incb
  	no_inc_11_13_12_13:
  	; Analizar casilla 12,14 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_13_12_14
  	incb
  	no_inc_11_13_12_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+189,pcr
  	cmpa #'@
  	beq celda_viva_189
  	; Si está muerta
  	cmpb #3
  	beq nace_189
  	cmpb #6
  	beq nace_189
  	bra muere_189
  	celda_viva_189:
  	cmpb #2
  	beq vive_189
  	cmpb #3
  	beq vive_189
  	bra muere_189
  	nace_189:
  	lda #'@
  	sta puntero_tablero2+189,pcr
  	bra continuar_189
  	vive_189:
  	lda #'@
  	sta puntero_tablero2+189,pcr
  	bra continuar_189
  	muere_189:
  	lda #' 
  	sta puntero_tablero2+189,pcr
  	continuar_189:
  	
  	; Casilla 11,14 (dirección 190)
  	clrb
  	; Analizar casilla 10,13 (dirección 173) 
  	lda puntero_tablero+173,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_10_13
  	incb
  	no_inc_11_14_10_13:
  	; Analizar casilla 10,14 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_10_14
  	incb
  	no_inc_11_14_10_14:
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_10_15
  	incb
  	no_inc_11_14_10_15:
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_11_13
  	incb
  	no_inc_11_14_11_13:
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_11_15
  	incb
  	no_inc_11_14_11_15:
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_12_13
  	incb
  	no_inc_11_14_12_13:
  	; Analizar casilla 12,14 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_12_14
  	incb
  	no_inc_11_14_12_14:
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_14_12_15
  	incb
  	no_inc_11_14_12_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+190,pcr
  	cmpa #'@
  	beq celda_viva_190
  	; Si está muerta
  	cmpb #3
  	beq nace_190
  	cmpb #6
  	beq nace_190
  	bra muere_190
  	celda_viva_190:
  	cmpb #2
  	beq vive_190
  	cmpb #3
  	beq vive_190
  	bra muere_190
  	nace_190:
  	lda #'@
  	sta puntero_tablero2+190,pcr
  	bra continuar_190
  	vive_190:
  	lda #'@
  	sta puntero_tablero2+190,pcr
  	bra continuar_190
  	muere_190:
  	lda #' 
  	sta puntero_tablero2+190,pcr
  	continuar_190:
  	
  	; Casilla 11,15 (dirección 191)
  	clrb
  	; Analizar casilla 10,14 (dirección 174) 
  	lda puntero_tablero+174,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_10_14
  	incb
  	no_inc_11_15_10_14:
  	; Analizar casilla 10,15 (dirección 175) 
  	lda puntero_tablero+175,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_10_15
  	incb
  	no_inc_11_15_10_15:
  	; Analizar casilla 10,0 (dirección 160) 
  	lda puntero_tablero+160,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_10_0
  	incb
  	no_inc_11_15_10_0:
  	; Analizar casilla 11,14 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_11_14
  	incb
  	no_inc_11_15_11_14:
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_11_0
  	incb
  	no_inc_11_15_11_0:
  	; Analizar casilla 12,2 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_12_2
  	incb
  	no_inc_11_15_12_2:
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_12_15
  	incb
  	no_inc_11_15_12_15:
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_11_15_12_0
  	incb
  	no_inc_11_15_12_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+191,pcr
  	cmpa #'@
  	beq celda_viva_191
  	; Si está muerta
  	cmpb #3
  	beq nace_191
  	cmpb #6
  	beq nace_191
  	bra muere_191
  	celda_viva_191:
  	cmpb #2
  	beq vive_191
  	cmpb #3
  	beq vive_191
  	bra muere_191
  	nace_191:
  	lda #'@
  	sta puntero_tablero2+191,pcr
  	bra continuar_191
  	vive_191:
  	lda #'@
  	sta puntero_tablero2+191,pcr
  	bra continuar_191
  	muere_191:
  	lda #' 
  	sta puntero_tablero2+191,pcr
  	continuar_191:
  	
  	; Casilla 12,0 (dirección 192)
  	clrb
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_11_15
  	incb
  	no_inc_12_0_11_15:
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_11_0
  	incb
  	no_inc_12_0_11_0:
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_11_1
  	incb
  	no_inc_12_0_11_1:
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_12_15
  	incb
  	no_inc_12_0_12_15:
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_12_1
  	incb
  	no_inc_12_0_12_1:
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_13_15
  	incb
  	no_inc_12_0_13_15:
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_13_0
  	incb
  	no_inc_12_0_13_0:
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_0_13_1
  	incb
  	no_inc_12_0_13_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+192,pcr
  	cmpa #'@
  	beq celda_viva_192
  	; Si está muerta
  	cmpb #3
  	beq nace_192
  	cmpb #6
  	beq nace_192
  	bra muere_192
  	celda_viva_192:
  	cmpb #2
  	beq vive_192
  	cmpb #3
  	beq vive_192
  	bra muere_192
  	nace_192:
  	lda #'@
  	sta puntero_tablero2+192,pcr
  	bra continuar_192
  	vive_192:
  	lda #'@
  	sta puntero_tablero2+192,pcr
  	bra continuar_192
  	muere_192:
  	lda #' 
  	sta puntero_tablero2+192,pcr
  	continuar_192:
  	
  	; Casilla 12,1 (dirección 193)
  	clrb
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_11_0
  	incb
  	no_inc_12_1_11_0:
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_11_1
  	incb
  	no_inc_12_1_11_1:
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_11_2
  	incb
  	no_inc_12_1_11_2:
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_12_0
  	incb
  	no_inc_12_1_12_0:
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_12_2
  	incb
  	no_inc_12_1_12_2:
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_13_0
  	incb
  	no_inc_12_1_13_0:
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_13_1
  	incb
  	no_inc_12_1_13_1:
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_1_13_2
  	incb
  	no_inc_12_1_13_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+193,pcr
  	cmpa #'@
  	beq celda_viva_193
  	; Si está muerta
  	cmpb #3
  	beq nace_193
  	cmpb #6
  	beq nace_193
  	bra muere_193
  	celda_viva_193:
  	cmpb #2
  	beq vive_193
  	cmpb #3
  	beq vive_193
  	bra muere_193
  	nace_193:
  	lda #'@
  	sta puntero_tablero2+193,pcr
  	bra continuar_193
  	vive_193:
  	lda #'@
  	sta puntero_tablero2+193,pcr
  	bra continuar_193
  	muere_193:
  	lda #' 
  	sta puntero_tablero2+193,pcr
  	continuar_193:
  	
  	; Casilla 12,2 (dirección 194)
  	clrb
  	; Analizar casilla 11,1 (dirección 177) 
  	lda puntero_tablero+177,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_11_1
  	incb
  	no_inc_12_2_11_1:
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_11_2
  	incb
  	no_inc_12_2_11_2:
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_11_3
  	incb
  	no_inc_12_2_11_3:
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_12_1
  	incb
  	no_inc_12_2_12_1:
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_12_3
  	incb
  	no_inc_12_2_12_3:
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_13_1
  	incb
  	no_inc_12_2_13_1:
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_13_2
  	incb
  	no_inc_12_2_13_2:
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_2_13_3
  	incb
  	no_inc_12_2_13_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+194,pcr
  	cmpa #'@
  	beq celda_viva_194
  	; Si está muerta
  	cmpb #3
  	beq nace_194
  	cmpb #6
  	beq nace_194
  	bra muere_194
  	celda_viva_194:
  	cmpb #2
  	beq vive_194
  	cmpb #3
  	beq vive_194
  	bra muere_194
  	nace_194:
  	lda #'@
  	sta puntero_tablero2+194,pcr
  	bra continuar_194
  	vive_194:
  	lda #'@
  	sta puntero_tablero2+194,pcr
  	bra continuar_194
  	muere_194:
  	lda #' 
  	sta puntero_tablero2+194,pcr
  	continuar_194:
  	
  	; Casilla 12,3 (dirección 195)
  	clrb
  	; Analizar casilla 11,2 (dirección 178) 
  	lda puntero_tablero+178,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_11_2
  	incb
  	no_inc_12_3_11_2:
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_11_3
  	incb
  	no_inc_12_3_11_3:
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_11_4
  	incb
  	no_inc_12_3_11_4:
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_12_2
  	incb
  	no_inc_12_3_12_2:
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_12_4
  	incb
  	no_inc_12_3_12_4:
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_13_2
  	incb
  	no_inc_12_3_13_2:
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_13_3
  	incb
  	no_inc_12_3_13_3:
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_3_13_4
  	incb
  	no_inc_12_3_13_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+195,pcr
  	cmpa #'@
  	beq celda_viva_195
  	; Si está muerta
  	cmpb #3
  	beq nace_195
  	cmpb #6
  	beq nace_195
  	bra muere_195
  	celda_viva_195:
  	cmpb #2
  	beq vive_195
  	cmpb #3
  	beq vive_195
  	bra muere_195
  	nace_195:
  	lda #'@
  	sta puntero_tablero2+195,pcr
  	bra continuar_195
  	vive_195:
  	lda #'@
  	sta puntero_tablero2+195,pcr
  	bra continuar_195
  	muere_195:
  	lda #' 
  	sta puntero_tablero2+195,pcr
  	continuar_195:
  	
  	; Casilla 12,4 (dirección 196)
  	clrb
  	; Analizar casilla 11,3 (dirección 179) 
  	lda puntero_tablero+179,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_11_3
  	incb
  	no_inc_12_4_11_3:
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_11_4
  	incb
  	no_inc_12_4_11_4:
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_11_5
  	incb
  	no_inc_12_4_11_5:
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_12_3
  	incb
  	no_inc_12_4_12_3:
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_12_5
  	incb
  	no_inc_12_4_12_5:
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_13_3
  	incb
  	no_inc_12_4_13_3:
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_13_4
  	incb
  	no_inc_12_4_13_4:
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_4_13_5
  	incb
  	no_inc_12_4_13_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+196,pcr
  	cmpa #'@
  	beq celda_viva_196
  	; Si está muerta
  	cmpb #3
  	beq nace_196
  	cmpb #6
  	beq nace_196
  	bra muere_196
  	celda_viva_196:
  	cmpb #2
  	beq vive_196
  	cmpb #3
  	beq vive_196
  	bra muere_196
  	nace_196:
  	lda #'@
  	sta puntero_tablero2+196,pcr
  	bra continuar_196
  	vive_196:
  	lda #'@
  	sta puntero_tablero2+196,pcr
  	bra continuar_196
  	muere_196:
  	lda #' 
  	sta puntero_tablero2+196,pcr
  	continuar_196:
  	
  	; Casilla 12,5 (dirección 197)
  	clrb
  	; Analizar casilla 11,4 (dirección 180) 
  	lda puntero_tablero+180,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_11_4
  	incb
  	no_inc_12_5_11_4:
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_11_5
  	incb
  	no_inc_12_5_11_5:
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_11_6
  	incb
  	no_inc_12_5_11_6:
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_12_4
  	incb
  	no_inc_12_5_12_4:
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_12_6
  	incb
  	no_inc_12_5_12_6:
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_13_4
  	incb
  	no_inc_12_5_13_4:
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_13_5
  	incb
  	no_inc_12_5_13_5:
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_5_13_6
  	incb
  	no_inc_12_5_13_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+197,pcr
  	cmpa #'@
  	beq celda_viva_197
  	; Si está muerta
  	cmpb #3
  	beq nace_197
  	cmpb #6
  	beq nace_197
  	bra muere_197
  	celda_viva_197:
  	cmpb #2
  	beq vive_197
  	cmpb #3
  	beq vive_197
  	bra muere_197
  	nace_197:
  	lda #'@
  	sta puntero_tablero2+197,pcr
  	bra continuar_197
  	vive_197:
  	lda #'@
  	sta puntero_tablero2+197,pcr
  	bra continuar_197
  	muere_197:
  	lda #' 
  	sta puntero_tablero2+197,pcr
  	continuar_197:
  	
  	; Casilla 12,6 (dirección 198)
  	clrb
  	; Analizar casilla 11,5 (dirección 181) 
  	lda puntero_tablero+181,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_11_5
  	incb
  	no_inc_12_6_11_5:
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_11_6
  	incb
  	no_inc_12_6_11_6:
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_11_7
  	incb
  	no_inc_12_6_11_7:
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_12_5
  	incb
  	no_inc_12_6_12_5:
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_12_7
  	incb
  	no_inc_12_6_12_7:
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_13_5
  	incb
  	no_inc_12_6_13_5:
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_13_6
  	incb
  	no_inc_12_6_13_6:
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_6_13_7
  	incb
  	no_inc_12_6_13_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+198,pcr
  	cmpa #'@
  	beq celda_viva_198
  	; Si está muerta
  	cmpb #3
  	beq nace_198
  	cmpb #6
  	beq nace_198
  	bra muere_198
  	celda_viva_198:
  	cmpb #2
  	beq vive_198
  	cmpb #3
  	beq vive_198
  	bra muere_198
  	nace_198:
  	lda #'@
  	sta puntero_tablero2+198,pcr
  	bra continuar_198
  	vive_198:
  	lda #'@
  	sta puntero_tablero2+198,pcr
  	bra continuar_198
  	muere_198:
  	lda #' 
  	sta puntero_tablero2+198,pcr
  	continuar_198:
  	
  	; Casilla 12,7 (dirección 199)
  	clrb
  	; Analizar casilla 11,6 (dirección 182) 
  	lda puntero_tablero+182,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_11_6
  	incb
  	no_inc_12_7_11_6:
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_11_7
  	incb
  	no_inc_12_7_11_7:
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_11_8
  	incb
  	no_inc_12_7_11_8:
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_12_6
  	incb
  	no_inc_12_7_12_6:
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_12_8
  	incb
  	no_inc_12_7_12_8:
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_13_6
  	incb
  	no_inc_12_7_13_6:
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_13_7
  	incb
  	no_inc_12_7_13_7:
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_7_13_8
  	incb
  	no_inc_12_7_13_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+199,pcr
  	cmpa #'@
  	beq celda_viva_199
  	; Si está muerta
  	cmpb #3
  	beq nace_199
  	cmpb #6
  	beq nace_199
  	bra muere_199
  	celda_viva_199:
  	cmpb #2
  	beq vive_199
  	cmpb #3
  	beq vive_199
  	bra muere_199
  	nace_199:
  	lda #'@
  	sta puntero_tablero2+199,pcr
  	bra continuar_199
  	vive_199:
  	lda #'@
  	sta puntero_tablero2+199,pcr
  	bra continuar_199
  	muere_199:
  	lda #' 
  	sta puntero_tablero2+199,pcr
  	continuar_199:
  	
  	; Casilla 12,8 (dirección 200)
  	clrb
  	; Analizar casilla 11,7 (dirección 183) 
  	lda puntero_tablero+183,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_11_7
  	incb
  	no_inc_12_8_11_7:
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_11_8
  	incb
  	no_inc_12_8_11_8:
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_11_9
  	incb
  	no_inc_12_8_11_9:
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_12_7
  	incb
  	no_inc_12_8_12_7:
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_12_9
  	incb
  	no_inc_12_8_12_9:
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_13_7
  	incb
  	no_inc_12_8_13_7:
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_13_8
  	incb
  	no_inc_12_8_13_8:
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_8_13_9
  	incb
  	no_inc_12_8_13_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+200,pcr
  	cmpa #'@
  	beq celda_viva_200
  	; Si está muerta
  	cmpb #3
  	beq nace_200
  	cmpb #6
  	beq nace_200
  	bra muere_200
  	celda_viva_200:
  	cmpb #2
  	beq vive_200
  	cmpb #3
  	beq vive_200
  	bra muere_200
  	nace_200:
  	lda #'@
  	sta puntero_tablero2+200,pcr
  	bra continuar_200
  	vive_200:
  	lda #'@
  	sta puntero_tablero2+200,pcr
  	bra continuar_200
  	muere_200:
  	lda #' 
  	sta puntero_tablero2+200,pcr
  	continuar_200:
  	
  	; Casilla 12,9 (dirección 201)
  	clrb
  	; Analizar casilla 11,8 (dirección 184) 
  	lda puntero_tablero+184,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_11_8
  	incb
  	no_inc_12_9_11_8:
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_11_9
  	incb
  	no_inc_12_9_11_9:
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_11_10
  	incb
  	no_inc_12_9_11_10:
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_12_8
  	incb
  	no_inc_12_9_12_8:
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_12_10
  	incb
  	no_inc_12_9_12_10:
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_13_8
  	incb
  	no_inc_12_9_13_8:
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_13_9
  	incb
  	no_inc_12_9_13_9:
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_9_13_10
  	incb
  	no_inc_12_9_13_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+201,pcr
  	cmpa #'@
  	beq celda_viva_201
  	; Si está muerta
  	cmpb #3
  	beq nace_201
  	cmpb #6
  	beq nace_201
  	bra muere_201
  	celda_viva_201:
  	cmpb #2
  	beq vive_201
  	cmpb #3
  	beq vive_201
  	bra muere_201
  	nace_201:
  	lda #'@
  	sta puntero_tablero2+201,pcr
  	bra continuar_201
  	vive_201:
  	lda #'@
  	sta puntero_tablero2+201,pcr
  	bra continuar_201
  	muere_201:
  	lda #' 
  	sta puntero_tablero2+201,pcr
  	continuar_201:
  	
  	; Casilla 12,10 (dirección 202)
  	clrb
  	; Analizar casilla 11,9 (dirección 185) 
  	lda puntero_tablero+185,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_11_9
  	incb
  	no_inc_12_10_11_9:
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_11_10
  	incb
  	no_inc_12_10_11_10:
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_11_11
  	incb
  	no_inc_12_10_11_11:
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_12_9
  	incb
  	no_inc_12_10_12_9:
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_12_11
  	incb
  	no_inc_12_10_12_11:
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_13_9
  	incb
  	no_inc_12_10_13_9:
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_13_10
  	incb
  	no_inc_12_10_13_10:
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_10_13_11
  	incb
  	no_inc_12_10_13_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+202,pcr
  	cmpa #'@
  	beq celda_viva_202
  	; Si está muerta
  	cmpb #3
  	beq nace_202
  	cmpb #6
  	beq nace_202
  	bra muere_202
  	celda_viva_202:
  	cmpb #2
  	beq vive_202
  	cmpb #3
  	beq vive_202
  	bra muere_202
  	nace_202:
  	lda #'@
  	sta puntero_tablero2+202,pcr
  	bra continuar_202
  	vive_202:
  	lda #'@
  	sta puntero_tablero2+202,pcr
  	bra continuar_202
  	muere_202:
  	lda #' 
  	sta puntero_tablero2+202,pcr
  	continuar_202:
  	
  	; Casilla 12,11 (dirección 203)
  	clrb
  	; Analizar casilla 11,10 (dirección 186) 
  	lda puntero_tablero+186,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_11_10
  	incb
  	no_inc_12_11_11_10:
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_11_11
  	incb
  	no_inc_12_11_11_11:
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_11_12
  	incb
  	no_inc_12_11_11_12:
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_12_10
  	incb
  	no_inc_12_11_12_10:
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_12_12
  	incb
  	no_inc_12_11_12_12:
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_13_10
  	incb
  	no_inc_12_11_13_10:
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_13_11
  	incb
  	no_inc_12_11_13_11:
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_11_13_12
  	incb
  	no_inc_12_11_13_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+203,pcr
  	cmpa #'@
  	beq celda_viva_203
  	; Si está muerta
  	cmpb #3
  	beq nace_203
  	cmpb #6
  	beq nace_203
  	bra muere_203
  	celda_viva_203:
  	cmpb #2
  	beq vive_203
  	cmpb #3
  	beq vive_203
  	bra muere_203
  	nace_203:
  	lda #'@
  	sta puntero_tablero2+203,pcr
  	bra continuar_203
  	vive_203:
  	lda #'@
  	sta puntero_tablero2+203,pcr
  	bra continuar_203
  	muere_203:
  	lda #' 
  	sta puntero_tablero2+203,pcr
  	continuar_203:
  	
  	; Casilla 12,12 (dirección 204)
  	clrb
  	; Analizar casilla 11,11 (dirección 187) 
  	lda puntero_tablero+187,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_11_11
  	incb
  	no_inc_12_12_11_11:
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_11_12
  	incb
  	no_inc_12_12_11_12:
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_11_13
  	incb
  	no_inc_12_12_11_13:
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_12_11
  	incb
  	no_inc_12_12_12_11:
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_12_13
  	incb
  	no_inc_12_12_12_13:
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_13_11
  	incb
  	no_inc_12_12_13_11:
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_13_12
  	incb
  	no_inc_12_12_13_12:
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_12_13_13
  	incb
  	no_inc_12_12_13_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+204,pcr
  	cmpa #'@
  	beq celda_viva_204
  	; Si está muerta
  	cmpb #3
  	beq nace_204
  	cmpb #6
  	beq nace_204
  	bra muere_204
  	celda_viva_204:
  	cmpb #2
  	beq vive_204
  	cmpb #3
  	beq vive_204
  	bra muere_204
  	nace_204:
  	lda #'@
  	sta puntero_tablero2+204,pcr
  	bra continuar_204
  	vive_204:
  	lda #'@
  	sta puntero_tablero2+204,pcr
  	bra continuar_204
  	muere_204:
  	lda #' 
  	sta puntero_tablero2+204,pcr
  	continuar_204:
  	
  	; Casilla 12,13 (dirección 205)
  	clrb
  	; Analizar casilla 11,12 (dirección 188) 
  	lda puntero_tablero+188,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_11_12
  	incb
  	no_inc_12_13_11_12:
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_11_13
  	incb
  	no_inc_12_13_11_13:
  	; Analizar casilla 11,14 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_11_14
  	incb
  	no_inc_12_13_11_14:
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_12_12
  	incb
  	no_inc_12_13_12_12:
  	; Analizar casilla 12,14 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_12_14
  	incb
  	no_inc_12_13_12_14:
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_13_12
  	incb
  	no_inc_12_13_13_12:
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_13_13
  	incb
  	no_inc_12_13_13_13:
  	; Analizar casilla 13,14 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_13_13_14
  	incb
  	no_inc_12_13_13_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+205,pcr
  	cmpa #'@
  	beq celda_viva_205
  	; Si está muerta
  	cmpb #3
  	beq nace_205
  	cmpb #6
  	beq nace_205
  	bra muere_205
  	celda_viva_205:
  	cmpb #2
  	beq vive_205
  	cmpb #3
  	beq vive_205
  	bra muere_205
  	nace_205:
  	lda #'@
  	sta puntero_tablero2+205,pcr
  	bra continuar_205
  	vive_205:
  	lda #'@
  	sta puntero_tablero2+205,pcr
  	bra continuar_205
  	muere_205:
  	lda #' 
  	sta puntero_tablero2+205,pcr
  	continuar_205:
  	
  	; Casilla 12,14 (dirección 206)
  	clrb
  	; Analizar casilla 11,13 (dirección 189) 
  	lda puntero_tablero+189,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_11_13
  	incb
  	no_inc_12_14_11_13:
  	; Analizar casilla 11,14 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_11_14
  	incb
  	no_inc_12_14_11_14:
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_11_15
  	incb
  	no_inc_12_14_11_15:
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_12_13
  	incb
  	no_inc_12_14_12_13:
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_12_15
  	incb
  	no_inc_12_14_12_15:
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_13_13
  	incb
  	no_inc_12_14_13_13:
  	; Analizar casilla 13,14 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_13_14
  	incb
  	no_inc_12_14_13_14:
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_14_13_15
  	incb
  	no_inc_12_14_13_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+206,pcr
  	cmpa #'@
  	beq celda_viva_206
  	; Si está muerta
  	cmpb #3
  	beq nace_206
  	cmpb #6
  	beq nace_206
  	bra muere_206
  	celda_viva_206:
  	cmpb #2
  	beq vive_206
  	cmpb #3
  	beq vive_206
  	bra muere_206
  	nace_206:
  	lda #'@
  	sta puntero_tablero2+206,pcr
  	bra continuar_206
  	vive_206:
  	lda #'@
  	sta puntero_tablero2+206,pcr
  	bra continuar_206
  	muere_206:
  	lda #' 
  	sta puntero_tablero2+206,pcr
  	continuar_206:
  	
  	; Casilla 12,15 (dirección 207)
  	clrb
  	; Analizar casilla 11,14 (dirección 190) 
  	lda puntero_tablero+190,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_11_14
  	incb
  	no_inc_12_15_11_14:
  	; Analizar casilla 11,15 (dirección 191) 
  	lda puntero_tablero+191,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_11_15
  	incb
  	no_inc_12_15_11_15:
  	; Analizar casilla 11,0 (dirección 176) 
  	lda puntero_tablero+176,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_11_0
  	incb
  	no_inc_12_15_11_0:
  	; Analizar casilla 12,14 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_12_14
  	incb
  	no_inc_12_15_12_14:
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_12_0
  	incb
  	no_inc_12_15_12_0:
  	; Analizar casilla 13,1 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_13_1
  	incb
  	no_inc_12_15_13_1:
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_13_15
  	incb
  	no_inc_12_15_13_15:
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_12_15_13_0
  	incb
  	no_inc_12_15_13_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+207,pcr
  	cmpa #'@
  	beq celda_viva_207
  	; Si está muerta
  	cmpb #3
  	beq nace_207
  	cmpb #6
  	beq nace_207
  	bra muere_207
  	celda_viva_207:
  	cmpb #2
  	beq vive_207
  	cmpb #3
  	beq vive_207
  	bra muere_207
  	nace_207:
  	lda #'@
  	sta puntero_tablero2+207,pcr
  	bra continuar_207
  	vive_207:
  	lda #'@
  	sta puntero_tablero2+207,pcr
  	bra continuar_207
  	muere_207:
  	lda #' 
  	sta puntero_tablero2+207,pcr
  	continuar_207:
  	
  	; Casilla 13,0 (dirección 208)
  	clrb
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_12_15
  	incb
  	no_inc_13_0_12_15:
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_12_0
  	incb
  	no_inc_13_0_12_0:
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_12_1
  	incb
  	no_inc_13_0_12_1:
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_13_15
  	incb
  	no_inc_13_0_13_15:
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_13_1
  	incb
  	no_inc_13_0_13_1:
  	; Analizar casilla 14,15 (dirección 239) 
  	lda puntero_tablero+239,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_14_15
  	incb
  	no_inc_13_0_14_15:
  	; Analizar casilla 14,0 (dirección 224) 
  	lda puntero_tablero+224,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_14_0
  	incb
  	no_inc_13_0_14_0:
  	; Analizar casilla 14,1 (dirección 225) 
  	lda puntero_tablero+225,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_0_14_1
  	incb
  	no_inc_13_0_14_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+208,pcr
  	cmpa #'@
  	beq celda_viva_208
  	; Si está muerta
  	cmpb #3
  	beq nace_208
  	cmpb #6
  	beq nace_208
  	bra muere_208
  	celda_viva_208:
  	cmpb #2
  	beq vive_208
  	cmpb #3
  	beq vive_208
  	bra muere_208
  	nace_208:
  	lda #'@
  	sta puntero_tablero2+208,pcr
  	bra continuar_208
  	vive_208:
  	lda #'@
  	sta puntero_tablero2+208,pcr
  	bra continuar_208
  	muere_208:
  	lda #' 
  	sta puntero_tablero2+208,pcr
  	continuar_208:
  	
  	; Casilla 13,1 (dirección 209)
  	clrb
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_12_0
  	incb
  	no_inc_13_1_12_0:
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_12_1
  	incb
  	no_inc_13_1_12_1:
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_12_2
  	incb
  	no_inc_13_1_12_2:
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_13_0
  	incb
  	no_inc_13_1_13_0:
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_13_2
  	incb
  	no_inc_13_1_13_2:
  	; Analizar casilla 14,0 (dirección 224) 
  	lda puntero_tablero+224,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_14_0
  	incb
  	no_inc_13_1_14_0:
  	; Analizar casilla 14,1 (dirección 225) 
  	lda puntero_tablero+225,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_14_1
  	incb
  	no_inc_13_1_14_1:
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_1_14_2
  	incb
  	no_inc_13_1_14_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+209,pcr
  	cmpa #'@
  	beq celda_viva_209
  	; Si está muerta
  	cmpb #3
  	beq nace_209
  	cmpb #6
  	beq nace_209
  	bra muere_209
  	celda_viva_209:
  	cmpb #2
  	beq vive_209
  	cmpb #3
  	beq vive_209
  	bra muere_209
  	nace_209:
  	lda #'@
  	sta puntero_tablero2+209,pcr
  	bra continuar_209
  	vive_209:
  	lda #'@
  	sta puntero_tablero2+209,pcr
  	bra continuar_209
  	muere_209:
  	lda #' 
  	sta puntero_tablero2+209,pcr
  	continuar_209:
  	
  	; Casilla 13,2 (dirección 210)
  	clrb
  	; Analizar casilla 12,1 (dirección 193) 
  	lda puntero_tablero+193,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_12_1
  	incb
  	no_inc_13_2_12_1:
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_12_2
  	incb
  	no_inc_13_2_12_2:
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_12_3
  	incb
  	no_inc_13_2_12_3:
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_13_1
  	incb
  	no_inc_13_2_13_1:
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_13_3
  	incb
  	no_inc_13_2_13_3:
  	; Analizar casilla 14,1 (dirección 225) 
  	lda puntero_tablero+225,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_14_1
  	incb
  	no_inc_13_2_14_1:
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_14_2
  	incb
  	no_inc_13_2_14_2:
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_2_14_3
  	incb
  	no_inc_13_2_14_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+210,pcr
  	cmpa #'@
  	beq celda_viva_210
  	; Si está muerta
  	cmpb #3
  	beq nace_210
  	cmpb #6
  	beq nace_210
  	bra muere_210
  	celda_viva_210:
  	cmpb #2
  	beq vive_210
  	cmpb #3
  	beq vive_210
  	bra muere_210
  	nace_210:
  	lda #'@
  	sta puntero_tablero2+210,pcr
  	bra continuar_210
  	vive_210:
  	lda #'@
  	sta puntero_tablero2+210,pcr
  	bra continuar_210
  	muere_210:
  	lda #' 
  	sta puntero_tablero2+210,pcr
  	continuar_210:
  	
  	; Casilla 13,3 (dirección 211)
  	clrb
  	; Analizar casilla 12,2 (dirección 194) 
  	lda puntero_tablero+194,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_12_2
  	incb
  	no_inc_13_3_12_2:
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_12_3
  	incb
  	no_inc_13_3_12_3:
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_12_4
  	incb
  	no_inc_13_3_12_4:
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_13_2
  	incb
  	no_inc_13_3_13_2:
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_13_4
  	incb
  	no_inc_13_3_13_4:
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_14_2
  	incb
  	no_inc_13_3_14_2:
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_14_3
  	incb
  	no_inc_13_3_14_3:
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_3_14_4
  	incb
  	no_inc_13_3_14_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+211,pcr
  	cmpa #'@
  	beq celda_viva_211
  	; Si está muerta
  	cmpb #3
  	beq nace_211
  	cmpb #6
  	beq nace_211
  	bra muere_211
  	celda_viva_211:
  	cmpb #2
  	beq vive_211
  	cmpb #3
  	beq vive_211
  	bra muere_211
  	nace_211:
  	lda #'@
  	sta puntero_tablero2+211,pcr
  	bra continuar_211
  	vive_211:
  	lda #'@
  	sta puntero_tablero2+211,pcr
  	bra continuar_211
  	muere_211:
  	lda #' 
  	sta puntero_tablero2+211,pcr
  	continuar_211:
  	
  	; Casilla 13,4 (dirección 212)
  	clrb
  	; Analizar casilla 12,3 (dirección 195) 
  	lda puntero_tablero+195,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_12_3
  	incb
  	no_inc_13_4_12_3:
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_12_4
  	incb
  	no_inc_13_4_12_4:
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_12_5
  	incb
  	no_inc_13_4_12_5:
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_13_3
  	incb
  	no_inc_13_4_13_3:
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_13_5
  	incb
  	no_inc_13_4_13_5:
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_14_3
  	incb
  	no_inc_13_4_14_3:
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_14_4
  	incb
  	no_inc_13_4_14_4:
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_4_14_5
  	incb
  	no_inc_13_4_14_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+212,pcr
  	cmpa #'@
  	beq celda_viva_212
  	; Si está muerta
  	cmpb #3
  	beq nace_212
  	cmpb #6
  	beq nace_212
  	bra muere_212
  	celda_viva_212:
  	cmpb #2
  	beq vive_212
  	cmpb #3
  	beq vive_212
  	bra muere_212
  	nace_212:
  	lda #'@
  	sta puntero_tablero2+212,pcr
  	bra continuar_212
  	vive_212:
  	lda #'@
  	sta puntero_tablero2+212,pcr
  	bra continuar_212
  	muere_212:
  	lda #' 
  	sta puntero_tablero2+212,pcr
  	continuar_212:
  	
  	; Casilla 13,5 (dirección 213)
  	clrb
  	; Analizar casilla 12,4 (dirección 196) 
  	lda puntero_tablero+196,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_12_4
  	incb
  	no_inc_13_5_12_4:
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_12_5
  	incb
  	no_inc_13_5_12_5:
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_12_6
  	incb
  	no_inc_13_5_12_6:
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_13_4
  	incb
  	no_inc_13_5_13_4:
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_13_6
  	incb
  	no_inc_13_5_13_6:
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_14_4
  	incb
  	no_inc_13_5_14_4:
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_14_5
  	incb
  	no_inc_13_5_14_5:
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_5_14_6
  	incb
  	no_inc_13_5_14_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+213,pcr
  	cmpa #'@
  	beq celda_viva_213
  	; Si está muerta
  	cmpb #3
  	beq nace_213
  	cmpb #6
  	beq nace_213
  	bra muere_213
  	celda_viva_213:
  	cmpb #2
  	beq vive_213
  	cmpb #3
  	beq vive_213
  	bra muere_213
  	nace_213:
  	lda #'@
  	sta puntero_tablero2+213,pcr
  	bra continuar_213
  	vive_213:
  	lda #'@
  	sta puntero_tablero2+213,pcr
  	bra continuar_213
  	muere_213:
  	lda #' 
  	sta puntero_tablero2+213,pcr
  	continuar_213:
  	
  	; Casilla 13,6 (dirección 214)
  	clrb
  	; Analizar casilla 12,5 (dirección 197) 
  	lda puntero_tablero+197,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_12_5
  	incb
  	no_inc_13_6_12_5:
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_12_6
  	incb
  	no_inc_13_6_12_6:
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_12_7
  	incb
  	no_inc_13_6_12_7:
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_13_5
  	incb
  	no_inc_13_6_13_5:
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_13_7
  	incb
  	no_inc_13_6_13_7:
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_14_5
  	incb
  	no_inc_13_6_14_5:
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_14_6
  	incb
  	no_inc_13_6_14_6:
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_6_14_7
  	incb
  	no_inc_13_6_14_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+214,pcr
  	cmpa #'@
  	beq celda_viva_214
  	; Si está muerta
  	cmpb #3
  	beq nace_214
  	cmpb #6
  	beq nace_214
  	bra muere_214
  	celda_viva_214:
  	cmpb #2
  	beq vive_214
  	cmpb #3
  	beq vive_214
  	bra muere_214
  	nace_214:
  	lda #'@
  	sta puntero_tablero2+214,pcr
  	bra continuar_214
  	vive_214:
  	lda #'@
  	sta puntero_tablero2+214,pcr
  	bra continuar_214
  	muere_214:
  	lda #' 
  	sta puntero_tablero2+214,pcr
  	continuar_214:
  	
  	; Casilla 13,7 (dirección 215)
  	clrb
  	; Analizar casilla 12,6 (dirección 198) 
  	lda puntero_tablero+198,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_12_6
  	incb
  	no_inc_13_7_12_6:
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_12_7
  	incb
  	no_inc_13_7_12_7:
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_12_8
  	incb
  	no_inc_13_7_12_8:
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_13_6
  	incb
  	no_inc_13_7_13_6:
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_13_8
  	incb
  	no_inc_13_7_13_8:
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_14_6
  	incb
  	no_inc_13_7_14_6:
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_14_7
  	incb
  	no_inc_13_7_14_7:
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_7_14_8
  	incb
  	no_inc_13_7_14_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+215,pcr
  	cmpa #'@
  	beq celda_viva_215
  	; Si está muerta
  	cmpb #3
  	beq nace_215
  	cmpb #6
  	beq nace_215
  	bra muere_215
  	celda_viva_215:
  	cmpb #2
  	beq vive_215
  	cmpb #3
  	beq vive_215
  	bra muere_215
  	nace_215:
  	lda #'@
  	sta puntero_tablero2+215,pcr
  	bra continuar_215
  	vive_215:
  	lda #'@
  	sta puntero_tablero2+215,pcr
  	bra continuar_215
  	muere_215:
  	lda #' 
  	sta puntero_tablero2+215,pcr
  	continuar_215:
  	
  	; Casilla 13,8 (dirección 216)
  	clrb
  	; Analizar casilla 12,7 (dirección 199) 
  	lda puntero_tablero+199,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_12_7
  	incb
  	no_inc_13_8_12_7:
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_12_8
  	incb
  	no_inc_13_8_12_8:
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_12_9
  	incb
  	no_inc_13_8_12_9:
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_13_7
  	incb
  	no_inc_13_8_13_7:
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_13_9
  	incb
  	no_inc_13_8_13_9:
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_14_7
  	incb
  	no_inc_13_8_14_7:
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_14_8
  	incb
  	no_inc_13_8_14_8:
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_8_14_9
  	incb
  	no_inc_13_8_14_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+216,pcr
  	cmpa #'@
  	beq celda_viva_216
  	; Si está muerta
  	cmpb #3
  	beq nace_216
  	cmpb #6
  	beq nace_216
  	bra muere_216
  	celda_viva_216:
  	cmpb #2
  	beq vive_216
  	cmpb #3
  	beq vive_216
  	bra muere_216
  	nace_216:
  	lda #'@
  	sta puntero_tablero2+216,pcr
  	bra continuar_216
  	vive_216:
  	lda #'@
  	sta puntero_tablero2+216,pcr
  	bra continuar_216
  	muere_216:
  	lda #' 
  	sta puntero_tablero2+216,pcr
  	continuar_216:
  	
  	; Casilla 13,9 (dirección 217)
  	clrb
  	; Analizar casilla 12,8 (dirección 200) 
  	lda puntero_tablero+200,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_12_8
  	incb
  	no_inc_13_9_12_8:
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_12_9
  	incb
  	no_inc_13_9_12_9:
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_12_10
  	incb
  	no_inc_13_9_12_10:
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_13_8
  	incb
  	no_inc_13_9_13_8:
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_13_10
  	incb
  	no_inc_13_9_13_10:
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_14_8
  	incb
  	no_inc_13_9_14_8:
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_14_9
  	incb
  	no_inc_13_9_14_9:
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_9_14_10
  	incb
  	no_inc_13_9_14_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+217,pcr
  	cmpa #'@
  	beq celda_viva_217
  	; Si está muerta
  	cmpb #3
  	beq nace_217
  	cmpb #6
  	beq nace_217
  	bra muere_217
  	celda_viva_217:
  	cmpb #2
  	beq vive_217
  	cmpb #3
  	beq vive_217
  	bra muere_217
  	nace_217:
  	lda #'@
  	sta puntero_tablero2+217,pcr
  	bra continuar_217
  	vive_217:
  	lda #'@
  	sta puntero_tablero2+217,pcr
  	bra continuar_217
  	muere_217:
  	lda #' 
  	sta puntero_tablero2+217,pcr
  	continuar_217:
  	
  	; Casilla 13,10 (dirección 218)
  	clrb
  	; Analizar casilla 12,9 (dirección 201) 
  	lda puntero_tablero+201,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_12_9
  	incb
  	no_inc_13_10_12_9:
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_12_10
  	incb
  	no_inc_13_10_12_10:
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_12_11
  	incb
  	no_inc_13_10_12_11:
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_13_9
  	incb
  	no_inc_13_10_13_9:
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_13_11
  	incb
  	no_inc_13_10_13_11:
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_14_9
  	incb
  	no_inc_13_10_14_9:
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_14_10
  	incb
  	no_inc_13_10_14_10:
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_10_14_11
  	incb
  	no_inc_13_10_14_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+218,pcr
  	cmpa #'@
  	beq celda_viva_218
  	; Si está muerta
  	cmpb #3
  	beq nace_218
  	cmpb #6
  	beq nace_218
  	bra muere_218
  	celda_viva_218:
  	cmpb #2
  	beq vive_218
  	cmpb #3
  	beq vive_218
  	bra muere_218
  	nace_218:
  	lda #'@
  	sta puntero_tablero2+218,pcr
  	bra continuar_218
  	vive_218:
  	lda #'@
  	sta puntero_tablero2+218,pcr
  	bra continuar_218
  	muere_218:
  	lda #' 
  	sta puntero_tablero2+218,pcr
  	continuar_218:
  	
  	; Casilla 13,11 (dirección 219)
  	clrb
  	; Analizar casilla 12,10 (dirección 202) 
  	lda puntero_tablero+202,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_12_10
  	incb
  	no_inc_13_11_12_10:
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_12_11
  	incb
  	no_inc_13_11_12_11:
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_12_12
  	incb
  	no_inc_13_11_12_12:
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_13_10
  	incb
  	no_inc_13_11_13_10:
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_13_12
  	incb
  	no_inc_13_11_13_12:
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_14_10
  	incb
  	no_inc_13_11_14_10:
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_14_11
  	incb
  	no_inc_13_11_14_11:
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_11_14_12
  	incb
  	no_inc_13_11_14_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+219,pcr
  	cmpa #'@
  	beq celda_viva_219
  	; Si está muerta
  	cmpb #3
  	beq nace_219
  	cmpb #6
  	beq nace_219
  	bra muere_219
  	celda_viva_219:
  	cmpb #2
  	beq vive_219
  	cmpb #3
  	beq vive_219
  	bra muere_219
  	nace_219:
  	lda #'@
  	sta puntero_tablero2+219,pcr
  	bra continuar_219
  	vive_219:
  	lda #'@
  	sta puntero_tablero2+219,pcr
  	bra continuar_219
  	muere_219:
  	lda #' 
  	sta puntero_tablero2+219,pcr
  	continuar_219:
  	
  	; Casilla 13,12 (dirección 220)
  	clrb
  	; Analizar casilla 12,11 (dirección 203) 
  	lda puntero_tablero+203,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_12_11
  	incb
  	no_inc_13_12_12_11:
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_12_12
  	incb
  	no_inc_13_12_12_12:
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_12_13
  	incb
  	no_inc_13_12_12_13:
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_13_11
  	incb
  	no_inc_13_12_13_11:
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_13_13
  	incb
  	no_inc_13_12_13_13:
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_14_11
  	incb
  	no_inc_13_12_14_11:
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_14_12
  	incb
  	no_inc_13_12_14_12:
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_12_14_13
  	incb
  	no_inc_13_12_14_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+220,pcr
  	cmpa #'@
  	beq celda_viva_220
  	; Si está muerta
  	cmpb #3
  	beq nace_220
  	cmpb #6
  	beq nace_220
  	bra muere_220
  	celda_viva_220:
  	cmpb #2
  	beq vive_220
  	cmpb #3
  	beq vive_220
  	bra muere_220
  	nace_220:
  	lda #'@
  	sta puntero_tablero2+220,pcr
  	bra continuar_220
  	vive_220:
  	lda #'@
  	sta puntero_tablero2+220,pcr
  	bra continuar_220
  	muere_220:
  	lda #' 
  	sta puntero_tablero2+220,pcr
  	continuar_220:
  	
  	; Casilla 13,13 (dirección 221)
  	clrb
  	; Analizar casilla 12,12 (dirección 204) 
  	lda puntero_tablero+204,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_12_12
  	incb
  	no_inc_13_13_12_12:
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_12_13
  	incb
  	no_inc_13_13_12_13:
  	; Analizar casilla 12,14 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_12_14
  	incb
  	no_inc_13_13_12_14:
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_13_12
  	incb
  	no_inc_13_13_13_12:
  	; Analizar casilla 13,14 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_13_14
  	incb
  	no_inc_13_13_13_14:
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_14_12
  	incb
  	no_inc_13_13_14_12:
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_14_13
  	incb
  	no_inc_13_13_14_13:
  	; Analizar casilla 14,14 (dirección 238) 
  	lda puntero_tablero+238,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_13_14_14
  	incb
  	no_inc_13_13_14_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+221,pcr
  	cmpa #'@
  	beq celda_viva_221
  	; Si está muerta
  	cmpb #3
  	beq nace_221
  	cmpb #6
  	beq nace_221
  	bra muere_221
  	celda_viva_221:
  	cmpb #2
  	beq vive_221
  	cmpb #3
  	beq vive_221
  	bra muere_221
  	nace_221:
  	lda #'@
  	sta puntero_tablero2+221,pcr
  	bra continuar_221
  	vive_221:
  	lda #'@
  	sta puntero_tablero2+221,pcr
  	bra continuar_221
  	muere_221:
  	lda #' 
  	sta puntero_tablero2+221,pcr
  	continuar_221:
  	
  	; Casilla 13,14 (dirección 222)
  	clrb
  	; Analizar casilla 12,13 (dirección 205) 
  	lda puntero_tablero+205,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_12_13
  	incb
  	no_inc_13_14_12_13:
  	; Analizar casilla 12,14 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_12_14
  	incb
  	no_inc_13_14_12_14:
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_12_15
  	incb
  	no_inc_13_14_12_15:
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_13_13
  	incb
  	no_inc_13_14_13_13:
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_13_15
  	incb
  	no_inc_13_14_13_15:
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_14_13
  	incb
  	no_inc_13_14_14_13:
  	; Analizar casilla 14,14 (dirección 238) 
  	lda puntero_tablero+238,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_14_14
  	incb
  	no_inc_13_14_14_14:
  	; Analizar casilla 14,15 (dirección 239) 
  	lda puntero_tablero+239,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_14_14_15
  	incb
  	no_inc_13_14_14_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+222,pcr
  	cmpa #'@
  	beq celda_viva_222
  	; Si está muerta
  	cmpb #3
  	beq nace_222
  	cmpb #6
  	beq nace_222
  	bra muere_222
  	celda_viva_222:
  	cmpb #2
  	beq vive_222
  	cmpb #3
  	beq vive_222
  	bra muere_222
  	nace_222:
  	lda #'@
  	sta puntero_tablero2+222,pcr
  	bra continuar_222
  	vive_222:
  	lda #'@
  	sta puntero_tablero2+222,pcr
  	bra continuar_222
  	muere_222:
  	lda #' 
  	sta puntero_tablero2+222,pcr
  	continuar_222:
  	
  	; Casilla 13,15 (dirección 223)
  	clrb
  	; Analizar casilla 12,14 (dirección 206) 
  	lda puntero_tablero+206,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_12_14
  	incb
  	no_inc_13_15_12_14:
  	; Analizar casilla 12,15 (dirección 207) 
  	lda puntero_tablero+207,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_12_15
  	incb
  	no_inc_13_15_12_15:
  	; Analizar casilla 12,0 (dirección 192) 
  	lda puntero_tablero+192,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_12_0
  	incb
  	no_inc_13_15_12_0:
  	; Analizar casilla 13,14 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_13_14
  	incb
  	no_inc_13_15_13_14:
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_13_0
  	incb
  	no_inc_13_15_13_0:
  	; Analizar casilla 14,0 (dirección 238) 
  	lda puntero_tablero+238,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_14_0
  	incb
  	no_inc_13_15_14_0:
  	; Analizar casilla 14,15 (dirección 239) 
  	lda puntero_tablero+239,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_14_15
  	incb
  	no_inc_13_15_14_15:
  	; Analizar casilla 14,14 (dirección 224) 
  	lda puntero_tablero+224,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_13_15_14_14
  	incb
  	no_inc_13_15_14_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+223,pcr
  	cmpa #'@
  	beq celda_viva_223
  	; Si está muerta
  	cmpb #3
  	beq nace_223
  	cmpb #6
  	beq nace_223
  	bra muere_223
  	celda_viva_223:
  	cmpb #2
  	beq vive_223
  	cmpb #3
  	beq vive_223
  	bra muere_223
  	nace_223:
  	lda #'@
  	sta puntero_tablero2+223,pcr
  	bra continuar_223
  	vive_223:
  	lda #'@
  	sta puntero_tablero2+223,pcr
  	bra continuar_223
  	muere_223:
  	lda #' 
  	sta puntero_tablero2+223,pcr
  	continuar_223:
  	
  	; Casilla 14,0 (dirección 224)
  	clrb
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_13_15
  	incb
  	no_inc_14_0_13_15:
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_13_0
  	incb
  	no_inc_14_0_13_0:
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_13_1
  	incb
  	no_inc_14_0_13_1:
  	; Analizar casilla 14,15 (dirección 239) 
  	lda puntero_tablero+239,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_14_15
  	incb
  	no_inc_14_0_14_15:
  	; Analizar casilla 14,1 (dirección 225) 
  	lda puntero_tablero+225,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_14_1
  	incb
  	no_inc_14_0_14_1:
  	; Analizar casilla 15,15 (dirección 255) 
  	lda puntero_tablero+255,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_15_15
  	incb
  	no_inc_14_0_15_15:
  	; Analizar casilla 15,0 (dirección 240) 
  	lda puntero_tablero+240,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_15_0
  	incb
  	no_inc_14_0_15_0:
  	; Analizar casilla 15,1 (dirección 241) 
  	lda puntero_tablero+241,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_0_15_1
  	incb
  	no_inc_14_0_15_1:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+224,pcr
  	cmpa #'@
  	beq celda_viva_224
  	; Si está muerta
  	cmpb #3
  	beq nace_224
  	cmpb #6
  	beq nace_224
  	bra muere_224
  	celda_viva_224:
  	cmpb #2
  	beq vive_224
  	cmpb #3
  	beq vive_224
  	bra muere_224
  	nace_224:
  	lda #'@
  	sta puntero_tablero2+224,pcr
  	bra continuar_224
  	vive_224:
  	lda #'@
  	sta puntero_tablero2+224,pcr
  	bra continuar_224
  	muere_224:
  	lda #' 
  	sta puntero_tablero2+224,pcr
  	continuar_224:
  	
  	; Casilla 14,1 (dirección 225)
  	clrb
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_13_0
  	incb
  	no_inc_14_1_13_0:
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_13_1
  	incb
  	no_inc_14_1_13_1:
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_13_2
  	incb
  	no_inc_14_1_13_2:
  	; Analizar casilla 14,0 (dirección 224) 
  	lda puntero_tablero+224,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_14_0
  	incb
  	no_inc_14_1_14_0:
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_14_2
  	incb
  	no_inc_14_1_14_2:
  	; Analizar casilla 15,0 (dirección 240) 
  	lda puntero_tablero+240,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_15_0
  	incb
  	no_inc_14_1_15_0:
  	; Analizar casilla 15,1 (dirección 241) 
  	lda puntero_tablero+241,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_15_1
  	incb
  	no_inc_14_1_15_1:
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_1_15_2
  	incb
  	no_inc_14_1_15_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+225,pcr
  	cmpa #'@
  	beq celda_viva_225
  	; Si está muerta
  	cmpb #3
  	beq nace_225
  	cmpb #6
  	beq nace_225
  	bra muere_225
  	celda_viva_225:
  	cmpb #2
  	beq vive_225
  	cmpb #3
  	beq vive_225
  	bra muere_225
  	nace_225:
  	lda #'@
  	sta puntero_tablero2+225,pcr
  	bra continuar_225
  	vive_225:
  	lda #'@
  	sta puntero_tablero2+225,pcr
  	bra continuar_225
  	muere_225:
  	lda #' 
  	sta puntero_tablero2+225,pcr
  	continuar_225:
  	
  	; Casilla 14,2 (dirección 226)
  	clrb
  	; Analizar casilla 13,1 (dirección 209) 
  	lda puntero_tablero+209,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_13_1
  	incb
  	no_inc_14_2_13_1:
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_13_2
  	incb
  	no_inc_14_2_13_2:
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_13_3
  	incb
  	no_inc_14_2_13_3:
  	; Analizar casilla 14,1 (dirección 225) 
  	lda puntero_tablero+225,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_14_1
  	incb
  	no_inc_14_2_14_1:
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_14_3
  	incb
  	no_inc_14_2_14_3:
  	; Analizar casilla 15,1 (dirección 241) 
  	lda puntero_tablero+241,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_15_1
  	incb
  	no_inc_14_2_15_1:
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_15_2
  	incb
  	no_inc_14_2_15_2:
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_2_15_3
  	incb
  	no_inc_14_2_15_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+226,pcr
  	cmpa #'@
  	beq celda_viva_226
  	; Si está muerta
  	cmpb #3
  	beq nace_226
  	cmpb #6
  	beq nace_226
  	bra muere_226
  	celda_viva_226:
  	cmpb #2
  	beq vive_226
  	cmpb #3
  	beq vive_226
  	bra muere_226
  	nace_226:
  	lda #'@
  	sta puntero_tablero2+226,pcr
  	bra continuar_226
  	vive_226:
  	lda #'@
  	sta puntero_tablero2+226,pcr
  	bra continuar_226
  	muere_226:
  	lda #' 
  	sta puntero_tablero2+226,pcr
  	continuar_226:
  	
  	; Casilla 14,3 (dirección 227)
  	clrb
  	; Analizar casilla 13,2 (dirección 210) 
  	lda puntero_tablero+210,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_13_2
  	incb
  	no_inc_14_3_13_2:
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_13_3
  	incb
  	no_inc_14_3_13_3:
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_13_4
  	incb
  	no_inc_14_3_13_4:
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_14_2
  	incb
  	no_inc_14_3_14_2:
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_14_4
  	incb
  	no_inc_14_3_14_4:
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_15_2
  	incb
  	no_inc_14_3_15_2:
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_15_3
  	incb
  	no_inc_14_3_15_3:
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_3_15_4
  	incb
  	no_inc_14_3_15_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+227,pcr
  	cmpa #'@
  	beq celda_viva_227
  	; Si está muerta
  	cmpb #3
  	beq nace_227
  	cmpb #6
  	beq nace_227
  	bra muere_227
  	celda_viva_227:
  	cmpb #2
  	beq vive_227
  	cmpb #3
  	beq vive_227
  	bra muere_227
  	nace_227:
  	lda #'@
  	sta puntero_tablero2+227,pcr
  	bra continuar_227
  	vive_227:
  	lda #'@
  	sta puntero_tablero2+227,pcr
  	bra continuar_227
  	muere_227:
  	lda #' 
  	sta puntero_tablero2+227,pcr
  	continuar_227:
  	
  	; Casilla 14,4 (dirección 228)
  	clrb
  	; Analizar casilla 13,3 (dirección 211) 
  	lda puntero_tablero+211,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_13_3
  	incb
  	no_inc_14_4_13_3:
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_13_4
  	incb
  	no_inc_14_4_13_4:
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_13_5
  	incb
  	no_inc_14_4_13_5:
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_14_3
  	incb
  	no_inc_14_4_14_3:
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_14_5
  	incb
  	no_inc_14_4_14_5:
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_15_3
  	incb
  	no_inc_14_4_15_3:
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_15_4
  	incb
  	no_inc_14_4_15_4:
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_4_15_5
  	incb
  	no_inc_14_4_15_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+228,pcr
  	cmpa #'@
  	beq celda_viva_228
  	; Si está muerta
  	cmpb #3
  	beq nace_228
  	cmpb #6
  	beq nace_228
  	bra muere_228
  	celda_viva_228:
  	cmpb #2
  	beq vive_228
  	cmpb #3
  	beq vive_228
  	bra muere_228
  	nace_228:
  	lda #'@
  	sta puntero_tablero2+228,pcr
  	bra continuar_228
  	vive_228:
  	lda #'@
  	sta puntero_tablero2+228,pcr
  	bra continuar_228
  	muere_228:
  	lda #' 
  	sta puntero_tablero2+228,pcr
  	continuar_228:
  	
  	; Casilla 14,5 (dirección 229)
  	clrb
  	; Analizar casilla 13,4 (dirección 212) 
  	lda puntero_tablero+212,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_13_4
  	incb
  	no_inc_14_5_13_4:
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_13_5
  	incb
  	no_inc_14_5_13_5:
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_13_6
  	incb
  	no_inc_14_5_13_6:
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_14_4
  	incb
  	no_inc_14_5_14_4:
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_14_6
  	incb
  	no_inc_14_5_14_6:
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_15_4
  	incb
  	no_inc_14_5_15_4:
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_15_5
  	incb
  	no_inc_14_5_15_5:
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_5_15_6
  	incb
  	no_inc_14_5_15_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+229,pcr
  	cmpa #'@
  	beq celda_viva_229
  	; Si está muerta
  	cmpb #3
  	beq nace_229
  	cmpb #6
  	beq nace_229
  	bra muere_229
  	celda_viva_229:
  	cmpb #2
  	beq vive_229
  	cmpb #3
  	beq vive_229
  	bra muere_229
  	nace_229:
  	lda #'@
  	sta puntero_tablero2+229,pcr
  	bra continuar_229
  	vive_229:
  	lda #'@
  	sta puntero_tablero2+229,pcr
  	bra continuar_229
  	muere_229:
  	lda #' 
  	sta puntero_tablero2+229,pcr
  	continuar_229:
  	
  	; Casilla 14,6 (dirección 230)
  	clrb
  	; Analizar casilla 13,5 (dirección 213) 
  	lda puntero_tablero+213,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_13_5
  	incb
  	no_inc_14_6_13_5:
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_13_6
  	incb
  	no_inc_14_6_13_6:
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_13_7
  	incb
  	no_inc_14_6_13_7:
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_14_5
  	incb
  	no_inc_14_6_14_5:
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_14_7
  	incb
  	no_inc_14_6_14_7:
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_15_5
  	incb
  	no_inc_14_6_15_5:
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_15_6
  	incb
  	no_inc_14_6_15_6:
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_6_15_7
  	incb
  	no_inc_14_6_15_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+230,pcr
  	cmpa #'@
  	beq celda_viva_230
  	; Si está muerta
  	cmpb #3
  	beq nace_230
  	cmpb #6
  	beq nace_230
  	bra muere_230
  	celda_viva_230:
  	cmpb #2
  	beq vive_230
  	cmpb #3
  	beq vive_230
  	bra muere_230
  	nace_230:
  	lda #'@
  	sta puntero_tablero2+230,pcr
  	bra continuar_230
  	vive_230:
  	lda #'@
  	sta puntero_tablero2+230,pcr
  	bra continuar_230
  	muere_230:
  	lda #' 
  	sta puntero_tablero2+230,pcr
  	continuar_230:
  	
  	; Casilla 14,7 (dirección 231)
  	clrb
  	; Analizar casilla 13,6 (dirección 214) 
  	lda puntero_tablero+214,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_13_6
  	incb
  	no_inc_14_7_13_6:
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_13_7
  	incb
  	no_inc_14_7_13_7:
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_13_8
  	incb
  	no_inc_14_7_13_8:
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_14_6
  	incb
  	no_inc_14_7_14_6:
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_14_8
  	incb
  	no_inc_14_7_14_8:
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_15_6
  	incb
  	no_inc_14_7_15_6:
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_15_7
  	incb
  	no_inc_14_7_15_7:
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_7_15_8
  	incb
  	no_inc_14_7_15_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+231,pcr
  	cmpa #'@
  	beq celda_viva_231
  	; Si está muerta
  	cmpb #3
  	beq nace_231
  	cmpb #6
  	beq nace_231
  	bra muere_231
  	celda_viva_231:
  	cmpb #2
  	beq vive_231
  	cmpb #3
  	beq vive_231
  	bra muere_231
  	nace_231:
  	lda #'@
  	sta puntero_tablero2+231,pcr
  	bra continuar_231
  	vive_231:
  	lda #'@
  	sta puntero_tablero2+231,pcr
  	bra continuar_231
  	muere_231:
  	lda #' 
  	sta puntero_tablero2+231,pcr
  	continuar_231:
  	
  	; Casilla 14,8 (dirección 232)
  	clrb
  	; Analizar casilla 13,7 (dirección 215) 
  	lda puntero_tablero+215,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_13_7
  	incb
  	no_inc_14_8_13_7:
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_13_8
  	incb
  	no_inc_14_8_13_8:
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_13_9
  	incb
  	no_inc_14_8_13_9:
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_14_7
  	incb
  	no_inc_14_8_14_7:
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_14_9
  	incb
  	no_inc_14_8_14_9:
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_15_7
  	incb
  	no_inc_14_8_15_7:
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_15_8
  	incb
  	no_inc_14_8_15_8:
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_8_15_9
  	incb
  	no_inc_14_8_15_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+232,pcr
  	cmpa #'@
  	beq celda_viva_232
  	; Si está muerta
  	cmpb #3
  	beq nace_232
  	cmpb #6
  	beq nace_232
  	bra muere_232
  	celda_viva_232:
  	cmpb #2
  	beq vive_232
  	cmpb #3
  	beq vive_232
  	bra muere_232
  	nace_232:
  	lda #'@
  	sta puntero_tablero2+232,pcr
  	bra continuar_232
  	vive_232:
  	lda #'@
  	sta puntero_tablero2+232,pcr
  	bra continuar_232
  	muere_232:
  	lda #' 
  	sta puntero_tablero2+232,pcr
  	continuar_232:
  	
  	; Casilla 14,9 (dirección 233)
  	clrb
  	; Analizar casilla 13,8 (dirección 216) 
  	lda puntero_tablero+216,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_13_8
  	incb
  	no_inc_14_9_13_8:
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_13_9
  	incb
  	no_inc_14_9_13_9:
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_13_10
  	incb
  	no_inc_14_9_13_10:
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_14_8
  	incb
  	no_inc_14_9_14_8:
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_14_10
  	incb
  	no_inc_14_9_14_10:
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_15_8
  	incb
  	no_inc_14_9_15_8:
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_15_9
  	incb
  	no_inc_14_9_15_9:
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_9_15_10
  	incb
  	no_inc_14_9_15_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+233,pcr
  	cmpa #'@
  	beq celda_viva_233
  	; Si está muerta
  	cmpb #3
  	beq nace_233
  	cmpb #6
  	beq nace_233
  	bra muere_233
  	celda_viva_233:
  	cmpb #2
  	beq vive_233
  	cmpb #3
  	beq vive_233
  	bra muere_233
  	nace_233:
  	lda #'@
  	sta puntero_tablero2+233,pcr
  	bra continuar_233
  	vive_233:
  	lda #'@
  	sta puntero_tablero2+233,pcr
  	bra continuar_233
  	muere_233:
  	lda #' 
  	sta puntero_tablero2+233,pcr
  	continuar_233:
  	
  	; Casilla 14,10 (dirección 234)
  	clrb
  	; Analizar casilla 13,9 (dirección 217) 
  	lda puntero_tablero+217,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_13_9
  	incb
  	no_inc_14_10_13_9:
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_13_10
  	incb
  	no_inc_14_10_13_10:
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_13_11
  	incb
  	no_inc_14_10_13_11:
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_14_9
  	incb
  	no_inc_14_10_14_9:
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_14_11
  	incb
  	no_inc_14_10_14_11:
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_15_9
  	incb
  	no_inc_14_10_15_9:
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_15_10
  	incb
  	no_inc_14_10_15_10:
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_10_15_11
  	incb
  	no_inc_14_10_15_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+234,pcr
  	cmpa #'@
  	beq celda_viva_234
  	; Si está muerta
  	cmpb #3
  	beq nace_234
  	cmpb #6
  	beq nace_234
  	bra muere_234
  	celda_viva_234:
  	cmpb #2
  	beq vive_234
  	cmpb #3
  	beq vive_234
  	bra muere_234
  	nace_234:
  	lda #'@
  	sta puntero_tablero2+234,pcr
  	bra continuar_234
  	vive_234:
  	lda #'@
  	sta puntero_tablero2+234,pcr
  	bra continuar_234
  	muere_234:
  	lda #' 
  	sta puntero_tablero2+234,pcr
  	continuar_234:
  	
  	; Casilla 14,11 (dirección 235)
  	clrb
  	; Analizar casilla 13,10 (dirección 218) 
  	lda puntero_tablero+218,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_13_10
  	incb
  	no_inc_14_11_13_10:
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_13_11
  	incb
  	no_inc_14_11_13_11:
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_13_12
  	incb
  	no_inc_14_11_13_12:
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_14_10
  	incb
  	no_inc_14_11_14_10:
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_14_12
  	incb
  	no_inc_14_11_14_12:
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_15_10
  	incb
  	no_inc_14_11_15_10:
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_15_11
  	incb
  	no_inc_14_11_15_11:
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_11_15_12
  	incb
  	no_inc_14_11_15_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+235,pcr
  	cmpa #'@
  	beq celda_viva_235
  	; Si está muerta
  	cmpb #3
  	beq nace_235
  	cmpb #6
  	beq nace_235
  	bra muere_235
  	celda_viva_235:
  	cmpb #2
  	beq vive_235
  	cmpb #3
  	beq vive_235
  	bra muere_235
  	nace_235:
  	lda #'@
  	sta puntero_tablero2+235,pcr
  	bra continuar_235
  	vive_235:
  	lda #'@
  	sta puntero_tablero2+235,pcr
  	bra continuar_235
  	muere_235:
  	lda #' 
  	sta puntero_tablero2+235,pcr
  	continuar_235:
  	
  	; Casilla 14,12 (dirección 236)
  	clrb
  	; Analizar casilla 13,11 (dirección 219) 
  	lda puntero_tablero+219,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_13_11
  	incb
  	no_inc_14_12_13_11:
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_13_12
  	incb
  	no_inc_14_12_13_12:
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_13_13
  	incb
  	no_inc_14_12_13_13:
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_14_11
  	incb
  	no_inc_14_12_14_11:
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_14_13
  	incb
  	no_inc_14_12_14_13:
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_15_11
  	incb
  	no_inc_14_12_15_11:
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_15_12
  	incb
  	no_inc_14_12_15_12:
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_12_15_13
  	incb
  	no_inc_14_12_15_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+236,pcr
  	cmpa #'@
  	beq celda_viva_236
  	; Si está muerta
  	cmpb #3
  	beq nace_236
  	cmpb #6
  	beq nace_236
  	bra muere_236
  	celda_viva_236:
  	cmpb #2
  	beq vive_236
  	cmpb #3
  	beq vive_236
  	bra muere_236
  	nace_236:
  	lda #'@
  	sta puntero_tablero2+236,pcr
  	bra continuar_236
  	vive_236:
  	lda #'@
  	sta puntero_tablero2+236,pcr
  	bra continuar_236
  	muere_236:
  	lda #' 
  	sta puntero_tablero2+236,pcr
  	continuar_236:
  	
  	; Casilla 14,13 (dirección 237)
  	clrb
  	; Analizar casilla 13,12 (dirección 220) 
  	lda puntero_tablero+220,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_13_12
  	incb
  	no_inc_14_13_13_12:
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_13_13
  	incb
  	no_inc_14_13_13_13:
  	; Analizar casilla 13,14 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_13_14
  	incb
  	no_inc_14_13_13_14:
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_14_12
  	incb
  	no_inc_14_13_14_12:
  	; Analizar casilla 14,14 (dirección 238) 
  	lda puntero_tablero+238,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_14_14
  	incb
  	no_inc_14_13_14_14:
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_15_12
  	incb
  	no_inc_14_13_15_12:
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_15_13
  	incb
  	no_inc_14_13_15_13:
  	; Analizar casilla 15,14 (dirección 254) 
  	lda puntero_tablero+254,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_13_15_14
  	incb
  	no_inc_14_13_15_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+237,pcr
  	cmpa #'@
  	beq celda_viva_237
  	; Si está muerta
  	cmpb #3
  	beq nace_237
  	cmpb #6
  	beq nace_237
  	bra muere_237
  	celda_viva_237:
  	cmpb #2
  	beq vive_237
  	cmpb #3
  	beq vive_237
  	bra muere_237
  	nace_237:
  	lda #'@
  	sta puntero_tablero2+237,pcr
  	bra continuar_237
  	vive_237:
  	lda #'@
  	sta puntero_tablero2+237,pcr
  	bra continuar_237
  	muere_237:
  	lda #' 
  	sta puntero_tablero2+237,pcr
  	continuar_237:
  	
  	; Casilla 14,14 (dirección 238)
  	clrb
  	; Analizar casilla 13,13 (dirección 221) 
  	lda puntero_tablero+221,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_13_13
  	incb
  	no_inc_14_14_13_13:
  	; Analizar casilla 13,14 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_13_14
  	incb
  	no_inc_14_14_13_14:
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_13_15
  	incb
  	no_inc_14_14_13_15:
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_14_13
  	incb
  	no_inc_14_14_14_13:
  	; Analizar casilla 14,15 (dirección 239) 
  	lda puntero_tablero+239,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_14_15
  	incb
  	no_inc_14_14_14_15:
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_15_13
  	incb
  	no_inc_14_14_15_13:
  	; Analizar casilla 15,14 (dirección 254) 
  	lda puntero_tablero+254,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_15_14
  	incb
  	no_inc_14_14_15_14:
  	; Analizar casilla 15,15 (dirección 255) 
  	lda puntero_tablero+255,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_14_15_15
  	incb
  	no_inc_14_14_15_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+238,pcr
  	cmpa #'@
  	beq celda_viva_238
  	; Si está muerta
  	cmpb #3
  	beq nace_238
  	cmpb #6
  	beq nace_238
  	bra muere_238
  	celda_viva_238:
  	cmpb #2
  	beq vive_238
  	cmpb #3
  	beq vive_238
  	bra muere_238
  	nace_238:
  	lda #'@
  	sta puntero_tablero2+238,pcr
  	bra continuar_238
  	vive_238:
  	lda #'@
  	sta puntero_tablero2+238,pcr
  	bra continuar_238
  	muere_238:
  	lda #' 
  	sta puntero_tablero2+238,pcr
  	continuar_238:
  	
  	; Casilla 14,15 (dirección 239)
  	clrb
  	; Analizar casilla 13,14 (dirección 222) 
  	lda puntero_tablero+222,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_13_14
  	incb
  	no_inc_14_15_13_14:
  	; Analizar casilla 13,15 (dirección 223) 
  	lda puntero_tablero+223,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_13_15
  	incb
  	no_inc_14_15_13_15:
  	; Analizar casilla 13,0 (dirección 208) 
  	lda puntero_tablero+208,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_13_0
  	incb
  	no_inc_14_15_13_0:
  	; Analizar casilla 14,14 (dirección 238) 
  	lda puntero_tablero+238,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_14_14
  	incb
  	no_inc_14_15_14_14:
  	; Analizar casilla 14,0 (dirección 224) 
  	lda puntero_tablero+224,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_14_0
  	incb
  	no_inc_14_15_14_0:
  	; Analizar casilla 15,14 (dirección 254) 
  	lda puntero_tablero+254,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_15_14
  	incb
  	no_inc_14_15_15_14:
  	; Analizar casilla 15,15 (dirección 255) 
  	lda puntero_tablero+255,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_15_15
  	incb
  	no_inc_14_15_15_15:
  	; Analizar casilla 15,0 (dirección 240) 
  	lda puntero_tablero+240,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_14_15_15_0
  	incb
  	no_inc_14_15_15_0:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+239,pcr
  	cmpa #'@
  	beq celda_viva_239
  	; Si está muerta
  	cmpb #3
  	beq nace_239
  	cmpb #6
  	beq nace_239
  	bra muere_239
  	celda_viva_239:
  	cmpb #2
  	beq vive_239
  	cmpb #3
  	beq vive_239
  	bra muere_239
  	nace_239:
  	lda #'@
  	sta puntero_tablero2+239,pcr
  	bra continuar_239
  	vive_239:
  	lda #'@
  	sta puntero_tablero2+239,pcr
  	bra continuar_239
  	muere_239:
  	lda #' 
  	sta puntero_tablero2+239,pcr
  	continuar_239:
  	
  	; Casilla 15,1 (dirección 241)
  	clrb
  	; Analizar casilla 14,0 (dirección 224) 
  	lda puntero_tablero+224,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_14_0
  	incb
  	no_inc_15_1_14_0:
  	; Analizar casilla 14,1 (dirección 225) 
  	lda puntero_tablero+225,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_14_1
  	incb
  	no_inc_15_1_14_1:
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_14_2
  	incb
  	no_inc_15_1_14_2:
  	; Analizar casilla 15,0 (dirección 240) 
  	lda puntero_tablero+240,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_15_0
  	incb
  	no_inc_15_1_15_0:
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_15_2
  	incb
  	no_inc_15_1_15_2:
  	; Analizar casilla 0,0 (dirección 0) 
  	lda puntero_tablero+0,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_0_0
  	incb
  	no_inc_15_1_0_0:
  	; Analizar casilla 0,1 (dirección 1) 
  	lda puntero_tablero+1,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_0_1
  	incb
  	no_inc_15_1_0_1:
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_1_0_2
  	incb
  	no_inc_15_1_0_2:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+241,pcr
  	cmpa #'@
  	beq celda_viva_241
  	; Si está muerta
  	cmpb #3
  	beq nace_241
  	cmpb #6
  	beq nace_241
  	bra muere_241
  	celda_viva_241:
  	cmpb #2
  	beq vive_241
  	cmpb #3
  	beq vive_241
  	bra muere_241
  	nace_241:
  	lda #'@
  	sta puntero_tablero2+241,pcr
  	bra continuar_241
  	vive_241:
  	lda #'@
  	sta puntero_tablero2+241,pcr
  	bra continuar_241
  	muere_241:
  	lda #' 
  	sta puntero_tablero2+241,pcr
  	continuar_241:
  	
  	; Casilla 15,2 (dirección 242)
  	clrb
  	; Analizar casilla 14,1 (dirección 225) 
  	lda puntero_tablero+225,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_14_1
  	incb
  	no_inc_15_2_14_1:
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_14_2
  	incb
  	no_inc_15_2_14_2:
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_14_3
  	incb
  	no_inc_15_2_14_3:
  	; Analizar casilla 15,1 (dirección 241) 
  	lda puntero_tablero+241,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_15_1
  	incb
  	no_inc_15_2_15_1:
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_15_3
  	incb
  	no_inc_15_2_15_3:
  	; Analizar casilla 0,1 (dirección 1) 
  	lda puntero_tablero+1,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_0_1
  	incb
  	no_inc_15_2_0_1:
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_0_2
  	incb
  	no_inc_15_2_0_2:
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_2_0_3
  	incb
  	no_inc_15_2_0_3:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+242,pcr
  	cmpa #'@
  	beq celda_viva_242
  	; Si está muerta
  	cmpb #3
  	beq nace_242
  	cmpb #6
  	beq nace_242
  	bra muere_242
  	celda_viva_242:
  	cmpb #2
  	beq vive_242
  	cmpb #3
  	beq vive_242
  	bra muere_242
  	nace_242:
  	lda #'@
  	sta puntero_tablero2+242,pcr
  	bra continuar_242
  	vive_242:
  	lda #'@
  	sta puntero_tablero2+242,pcr
  	bra continuar_242
  	muere_242:
  	lda #' 
  	sta puntero_tablero2+242,pcr
  	continuar_242:
  	
  	; Casilla 15,3 (dirección 243)
  	clrb
  	; Analizar casilla 14,2 (dirección 226) 
  	lda puntero_tablero+226,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_14_2
  	incb
  	no_inc_15_3_14_2:
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_14_3
  	incb
  	no_inc_15_3_14_3:
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_14_4
  	incb
  	no_inc_15_3_14_4:
  	; Analizar casilla 15,2 (dirección 242) 
  	lda puntero_tablero+242,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_15_2
  	incb
  	no_inc_15_3_15_2:
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_15_4
  	incb
  	no_inc_15_3_15_4:
  	; Analizar casilla 0,2 (dirección 2) 
  	lda puntero_tablero+2,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_0_2
  	incb
  	no_inc_15_3_0_2:
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_0_3
  	incb
  	no_inc_15_3_0_3:
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_3_0_4
  	incb
  	no_inc_15_3_0_4:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+243,pcr
  	cmpa #'@
  	beq celda_viva_243
  	; Si está muerta
  	cmpb #3
  	beq nace_243
  	cmpb #6
  	beq nace_243
  	bra muere_243
  	celda_viva_243:
  	cmpb #2
  	beq vive_243
  	cmpb #3
  	beq vive_243
  	bra muere_243
  	nace_243:
  	lda #'@
  	sta puntero_tablero2+243,pcr
  	bra continuar_243
  	vive_243:
  	lda #'@
  	sta puntero_tablero2+243,pcr
  	bra continuar_243
  	muere_243:
  	lda #' 
  	sta puntero_tablero2+243,pcr
  	continuar_243:
  	
  	; Casilla 15,4 (dirección 244)
  	clrb
  	; Analizar casilla 14,3 (dirección 227) 
  	lda puntero_tablero+227,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_14_3
  	incb
  	no_inc_15_4_14_3:
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_14_4
  	incb
  	no_inc_15_4_14_4:
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_14_5
  	incb
  	no_inc_15_4_14_5:
  	; Analizar casilla 15,3 (dirección 243) 
  	lda puntero_tablero+243,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_15_3
  	incb
  	no_inc_15_4_15_3:
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_15_5
  	incb
  	no_inc_15_4_15_5:
  	; Analizar casilla 0,3 (dirección 3) 
  	lda puntero_tablero+3,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_0_3
  	incb
  	no_inc_15_4_0_3:
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_0_4
  	incb
  	no_inc_15_4_0_4:
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_4_0_5
  	incb
  	no_inc_15_4_0_5:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+244,pcr
  	cmpa #'@
  	beq celda_viva_244
  	; Si está muerta
  	cmpb #3
  	beq nace_244
  	cmpb #6
  	beq nace_244
  	bra muere_244
  	celda_viva_244:
  	cmpb #2
  	beq vive_244
  	cmpb #3
  	beq vive_244
  	bra muere_244
  	nace_244:
  	lda #'@
  	sta puntero_tablero2+244,pcr
  	bra continuar_244
  	vive_244:
  	lda #'@
  	sta puntero_tablero2+244,pcr
  	bra continuar_244
  	muere_244:
  	lda #' 
  	sta puntero_tablero2+244,pcr
  	continuar_244:
  	
  	; Casilla 15,5 (dirección 245)
  	clrb
  	; Analizar casilla 14,4 (dirección 228) 
  	lda puntero_tablero+228,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_14_4
  	incb
  	no_inc_15_5_14_4:
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_14_5
  	incb
  	no_inc_15_5_14_5:
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_14_6
  	incb
  	no_inc_15_5_14_6:
  	; Analizar casilla 15,4 (dirección 244) 
  	lda puntero_tablero+244,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_15_4
  	incb
  	no_inc_15_5_15_4:
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_15_6
  	incb
  	no_inc_15_5_15_6:
  	; Analizar casilla 0,4 (dirección 4) 
  	lda puntero_tablero+4,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_0_4
  	incb
  	no_inc_15_5_0_4:
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_0_5
  	incb
  	no_inc_15_5_0_5:
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_5_0_6
  	incb
  	no_inc_15_5_0_6:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+245,pcr
  	cmpa #'@
  	beq celda_viva_245
  	; Si está muerta
  	cmpb #3
  	beq nace_245
  	cmpb #6
  	beq nace_245
  	bra muere_245
  	celda_viva_245:
  	cmpb #2
  	beq vive_245
  	cmpb #3
  	beq vive_245
  	bra muere_245
  	nace_245:
  	lda #'@
  	sta puntero_tablero2+245,pcr
  	bra continuar_245
  	vive_245:
  	lda #'@
  	sta puntero_tablero2+245,pcr
  	bra continuar_245
  	muere_245:
  	lda #' 
  	sta puntero_tablero2+245,pcr
  	continuar_245:
  	
  	; Casilla 15,6 (dirección 246)
  	clrb
  	; Analizar casilla 14,5 (dirección 229) 
  	lda puntero_tablero+229,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_14_5
  	incb
  	no_inc_15_6_14_5:
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_14_6
  	incb
  	no_inc_15_6_14_6:
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_14_7
  	incb
  	no_inc_15_6_14_7:
  	; Analizar casilla 15,5 (dirección 245) 
  	lda puntero_tablero+245,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_15_5
  	incb
  	no_inc_15_6_15_5:
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_15_7
  	incb
  	no_inc_15_6_15_7:
  	; Analizar casilla 0,5 (dirección 5) 
  	lda puntero_tablero+5,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_0_5
  	incb
  	no_inc_15_6_0_5:
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_0_6
  	incb
  	no_inc_15_6_0_6:
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_6_0_7
  	incb
  	no_inc_15_6_0_7:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+246,pcr
  	cmpa #'@
  	beq celda_viva_246
  	; Si está muerta
  	cmpb #3
  	beq nace_246
  	cmpb #6
  	beq nace_246
  	bra muere_246
  	celda_viva_246:
  	cmpb #2
  	beq vive_246
  	cmpb #3
  	beq vive_246
  	bra muere_246
  	nace_246:
  	lda #'@
  	sta puntero_tablero2+246,pcr
  	bra continuar_246
  	vive_246:
  	lda #'@
  	sta puntero_tablero2+246,pcr
  	bra continuar_246
  	muere_246:
  	lda #' 
  	sta puntero_tablero2+246,pcr
  	continuar_246:
  	
  	; Casilla 15,7 (dirección 247)
  	clrb
  	; Analizar casilla 14,6 (dirección 230) 
  	lda puntero_tablero+230,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_14_6
  	incb
  	no_inc_15_7_14_6:
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_14_7
  	incb
  	no_inc_15_7_14_7:
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_14_8
  	incb
  	no_inc_15_7_14_8:
  	; Analizar casilla 15,6 (dirección 246) 
  	lda puntero_tablero+246,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_15_6
  	incb
  	no_inc_15_7_15_6:
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_15_8
  	incb
  	no_inc_15_7_15_8:
  	; Analizar casilla 0,6 (dirección 6) 
  	lda puntero_tablero+6,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_0_6
  	incb
  	no_inc_15_7_0_6:
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_0_7
  	incb
  	no_inc_15_7_0_7:
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_7_0_8
  	incb
  	no_inc_15_7_0_8:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+247,pcr
  	cmpa #'@
  	beq celda_viva_247
  	; Si está muerta
  	cmpb #3
  	beq nace_247
  	cmpb #6
  	beq nace_247
  	bra muere_247
  	celda_viva_247:
  	cmpb #2
  	beq vive_247
  	cmpb #3
  	beq vive_247
  	bra muere_247
  	nace_247:
  	lda #'@
  	sta puntero_tablero2+247,pcr
  	bra continuar_247
  	vive_247:
  	lda #'@
  	sta puntero_tablero2+247,pcr
  	bra continuar_247
  	muere_247:
  	lda #' 
  	sta puntero_tablero2+247,pcr
  	continuar_247:
  	
  	; Casilla 15,8 (dirección 248)
  	clrb
  	; Analizar casilla 14,7 (dirección 231) 
  	lda puntero_tablero+231,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_14_7
  	incb
  	no_inc_15_8_14_7:
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_14_8
  	incb
  	no_inc_15_8_14_8:
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_14_9
  	incb
  	no_inc_15_8_14_9:
  	; Analizar casilla 15,7 (dirección 247) 
  	lda puntero_tablero+247,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_15_7
  	incb
  	no_inc_15_8_15_7:
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_15_9
  	incb
  	no_inc_15_8_15_9:
  	; Analizar casilla 0,7 (dirección 7) 
  	lda puntero_tablero+7,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_0_7
  	incb
  	no_inc_15_8_0_7:
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_0_8
  	incb
  	no_inc_15_8_0_8:
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_8_0_9
  	incb
  	no_inc_15_8_0_9:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+248,pcr
  	cmpa #'@
  	beq celda_viva_248
  	; Si está muerta
  	cmpb #3
  	beq nace_248
  	cmpb #6
  	beq nace_248
  	bra muere_248
  	celda_viva_248:
  	cmpb #2
  	beq vive_248
  	cmpb #3
  	beq vive_248
  	bra muere_248
  	nace_248:
  	lda #'@
  	sta puntero_tablero2+248,pcr
  	bra continuar_248
  	vive_248:
  	lda #'@
  	sta puntero_tablero2+248,pcr
  	bra continuar_248
  	muere_248:
  	lda #' 
  	sta puntero_tablero2+248,pcr
  	continuar_248:
  	
  	; Casilla 15,9 (dirección 249)
  	clrb
  	; Analizar casilla 14,8 (dirección 232) 
  	lda puntero_tablero+232,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_14_8
  	incb
  	no_inc_15_9_14_8:
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_14_9
  	incb
  	no_inc_15_9_14_9:
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_14_10
  	incb
  	no_inc_15_9_14_10:
  	; Analizar casilla 15,8 (dirección 248) 
  	lda puntero_tablero+248,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_15_8
  	incb
  	no_inc_15_9_15_8:
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_15_10
  	incb
  	no_inc_15_9_15_10:
  	; Analizar casilla 0,8 (dirección 8) 
  	lda puntero_tablero+8,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_0_8
  	incb
  	no_inc_15_9_0_8:
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_0_9
  	incb
  	no_inc_15_9_0_9:
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_9_0_10
  	incb
  	no_inc_15_9_0_10:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+249,pcr
  	cmpa #'@
  	beq celda_viva_249
  	; Si está muerta
  	cmpb #3
  	beq nace_249
  	cmpb #6
  	beq nace_249
  	bra muere_249
  	celda_viva_249:
  	cmpb #2
  	beq vive_249
  	cmpb #3
  	beq vive_249
  	bra muere_249
  	nace_249:
  	lda #'@
  	sta puntero_tablero2+249,pcr
  	bra continuar_249
  	vive_249:
  	lda #'@
  	sta puntero_tablero2+249,pcr
  	bra continuar_249
  	muere_249:
  	lda #' 
  	sta puntero_tablero2+249,pcr
  	continuar_249:
  	
  	; Casilla 15,10 (dirección 250)
  	clrb
  	; Analizar casilla 14,9 (dirección 233) 
  	lda puntero_tablero+233,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_14_9
  	incb
  	no_inc_15_10_14_9:
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_14_10
  	incb
  	no_inc_15_10_14_10:
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_14_11
  	incb
  	no_inc_15_10_14_11:
  	; Analizar casilla 15,9 (dirección 249) 
  	lda puntero_tablero+249,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_15_9
  	incb
  	no_inc_15_10_15_9:
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_15_11
  	incb
  	no_inc_15_10_15_11:
  	; Analizar casilla 0,9 (dirección 9) 
  	lda puntero_tablero+9,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_0_9
  	incb
  	no_inc_15_10_0_9:
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_0_10
  	incb
  	no_inc_15_10_0_10:
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_10_0_11
  	incb
  	no_inc_15_10_0_11:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+250,pcr
  	cmpa #'@
  	beq celda_viva_250
  	; Si está muerta
  	cmpb #3
  	beq nace_250
  	cmpb #6
  	beq nace_250
  	bra muere_250
  	celda_viva_250:
  	cmpb #2
  	beq vive_250
  	cmpb #3
  	beq vive_250
  	bra muere_250
  	nace_250:
  	lda #'@
  	sta puntero_tablero2+250,pcr
  	bra continuar_250
  	vive_250:
  	lda #'@
  	sta puntero_tablero2+250,pcr
  	bra continuar_250
  	muere_250:
  	lda #' 
  	sta puntero_tablero2+250,pcr
  	continuar_250:
  	
  	; Casilla 15,11 (dirección 251)
  	clrb
  	; Analizar casilla 14,10 (dirección 234) 
  	lda puntero_tablero+234,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_14_10
  	incb
  	no_inc_15_11_14_10:
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_14_11
  	incb
  	no_inc_15_11_14_11:
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_14_12
  	incb
  	no_inc_15_11_14_12:
  	; Analizar casilla 15,10 (dirección 250) 
  	lda puntero_tablero+250,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_15_10
  	incb
  	no_inc_15_11_15_10:
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_15_12
  	incb
  	no_inc_15_11_15_12:
  	; Analizar casilla 0,10 (dirección 10) 
  	lda puntero_tablero+10,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_0_10
  	incb
  	no_inc_15_11_0_10:
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_0_11
  	incb
  	no_inc_15_11_0_11:
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_11_0_12
  	incb
  	no_inc_15_11_0_12:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+251,pcr
  	cmpa #'@
  	beq celda_viva_251
  	; Si está muerta
  	cmpb #3
  	beq nace_251
  	cmpb #6
  	beq nace_251
  	bra muere_251
  	celda_viva_251:
  	cmpb #2
  	beq vive_251
  	cmpb #3
  	beq vive_251
  	bra muere_251
  	nace_251:
  	lda #'@
  	sta puntero_tablero2+251,pcr
  	bra continuar_251
  	vive_251:
  	lda #'@
  	sta puntero_tablero2+251,pcr
  	bra continuar_251
  	muere_251:
  	lda #' 
  	sta puntero_tablero2+251,pcr
  	continuar_251:
  	
  	; Casilla 15,12 (dirección 252)
  	clrb
  	; Analizar casilla 14,11 (dirección 235) 
  	lda puntero_tablero+235,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_14_11
  	incb
  	no_inc_15_12_14_11:
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_14_12
  	incb
  	no_inc_15_12_14_12:
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_14_13
  	incb
  	no_inc_15_12_14_13:
  	; Analizar casilla 15,11 (dirección 251) 
  	lda puntero_tablero+251,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_15_11
  	incb
  	no_inc_15_12_15_11:
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_15_13
  	incb
  	no_inc_15_12_15_13:
  	; Analizar casilla 0,11 (dirección 11) 
  	lda puntero_tablero+11,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_0_11
  	incb
  	no_inc_15_12_0_11:
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_0_12
  	incb
  	no_inc_15_12_0_12:
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_12_0_13
  	incb
  	no_inc_15_12_0_13:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+252,pcr
  	cmpa #'@
  	beq celda_viva_252
  	; Si está muerta
  	cmpb #3
  	beq nace_252
  	cmpb #6
  	beq nace_252
  	bra muere_252
  	celda_viva_252:
  	cmpb #2
  	beq vive_252
  	cmpb #3
  	beq vive_252
  	bra muere_252
  	nace_252:
  	lda #'@
  	sta puntero_tablero2+252,pcr
  	bra continuar_252
  	vive_252:
  	lda #'@
  	sta puntero_tablero2+252,pcr
  	bra continuar_252
  	muere_252:
  	lda #' 
  	sta puntero_tablero2+252,pcr
  	continuar_252:
  	
  	; Casilla 15,13 (dirección 253)
  	clrb
  	; Analizar casilla 14,12 (dirección 236) 
  	lda puntero_tablero+236,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_14_12
  	incb
  	no_inc_15_13_14_12:
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_14_13
  	incb
  	no_inc_15_13_14_13:
  	; Analizar casilla 14,14 (dirección 238) 
  	lda puntero_tablero+238,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_14_14
  	incb
  	no_inc_15_13_14_14:
  	; Analizar casilla 15,12 (dirección 252) 
  	lda puntero_tablero+252,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_15_12
  	incb
  	no_inc_15_13_15_12:
  	; Analizar casilla 15,14 (dirección 254) 
  	lda puntero_tablero+254,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_15_14
  	incb
  	no_inc_15_13_15_14:
  	; Analizar casilla 0,12 (dirección 12) 
  	lda puntero_tablero+12,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_0_12
  	incb
  	no_inc_15_13_0_12:
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_0_13
  	incb
  	no_inc_15_13_0_13:
  	; Analizar casilla 0,14 (dirección 14) 
  	lda puntero_tablero+14,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_13_0_14
  	incb
  	no_inc_15_13_0_14:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+253,pcr
  	cmpa #'@
  	beq celda_viva_253
  	; Si está muerta
  	cmpb #3
  	beq nace_253
  	cmpb #6
  	beq nace_253
  	bra muere_253
  	celda_viva_253:
  	cmpb #2
  	beq vive_253
  	cmpb #3
  	beq vive_253
  	bra muere_253
  	nace_253:
  	lda #'@
  	sta puntero_tablero2+253,pcr
  	bra continuar_253
  	vive_253:
  	lda #'@
  	sta puntero_tablero2+253,pcr
  	bra continuar_253
  	muere_253:
  	lda #' 
  	sta puntero_tablero2+253,pcr
  	continuar_253:
  	
  	; Casilla 15,14 (dirección 254)
  	clrb
  	; Analizar casilla 14,13 (dirección 237) 
  	lda puntero_tablero+237,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_14_13
  	incb
  	no_inc_15_14_14_13:
  	; Analizar casilla 14,14 (dirección 238) 
  	lda puntero_tablero+238,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_14_14
  	incb
  	no_inc_15_14_14_14:
  	; Analizar casilla 14,15 (dirección 239) 
  	lda puntero_tablero+239,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_14_15
  	incb
  	no_inc_15_14_14_15:
  	; Analizar casilla 15,13 (dirección 253) 
  	lda puntero_tablero+253,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_15_13
  	incb
  	no_inc_15_14_15_13:
  	; Analizar casilla 15,15 (dirección 255) 
  	lda puntero_tablero+255,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_15_15
  	incb
  	no_inc_15_14_15_15:
  	; Analizar casilla 0,13 (dirección 13) 
  	lda puntero_tablero+13,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_0_13
  	incb
  	no_inc_15_14_0_13:
  	; Analizar casilla 0,14 (dirección 14) 
  	lda puntero_tablero+14,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_0_14
  	incb
  	no_inc_15_14_0_14:
  	; Analizar casilla 0,15 (dirección 15) 
  	lda puntero_tablero+15,pcr
  	cmpa #'@ ; Ver si está viva
  	bne no_inc_15_14_0_15
  	incb
  	no_inc_15_14_0_15:
  	; Calculos de nacimiento/muerte
  	lda puntero_tablero+254,pcr
  	cmpa #'@
  	beq celda_viva_254
  	; Si está muerta
  	cmpb #3
  	beq nace_254
  	cmpb #6
  	beq nace_254
  	bra muere_254
  	celda_viva_254:
  	cmpb #2
  	beq vive_254
  	cmpb #3
  	beq vive_254
  	bra muere_254
  	nace_254:
  	lda #'@
  	sta puntero_tablero2+254,pcr
  	bra continuar_254
  	vive_254:
  	lda #'@
  	sta puntero_tablero2+254,pcr
  	bra continuar_254
  	muere_254:
  	lda #' 
  	sta puntero_tablero2+254,pcr
  	continuar_254:
  	
  	; Cargar valores de tablero para intercambiarlos
  	;leax puntero_tablero,pcr
	;leay puntero_tablero2,pcr
	ldx #puntero_tablero
	ldy #puntero_tablero2

	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 1
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 2
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 3
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 4
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 5
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 6
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 7
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 8
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 9
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 10
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 11
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 12
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 13
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 14
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 15
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	lda ,y+
	sta ,x+
	; Fin intercambio de tableros línea 16
  	
	

contador:
	; decrementar número de pasos y saltar al bucle de impresión y actualización de nuevo
	ldb nPasos
	decb
	stb nPasos
	beq acabar
	lbra bucleImpresion
    jmp bucleImpresion,pcr


acabar:
	; fin del programa
	clra
	sta 0xFF01

	.org 0xFFFE    
	.word programa
