/**
 * When importing from @substrate/asset-transfer-api it would look like the following
 *
 * import { AssetTransferApi, constructApiPromise } from '@substrate/asset-transfer-api'
 */
import { AssetTransferApi, constructApiPromise } from '../src';
import { TxResult } from '../src/types';
import { GREEN, PURPLE, RESET } from './colors';
import { ApiPromise, WsProvider } from '@polkadot/api';


const EMPTY_ACCOUNT = '5GLTAEtR2wyJCjqamkWdJciHdSPxe3CpebvxkWMhSAQpiHak'
const WESTEND_RELAY = 'wss://westend-rpc.polkadot.io';
const WESTEND_ASSET_HUB = 'wss://westend-asset-hub-rpc.polkadot.io';
const WESTEND_ASSET_HUB_CHAIN_ID = '1000';

/**
 * In this example we are sending 1/10th the existential deposit of
 * WND from the relay to the asset hub. If successful, the account
 * would still be reaped and funds would be lost, but this is caught
 * by providing the optional `destApi`. Thus an InsufficientDestinationAccount
 * error is thrown.
 */
const sendingInsufficientNativeAsset = async () => {
    const { api, specName, safeXcmVersion } = await constructApiPromise(WESTEND_RELAY);
    const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

    const destProvider = new WsProvider(WESTEND_ASSET_HUB);
    const destApi = await ApiPromise.create({ provider: destProvider });

    let callInfo: TxResult<'call'>;
    try {
        console.log(`${PURPLE}Attempting to send an insufficient amount of WND`);
        callInfo = await assetApi.createTransferTransaction(
            WESTEND_ASSET_HUB_CHAIN_ID,
            EMPTY_ACCOUNT,
            [],  // blank for native transfer
            ['100000000'], // existential deposit is 1_000_000_000
            {
                format: 'call',
                xcmVersion: safeXcmVersion,
                destApi, // Comment out to remove check
            },
        );

        console.log(`${PURPLE}The following call data that is returned:\n${GREEN}${JSON.stringify(callInfo, null, 4)}`);
    } catch (e) {
        console.error(e);
        return;
    }

    const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
    console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);
};

/**
 * In this example we are sending a large amount of an insufficient asset
 * within the Westend Asset Hub to an empty account. Since the account is empty
 * and the asset is insufficient, the acount would still be reaped and funds would be
 * lost, but this is caught by providing the optional `destApi`. Thus an
 * InsufficientDestinationAccount error is thrown.
 */
const sendingInsufficientNonNativeAsset = async () => {
    const { api, specName, safeXcmVersion } = await constructApiPromise(WESTEND_ASSET_HUB);
    const assetApi = new AssetTransferApi(api, specName, safeXcmVersion);

    let callInfo: TxResult<'call'>;
    try {
        console.log(`${PURPLE}Attempting to send an insufficient asset to an insufficient account`);
        callInfo = await assetApi.createTransferTransaction(
            WESTEND_ASSET_HUB_CHAIN_ID,
            EMPTY_ACCOUNT,
            ['1337'],  // 1337 on Westend is not a sufficient asset
            ['100000000000000000000000000000'],
            {
                format: 'call',
                xcmVersion: safeXcmVersion,
                destApi: api, // Comment out to remove check
            },
        );

        console.log(`${PURPLE}The following call data that is returned:\n${GREEN}${JSON.stringify(callInfo, null, 4)}`);
    } catch (e) {
        console.error(e);
        return;
    }

    const decoded = assetApi.decodeExtrinsic(callInfo.tx, 'call');
    console.log(`\n${PURPLE}The following decoded tx:\n${GREEN} ${JSON.stringify(JSON.parse(decoded), null, 4)}${RESET}`);

    await api.disconnect();
};

(async () => {
	try {
		await sendingInsufficientNativeAsset();
        console.log();
        await sendingInsufficientNonNativeAsset();
	} catch (err) {
		console.error(err)
	} finally {
        process.exit();
    }
})();
