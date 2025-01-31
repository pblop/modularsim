#!/usr/bin/env python3

import sys

with open(sys.argv[1], 'r', encoding="ASCII") as inf:
  with open(sys.argv[2], "wb") as outf:
    for line in inf.readlines():
      line = line.strip()

      recordtype = line[:2]
      bytecount = int(line[2:4], 16)
      address = int(line[4:8], 16)
      data = line[8:-2]
      checksum = line[-2:]
    
      match recordtype:
        case "S0":
          print(f"S0 (Header): {data}")
        case "S1":
          print(f"S1 (Data): {data}")
          outf.seek(address, 0) # seek_set=0
          outf.write(bytes.fromhex(data))
        case "S9":
          print(f"S9 (Termination): {data}")


