/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://github.com/isaacs/tshy?tab=readme-ov-file#commonjs-dialect-polyfills
// @ts-ignore suppress "Import assertions are not allowed on statements that compile to CommonJS 'require' calls."
import registry from '@substrate/asset-transfer-api-registry/docs/registry.json' assert { type: 'json' };

export { registry };
