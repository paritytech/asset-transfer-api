import { ChainInfoRegistry } from "../registry/types";

export const mockAssetRegistry = {
    "polkadot": {
      "0": {
        "tokens": [
          "DOT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "polkadot"
      },
      "1000": {
        "tokens": [
          "DOT"
        ],
        "assetsInfo": {
          "1": "no1",
          "2": "BTC",
          "3": "DOT",
          "4": "EFI",
          "5": "PLX",
          "6": "LPHP",
          "7": "lucky7",
          "8": "JOE",
          "9": "PINT",
          "10": "BEAST",
          "11": "web3",
          "12": "USDcp",
          "15": "Meme",
          "20": "StabCP",
          "21": "WBTC",
          "23": "PINK",
          "77": "TRQ",
          "79": "PGOLD",
          "99": "Cypress",
          "100": "WETH",
          "101": "DOTMA",
          "123": "123",
          "256": "ICE",
          "666": "DANGER",
          "777": "777",
          "999": "gold",
          "1000": "BRZ",
          "1337": "USDC",
          "1984": "USDt",
          "862812": "CUBO",
          "868367": "VSC",
          "20090103": "BTC"
        },
        "foreignAssetsInfo": {
          "EQ": {
            "symbol": "EQ",
            "name": "Equilibrium",
            "multiLocation": "{\"parents\":\"1\",\"interior\":{\"X1\":{\"Parachain\":\"2011\"}}}"
          },
          "0x7b22706172656e7473223a2232222c22696e746572696f72223a7b225831223a7b22476c6f62616c436f6e73656e737573223a224b7573616d61227d7d7d": {
            "symbol": "",
            "name": "",
            "multiLocation": "{\"parents\":\"2\",\"interior\":{\"X1\":{\"GlobalConsensus\":\"Kusama\"}}}"
          },
          "EQD": {
            "symbol": "EQD",
            "name": "Equilibrium Dollar",
            "multiLocation": "{\"parents\":\"1\",\"interior\":{\"X2\":[{\"Parachain\":\"2011\"},{\"GeneralKey\":{\"length\":\"3\",\"data\":\"0x6571640000000000000000000000000000000000000000000000000000000000\"}}]}}"
          }
        },
        "poolPairsInfo": {},
        "specName": "statemint"
      },
      "1001": {
        "tokens": [
          "DOT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "collectives"
      },
      "1002": {
        "tokens": [
          "DOT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bridge-hub-polkadot"
      },
      "2000": {
        "tokens": [
          "ACA",
          "AUSD",
          "DOT",
          "LDOT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "acala",
        "xcAssetsData": [
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "ForeignAsset": "12"
            }
          },
          {
            "paraID": 1000,
            "symbol": "WETH",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":100}]}}}",
            "asset": {
              "ForeignAsset": "6"
            }
          },
          {
            "paraID": 1000,
            "symbol": "WBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":21}]}}}",
            "asset": {
              "ForeignAsset": "5"
            }
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": {
              "ForeignAsset": "0"
            }
          },
          {
            "paraID": 2006,
            "symbol": "ASTR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2006}}}}",
            "asset": {
              "ForeignAsset": "2"
            }
          },
          {
            "paraID": 2008,
            "symbol": "CRU",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2008}}}}",
            "asset": {
              "ForeignAsset": "11"
            }
          },
          {
            "paraID": 2011,
            "symbol": "EQD",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2011},{\"generalKey\":\"0x657164\"}]}}}",
            "asset": {
              "ForeignAsset": "8"
            }
          },
          {
            "paraID": 2011,
            "symbol": "EQ",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2011}}}}",
            "asset": {
              "ForeignAsset": "7"
            }
          },
          {
            "paraID": 2012,
            "symbol": "PARA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2012},{\"generalKey\":\"0x50415241\"}]}}}",
            "asset": {
              "ForeignAsset": "1"
            }
          },
          {
            "paraID": 2032,
            "symbol": "IBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": {
              "ForeignAsset": "3"
            }
          },
          {
            "paraID": 2032,
            "symbol": "INTR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0002\"}]}}}",
            "asset": {
              "ForeignAsset": "4"
            }
          },
          {
            "paraID": 2035,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2035}}}}",
            "asset": {
              "ForeignAsset": "9"
            }
          },
          {
            "paraID": 2037,
            "symbol": "UNQ",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2037}}}}",
            "asset": {
              "ForeignAsset": "10"
            }
          }
        ]
      },
      "2004": {
        "tokens": [
          "GLMR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "moonbeam",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "DOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "42259045809535163221576417993425387648"
          },
          {
            "paraID": 1000,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1337}]}}}",
            "asset": "166377000701797186346254371275954761085"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "311091173110107856861649819128533077277"
          },
          {
            "paraID": 2000,
            "symbol": "LDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0003\"}]}}}",
            "asset": "225719522181998468294117309041779353812"
          },
          {
            "paraID": 2000,
            "symbol": "aUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "110021739665376159354538090254163045594"
          },
          {
            "paraID": 2000,
            "symbol": "ACA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0000\"}]}}}",
            "asset": "224821240862170613278369189818311486111"
          },
          {
            "paraID": 2006,
            "symbol": "ASTR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2006}}}}",
            "asset": "224077081838586484055667086558292981199"
          },
          {
            "paraID": 2011,
            "symbol": "EQD",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2011},{\"generalKey\":\"0x657164\"}]}}}",
            "asset": "187224307232923873519830480073807488153"
          },
          {
            "paraID": 2011,
            "symbol": "EQ",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2011}}}}",
            "asset": "190590555344745888270686124937537713878"
          },
          {
            "paraID": 2012,
            "symbol": "PARA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2012},{\"generalKey\":\"0x50415241\"}]}}}",
            "asset": "32615670524745285411807346420584982855"
          },
          {
            "paraID": 2026,
            "symbol": "NODL",
            "decimals": 11,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2026},{\"palletInstance\":2}]}}}",
            "asset": "309163521958167876851250718453738106865"
          },
          {
            "paraID": 2030,
            "symbol": "FIL",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0804\"}]}}}",
            "asset": "144012926827374458669278577633504620722"
          },
          {
            "paraID": 2030,
            "symbol": "vDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0900\"}]}}}",
            "asset": "29085784439601774464560083082574142143"
          },
          {
            "paraID": 2030,
            "symbol": "vGLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0901\"}]}}}",
            "asset": "204507659831918931608354793288110796652"
          },
          {
            "paraID": 2030,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "165823357460190568952172802245839421906"
          },
          {
            "paraID": 2030,
            "symbol": "vFIL",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0904\"}]}}}",
            "asset": "272547899416482196831721420898811311297"
          },
          {
            "paraID": 2031,
            "symbol": "CFG",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2031},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "91372035960551235635465443179559840483"
          },
          {
            "paraID": 2032,
            "symbol": "IBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "120637696315203257380661607956669368914"
          },
          {
            "paraID": 2032,
            "symbol": "INTR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0002\"}]}}}",
            "asset": "101170542313601871197860408087030232491"
          },
          {
            "paraID": 2034,
            "symbol": "HDX",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2034},{\"generalIndex\":0}]}}}",
            "asset": "69606720909260275826784788104880799692"
          },
          {
            "paraID": 2035,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2035}}}}",
            "asset": "132685552157663328694213725410064821485"
          },
          {
            "paraID": 2043,
            "symbol": "OTP",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2043},{\"palletInstance\":10}]}}}",
            "asset": "238111524681612888331172110363070489924"
          },
          {
            "paraID": 2046,
            "symbol": "RING",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2046},{\"palletInstance\":5}]}}}",
            "asset": "125699734534028342599692732320197985871"
          },
          {
            "paraID": 2092,
            "symbol": "ZTG",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "150874409661081770150564009349448205842"
          },
          {
            "paraID": 2101,
            "symbol": "SUB",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2101}}}}",
            "asset": "89994634370519791027168048838578580624"
          },
          {
            "paraID": 2104,
            "symbol": "MANTA",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2104}}}}",
            "asset": "166446646689194205559791995948102903873"
          }
        ]
      },
      "2006": {
        "tokens": [
          "ASTR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "astar",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "DOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "340282366920938463463374607431768211455"
          },
          {
            "paraID": 1000,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1337}]}}}",
            "asset": "4294969281"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "4294969280"
          },
          {
            "paraID": 2000,
            "symbol": "LDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0003\"}]}}}",
            "asset": "18446744073709551618"
          },
          {
            "paraID": 2000,
            "symbol": "ACA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0000\"}]}}}",
            "asset": "18446744073709551616"
          },
          {
            "paraID": 2000,
            "symbol": "aSEED",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "18446744073709551617"
          },
          {
            "paraID": 2002,
            "symbol": "CLV",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2002}}}}",
            "asset": "18446744073709551625"
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": "18446744073709551619"
          },
          {
            "paraID": 2011,
            "symbol": "EQD",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2011},{\"generalKey\":\"0x657164\"}]}}}",
            "asset": "18446744073709551629"
          },
          {
            "paraID": 2011,
            "symbol": "EQ",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2011}}}}",
            "asset": "18446744073709551628"
          },
          {
            "paraID": 2030,
            "symbol": "vsDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0403\"}]}}}",
            "asset": "18446744073709551626"
          },
          {
            "paraID": 2030,
            "symbol": "vDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0900\"}]}}}",
            "asset": "18446744073709551624"
          },
          {
            "paraID": 2030,
            "symbol": "vASTR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0903\"}]}}}",
            "asset": "18446744073709551632"
          },
          {
            "paraID": 2030,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "18446744073709551623"
          },
          {
            "paraID": 2032,
            "symbol": "IBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "18446744073709551620"
          },
          {
            "paraID": 2032,
            "symbol": "INTR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0002\"}]}}}",
            "asset": "18446744073709551621"
          },
          {
            "paraID": 2034,
            "symbol": "HDX",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2034},{\"generalIndex\":0}]}}}",
            "asset": "18446744073709551630"
          },
          {
            "paraID": 2035,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2035}}}}",
            "asset": "18446744073709551622"
          },
          {
            "paraID": 2037,
            "symbol": "UNQ",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2037}}}}",
            "asset": "18446744073709551631"
          },
          {
            "paraID": 2046,
            "symbol": "RING",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2046},{\"palletInstance\":5}]}}}",
            "asset": "18446744073709551627"
          }
        ]
      },
      "2007": {
        "tokens": [
          "KPX"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "totem-parachain"
      },
      "2008": {
        "tokens": [
          "CRU"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "polkadot-crust-parachain"
      },
      "2011": {
        "tokens": [
          "TOKEN"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "Equilibrium-parachain"
      },
      "2012": {
        "tokens": [
          "PARA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "parallel",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "DOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "101"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "102"
          },
          {
            "paraID": 2000,
            "symbol": "LDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0003\"}]}}}",
            "asset": "110"
          },
          {
            "paraID": 2000,
            "symbol": "ACA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0000\"}]}}}",
            "asset": "108"
          },
          {
            "paraID": 2000,
            "symbol": "lcDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x040d000000\"}]}}}",
            "asset": "106"
          },
          {
            "paraID": 2002,
            "symbol": "CLV",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2002}}}}",
            "asset": "130"
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": "114"
          },
          {
            "paraID": 2012,
            "symbol": "sDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2012},{\"generalKey\":\"0x73444f54\"}]}}}",
            "asset": "1001"
          },
          {
            "paraID": 2012,
            "symbol": "cDOT-7/14",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2012},{\"palletInstance\":6},{\"generalIndex\":200070014}]}}}",
            "asset": "200070014"
          },
          {
            "paraID": 2012,
            "symbol": "cDOT-8/15",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2012},{\"palletInstance\":6},{\"generalIndex\":200080015}]}}}",
            "asset": "200080015"
          },
          {
            "paraID": 2012,
            "symbol": "cDOT-10/17",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2012},{\"palletInstance\":6},{\"generalIndex\":200100017}]}}}",
            "asset": "200100017"
          },
          {
            "paraID": 2012,
            "symbol": "cDOT-6/13",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2012},{\"palletInstance\":6},{\"generalIndex\":200060013}]}}}",
            "asset": "200060013"
          },
          {
            "paraID": 2012,
            "symbol": "cDOT-9/16",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2012},{\"palletInstance\":6},{\"generalIndex\":200090016}]}}}",
            "asset": "200090016"
          },
          {
            "paraID": 2032,
            "symbol": "INTR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0002\"}]}}}",
            "asset": "120"
          },
          {
            "paraID": 2032,
            "symbol": "IBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "122"
          },
          {
            "paraID": 2035,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2035}}}}",
            "asset": "115"
          }
        ]
      },
      "2013": {
        "tokens": [
          "LIT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "litentry-parachain"
      },
      "2019": {
        "tokens": [
          "LAYR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "composable"
      },
      "2026": {
        "tokens": [
          "NODL"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "nodle-para"
      },
      "2030": {
        "tokens": [
          "BNC"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bifrost_polkadot",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "DOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": {
              "Token2": "0"
            }
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "Token2": "2"
            }
          },
          {
            "paraID": 1000,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1337}]}}}",
            "asset": {
              "Token2": "5"
            }
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": {
              "Token2": "1"
            }
          },
          {
            "paraID": 2006,
            "symbol": "ASTR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2006}}}}",
            "asset": {
              "Token2": "3"
            }
          },
          {
            "paraID": 2030,
            "symbol": "vGLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0901\"}]}}}",
            "asset": {
              "VToken2": "1"
            }
          },
          {
            "paraID": 2030,
            "symbol": "vFIL",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0904\"}]}}}",
            "asset": {
              "VToken2": "4"
            }
          },
          {
            "paraID": 2030,
            "symbol": "FIL",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0804\"}]}}}",
            "asset": {
              "Token2": "4"
            }
          },
          {
            "paraID": 2030,
            "symbol": "vASTR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0903\"}]}}}",
            "asset": {
              "VToken2": "3"
            }
          },
          {
            "paraID": 2030,
            "symbol": "vDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0900\"}]}}}",
            "asset": {
              "VToken2": "0"
            }
          },
          {
            "paraID": 2030,
            "symbol": "vsDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0403\"}]}}}",
            "asset": {
              "VSToken2": "0"
            }
          },
          {
            "paraID": 2032,
            "symbol": "IBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": {
              "Token2": "6"
            }
          },
          {
            "paraID": 2032,
            "symbol": "INTR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0002\"}]}}}",
            "asset": {
              "Token2": "7"
            }
          },
          {
            "paraID": 2104,
            "symbol": "MANTA",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2104}}}}",
            "asset": {
              "Token2": "8"
            }
          }
        ]
      },
      "2031": {
        "tokens": [
          "CFG"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "centrifuge",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "DOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": {
              "ForeignAsset": "5"
            }
          },
          {
            "paraID": 1000,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1337}]}}}",
            "asset": {
              "ForeignAsset": "6"
            }
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "ForeignAsset": "1"
            }
          },
          {
            "paraID": 2000,
            "symbol": "aUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": {
              "ForeignAsset": "3"
            }
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": {
              "ForeignAsset": "4"
            }
          },
          {
            "paraID": 2031,
            "symbol": "LpArbUSDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x4\":[{\"parachain\":2031},{\"palletInstance\":103},{\"globalConsensus\":{\"ethereum\":{\"chainId\":42161}}},{\"accountKey20\":{\"network\":null,\"key\":\"0xaf88d065e77c8cc2239327c5edb3a432268e5831\"}}]}}}",
            "asset": {
              "ForeignAsset": "100,003"
            }
          },
          {
            "paraID": 2031,
            "symbol": "CFG",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2031},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "Native"
          },
          {
            "paraID": 2031,
            "symbol": "LpBaseUSDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x4\":[{\"parachain\":2031},{\"palletInstance\":103},{\"globalConsensus\":{\"ethereum\":{\"chainId\":8453}}},{\"accountKey20\":{\"network\":null,\"key\":\"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913\"}}]}}}",
            "asset": {
              "ForeignAsset": "100,002"
            }
          },
          {
            "paraID": 2031,
            "symbol": "LpEthUSDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x4\":[{\"parachain\":2031},{\"palletInstance\":103},{\"globalConsensus\":{\"ethereum\":{\"chainId\":1}}},{\"accountKey20\":{\"network\":null,\"key\":\"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48\"}}]}}}",
            "asset": {
              "ForeignAsset": "100,001"
            }
          },
          {
            "paraID": 2031,
            "symbol": "LpCeloUSDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x4\":[{\"parachain\":2031},{\"palletInstance\":103},{\"globalConsensus\":{\"ethereum\":{\"chainId\":42220}}},{\"accountKey20\":{\"network\":null,\"key\":\"0x37f750b7cc259a2f741af45294f6a16572cf5cad\"}}]}}}",
            "asset": {
              "ForeignAsset": "100,004"
            }
          }
        ]
      },
      "2032": {
        "tokens": [
          "INTR",
          "IBTC",
          "DOT",
          "KINT",
          "KBTC",
          "KSM"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "interlay-parachain",
        "xcAssetsData": [
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "ForeignAsset": "2"
            }
          },
          {
            "paraID": 2000,
            "symbol": "LDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0003\"}]}}}",
            "asset": {
              "ForeignAsset": "1"
            }
          },
          {
            "paraID": 2001,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": {
              "ForeignAsset": "11"
            }
          },
          {
            "paraID": 2004,
            "symbol": "WBNB.wh",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0xe3b841c3f96e647e6dc01b468d6d0ad3562a9eeb\"}}]}}}",
            "asset": {
              "ForeignAsset": "7"
            }
          },
          {
            "paraID": 2004,
            "symbol": "TBTC.wh",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0xecd65e4b89495ae63b4f11ca872a23680a7c419c\"}}]}}}",
            "asset": {
              "ForeignAsset": "5"
            }
          },
          {
            "paraID": 2004,
            "symbol": "USDC.wh",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0x931715fee2d06333043d11f658c8ce934ac61d0c\"}}]}}}",
            "asset": {
              "ForeignAsset": "8"
            }
          },
          {
            "paraID": 2004,
            "symbol": "WBTC.wh",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0xe57ebd2d67b462e9926e04a8e33f01cd0d64346d\"}}]}}}",
            "asset": {
              "ForeignAsset": "9"
            }
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": {
              "ForeignAsset": "10"
            }
          },
          {
            "paraID": 2004,
            "symbol": "WETH.wh",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0xab3f0245b83feb11d15aaffefd7ad465a59817ed\"}}]}}}",
            "asset": {
              "ForeignAsset": "6"
            }
          },
          {
            "paraID": 2004,
            "symbol": "DAI.wh",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0x06e605775296e851ff43b4daa541bb0984e9d6fd\"}}]}}}",
            "asset": {
              "ForeignAsset": "4"
            }
          },
          {
            "paraID": 2030,
            "symbol": "VDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0900\"}]}}}",
            "asset": {
              "ForeignAsset": "3"
            }
          }
        ]
      },
      "2034": {
        "tokens": [
          "HDX"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "hydradx",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "DOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "5"
          },
          {
            "paraID": 1000,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1337}]}}}",
            "asset": "22"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "10"
          },
          {
            "paraID": 2000,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0207df96d1341a7d16ba1ad431e2c847d978bc2bce\"}]}}}",
            "asset": "7"
          },
          {
            "paraID": 2000,
            "symbol": "DAI",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0254a37a01cd75b616d63e0ab665bffdb0143c52ae\"}]}}}",
            "asset": "2"
          },
          {
            "paraID": 2000,
            "symbol": "APE",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02f4c723e61709d90f89939c1852f516e373d418a8\"}]}}}",
            "asset": "6"
          },
          {
            "paraID": 2000,
            "symbol": "WBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02c80084af223c8b598536178d9361dc55bfda6818\"}]}}}",
            "asset": "3"
          },
          {
            "paraID": 2000,
            "symbol": "WETH",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x025a4d6acdc4e3e5ab15717f407afe957f7a242578\"}]}}}",
            "asset": "4"
          },
          {
            "paraID": 2004,
            "symbol": "WETH",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0xab3f0245b83feb11d15aaffefd7ad465a59817ed\"}}]}}}",
            "asset": "20"
          },
          {
            "paraID": 2004,
            "symbol": "WBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0xe57ebd2d67b462e9926e04a8e33f01cd0d64346d\"}}]}}}",
            "asset": "19"
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": "16"
          },
          {
            "paraID": 2004,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0x931715fee2d06333043d11f658c8ce934ac61d0c\"}}]}}}",
            "asset": "21"
          },
          {
            "paraID": 2004,
            "symbol": "DAI",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0x06e605775296e851ff43b4daa541bb0984e9d6fd\"}}]}}}",
            "asset": "18"
          },
          {
            "paraID": 2004,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2004},{\"palletInstance\":110},{\"accountKey20\":{\"network\":null,\"key\":\"0xc30e9ca94cf52f3bf5692aacf81353a27052c46f\"}}]}}}",
            "asset": "23"
          },
          {
            "paraID": 2006,
            "symbol": "ASTR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2006}}}}",
            "asset": "9"
          },
          {
            "paraID": 2030,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "14"
          },
          {
            "paraID": 2030,
            "symbol": "vDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0900\"}]}}}",
            "asset": "15"
          },
          {
            "paraID": 2031,
            "symbol": "CFG",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2031},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "13"
          },
          {
            "paraID": 2032,
            "symbol": "iBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "11"
          },
          {
            "paraID": 2032,
            "symbol": "INTR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2032},{\"generalKey\":\"0x0002\"}]}}}",
            "asset": "17"
          },
          {
            "paraID": 2035,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2035}}}}",
            "asset": "8"
          },
          {
            "paraID": 2092,
            "symbol": "ZTG",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "12"
          },
          {
            "paraID": 2101,
            "symbol": "SUB",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2101}}}}",
            "asset": "24"
          }
        ]
      },
      "2035": {
        "tokens": [
          "PHA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "phala",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "DOT",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "0"
          },
          {
            "paraID": 2000,
            "symbol": "ACA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0000\"}]}}}",
            "asset": "5"
          },
          {
            "paraID": 2000,
            "symbol": "AUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "3"
          },
          {
            "paraID": 2000,
            "symbol": "LDOT",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0003\"}]}}}",
            "asset": "4"
          },
          {
            "paraID": 2004,
            "symbol": "GLMR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2004},{\"palletInstance\":10}]}}}",
            "asset": "1"
          },
          {
            "paraID": 2006,
            "symbol": "ASTR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2006}}}}",
            "asset": "6"
          },
          {
            "paraID": 2011,
            "symbol": "EQ",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2011}}}}",
            "asset": "9"
          },
          {
            "paraID": 2011,
            "symbol": "EQD",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2011},{\"generalKey\":\"0x657164\"}]}}}",
            "asset": "10"
          },
          {
            "paraID": 2012,
            "symbol": "PARA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2012},{\"generalKey\":\"0x50415241\"}]}}}",
            "asset": "2"
          },
          {
            "paraID": 2030,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2030},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "8"
          },
          {
            "paraID": 2034,
            "symbol": "HDX",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2034},{\"generalIndex\":0}]}}}",
            "asset": "11"
          },
          {
            "paraID": 2046,
            "symbol": "RING",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2046},{\"palletInstance\":5}]}}}",
            "asset": "7"
          }
        ]
      },
      "2037": {
        "tokens": [
          "UNQ"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "unique"
      },
      "2039": {
        "tokens": [
          "TEER"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "integritee-parachain"
      },
      "2043": {
        "tokens": [
          "OTP"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "origintrail-parachain",
        "xcAssetsData": [
          {
            "paraID": 2043,
            "symbol": "TRAC",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2043},{\"generalIndex\":1}]}}}",
            "asset": "1"
          }
        ]
      },
      "2046": {
        "tokens": [
          "RING"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "Darwinia2"
      },
      "2048": {
        "tokens": [
          "BBB"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bitgreen-parachain"
      },
      "2051": {
        "tokens": [
          "AJUN"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "ajuna"
      },
      "2056": {
        "tokens": [
          "AVT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "avn-parachain"
      },
      "2086": {
        "tokens": [
          "KILT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "kilt-spiritnet"
      },
      "2091": {
        "tokens": [
          "FRQCY"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "frequency"
      },
      "2092": {
        "tokens": [
          "ZTG"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "zeitgeist"
      },
      "2093": {
        "tokens": [
          "HASH"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "luhn"
      },
      "2094": {
        "tokens": [
          "PEN"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "pendulum"
      },
      "2101": {
        "tokens": [
          "SUB"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "subsocial-parachain"
      },
      "2104": {
        "tokens": [
          "MANTA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "manta"
      },
      "3333": {
        "tokens": [
          "TRN"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "t3rn"
      }
    },
    "kusama": {
      "0": {
        "tokens": [
          "KSM"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "kusama"
      },
      "1000": {
        "tokens": [
          "KSM"
        ],
        "assetsInfo": {
          "0": "DOG",
          "1": "L T",
          "2": "PNN",
          "3": "Meow",
          "4": "HAPPY",
          "5": "BEER",
          "6": "ZKPD",
          "7": "DOS",
          "8": "RMRK",
          "9": "TOT",
          "10": "USDC",
          "11": "USDT",
          "12": "BUSD",
          "13": "LN",
          "14": "DOT",
          "15": "Web3",
          "16": "ARIS",
          "17": "MEME",
          "18": "HEI",
          "19": "SHOT",
          "20": "BFKK",
          "21": "ELEV",
          "22": "STH",
          "23": "KOJO",
          "24": "test",
          "25": "BABE",
          "26": "BUNGA",
          "27": "RUNE",
          "28": "LAC",
          "29": "CODES",
          "30": "GOL",
          "31": "ki",
          "32": "FAV",
          "33": "BUSSY",
          "34": "PLX",
          "35": "LUCKY",
          "36": "RRT",
          "37": "MNCH",
          "38": "ENT",
          "39": "DSCAN",
          "40": "ERIC",
          "41": "GOOSE",
          "42": "NRNF",
          "43": "TTT",
          "44": "ADVNCE",
          "45": "CRIB",
          "46": "FAN",
          "47": "EUR",
          "49": "DIAN",
          "50": "PROMO",
          "55": "MTS",
          "60": "GAV",
          "61": "CRY",
          "64": "oh!",
          "66": "DAI",
          "68": "ADVERT",
          "69": "NICE",
          "70": "MAR",
          "71": "OAK",
          "75": "cipher",
          "77": "Crypto",
          "87": "XEXR",
          "88": "BTC",
          "90": "SATS",
          "91": "TMJ",
          "99": "BITCOIN",
          "100": "Chralt",
          "101": "---",
          "102": "DRX",
          "111": "NO1",
          "117": "TNKR",
          "123": "NFT",
          "138": "Abc",
          "168": "Tokens",
          "188": "ZLK",
          "200": "SIX",
          "214": "LOVE",
          "222": "PNEO",
          "223": "BILL",
          "224": "SIK",
          "300": "PWS",
          "333": "Token",
          "345": "345",
          "360": "uni",
          "365": "time",
          "374": "wETH",
          "377": "KAA",
          "383": "KODA",
          "404": "MAXI",
          "420": "BLAZE",
          "520": "0xe299a5e299a5e299a5",
          "555": "GAME",
          "567": "CHRWNA",
          "569": "KUSA",
          "598": "EREN",
          "666": "BAD",
          "677": "GRB",
          "759": "bLd",
          "777": "GOD",
          "813": "TBUX",
          "841": "YAYOI",
          "888": "LUCK",
          "911": "911",
          "969": "WGTL",
          "999": "CBDC",
          "1000": "SPARK",
          "1107": "HOLIC",
          "1111": "MTVD",
          "1123": "XEN",
          "1155": "WITEK",
          "1225": "GOD",
          "1234": "KSM",
          "1313": "TACP",
          "1337": "TIP",
          "1420": "HYDR",
          "1441": "SPOT",
          "1526": "bcd",
          "1607": "STRGZN",
          "1688": "ali",
          "1984": "USDt",
          "1999": "ADVERT2",
          "2021": "WAVE",
          "2048": "RWS",
          "2049": "Android",
          "2050": "CUT",
          "2077": "XRT",
          "3000": "GRAIN",
          "3001": "DUCK",
          "3077": "ACT",
          "3721": "fast",
          "3943": "GMK",
          "6789": "VHM",
          "6967": "CHAOS",
          "7777": "lucky7",
          "8848": "top",
          "9000": "KPOTS",
          "9999": "BTC",
          "11111": "KVC",
          "12345": "DREX",
          "19840": "USDt",
          "42069": "INTRN",
          "69420": "CHAOS",
          "80815": "KSMFS",
          "80816": "RUEPP",
          "80817": "FRALEY",
          "88888": "BAILEGO",
          "95834": "LUL",
          "220204": "STM",
          "314159": "RTT",
          "777777": "DEFI",
          "862812": "CUBO",
          "863012": "VCOP",
          "4206969": "SHIB",
          "5201314": "belove",
          "5797867": "TAKE",
          "7777777": "king",
          "4294967291": "PRIME"
        },
        "foreignAssetsInfo": {
          "0x7b22706172656e7473223a2232222c22696e746572696f72223a7b225831223a7b22476c6f62616c436f6e73656e737573223a22506f6c6b61646f74227d7d7d": {
            "symbol": "",
            "name": "",
            "multiLocation": "{\"parents\":\"2\",\"interior\":{\"X1\":{\"GlobalConsensus\":\"Polkadot\"}}}"
          },
          "TNKR": {
            "symbol": "TNKR",
            "name": "Tinkernet",
            "multiLocation": "{\"parents\":\"1\",\"interior\":{\"X2\":[{\"Parachain\":\"2125\"},{\"GeneralIndex\":\"0\"}]}}"
          }
        },
        "poolPairsInfo": {
          "0": {
            "lpToken": "0",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"5797867\"}]}}]]"
          },
          "1": {
            "lpToken": "1",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1984\"}]}}]]"
          },
          "2": {
            "lpToken": "2",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1313\"}]}}]]"
          }
        },
        "specName": "statemine"
      },
      "1001": {
        "tokens": [
          "KSM"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "encointer-parachain"
      },
      "1002": {
        "tokens": [
          "KSM"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bridge-hub-kusama"
      },
      "2000": {
        "tokens": [
          "KAR",
          "KUSD",
          "KSM",
          "LKSM",
          "BNC",
          "VSKSM",
          "PHA",
          "KINT",
          "KBTC",
          "TAI"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "karura",
        "xcAssetsData": [
          {
            "paraID": 1000,
            "symbol": "RMRK",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":8}]}}}",
            "asset": {
              "ForeignAsset": "0"
            }
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "ForeignAsset": "7"
            }
          },
          {
            "paraID": 1000,
            "symbol": "ARIS",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":16}]}}}",
            "asset": {
              "ForeignAsset": "1"
            }
          },
          {
            "paraID": 2007,
            "symbol": "SDN",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2007}}}}",
            "asset": {
              "ForeignAsset": "18"
            }
          },
          {
            "paraID": 2012,
            "symbol": "CSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2012}}}}",
            "asset": {
              "ForeignAsset": "5"
            }
          },
          {
            "paraID": 2015,
            "symbol": "TEER",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2015},{\"generalKey\":\"0x54454552\"}]}}}",
            "asset": {
              "ForeignAsset": "8"
            }
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": {
              "ForeignAsset": "3"
            }
          },
          {
            "paraID": 2024,
            "symbol": "GENS",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2024}}}}",
            "asset": {
              "ForeignAsset": "14"
            }
          },
          {
            "paraID": 2024,
            "symbol": "EQD",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2024},{\"generalKey\":\"0x657164\"}]}}}",
            "asset": {
              "ForeignAsset": "15"
            }
          },
          {
            "paraID": 2084,
            "symbol": "KMA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2084}}}}",
            "asset": {
              "ForeignAsset": "10"
            }
          },
          {
            "paraID": 2085,
            "symbol": "HKO",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2085},{\"generalKey\":\"0x484b4f\"}]}}}",
            "asset": {
              "ForeignAsset": "4"
            }
          },
          {
            "paraID": 2088,
            "symbol": "AIR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2088},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": {
              "ForeignAsset": "12"
            }
          },
          {
            "paraID": 2090,
            "symbol": "BSX",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2090},{\"generalIndex\":0}]}}}",
            "asset": {
              "ForeignAsset": "11"
            }
          },
          {
            "paraID": 2095,
            "symbol": "QTZ",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2095}}}}",
            "asset": {
              "ForeignAsset": "2"
            }
          },
          {
            "paraID": 2096,
            "symbol": "NEER",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2096},{\"generalKey\":\"0x000000000000000000\"}]}}}",
            "asset": {
              "ForeignAsset": "9"
            }
          },
          {
            "paraID": 2102,
            "symbol": "PCHU",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2102},{\"generalKey\":\"0x50434855\"}]}}}",
            "asset": {
              "ForeignAsset": "17"
            }
          },
          {
            "paraID": 2105,
            "symbol": "CRAB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2105},{\"palletInstance\":5}]}}}",
            "asset": {
              "ForeignAsset": "13"
            }
          },
          {
            "paraID": 2106,
            "symbol": "LIT",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2106},{\"palletInstance\":10}]}}}",
            "asset": {
              "ForeignAsset": "20"
            }
          },
          {
            "paraID": 2107,
            "symbol": "KICO",
            "decimals": 14,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2107},{\"generalKey\":\"0x4b49434f\"}]}}}",
            "asset": {
              "ForeignAsset": "6"
            }
          },
          {
            "paraID": 2114,
            "symbol": "TUR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2114}}}}",
            "asset": {
              "ForeignAsset": "16"
            }
          },
          {
            "paraID": 2118,
            "symbol": "LT",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2118},{\"generalKey\":\"0x4c54\"}]}}}",
            "asset": {
              "ForeignAsset": "19"
            }
          }
        ]
      },
      "2001": {
        "tokens": [
          "BNC",
          "KUSD",
          "DOT",
          "KSM",
          "KAR",
          "ZLK",
          "PHA",
          "RMRK",
          "MOVR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bifrost",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": {
              "Token": "KSM"
            }
          },
          {
            "paraID": 1000,
            "symbol": "RMRK",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":8}]}}}",
            "asset": {
              "Token": "RMRK"
            }
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "Token2": "0"
            }
          },
          {
            "paraID": 2000,
            "symbol": "KUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": {
              "Stable": "KUSD"
            }
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": {
              "Token": "KAR"
            }
          },
          {
            "paraID": 2001,
            "symbol": "vBNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0101\"}]}}}",
            "asset": {
              "VToken": "BNC"
            }
          },
          {
            "paraID": 2001,
            "symbol": "vMOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x010a\"}]}}}",
            "asset": {
              "VToken": "MOVR"
            }
          },
          {
            "paraID": 2001,
            "symbol": "vKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0104\"}]}}}",
            "asset": {
              "VToken": "KSM"
            }
          },
          {
            "paraID": 2001,
            "symbol": "ZLK",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0207\"}]}}}",
            "asset": {
              "Token": "ZLK"
            }
          },
          {
            "paraID": 2001,
            "symbol": "VSvsKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0404\"}]}}}",
            "asset": {
              "VSToken": "KSM"
            }
          },
          {
            "paraID": 2001,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": {
              "Native": "BNC"
            }
          },
          {
            "paraID": 2004,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2004}}}}",
            "asset": {
              "Token": "PHA"
            }
          },
          {
            "paraID": 2007,
            "symbol": "SDN",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2007}}}}",
            "asset": {
              "Token2": "3"
            }
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": {
              "Token": "MOVR"
            }
          },
          {
            "paraID": 2092,
            "symbol": "KBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000b\"}]}}}",
            "asset": {
              "Token2": "2"
            }
          },
          {
            "paraID": 2092,
            "symbol": "KINT",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000c\"}]}}}",
            "asset": {
              "Token2": "1"
            }
          },
          {
            "paraID": 2110,
            "symbol": "MGX",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2110},{\"generalKey\":\"0x00000000\"}]}}}",
            "asset": {
              "Token2": "4"
            }
          }
        ]
      },
      "2004": {
        "tokens": [
          "PHA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "khala",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "0"
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": "1"
          },
          {
            "paraID": 2000,
            "symbol": "aUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": "4"
          },
          {
            "paraID": 2001,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "2"
          },
          {
            "paraID": 2001,
            "symbol": "ZLK",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0207\"}]}}}",
            "asset": "3"
          },
          {
            "paraID": 2007,
            "symbol": "SDN",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2007}}}}",
            "asset": "12"
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": "6"
          },
          {
            "paraID": 2084,
            "symbol": "KMA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2084}}}}",
            "asset": "8"
          },
          {
            "paraID": 2085,
            "symbol": "HKO",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2085},{\"generalKey\":\"0x484b4f\"}]}}}",
            "asset": "7"
          },
          {
            "paraID": 2087,
            "symbol": "PICA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2087}}}}",
            "asset": "15"
          },
          {
            "paraID": 2090,
            "symbol": "BSX",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2090},{\"generalKey\":\"0x00000000\"}]}}}",
            "asset": "5"
          },
          {
            "paraID": 2090,
            "symbol": "BSX",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2090},{\"generalIndex\":0}]}}}",
            "asset": "9"
          },
          {
            "paraID": 2096,
            "symbol": "NEER",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2096},{\"generalKey\":\"0x000000000000000000\"}]}}}",
            "asset": "13"
          },
          {
            "paraID": 2096,
            "symbol": "BIT",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2096},{\"generalKey\":\"0x020000000000000000\"}]}}}",
            "asset": "14"
          },
          {
            "paraID": 2105,
            "symbol": "CRAB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2105},{\"palletInstance\":5}]}}}",
            "asset": "11"
          },
          {
            "paraID": 2114,
            "symbol": "TUR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2114}}}}",
            "asset": "10"
          }
        ]
      },
      "2007": {
        "tokens": [
          "SDN"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "shiden",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "340282366920938463463374607431768211455"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "4294969280"
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": "18446744073709551618"
          },
          {
            "paraID": 2000,
            "symbol": "LKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0083\"}]}}}",
            "asset": "18446744073709551619"
          },
          {
            "paraID": 2000,
            "symbol": "aSEED",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": "18446744073709551616"
          },
          {
            "paraID": 2001,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "18446744073709551627"
          },
          {
            "paraID": 2001,
            "symbol": "vsKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0404\"}]}}}",
            "asset": "18446744073709551629"
          },
          {
            "paraID": 2001,
            "symbol": "vKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0104\"}]}}}",
            "asset": "18446744073709551628"
          },
          {
            "paraID": 2004,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2004}}}}",
            "asset": "18446744073709551623"
          },
          {
            "paraID": 2012,
            "symbol": "CSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2012}}}}",
            "asset": "18446744073709551624"
          },
          {
            "paraID": 2016,
            "symbol": "SKU",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2016}}}}",
            "asset": "18446744073709551626"
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": "18446744073709551620"
          },
          {
            "paraID": 2024,
            "symbol": "GENS",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2024}}}}",
            "asset": "18446744073709551630"
          },
          {
            "paraID": 2024,
            "symbol": "EQD",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2024},{\"generalKey\":\"0x657164\"}]}}}",
            "asset": "18446744073709551631"
          },
          {
            "paraID": 2092,
            "symbol": "KBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000b\"}]}}}",
            "asset": "18446744073709551621"
          },
          {
            "paraID": 2092,
            "symbol": "KINT",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000c\"}]}}}",
            "asset": "18446744073709551622"
          },
          {
            "paraID": 2095,
            "symbol": "QTZ",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2095}}}}",
            "asset": "18446744073709551633"
          },
          {
            "paraID": 2096,
            "symbol": "NEER",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2096},{\"generalKey\":\"0x000000000000000000\"}]}}}",
            "asset": "18446744073709551632"
          },
          {
            "paraID": 2105,
            "symbol": "CRAB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2105},{\"palletInstance\":5}]}}}",
            "asset": "18446744073709551625"
          }
        ]
      },
      "2011": {
        "tokens": [],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "sora_ksm"
      },
      "2012": {
        "tokens": [
          "CSM"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "crust-collator",
        "xcAssetsData": [
          {
            "paraID": 2000,
            "symbol": "AUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": "214920334981412447805621250067209749032"
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": "10810581592933651521121702237638664357"
          },
          {
            "paraID": 2001,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "319623561105283008236062145480775032445"
          },
          {
            "paraID": 2007,
            "symbol": "SDN",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2007}}}}",
            "asset": "16797826370226091782818345603793389938"
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": "232263652204149413431520870009560565298"
          },
          {
            "paraID": 2048,
            "symbol": "XRT",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2048}}}}",
            "asset": "108036400430056508975016746969135344601"
          },
          {
            "paraID": 2105,
            "symbol": "CRAB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2105},{\"palletInstance\":5}]}}}",
            "asset": "173481220575862801646329923366065693029"
          }
        ]
      },
      "2015": {
        "tokens": [
          "TEER"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "integritee-parachain"
      },
      "2023": {
        "tokens": [
          "MOVR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "moonriver",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "42259045809535163221576417993425387648"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "311091173110107856861649819128533077277"
          },
          {
            "paraID": 1000,
            "symbol": "RMRK",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":8}]}}}",
            "asset": "182365888117048807484804376330534607370"
          },
          {
            "paraID": 2000,
            "symbol": "aSeed",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": "214920334981412447805621250067209749032"
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": "10810581592933651521121702237638664357"
          },
          {
            "paraID": 2001,
            "symbol": "vKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0104\"}]}}}",
            "asset": "264344629840762281112027368930249420542"
          },
          {
            "paraID": 2001,
            "symbol": "vBNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0101\"}]}}}",
            "asset": "72145018963825376852137222787619937732"
          },
          {
            "paraID": 2001,
            "symbol": "vMOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x010a\"}]}}}",
            "asset": "203223821023327994093278529517083736593"
          },
          {
            "paraID": 2001,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "319623561105283008236062145480775032445"
          },
          {
            "paraID": 2004,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2004}}}}",
            "asset": "189307976387032586987344677431204943363"
          },
          {
            "paraID": 2007,
            "symbol": "SDN",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2007}}}}",
            "asset": "16797826370226091782818345603793389938"
          },
          {
            "paraID": 2012,
            "symbol": "CSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2012}}}}",
            "asset": "108457044225666871745333730479173774551"
          },
          {
            "paraID": 2015,
            "symbol": "TEER",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2015},{\"generalKey\":\"0x54454552\"}]}}}",
            "asset": "105075627293246237499203909093923548958"
          },
          {
            "paraID": 2048,
            "symbol": "XRT",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2048}}}}",
            "asset": "108036400430056508975016746969135344601"
          },
          {
            "paraID": 2084,
            "symbol": "KMA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2084}}}}",
            "asset": "213357169630950964874127107356898319277"
          },
          {
            "paraID": 2085,
            "symbol": "HKO",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2085},{\"generalKey\":\"0x484b4f\"}]}}}",
            "asset": "76100021443485661246318545281171740067"
          },
          {
            "paraID": 2087,
            "symbol": "PICA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2087}}}}",
            "asset": "167283995827706324502761431814209211090"
          },
          {
            "paraID": 2092,
            "symbol": "KBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000b\"}]}}}",
            "asset": "328179947973504579459046439826496046832"
          },
          {
            "paraID": 2092,
            "symbol": "KINT",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000c\"}]}}}",
            "asset": "175400718394635817552109270754364440562"
          },
          {
            "paraID": 2105,
            "symbol": "CRAB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2105},{\"palletInstance\":5}]}}}",
            "asset": "173481220575862801646329923366065693029"
          },
          {
            "paraID": 2106,
            "symbol": "LIT",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2106},{\"palletInstance\":10}]}}}",
            "asset": "65216491554813189869575508812319036608"
          },
          {
            "paraID": 2110,
            "symbol": "MGX",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2110},{\"generalKey\":\"0x00000000\"}]}}}",
            "asset": "118095707745084482624853002839493125353"
          },
          {
            "paraID": 2114,
            "symbol": "TUR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2114}}}}",
            "asset": "133300872918374599700079037156071917454"
          }
        ]
      },
      "2024": {
        "tokens": [
          "Unknown",
          "EQD",
          "GENS",
          "ETH",
          "BTC",
          "KSM",
          "CRV"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "Gens-parachain"
      },
      "2048": {
        "tokens": [
          "XRT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "robonomics"
      },
      "2084": {
        "tokens": [
          "KMA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "calamari",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "12"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "14"
          },
          {
            "paraID": 2000,
            "symbol": "BNB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02e278651e8ff8e2efa83d7f84205084ebc90688be\"}]}}}",
            "asset": "21"
          },
          {
            "paraID": 2000,
            "symbol": "WBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0266291c7d88d2ed9a708147bae4e0814a76705e2f\"}]}}}",
            "asset": "26"
          },
          {
            "paraID": 2000,
            "symbol": "USDC",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x021f3a10587a20114ea25ba1b388ee2dd4a337ce27\"}]}}}",
            "asset": "16"
          },
          {
            "paraID": 2000,
            "symbol": "BUSD",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02577f6a0718a468e8a995f6075f2325f86a07c83b\"}]}}}",
            "asset": "23"
          },
          {
            "paraID": 2000,
            "symbol": "AUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": "9"
          },
          {
            "paraID": 2000,
            "symbol": "LDO",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02b4ce1f6109854243d1af13b8ea34ed28542f31e0\"}]}}}",
            "asset": "18"
          },
          {
            "paraID": 2000,
            "symbol": "MATIC",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02a2a37aaf4730aeedada5aa8ee20a4451cb8b1c4e\"}]}}}",
            "asset": "20"
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": "8"
          },
          {
            "paraID": 2000,
            "symbol": "LKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0083\"}]}}}",
            "asset": "10"
          },
          {
            "paraID": 2000,
            "symbol": "ARB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02c621abc3afa3f24886ea278fffa7e10e8969d755\"}]}}}",
            "asset": "17"
          },
          {
            "paraID": 2000,
            "symbol": "APE",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0230b1f4ba0b07789be9986fa090a57e0fe5631ebb\"}]}}}",
            "asset": "25"
          },
          {
            "paraID": 2000,
            "symbol": "UNI",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0277cf14f938cb97308d752647d554439d99b39a3f\"}]}}}",
            "asset": "22"
          },
          {
            "paraID": 2000,
            "symbol": "LINK",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x022c7de70b32cf5f20e02329a88d2e3b00ef85eb90\"}]}}}",
            "asset": "24"
          },
          {
            "paraID": 2000,
            "symbol": "SHIB",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x029759ca009cbcd75a84786ac19bb5d02f8e68bcd9\"}]}}}",
            "asset": "19"
          },
          {
            "paraID": 2000,
            "symbol": "WETH",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02ece0cc38021e734bef1d5da071b027ac2f71181f\"}]}}}",
            "asset": "27"
          },
          {
            "paraID": 2000,
            "symbol": "DAI",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x024bb6afb5fa2b07a5d1c499e1c3ddb5a15e709a71\"}]}}}",
            "asset": "15"
          },
          {
            "paraID": 2004,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2004}}}}",
            "asset": "13"
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": "11"
          }
        ]
      },
      "2085": {
        "tokens": [
          "HKO"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "heiko",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "100"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "102"
          },
          {
            "paraID": 2000,
            "symbol": "LKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0083\"}]}}}",
            "asset": "109"
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": "107"
          },
          {
            "paraID": 2004,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2004}}}}",
            "asset": "115"
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": "113"
          },
          {
            "paraID": 2085,
            "symbol": "sKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2085},{\"palletInstance\":6},{\"generalIndex\":1000}]}}}",
            "asset": "1000"
          },
          {
            "paraID": 2092,
            "symbol": "KBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000b\"}]}}}",
            "asset": "121"
          },
          {
            "paraID": 2092,
            "symbol": "KINT",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2092},{\"generalKey\":\"0x000c\"}]}}}",
            "asset": "119"
          }
        ]
      },
      "2087": {
        "tokens": [
          "PICA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "picasso"
      },
      "2088": {
        "tokens": [
          "AIR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "altair",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": {
              "ForeignAsset": "3"
            }
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "ForeignAsset": "1"
            }
          },
          {
            "paraID": 2000,
            "symbol": "aUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": {
              "ForeignAsset": "2"
            }
          },
          {
            "paraID": 2088,
            "symbol": "AIR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2088},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "Native"
          }
        ]
      },
      "2090": {
        "tokens": [
          "BSX"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "basilisk",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "1"
          },
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "14"
          },
          {
            "paraID": 2000,
            "symbol": "DAI",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x024bb6afb5fa2b07a5d1c499e1c3ddb5a15e709a71\"}]}}}",
            "asset": "13"
          },
          {
            "paraID": 2000,
            "symbol": "USDCet",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x021f3a10587a20114ea25ba1b388ee2dd4a337ce27\"}]}}}",
            "asset": "9"
          },
          {
            "paraID": 2000,
            "symbol": "aUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": "2"
          },
          {
            "paraID": 2000,
            "symbol": "wETH",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x02ece0cc38021e734bef1d5da071b027ac2f71181f\"}]}}}",
            "asset": "10"
          },
          {
            "paraID": 2000,
            "symbol": "wBTC",
            "decimals": 8,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0266291c7d88d2ed9a708147bae4e0814a76705e2f\"}]}}}",
            "asset": "11"
          },
          {
            "paraID": 2000,
            "symbol": "wUSDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0254e183e533fd3c6e72debb2d1cab451d017faf72\"}]}}}",
            "asset": "12"
          },
          {
            "paraID": 2048,
            "symbol": "XRT",
            "decimals": 9,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2048}}}}",
            "asset": "16"
          },
          {
            "paraID": 2125,
            "symbol": "TNKR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2125},{\"generalIndex\":0}]}}}",
            "asset": "6"
          }
        ]
      },
      "2092": {
        "tokens": [
          "KINT",
          "KBTC",
          "KSM",
          "INTR",
          "IBTC",
          "DOT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "kintsugi-parachain",
        "xcAssetsData": [
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": {
              "ForeignAsset": "3"
            }
          },
          {
            "paraID": 2000,
            "symbol": "AUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": {
              "ForeignAsset": "1"
            }
          },
          {
            "paraID": 2000,
            "symbol": "LKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0083\"}]}}}",
            "asset": {
              "ForeignAsset": "2"
            }
          },
          {
            "paraID": 2001,
            "symbol": "VKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0104\"}]}}}",
            "asset": {
              "ForeignAsset": "5"
            }
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": {
              "ForeignAsset": "4"
            }
          },
          {
            "paraID": 2085,
            "symbol": "SKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":2085},{\"palletInstance\":6},{\"generalIndex\":1000}]}}}",
            "asset": {
              "ForeignAsset": "6"
            }
          }
        ]
      },
      "2095": {
        "tokens": [
          "QTZ"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "quartz"
      },
      "2105": {
        "tokens": [
          "CRAB"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "Crab2"
      },
      "2106": {
        "tokens": [
          "LIT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "litmus-parachain"
      },
      "2110": {
        "tokens": [
          "MGX"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "mangata-parachain",
        "xcAssetsData": [
          {
            "paraID": 1000,
            "symbol": "USDT",
            "decimals": 6,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":1984}]}}}",
            "asset": "30"
          },
          {
            "paraID": 1000,
            "symbol": "RMRK",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x3\":[{\"parachain\":1000},{\"palletInstance\":50},{\"generalIndex\":8}]}}}",
            "asset": "31"
          },
          {
            "paraID": 2001,
            "symbol": "BNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0001\"}]}}}",
            "asset": "14"
          },
          {
            "paraID": 2001,
            "symbol": "vBNC",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0101\"}]}}}",
            "asset": "23"
          },
          {
            "paraID": 2001,
            "symbol": "vKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0104\"}]}}}",
            "asset": "15"
          },
          {
            "paraID": 2001,
            "symbol": "ZLK",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0207\"}]}}}",
            "asset": "26"
          },
          {
            "paraID": 2001,
            "symbol": "vsKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2001},{\"generalKey\":\"0x0404\"}]}}}",
            "asset": "16"
          },
          {
            "paraID": 2114,
            "symbol": "TUR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2114}}}}",
            "asset": "7"
          },
          {
            "paraID": 2121,
            "symbol": "IMBU",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2121},{\"generalKey\":\"0x0096\"}]}}}",
            "asset": "11"
          }
        ]
      },
      "2113": {
        "tokens": [
          "KAB"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "kabocha-parachain"
      },
      "2114": {
        "tokens": [
          "TUR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "turing",
        "xcAssetsData": [
          {
            "paraID": 0,
            "symbol": "KSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"here\":null}}}",
            "asset": "1"
          },
          {
            "paraID": 2000,
            "symbol": "AUSD",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0081\"}]}}}",
            "asset": "2"
          },
          {
            "paraID": 2000,
            "symbol": "KAR",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0080\"}]}}}",
            "asset": "3"
          },
          {
            "paraID": 2000,
            "symbol": "LKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2000},{\"generalKey\":\"0x0083\"}]}}}",
            "asset": "4"
          },
          {
            "paraID": 2004,
            "symbol": "PHA",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2004}}}}",
            "asset": "7"
          },
          {
            "paraID": 2007,
            "symbol": "SDN",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2007}}}}",
            "asset": "8"
          },
          {
            "paraID": 2023,
            "symbol": "MOVR",
            "decimals": 18,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2023},{\"palletInstance\":10}]}}}",
            "asset": "9"
          },
          {
            "paraID": 2085,
            "symbol": "HKO",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2085},{\"generalKey\":\"0x484b4f\"}]}}}",
            "asset": "5"
          },
          {
            "symbol": "TUR",
            "decimals": 10,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x1\":{\"parachain\":2114}}}}",
            "asset": "0"
          },
          {
            "paraID": 2085,
            "symbol": "SKSM",
            "decimals": 12,
            "xcmV1MultiLocation": "{\"v1\":{\"parents\":1,\"interior\":{\"x2\":[{\"parachain\":2085},{\"generalKey\":\"0x734b534d\"}]}}}",
            "asset": "6"
          }
        ]
      },
      "2119": {
        "tokens": [
          "BAJU"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bajun"
      },
      "2124": {
        "tokens": [
          "AMPE"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "amplitude"
      },
      "2222": {
        "tokens": [
          "MITO"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "ipci"
      },
      "2236": {
        "tokens": [
          "ZERO",
          "PLAY",
          "GAME",
          "DOT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "subzero"
      },
      "2241": {
        "tokens": [
          "KREST"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "peaq-node-krest"
      }
    },
    "westend": {
      "0": {
        "tokens": [
          "WND"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "westend"
      },
      "1000": {
        "tokens": [
          "WND"
        ],
        "assetsInfo": {
          "0": "OSNT",
          "1": "CHV TKN",
          "2": "BIB",
          "3": "(null)",
          "4": "0xe282b5414c",
          "5": "MLK",
          "6": "BILL",
          "7": "XAU",
          "8": "JOE",
          "9": "xxx",
          "10": "CAT",
          "11": "SWD",
          "13": "RMRK",
          "14": "NGNC",
          "15": "JJS",
          "16": "TEST",
          "17": "LOL",
          "19": "TMJ",
          "20": "WETH",
          "21": "BETH",
          "22": "KO",
          "23": "UDT",
          "24": "AAA",
          "25": "BTC",
          "26": "Tsst",
          "27": "AMIR",
          "28": "NSS",
          "30": "TRTI",
          "31": "GTT",
          "32": "TRTO",
          "42": "HG2G",
          "46": "RASTA",
          "47": "MRT",
          "49": "RAN",
          "51": "kule",
          "52": "kule1",
          "55": "PER",
          "60": "AAA",
          "66": "USDT",
          "67": "USDT",
          "68": "TTT",
          "69": "TIDE",
          "77": "MVP1",
          "81": "SIRI",
          "84": "ASTRA",
          "85": "ITC",
          "88": "AEC",
          "91": "stt",
          "95": "HACK",
          "99": "hcc",
          "100": "tlj",
          "101": "WIL",
          "102": "cPHP",
          "103": "cPHP",
          "104": "NewT",
          "109": "assetT",
          "121": "TAL",
          "122": "TESTC",
          "123": "INXTSW1",
          "126": "TAT",
          "145": "dsu",
          "146": "FRAC",
          "168": "NIK",
          "200": "CRT",
          "222": "BBB",
          "223": "BILL",
          "233": "NTT",
          "301": "RYUD",
          "318": "SAT",
          "368": "KLING",
          "369": "WIN",
          "370": "SUM",
          "381": "ALC",
          "404": "JET",
          "420": "SKER",
          "434": "cool",
          "482": "PVSE",
          "535": "KEL",
          "666": "FTT",
          "676": "nbnbnbn",
          "777": "JJD",
          "887": "TTA",
          "900": "VOD",
          "950": "HBCOIN",
          "987": "JVT",
          "988": "VTT",
          "999": "CCW",
          "1000": "EDU",
          "1001": "VOW",
          "1002": "VOW",
          "1003": "VOW",
          "1004": "VOW",
          "1005": "VOW",
          "1010": "POL",
          "1021": "NFT",
          "1022": "nfttst",
          "1023": "qqnihao",
          "1024": "qqnihao",
          "1111": "TESTY",
          "1113": "JTT",
          "1114": "USDC",
          "1122": "dmd",
          "1233": "QTY",
          "1234": "TEST",
          "1309": "KLO",
          "1312": "NG1312",
          "1337": "NACHO",
          "1977": "SQL",
          "1984": "USDTT",
          "1988": "HBB",
          "1994": "SOU",
          "1995": "LUSD",
          "2000": "USDT",
          "2022": "weUSDT",
          "2023": "DEC",
          "2048": "CUT",
          "2122": "SVE",
          "2131": "Wnd",
          "2511": "TTY",
          "3000": "DEV",
          "4000": "DES",
          "4123": "DWND2",
          "4200": "KLM",
          "6666": "BOB",
          "8888": "USDT",
          "8937": "test",
          "9898": "FTT",
          "9999": "WND",
          "10111": "ETH",
          "12344": "tst",
          "12345": "DRR2",
          "13122": "NKL",
          "13337": "DEV",
          "15240": "KOKOS",
          "22061": "RSD",
          "22062": "BAM",
          "22063": "PIVO",
          "22064": "DKT",
          "31337": "USDC",
          "54221": "wTEST",
          "61337": "USDC",
          "100112": "FLK",
          "100500": "KEKPEK",
          "123456": "BATTY",
          "313370": "WBTC",
          "313371": "WETH",
          "321123": "aWNDb",
          "420420": "KLM2",
          "793910": "CIDR",
          "862105": "USDTT",
          "862812": "CUBOT",
          "863012": "VCOPT",
          "1000000": "USDT_B",
          "19801204": "KHT",
          "21000000": "PKTB",
          "21000001": "PKCR",
          "40000001": "ETH",
          "123456789": "PUSH",
          "900990087": "SPOT",
          "1000000000": "CZX",
          "1233344433": "BQE",
          "2000000000": "weUSDT",
          "3999999999": "BETH",
          "4000000000": "dde"
        },
        "foreignAssetsInfo": {
          "0x7b22706172656e7473223a2232222c22696e746572696f72223a7b225831223a7b22476c6f62616c436f6e73656e737573223a22506f6c6b61646f74227d7d7d": {
            "symbol": "",
            "name": "",
            "multiLocation": "{\"parents\":\"2\",\"interior\":{\"X1\":{\"GlobalConsensus\":\"Polkadot\"}}}"
          },
          "ROC": {
            "symbol": "ROC",
            "name": "Rococo",
            "multiLocation": "{\"parents\":\"2\",\"interior\":{\"X1\":{\"GlobalConsensus\":\"Rococo\"}}}"
          }
        },
        "poolPairsInfo": {
          "0": {
            "lpToken": "0",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1977\"}]}}]]"
          },
          "1": {
            "lpToken": "1",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"8\"}]}}]]"
          },
          "2": {
            "lpToken": "2",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1114\"}]}}]]"
          },
          "3": {
            "lpToken": "3",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"19801204\"}]}}]]"
          },
          "4": {
            "lpToken": "4",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"2511\"}]}}]]"
          },
          "5": {
            "lpToken": "5",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"2\",\"interior\":{\"X1\":{\"GlobalConsensus\":\"Polkadot\"}}}]]"
          },
          "6": {
            "lpToken": "6",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"45\"}]}}]]"
          },
          "7": {
            "lpToken": "7",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"4200\"}]}}]]"
          },
          "8": {
            "lpToken": "8",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"32\"}]}}]]"
          },
          "9": {
            "lpToken": "9",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"30\"}]}}]]"
          },
          "10": {
            "lpToken": "10",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"46\"}]}}]]"
          },
          "11": {
            "lpToken": "11",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1\"}]}}]]"
          },
          "12": {
            "lpToken": "12",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"47\"}]}}]]"
          },
          "13": {
            "lpToken": "13",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1312\"}]}}]]"
          },
          "14": {
            "lpToken": "14",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1233\"}]}}]]"
          },
          "15": {
            "lpToken": "15",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"13122\"}]}}]]"
          },
          "16": {
            "lpToken": "16",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"48\"}]}}]]"
          },
          "17": {
            "lpToken": "17",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"49\"}]}}]]"
          },
          "18": {
            "lpToken": "18",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"10111\"}]}}]]"
          },
          "19": {
            "lpToken": "19",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"91\"}]}}]]"
          },
          "20": {
            "lpToken": "20",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"26\"}]}}]]"
          },
          "21": {
            "lpToken": "21",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"28\"}]}}]]"
          },
          "22": {
            "lpToken": "22",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"51\"}]}}]]"
          },
          "23": {
            "lpToken": "23",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1309\"}]}}]]"
          },
          "24": {
            "lpToken": "24",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"122\"}]}}]]"
          },
          "25": {
            "lpToken": "25",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"31\"}]}}]]"
          },
          "26": {
            "lpToken": "26",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"77\"}]}}]]"
          },
          "27": {
            "lpToken": "27",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"381\"}]}}]]"
          },
          "28": {
            "lpToken": "28",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"81\"}]}}]]"
          },
          "29": {
            "lpToken": "29",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"104\"}]}}]]"
          },
          "30": {
            "lpToken": "30",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"121\"}]}}]]"
          },
          "31": {
            "lpToken": "31",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1113\"}]}}]]"
          },
          "32": {
            "lpToken": "32",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"50\"}]}}]]"
          },
          "33": {
            "lpToken": "33",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"777\"}]}}]]"
          },
          "34": {
            "lpToken": "34",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"887\"}]}}]]"
          },
          "35": {
            "lpToken": "35",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"318\"}]}}]]"
          },
          "36": {
            "lpToken": "36",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"120\"}]}}]]"
          },
          "37": {
            "lpToken": "37",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"369\"}]}}]]"
          },
          "38": {
            "lpToken": "38",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"368\"}]}}]]"
          },
          "39": {
            "lpToken": "39",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"370\"}]}}]]"
          },
          "40": {
            "lpToken": "40",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"22061\"}]}}]]"
          },
          "41": {
            "lpToken": "41",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"22062\"}]}}]]"
          },
          "42": {
            "lpToken": "42",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"22064\"}]}}]]"
          }
        },
        "specName": "westmint"
      },
      "1001": {
        "tokens": [
          "WND"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "collectives"
      }
    },
    "rococo": {
      "0": {
        "tokens": [
          "ROC"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "rococo"
      },
      "1000": {
        "tokens": [
          "ROC"
        ],
        "assetsInfo": {
          "1": "QQ22",
          "2": "DDTA",
          "3": "NGNC",
          "4": "RMRK",
          "5": "TROC",
          "6": "XTS",
          "7": "CTS",
          "8": "TCS",
          "9": "CCoin",
          "10": "RTST",
          "11": "SVI",
          "12": "TST",
          "13": "dtc",
          "14": "TTT",
          "15": "RAT",
          "16": "LVTAST",
          "17": "MEW",
          "18": "HEHE",
          "19": "ITC",
          "20": "ICC",
          "21": "TT21",
          "22": "SAF",
          "23": "LART",
          "24": "SPT",
          "25": "TAT",
          "26": "TVP",
          "27": "MTA",
          "28": "ZMS",
          "29": "SAS",
          "30": "GLT",
          "31": "FOT",
          "32": "KVS",
          "33": "Utoken",
          "34": "NSV",
          "39": "KVSS",
          "40": "RND",
          "46": "RocRa",
          "48": "Bal",
          "49": "Shark",
          "50": "ZTK",
          "51": "RCM",
          "55": "PIZ",
          "56": "PSP",
          "66": "BBC",
          "69": "SRT",
          "74": "GID",
          "77": "shicoin",
          "88": "MEM",
          "96": "@@@",
          "99": "PBA",
          "100": "ACRST",
          "101": "TTO",
          "108": "GURU",
          "111": "PBAC",
          "112": "TTam",
          "114": "GOG",
          "121": "NsNsN",
          "122": "ttam",
          "123": "RBT",
          "124": "BEA",
          "125": "SDV",
          "134": "TNG",
          "139": "PHNX",
          "140": "USDT",
          "143": "XIN",
          "144": "TTT",
          "145": "UMG",
          "200": "nUSDT",
          "201": "VNST",
          "224": "creagen",
          "228": "bebra",
          "233": "NTT",
          "261": "DOS",
          "322": "SOLO",
          "333": "MEM",
          "377": "KAA",
          "399": "TTAM",
          "404": "PDRS",
          "412": "PML",
          "420": "SWED",
          "444": "SASS",
          "500": "TRN",
          "555": "bambam",
          "609": "HMT",
          "666": "HOGE",
          "689": "YPT",
          "777": "FUGA",
          "786": "AMT",
          "824": "gbk",
          "888": "FFF",
          "988": "BABY",
          "999": "YAKIO",
          "1000": "TWC",
          "1111": "RCL",
          "1112": "TTam",
          "1113": "KCT",
          "1212": "bob",
          "1231": "123",
          "1234": "PPV",
          "1235": "PAV",
          "1313": "TNA",
          "1335": "LOT",
          "1336": "INV",
          "1337": "rUSD",
          "1717": "qveex",
          "1807": "SVO",
          "1984": "USDt",
          "1985": "XCMSDK",
          "2000": "bcdt",
          "2206": "RSD",
          "2512": "ARR2",
          "2727": "PRES",
          "2984": "RUSD",
          "3008": "ARR",
          "4040": "ROSTIK",
          "4110": "DDA",
          "5000": "xdtb",
          "6900": "LSPA",
          "6969": "STNLY",
          "7777": "USDT",
          "9394": "SMEAD",
          "9991": "SPT",
          "11111": "RLC",
          "11123": "AAE",
          "12345": "USDT",
          "20001": "TSTT",
          "20301": "EVM",
          "22061": "PIVO",
          "22062": "DEM",
          "22063": "DKT",
          "22064": "XPPEN",
          "26845": "TTT",
          "41217": "KFTP",
          "42069": "PEB",
          "50001": "jelou",
          "66666": "KST",
          "69420": "PLONK",
          "77777": "SHREK",
          "80085": "NKT",
          "111111": "11111",
          "111112": "SQRLTKN",
          "123456": "LRSKA",
          "228228": "TEST",
          "228282": "WTN",
          "228322": "nzprt",
          "335277": "PSPV",
          "411299": "any",
          "412177": "LKT",
          "413801": "PPV",
          "456789": "LDO",
          "666666": "ISH",
          "862105": "USDTT",
          "862812": "CUBOT",
          "863012": "vCOPT",
          "1111111": "VVA",
          "1234567": "TAFK",
          "12345678": "giraffe",
          "22332244": "ZoV",
          "76657621": "gaa",
          "123456789": "ZeAs",
          "143228832": "tasset",
          "1234567890": "giraffe",
          "2430784328": "TMW"
        },
        "foreignAssetsInfo": {
          "HOP": {
            "symbol": "HOP",
            "name": "Trappist Hop",
            "multiLocation": "{\"parents\":\"1\",\"interior\":{\"X1\":{\"Parachain\":\"1836\"}}}"
          },
          "WND": {
            "symbol": "WND",
            "name": "Westend",
            "multiLocation": "{\"parents\":\"2\",\"interior\":{\"X1\":{\"GlobalConsensus\":\"Westend\"}}}"
          }
        },
        "poolPairsInfo": {
          "0": {
            "lpToken": "0",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"140\"}]}}]]"
          },
          "1": {
            "lpToken": "1",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"420\"}]}}]]"
          },
          "2": {
            "lpToken": "2",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"47\"}]}}]]"
          },
          "3": {
            "lpToken": "3",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"48\"}]}}]]"
          },
          "4": {
            "lpToken": "4",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"46\"}]}}]]"
          },
          "5": {
            "lpToken": "5",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"49\"}]}}]]"
          },
          "6": {
            "lpToken": "6",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"51\"}]}}]]"
          },
          "7": {
            "lpToken": "7",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"56\"}]}}]]"
          },
          "8": {
            "lpToken": "8",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"11111\"}]}}]]"
          },
          "9": {
            "lpToken": "9",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"101\"}]}}]]"
          },
          "10": {
            "lpToken": "10",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"1111\"}]}}]]"
          },
          "11": {
            "lpToken": "11",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"1\",\"interior\":{\"X1\":{\"Parachain\":\"1836\"}}}]]"
          },
          "12": {
            "lpToken": "12",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"22062\"}]}}]]"
          },
          "13": {
            "lpToken": "13",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"111111\"}]}}]]"
          },
          "14": {
            "lpToken": "14",
            "pairInfo": "[[{\"parents\":\"1\",\"interior\":\"Here\"},{\"parents\":\"0\",\"interior\":{\"X2\":[{\"PalletInstance\":\"50\"},{\"GeneralIndex\":\"22064\"}]}}]]"
          }
        },
        "specName": "statemine"
      },
      "1002": {
        "tokens": [
          "ROC"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "contracts-rococo"
      },
      "1003": {
        "tokens": [
          "ROC"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "encointer-parachain"
      },
      "1013": {
        "tokens": [
          "ROC"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bridge-hub-rococo"
      },
      "2004": {
        "tokens": [
          "PHA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "rhala"
      },
      "2011": {
        "tokens": [
          "RXOR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "sora_ksm"
      },
      "2030": {
        "tokens": [
          "BNC",
          "KUSD",
          "DOT",
          "KSM",
          "KAR",
          "ZLK",
          "PHA",
          "RMRK",
          "MOVR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bifrost_polkadot"
      },
      "2031": {
        "tokens": [
          "NCFG"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "centrifuge"
      },
      "2043": {
        "tokens": [
          "OTP"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "origintrail-parachain"
      },
      "2056": {
        "tokens": [
          "AVT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "avn-parachain"
      },
      "2058": {
        "tokens": [
          "WATRD"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "watr-devnet"
      },
      "2087": {
        "tokens": [
          "PICA"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "picasso"
      },
      "2090": {
        "tokens": [
          "BSX"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "basilisk"
      },
      "2093": {
        "tokens": [
          "MD5"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "hashed"
      },
      "2100": {
        "tokens": [
          "SOON"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "soonsocial-parachain"
      },
      "2101": {
        "tokens": [
          "ZBS"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "zeitgeist"
      },
      "2105": {
        "tokens": [
          "PRING"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "Pangolin2"
      },
      "2106": {
        "tokens": [
          "LIT"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "rococo-parachain"
      },
      "2114": {
        "tokens": [
          "TUR"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "turing"
      },
      "2119": {
        "tokens": [
          "BAJU"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "bajun"
      },
      "2124": {
        "tokens": [
          "AMPE"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "foucoco"
      },
      "3333": {
        "tokens": [
          "T0RN"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "t0rn"
      },
      "4044": {
        "tokens": [
          "XRQCY"
        ],
        "assetsInfo": {},
        "foreignAssetsInfo": {},
        "poolPairsInfo": {},
        "specName": "frequency-rococo"
      }
    }
  } as ChainInfoRegistry;
  