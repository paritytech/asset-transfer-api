#!/usr/bin/env bash

# Run all TS files and examples/ and output the failures.
# This utility script is meant to simplify CI checks on the examples.

# cd to root of project
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/.." || exit

# Associative array of files to skip. Please provide reason
declare -A skippable=(
	# Utility scripts
	["examples/colors.ts"]=1
	# Expects local endpoint to be available
	["examples/submittable.ts"]=1
	# TODO: Fix the following later or remove them entirely
	# PalletNotFound: Pallet xTokens not found in the current runtime.
	["examples/paraToParaTransferMultiAsset.ts"]=1
	["examples/claimAssets.ts"]=1
	["examples/paraToSystemTransferMultiAssets.ts"]=1
	["examples/paraToSystemTransferMultiAsset.ts"]=1
	["examples/paraToParaTransferMultiAssetWithFee.ts"]=1
	["examples/paraToRelayTransferMultiAsset.ts"]=1
	["examples/paraToSystemTransferMultiAssetWithFee.ts"]=1
	# getaddrinfo ENOTFOUND moonriver-rpc.dwellir.com
	["examples/paraToParaTransferMultiAssets.ts"]=1
	["examples/paraToSystemParachainPrimaryNative.ts"]=1
	# getaddrinfo ENOTFOUND paseo-asset-hub-rpc.polkadot.io
	["examples/paseoAssetHubToRelay.ts"]=1
	# getaddrinfo ENOTFOUND bifrost-polkadot-rpc.dwellir.com
	["examples/fetchFeeInfo.ts"]=1
)

failed=$(mktemp)
error=$(mktemp)

for file in $(find examples/ -type f -name "*.ts"); do
	if [[ -n "${skippable[$file]}" ]]; then
		echo "Skipping $file. Explicitly listed exception."
		continue
	fi
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