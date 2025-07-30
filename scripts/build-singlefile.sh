#!/usr/bin/env bash

root_path="."
importmap_only=false
input_html_file=""
output_file=""

usage() {
  echo "Usage: $0 [options] <input_files>" >&2
  echo "Options:" >&2
  echo "  -h, --help        Show this help message" >&2
  echo "  -r <path>         Root path for the importmap (default: current directory \"$root_path\")" >&2
  echo "  -m                Show the import map and exit" >&2
  echo "  -s <html_file>    Specify an HTML file to process (default: none)" >&2
  echo "  -o <output_file>  Specify an output file (default: <inputfile>.onefile.html)" >&2
  echo "One of -h, -m, or -s must be specified." >&2
}

while getopts "hmr:s:" opt; do
  case $opt in
    h)
      usage
      exit 0
      ;;
    m)
      importmap_only=true
      ;;
    r)
      root_path="$OPTARG"
      ;;
    s)
      input_html_file="$OPTARG"
      if [ ! -f "$input_html_file" ]; then
        echo "Error: HTML file '$input_html_file' does not exist." >&2
        exit 1
      fi
      ;;
    o)
      output_file="$OPTARG"
      if [ -z "$output_file" ]; then
        echo "Error: Output file cannot be empty." >&2
        exit 1
      fi
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      usage
      exit 1
      ;;
  esac
done

shift $((OPTIND-1))

if [ $# -eq 0 ]; then
  echo "No input files specified." >&2
  usage
  exit 1
fi

if [[ "$importmap_only" == true && -n "$input_html_file" ]] || [[ "$importmap_only" == false && -z "$input_html_file" ]]; then
  echo "Error: You must either specify an HTML file with -s OR use -m to only show the import map." >&2
  usage
  exit 1
fi

# Find a realpath that supports --relative-to option
gnu_realpath=
if realpath --relative-to=. . >/dev/null 2>&1; then
  gnu_realpath=realpath
elif grealpath --relative-to=. . >/dev/null 2>&1; then
  gnu_realpath=grealpath
else
  echo "Error: realpath or grealpath command not found or does not support --relative-to option." >&2
  exit 1
fi

importmap="{
  \"imports\": {
"
for filepath in "$@"; do
  if [ ! -f "$filepath" ]; then
    echo "File not found: $filepath" >&2
    exit 1
  fi

  case "$filepath" in
    *.min.js)
      mime_type="text/plain"
      content="$(cat "$filepath" | jq -sRr @uri)"
      ;;
    *.js)
      mime_type="text/javascript"
      content=$(cat "$filepath" | sed 's|//# sourceMappingURL=.*||g' | jq -sRr @uri)
      ;;
    *)
      mime_type="data:text/plain"
      content="$(cat "$filepath" | jq -sRr @uri)"
      ;;
  esac

  relative_path=$($gnu_realpath --relative-to="$root_path" "$filepath")

  importmap+="    \"/$relative_path\": \"data:$mime_type,$content\",
"
  # importmap+="       \"/$relative_path\": \"\",
#"

done
# Remove trailing comma from the last entry
importmap=${importmap%,*}
importmap+="  },
  \"scopes\": {"

importmap+='
    "/modules/simulator/simulator.js": {
      "../../utils/": "/utils/"
    }
'

importmap+="  }
}"

if $importmap_only; then
  echo "<script type=\"importmap\">
  $importmap
  </script>"
  exit 0
fi

# Calculate the output file name.
if [ -z "$output_file" ]; then
  output_file="${input_html_file%.html}.onefile.html"
fi

# Read the HTML file and insert the importmap before </head>
# Store the sed command in a temporary file to sidestep issues with argv size
# limits (importmap can be large).
temp_file=$(mktemp)
trap 'rm -f "$temp_file"' EXIT
importmap_escaped="${importmap//$'\n'/\\n}"
echo "s|</head>|<script type=\"importmap\">\n$importmap_escaped\n</script></head>|" > "$temp_file"
sed -f "$temp_file" "$input_html_file" > "$output_file"

echo "Modified file saved into $output_file"