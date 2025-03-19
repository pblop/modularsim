#!/usr/bin/env python3

import json
import sys
from pathlib import Path
import argparse
import subprocess

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Generate test json file')
  parser.add_argument('s19file', type=str, help='s19 file')
  parser.add_argument('outfile', type=str, help='json output file')
  args = parser.parse_args()

  if not Path(args.s19file).exists():
    print('error: s19 file not found')
    sys.exit(1)

  if Path(args.outfile).exists():
    print('error: output file already exists')
    sys.exit(1)

  cmd = ["m6809-run", "-d", args.s19file]
  ip = b'next' + b'\n'*100
  result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, input=ip, check=False)

  debuggerout = result.stdout.decode('utf-8')
  
  lines = debuggerout.splitlines()
  snapshots = [line for line in lines if line.startswith('PCR:') or line.startswith('(dbg) PCR:')]
  
  jsonsnaps = []

  for snap in snapshots:
    if snap.startswith("(dbg) "):
      snap = snap[6:]

    snap = [r.split(":") for r in snap.split()]
    jsonsnap = {}

    for r in snap:
      name, value = r
      # make sure all names are lowercase
      name = name.lower() if name != "PCR" else "pc"

      if name == "cc":
        jsonsnap[name] = list(value.replace("_", ""))
      else:
        jsonsnap[name] = int(value, 16)
    
    jsonsnaps.append(jsonsnap)

  with open(args.outfile, 'w', encoding="utf-8") as f:
    json.dump(jsonsnaps, f, indent=2)


