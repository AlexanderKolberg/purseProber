import { useOpenConnectModal } from "@0xsequence/kit";
import { useDisconnect, useAccount } from "wagmi";
import { useSignTypedData } from "wagmi";

import "./Home.css";

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

  const onSignTypedData = () => {
    signTypedData({
      // account: wallet.account as Account,
      // domain: signData.domain as any,
      // types: signData.types as any,
      // primaryType: signData.primaryType,
      // message: signData.value,
    });
  };

  return (
    <div>
      {isConnected ? <Connected /> : <Disconnected />}
      <button onClick={() => onSignTypedData()}>Sign message</button>
    </div>
  );
};

export default App;
