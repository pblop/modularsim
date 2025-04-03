#!/usr/bin/env python3

import json
import sys
from pathlib import Path
import argparse
import subprocess

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description="Generate test json file")
  parser.add_argument("s19file", type=str, help="s19 file")
  parser.add_argument("outfile", type=str, help="json output file")
  args = parser.parse_args()

  if not Path(args.s19file).exists():
    print("error: s19 file not found")
    sys.exit(1)

  # if Path(args.outfile).exists():
  #   print("error: output file already exists")
  #   sys.exit(1)

  regdump_file = Path("regdump.json")
  if regdump_file.exists():
    regdump_file.unlink()

  cmd = ["m6809-run", "-d", args.s19file]
  inpt = b"json\ns\n" * 1000
  result = subprocess.run(
    cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, input=inpt, check=False
  )

  # load the json dumps
  with open("regdump.json", "r", encoding="utf-8") as f:
    regdumps = json.load(f)
  # remove the regdump file
  regdump_file.unlink()

  with open(args.outfile, "w", encoding="utf-8") as f:
    json.dump(regdumps, f, indent=2)
