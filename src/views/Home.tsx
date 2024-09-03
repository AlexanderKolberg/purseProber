import { useOpenConnectModal } from "@0xsequence/kit";
import { useDisconnect, useAccount } from "wagmi";
import { useSignTypedData } from "wagmi";

import "./Home.css";
import { SignTypedDataParameters } from "viem";

const App = () => {
  const { setOpenConnectModal } = useOpenConnectModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const onClickConnect = () => {
    setOpenConnectModal(true);
  };

  const onClickDisconnect = () => {
    disconnect();
  };

  const Connected = () => (
    <>
      <p>Connected with address: {address}</p>
      <div className="card">
        <button onClick={onClickDisconnect}>Disconnect</button>
      </div>
    </>
  );

  const Disconnected = () => (
    <>
      <p>Not connected</p>
      <div className="card">
        <button onClick={onClickConnect}>Connect</button>
      </div>
    </>
  );

  const { signTypedData } = useSignTypedData();

  const data = {
    account: "0xf30ff16be4e50870461537eb1476b3043815b869",
    domain: {
      name: "Seaport",
      version: "1.6",
      chainId: 80002,
      verifyingContract: "0x0000000000000068f116a894984e2db1123eb395",
    },
    types: {
      ConsiderationItem: [
        {
          name: "itemType",
          type: "uint8",
        },
        {
          name: "token",
          type: "address",
        },
        {
          name: "identifierOrCriteria",
          type: "uint256",
        },
        {
          name: "startAmount",
          type: "uint256",
        },
        {
          name: "endAmount",
          type: "uint256",
        },
        {
          name: "recipient",
          type: "address",
        },
      ],
      OfferItem: [
        {
          name: "itemType",
          type: "uint8",
        },
        {
          name: "token",
          type: "address",
        },
        {
          name: "identifierOrCriteria",
          type: "uint256",
        },
        {
          name: "startAmount",
          type: "uint256",
        },
        {
          name: "endAmount",
          type: "uint256",
        },
      ],
      OrderComponents: [
        {
          name: "offerer",
          type: "address",
        },
        {
          name: "zone",
          type: "address",
        },
        {
          name: "offer",
          type: "OfferItem[]",
        },
        {
          name: "consideration",
          type: "ConsiderationItem[]",
        },
        {
          name: "orderType",
          type: "uint8",
        },
        {
          name: "startTime",
          type: "uint256",
        },
        {
          name: "endTime",
          type: "uint256",
        },
        {
          name: "zoneHash",
          type: "bytes32",
        },
        {
          name: "salt",
          type: "uint256",
        },
        {
          name: "conduitKey",
          type: "bytes32",
        },
        {
          name: "counter",
          type: "uint256",
        },
      ],
    },
    primaryType: "OrderComponents",
    message: {
      conduitKey:
        "0xf3d63166f0ca56c3c1a3508fce03ff0cf3fb691e000000000000000000000000",
      consideration: [
        {
          endAmount: BigInt("990000"),
          identifierOrCriteria: BigInt("0"),
          itemType: 1,
          recipient: "0x38f0fa12ff9d87345186995d2bece9612309ba4a",
          startAmount: BigInt("990000"),
          token: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
        },
        {
          endAmount: BigInt("10000"),
          identifierOrCriteria: BigInt("0"),
          itemType: 1,
          recipient: "0xf30ff16be4e50870461537eb1476b3043815b869",
          startAmount: BigInt("10000"),
          token: "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
        },
      ],
      counter: BigInt("0"),
      endTime: BigInt(1745855184),
      offer: [
        {
          endAmount: BigInt("1"),
          identifierOrCriteria: BigInt("2"),
          itemType: 3,
          startAmount: BigInt("1"),
          token: "0xbb92fdb23b41c1f47f01691a0aa6e747fab36847",
        },
      ],
      offerer: "0x38f0fa12ff9d87345186995d2bece9612309ba4a",
      orderType: 1,
      salt: BigInt(
        "0x634abebe1d4da48b00000000000000004d7dbd90055135bd4e6b9f0e41ffe5b9",
      ),
      startTime: BigInt(1725362197),
      zone: "0x0000000000000000000000000000000000000000",
      zoneHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
  } as const satisfies SignTypedDataParameters;

  const onSuccess = (signature: string) => {
    console.log("Signature: ", signature);
  };

  const onError = (error: Error) => {
    console.log("Error: ", error);
  };

  const onSignTypedData = async () => {
    signTypedData(data, { onSuccess, onError });
  };

  return (
    <div>
      {isConnected ? <Connected /> : <Disconnected />}
      <button onClick={() => onSignTypedData()}>Sign message</button>
    </div>
  );
};

export default App;
