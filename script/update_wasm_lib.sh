#!/bin/bash

script_directory="$(dirname "$0")"

node_modules_path="$script_directory/../node_modules"
dependency_path="@safeheron/mpc-wasm-sdk"
source_file="$node_modules_path/$dependency_path/lib/MPC.html"
destination_directory="$script_directory/../src/service/mpc-lib"

if [ ! -d "$destination_directory" ]; then
  echo "target file $source_file not exist, please run npm install first"
  exit 1
fi

cp "$source_file" "$destination_directory"

echo "MPC.html copied to $destination_directory"
