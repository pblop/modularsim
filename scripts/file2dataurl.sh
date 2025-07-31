#!/usr/bin/env bash

# This script generates a data URL for a program file (.s19, .bin, .noi) and
# outputs it in a format suitable for embedding in a configuration file.

usage() {
  echo "Usage: $0 <input-file>"
  echo "Generates a data URL with the appropriate MIME type."
  echo "Supported file types: .s19, .bin, .noi"
  exit 1
}

if [ "$#" -ne 1 ]; then
  usage
fi

input_file="$1"

# Get the MIME type based on the file extension
printf "data:"

case "$input_file" in
  *.s19) 
    printf "text/x-srec"
    encoding="percent"
    ;;
  *.bin) 
    printf "application/octet-stream;base64"
    encoding="base64"
    ;;
  *.noi) 
    printf "application/x-noice"
    encoding="percent"
    ;;
  *) 
    echo "Unknown file type" >&2
    exit 1
    ;;
esac

printf ","

# Read the file content and it as either percent- or base64-encode it
if [ "$encoding" = "percent" ]; then
  cat "$input_file" | jq -sRr @uri
else
  cat "$input_file" | base64
fi