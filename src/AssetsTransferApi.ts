// Copyright 2023 Parity Technologies (UK) Ltd.

import '@polkadot/api-augment';

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import type {
	RuntimeDispatchInfo,
	RuntimeDispatchInfoV1,
} from '@polkadot/types/interfaces';
import type { ISubmittableResult } from '@polkadot/types/types';

import {
	RELAY_CHAIN_NAMES,
	SYSTEM_PARACHAINS_IDS,
	SYSTEM_PARACHAINS_NAMES,
} from './consts';
import * as assets from './createCalls/assets';
import * as balances from './createCalls/balances';
import {
	limitedReserveTransferAssets,
	limitedTeleportAssets,
	reserveTransferAssets,
	teleportAssets,
} from './createXcmCalls';
import {
	BaseError,
	checkBaseInputTypes,
	checkLocalTxInput,
	checkXcmTxInputs,
	checkXcmVersion,
} from './errors';
import { Registry } from './registry';
import { sanitizeAddress } from './sanitize/sanitizeAddress';
import {
	AssetsTransferApiOpts,
	AssetType,
	ConstructedFormat,
	Direction,
	Format,
	LocalTransferTypes,
	Methods,
	SubmittableMethodData,
	TransferArgsOpts,
	TxResult,
	UnsignedTransaction,
} from './types';

/**
 * Holds open an api connection to a specified chain within the ApiPromise in order to help
 * construct transactions for assets and estimating fees.
 *
 * @constructor api ApiPromise provided by Polkadot-js
 * @constructor specName The specName of the provided chains api
 * @constructor safeXcmVersion The safeXcmVersion of the chain.
 * @constructor opts AssetsTransferApiOpts
 */
export class AssetsTransferApi {
	readonly _api: ApiPromise;
	readonly _opts: AssetsTransferApiOpts;
	readonly _specName: string;
	readonly _safeXcmVersion: number;
	readonly registry: Registry;

	constructor(
		api: ApiPromise,
		specName: string,
		safeXcmVersion: number,
		opts: AssetsTransferApiOpts = {}
	) {
		this._api = api;
		this._opts = opts;
		this._specName = specName;
		this._safeXcmVersion = safeXcmVersion;
		this.registry = new Registry(specName, this._opts);
	}

