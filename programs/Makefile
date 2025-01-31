SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))

AS = as6809
ASFLAGS = 

LINK = aslink
LINKFLAGS =

all: $(patsubst %.asm,%.bin,$(wildcard *.asm))

# Assemble .asm file
%.rel: %.asm
	$(AS) $(ASFLAGS) -o $< 

%.lst: %.asm
	$(AS) $(ASFLAGS) -l $<

%.s19: %.rel
	$(LINK) $(LINKFLAGS) -s $<

%.bin: %.s19
	$(SELF_DIR)/../scripts/s19reader.py $< $@

# Clean build artifacts
clean:
	rm -rf *.rel *.lst *.s19 *.bin
