CC      = gcc
CFLAGS  = -O2 -Wall -Wextra
TARGET  = disk_sched

# Native build (for testing)
native: disk_scheduling.c disk_scheduling.h
	$(CC) $(CFLAGS) -o $(TARGET) disk_scheduling.c -lm

# WebAssembly build (requires Emscripten SDK)
wasm: disk_scheduling.c disk_scheduling.h
	emcc -O2 -o disk_scheduling.js disk_scheduling.c \
		-s EXPORTED_FUNCTIONS='["_fcfs","_sstf","_scan","_cscan","_malloc","_free"]' \
		-s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
		-s MODULARIZE=1 -s EXPORT_NAME='DiskSchedulingModule'

clean:
	rm -f $(TARGET) disk_scheduling.js disk_scheduling.wasm

.PHONY: native wasm clean
