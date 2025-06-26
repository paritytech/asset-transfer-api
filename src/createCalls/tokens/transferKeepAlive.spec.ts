import { mockBifrostParachainApi } from '../../testHelpers/mockBifrostParachainApi';
import { transferKeepAlive } from './transferKeepAlive';

describe('tokens::transferKeepAlive', () => {
	it('transferKeepAlive', () => {
		const res = transferKeepAlive(
			mockBifrostParachainApi,
			'djSk4JfeBVmDA6T4yuTZajjZGmn9h8hcSH1NE6mGE4UdFv3',
			'dot',
			'1000000',
		);
		expect(res.toHex()).toEqual(
			'0xa80447020058d75e286e10ad6c94094927df2ef747b39864dcf3c7aff55a7696915b1e0785020302093d00',
		);
	});
});