	/**
	 * Create an asset transfer transaction. This can be either locally on a systems parachain or relay chain,
	 * or between chains using xcm.
	 *
	 * @param destChainId ID of the destination (para) chain (‘0’ for Relaychain)
	 * @param destAddr Address of destination account
	 * @param assetIds Array of assetId's to be transferred
	 * @param amounts Array of the amounts of each token to transfer
	 * @param opts Options
	 */
	public async createTransferTransaction<T extends Format>(
		destChainId: string,
		destAddr: string,
		assetIds: string[],
		amounts: string[],
		opts?: TransferArgsOpts<T>
	): Promise<TxResult<T>> {
		/**
		 * Ensure all the inputs are the corrects primitive and or object types.
		 * It will throw an error if any are incorrect.
		 */
		checkBaseInputTypes(destChainId, destAddr, assetIds, amounts);

		const { _api, _specName, _safeXcmVersion, registry } = this;
		const isOriginSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(
			_specName.toLowerCase()
		);
		const isDestSystemParachain = SYSTEM_PARACHAINS_IDS.includes(destChainId);

		/**
		 * Sanitize the address to a hex, and ensure that the passed in SS58, or publickey
		 * is validated correctly.
		 */
		const addr = sanitizeAddress(destAddr);
		const isLocalSystemTx = isDestSystemParachain && isOriginSystemParachain;
		const isLocalRelayTx =
			destChainId === '0' &&
			RELAY_CHAIN_NAMES.includes(_specName.toLowerCase());
		/**
		 * Create a local asset transfer on a system parachain
		 */
		if (isLocalSystemTx || isLocalRelayTx) {
			/**
			 * This will throw a BaseError if the inputs are incorrect and don't
			 * fit the constraints for creating a local asset transfer.
			 */
			const localAssetType = checkLocalTxInput(assetIds, amounts, registry); // Throws an error when any of the inputs are incorrect.
			const method = opts?.keepAlive ? 'transferKeepAlive' : 'transfer';
			if (isLocalSystemTx) {
				let tx: SubmittableExtrinsic<'promise', ISubmittableResult>;
				let palletMethod: LocalTransferTypes;
				/**
				 *
				 */
				if (localAssetType === 'Balances') {
					tx =
						method === 'transferKeepAlive'
							? balances.transferKeepAlive(_api, addr, amounts[0])
							: balances.transfer(_api, addr, amounts[0]);
					palletMethod = `balances::${method}`;
				} else {
					tx =
						method === 'transferKeepAlive'
							? assets.transferKeepAlive(_api, addr, assetIds[0], amounts[0])
							: assets.transfer(_api, addr, assetIds[0], amounts[0]);
					palletMethod = `assets::${method}`;
				}

				return await this.constructFormat(
					tx,
					'local',
					null,
					palletMethod,
					opts?.format,
					opts?.paysWithFeeOrigin
				);
			} else {
				/**
				 * By default local transaction on a relay chain will always be from the balances pallet
				 */
				const palletMethod: LocalTransferTypes = `balances::${method}`;
				const tx =
					method === 'transferKeepAlive'
						? balances.transferKeepAlive(_api, addr, amounts[0])
						: balances.transfer(_api, addr, amounts[0]);
				return this.constructFormat(
					tx,
					'local',
					null,
					palletMethod,
					opts?.format,
					opts?.paysWithFeeOrigin
				);
			}
		}

		const xcmDirection = this.establishDirection(destChainId, _specName);
		const xcmVersion =
			opts?.xcmVersion === undefined ? _safeXcmVersion : opts.xcmVersion;
		checkXcmVersion(xcmVersion); // Throws an error when the xcmVersion is not supported.
		checkXcmTxInputs(
			assetIds,
			amounts,
			xcmDirection,
			destChainId,
			_specName,
			registry
		);

		const assetType = this.fetchAssetType(destChainId, assetIds, xcmDirection);

		let txMethod: Methods;
		let transaction: SubmittableExtrinsic<'promise', ISubmittableResult>;
		if (assetType === AssetType.Foreign) {
			if (opts?.isLimited) {
				txMethod = 'limitedReserveTransferAssets';
				transaction = limitedReserveTransferAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					_specName,
					opts?.weightLimit,
					opts?.paysWithFeeDest
				);
			} else {
				txMethod = 'reserveTransferAssets';
				transaction = reserveTransferAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					_specName,
					opts?.paysWithFeeDest
				);
			}
		} else {
			if (opts?.isLimited) {
				txMethod = 'limitedTeleportAssets';
				transaction = limitedTeleportAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					_specName,
					opts?.weightLimit
				);
			} else {
				txMethod = 'teleportAssets';
				transaction = teleportAssets(
					_api,
					xcmDirection,
					addr,
					assetIds,
					amounts,
					destChainId,
					xcmVersion,
					_specName
				);
			}
		}

		return this.constructFormat<T>(
			transaction,
			xcmDirection,
			xcmVersion,
			txMethod,
			opts?.format,
			opts?.paysWithFeeOrigin
		);
	}
	/**
	 * Fetch estimated fee information for an extrinsic
	 *
	 * @param tx A polkadot-js submittable extrinsic
	 * @param format The format the tx is in
	 */
	public async fetchFeeInfo<T extends Format>(
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		format?: T
	): Promise<RuntimeDispatchInfo | RuntimeDispatchInfoV1 | null> {
		const { _api } = this;
		const fmt = format ? format : 'payload';

		if (fmt === 'payload') {
			const payload = _api.registry
				.createType('ExtrinsicPayload', tx, {
					version: tx.version,
				})
				.toHex();

			return _api.call.transactionPaymentApi.queryInfo(payload, payload.length);
		} else if (fmt === 'call') {
			const call = _api.registry
				.createType('Call', {
					callIndex: tx.callIndex,
					args: tx.args,
				})
				.toHex();

			return _api.call.transactionPaymentApi.queryInfo(call, call.length);
		} else if (fmt === 'submittable') {
			const ext = _api.registry.createType('Extrinsic', tx);
			const u8a = ext.toU8a();

			return _api.call.transactionPaymentApi.queryInfo(u8a, u8a.length);
		}

		return null;
	}

	/**
	 * Declare the direction of the xcm message.
	 *
	 * @param destChainId
	 * @param specName
	 */
	private establishDirection(destChainId: string, specName: string): Direction {
		const { _api } = this;
		const isSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(
			specName.toLowerCase()
		);
		const isDestIdSystemPara = SYSTEM_PARACHAINS_IDS.includes(destChainId);

		/**
		 * Check if the origin is a System Parachain
		 */
		if (isSystemParachain && destChainId === '0') {
			return Direction.SystemToRelay;
		}

		if (isSystemParachain && destChainId !== '0') {
			return Direction.SystemToPara;
		}

		/**
		 * Check if the origin is a Relay Chain
		 */
		if (_api.query.paras && isDestIdSystemPara) {
			return Direction.RelayToSystem;
		}

		if (_api.query.paras && !isDestIdSystemPara) {
			return Direction.RelayToPara;
		}

		/**
		 * Check if the origin is a Parachain or Parathread
		 */
		if (_api.query.polkadotXcm && !isDestIdSystemPara) {
			throw Error('ParaToRelay is not yet implemented');

			return Direction.ParaToRelay;
		}

		if (_api.query.polkadotXcm) {
			throw Error('ParaToPara is not yet implemented');

			return Direction.ParaToPara;
		}

		throw Error('Could not establish a xcm transaction direction');
	}

	/**
	 * Construct the correct format for the transaction.
	 * If nothing is passed in, the format will default to a signing payload.
	 *
	 * @param tx A polkadot-js submittable extrinsic
	 * @param format The format to return the tx in.
	 */
	private async constructFormat<T extends Format>(
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		direction: Direction | 'local',
		xcmVersion: number | null = null,
		method: Methods,
		format?: T,
		paysWithFeeOrigin?: string
	): Promise<TxResult<T>> {
		const { _api } = this;
		const fmt = format ? format : 'payload';
		const result: TxResult<T> = {
			direction,
			xcmVersion,
			method,
			format: fmt as Format | 'local',
			tx: '' as ConstructedFormat<T>,
		};

		if (fmt === 'call') {
			result.tx = _api.registry
				.createType('Call', {
					callIndex: tx.callIndex,
					args: tx.args,
				})
				.toHex() as ConstructedFormat<T>;
		}

		if (fmt === 'submittable') {
			result.tx = tx as ConstructedFormat<T>;
		}

		if (fmt === 'payload') {
			result.tx = (await this.createPayload(
				tx,
				paysWithFeeOrigin
			)) as ConstructedFormat<T>;
		}

		return result;
	}

	private fetchAssetType(
		destChainId: string,
		assets: string[],
		xcmDirection: Direction
	): AssetType {
		if (xcmDirection === 'RelayToSystem' || xcmDirection === 'SystemToRelay') {
			return AssetType.Native;
		}

		if (xcmDirection === 'RelayToPara') {
			return AssetType.Foreign;
		}

		const relayChainInfo = this.registry.currentRelayRegistry;

		/**
		 * We can assume all the assets in `assets` are either foreign or native since we check
		 * all possible cases in `checkXcmTxInputs`.
		 */
		const { assetsInfo, tokens } = relayChainInfo[destChainId];
		const assetIdsAsStr = Object.keys(assetsInfo).map((num) => num.toString());

		if (assetIdsAsStr.includes(assets[0]) || tokens.includes(assets[0])) {
			return AssetType.Native;
		} else {
			return AssetType.Foreign;
		}
	}
	/**
	 * Decodes the hex of an extrinsic into a string readable format
	 *
	 * @param encodedTransaction the hex of an extrinsic tx
	 * @param format The format the tx is in
	 */
	public decodeExtrinsic<T extends Format>(
		encodedTransaction: string,
		format: T
	): string {
		const { _api } = this;
		const fmt = format ? format : 'payload';

		if (fmt === 'payload') {
			const extrinsicPayload = _api.registry.createType(
				'ExtrinsicPayload',
				encodedTransaction,
				{
					version: 4,
				}
			);

			const call = _api.registry.createType('Call', extrinsicPayload.method);
			const decodedMethodInfo = JSON.stringify(call.toHuman());

			return decodedMethodInfo;
		} else if (fmt === 'call') {
			const call = _api.registry.createType('Call', encodedTransaction);

			const decodedMethodInfo = JSON.stringify(call.toHuman());

			return decodedMethodInfo;
		} else if (fmt === 'submittable') {
			const extrinsic = _api.registry.createType(
				'Extrinsic',
				encodedTransaction
			);

			const decodedMethodInfo = JSON.stringify(extrinsic.method.toHuman());

			return decodedMethodInfo;
		}

		return '';
	}

	/**
	 * returns an ExtrinsicPayload
	 *
	 * @param tx SubmittableExtrinsic<'promise', ISubmittableResult>
	 * @param paysWithFeeOrigin string
	 */
	public createPayload = async (
		tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
		paysWithFeeOrigin?: string
	): Promise<`0x${string}`> => {
		let assetId = 0;

		// if a paysWithFeeOrigin is provided and the chain is of system origin
		// we assign the assetId to the value of paysWithFeeOrigin
		const isOriginSystemParachain = SYSTEM_PARACHAINS_NAMES.includes(
			this._specName.toLowerCase()
		);

		if (paysWithFeeOrigin && isOriginSystemParachain) {
			assetId = Number.parseInt(paysWithFeeOrigin);
			const isNotANumber = Number.isNaN(assetId);

			if (isNotANumber) {
				throw new BaseError(
					`paysWithFeeOrigin value must be a valid number. Received: ${paysWithFeeOrigin}`
				);
			}

			const isSufficient = await this.checkAssetIsSufficient(assetId);

			if (!isSufficient) {
				throw new BaseError(
					`asset with assetId ${assetId} is not a sufficient asset to pay for fees`
				);
			}
		}

		const submittableString = JSON.stringify(tx.toHuman());
		const submittableData: SubmittableMethodData = JSON.parse(
			submittableString
		) as unknown as SubmittableMethodData;
		const addr = submittableData.method.args.dest.id;
		const lastHeader = await this._api.rpc.chain.getHeader();
		const blockNumber = this._api.registry.createType(
			'BlockNumber',
			lastHeader.number.toNumber()
		);
		const method = this._api.registry.createType('Call', tx);
		const era = this._api.registry.createType('ExtrinsicEra', {
			current: lastHeader.number.toNumber(),
			period: 64,
		});

		const nonce = await this._api.rpc.system.accountNextIndex(addr);

		const unsignedPayload: UnsignedTransaction = {
			specVersion: this._api.runtimeVersion.specVersion.toHex(),
			transactionVersion: this._api.runtimeVersion.transactionVersion.toHex(),
			assetId,
			address: addr,
			blockHash: lastHeader.hash.toHex(),
			blockNumber: blockNumber.toHex(),
			era: era.toHex(),
			genesisHash: this._api.genesisHash.toHex(),
			method: method.toHex(),
			nonce: nonce.toHex(),
			signedExtensions: [
				'CheckNonZeroSender',
				'CheckSpecVersion',
				'CheckTxVersion',
				'CheckGenesis',
				'CheckMortality',
				'CheckNonce',
				'CheckWeight',
				'ChargeTransactionPayment',
			],
			tip: this._api.registry.createType('Compact<Balance>', 0).toHex(),
			version: tx.version,
		};

		const extrinsicPayload = this._api.registry.createType(
			'ExtrinsicPayload',
			unsignedPayload,
			{
				version: unsignedPayload.version,
			}
		);

		return extrinsicPayload.toHex();
	};

	/**
	 * checks the chains state to determine whether an asset is valid
	 * if it is valid, it returns whether it is marked as sufficient for paying fees
	 *
	 * @param assetId number
	 * @returns Promise<boolean>
	 */
	public checkAssetIsSufficient = async (assetId: number): Promise<boolean> => {
		try {
			const asset = (await this._api.query.assets.asset(assetId)).unwrap();

			if (asset.isSufficient.toString().toLowerCase() === 'true') {
				return true;
			}

			return false;
		} catch (err: unknown) {
			throw new BaseError(`assetId ${assetId} does not match a valid asset`);
		}
	};
}
