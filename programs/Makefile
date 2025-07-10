SELF_DIR := $(dir $(lastword $(MAKEFILE_LIST)))

AS = as6809
ASFLAGS = 

LINK = aslink
LINKFLAGS =

# test files exclude interrupt, loop and hlife (not meant to be tested in the
# simulator)
TEST_FILES := $(foreach S,$(wildcard *.asm),\
								$(if $(findstring interrupt,$(S)),,\
								$(if $(findstring loop,$(S)),,\
								$(if $(findstring hlife,$(S)),,\
								$(S))))\
							)

all: $(patsubst %.asm,%.bin,$(wildcard *.asm)) $(patsubst %.asm,%.s19,$(wildcard *.asm)) $(patsubst %.asm,%.noi,$(wildcard *.asm))
test: $(patsubst %.asm,%.bin,$(wildcard *.asm)) $(patsubst %.asm,%.json,$(TEST_FILES))

# Assemble .asm file
%.rel: %.asm
	$(AS) $(ASFLAGS) -o $< 

%.lst: %.asm
	$(AS) $(ASFLAGS) -l $<

# Binary output file
%.s19: %.rel
	$(LINK) $(LINKFLAGS) -s $<
%.ihx: %.rel
	$(LINK) $(LINKFLAGS) -i $<
# Full memory binary output 
%.bin: %.s19
	$(SELF_DIR)/../scripts/s19reader.py $< $@

# Debug symbols
%.noi: %.rel
	$(LINK) $(LINKFLAGS) -j $<
%.map: %.rel
	$(LINK) $(LINKFLAGS) -w -m $<
%.cdb: %.rel # this one isn't implemented
	$(LINK) $(LINKFLAGS) -y $<

# Test .json
%.json: %.s19
	$(SELF_DIR)/../scripts/generate-test-json.py $< $@

# Clean build artifacts
clean:
	rm -rf *.rel *.lst *.s19 *.bin *.noi *.map *.json
