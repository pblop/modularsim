#!/usr/bin/env python3

from pathlib import Path, PurePosixPath
import re
import argparse
import sys
from dataclasses import dataclass
from typing import Literal
import json
import urllib.parse
import os


# Arg parser that shows the help message on error
class MyParser(argparse.ArgumentParser):
  def error(self, message):
    sys.stderr.write("error: %s\n" % message)
    self.print_help(sys.stderr)
    sys.exit(2)


@dataclass
class Args:
  input_files: list[Path]
  root_path: Path
  output_file: Path | None
  map_only: bool
  html_file: Path | None


def parse_args():
  parser = MyParser(
    description="Generate a single-file HTML document from a set of input JS files and an HTML document.",
    epilog="One of -h, -m, or -s must be specified.",
  )
  parser.add_argument(
    "input_files", nargs="+", help="List of input HTML files to process."
  )
  parser.add_argument(
    "-r",
    "--root",
    dest="root_path",
    help="Root path for the importmap (default: current directory).",
    default=".",
  )
  parser.add_argument(
    "-o",
    "--output",
    dest="output_file",
    help="Output file to write the combined content (default: <input_html>.onefile.html).",
  )
  parser.add_argument(
    "-m",
    "--map-only",
    help="Show the import map and exit.",
    action="store_true",
  )
  parser.add_argument(
    "-s",
    "--source",
    dest="html_file",
    help="Specify an HTML file to process (default: none).",
  )
  args = parser.parse_args()

  if args.map_only == bool(args.html_file):
    parser.error(
      "You must either specify an HTML file with -s OR use -m to only show the import map."
    )

  # Ensure the input files exist (and are files)
  input_files = [Path(f) for f in args.input_files]
  for f in input_files:
    if not f.exists() or not f.is_file():
      parser.error(f"Input file '{f}' does not exist or is not a file.")

  # Ensure the root path exists
  root_path = Path(args.root_path)
  if not root_path.exists() or not root_path.is_dir():
    parser.error(f"Root path '{root_path}' does not exist or is not a directory.")

  output_file = None
  if args.output_file:
    output_file = Path(args.output_file).resolve()
    if output_file.exists() and not output_file.is_file():
      parser.error(f"Output file '{output_file}' already exists, but is not a file.")

  html_file = None
  if args.html_file:
    html_file = Path(args.html_file).resolve()
    if not html_file.exists() or not html_file.is_file():
      parser.error(f"HTML file '{html_file}' does not exist or is not a file.")
    if not output_file:
      # Default output file is <input-html>.onefile.html
      output_file = html_file.with_suffix(".onefile.html")

  return Args(
    input_files=input_files,
    root_path=root_path,
    output_file=output_file,
    map_only=args.map_only,
    html_file=html_file,
  )


MimeTypes = Literal["application/javascript", "text/plain", "application/wasm"]


def mime_type(file_path: Path) -> MimeTypes:
  """Determine the MIME type based on file extension."""
  if file_path.suffix == ".js":
    return "application/javascript"
  elif file_path.suffix == ".wasm":
    return "application/wasm"
  else:
    return "text/plain"


def read_file(file_path: Path, mime: MimeTypes) -> str | bytes:
  if mime == "application/javascript" or mime == "text/plain":
    # Read as text for js or plain text
    with open(file_path, "r", encoding="utf-8") as f:
      return f.read()
  else:
    # Read as binary for wasm files
    with open(file_path, "rb") as f:
      return f.read()


def get_importmap_script(importmap: dict[str, dict[str, str]]) -> str:
  """Generate the importmap script tag."""
  importmap_json = json.dumps(importmap, indent=2)
  return f'<script type="importmap">\n{importmap_json}\n</script>'


import_pattern = r"(import\s+.*?\s+from\s+['\"])(.*?)(['\"])"


def flatten_imports(file_path: Path, content: str) -> str:
  """Flatten import statements in the content."""
  # Find all import statements in the content
  matches = re.finditer(import_pattern, content, re.MULTILINE)
  # treat the file path as an absolute path
  path = PurePosixPath(file_path.as_posix())

  for match in matches:
    if not match:
      continue
    pre = match.group(1)
    import_path = match.group(2)
    post = match.group(3)

    if import_path.startswith("http://") or import_path.startswith("https://"):
      continue  # Skip non-relative imports

    import_path = PurePosixPath(import_path)

    flat_import_path = os.path.normpath(path.parent.joinpath(import_path))

    # Replace the import path with the flat path
    content = content.replace(match[0], f"{pre}{flat_import_path}{post}", count=1)

  return content


def main():
  args = parse_args()
  importmap = {"imports": {}}

  for file in args.input_files:
    mime = mime_type(file)
    # add charset=utf-8 for text/javascript and text/plain.
    mime_encoding = (
      mime
      if mime not in ["application/javascript", "text/plain"]
      else f"{mime};charset=utf-8"
    )
    relpath = file.relative_to(args.root_path)
    content = read_file(file, mime)
    # If the file is a javascript file, we need to manually resolve the imports
    # and set them to their flat equivalent (the importmap contains flat paths).
    # This is necessary because once we place all the files in a single HTML
    # file, the file paths will all be 'data:...' and relative imports will not
    # work.
    # Example: if the module "/a/b/c.js" imports "../../d.js", we need to modify
    # the import to be "/d.js".
    if mime == "application/javascript":
      # Additionally, we remove the sourceMappingURL comment if it exists.
      # I have yet to find a way to include source maps and have them work. For
      # now, we just remove the comment, because when the browser doesn't find
      # the source map, it will throw a warning in the console, and it pollutes
      # the rest of the console output.
      content = re.sub(r"//# sourceMappingURL=.*", "", content, count=1)  # type: ignore
      content = flatten_imports(relpath, content)

    content = urllib.parse.quote(content)
    importmap["imports"][f"{str(relpath)}"] = f"data:{mime_encoding},{content}"

  importmap_tag = get_importmap_script(importmap)

  if args.map_only:
    print(importmap_tag)
    return

  if args.html_file and args.output_file:
    with args.html_file.open("r", encoding="utf-8") as html_file:
      html = html_file.read()
      html = re.sub(r"</head>", f"{importmap_tag}\n</head>", html, count=1)
    with args.output_file.open("w", encoding="utf-8") as output_file:
      output_file.write(html)


if __name__ == "__main__":
  main()
