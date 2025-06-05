#!/usr/bin/env bash

# Run all TS files and examples/ and output the failures.
# This utility script is meant to simplify CI checks on the examples.

failed=$(mktemp)
error=$(mktemp)

for file in $(find examples/ -type f -name "*.ts"); do
	echo "Running $file ..."
	if ! npx tsx "$file" 2> "$error" > /dev/null; then
		echo "$file" >> "$failed"
		cat "$error"
		echo ""
	fi
done

if [[ -s "$failed" ]]; then
	echo "❌ Failed files:"
	cat "$failed"
	rm "$failed"
	exit 1
else
	echo "✅ All files ran successfully."
	rm "$failed"
	exit 0
fi