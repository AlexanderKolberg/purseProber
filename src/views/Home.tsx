import {useOpenConnectModal} from "@0xsequence/kit";
import {useAccount, useDisconnect, useSignTypedData} from "wagmi";
import {useState} from "react";

import "./Home.css";
import {SignTypedDataParameters} from "viem";

const Home = () => {
    const {setOpenConnectModal} = useOpenConnectModal();
    const {isConnected, address} = useAccount();
    const {disconnect} = useDisconnect();
    const [signature, setSignature] = useState("");
    const [reservoirBody, setReservoirBody] = useState("");

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

    const {signTypedData} = useSignTypedData();


    const onSuccess = (signature: string) => {
        setSignature(signature)
    };

    const onError = (error: Error) => {
        console.log("Error: ", error);
    };

    const onSignTypedData = async () => {
        const url = "https://dev-marketplace-api.sequence.app/amoy/rpc/Marketplace/GenerateListingTransaction"

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Access-Key": "AQAAAAAAAAHz7AVY4j_zT_2RNiFws80Kt00"
            },
            body: JSON.stringify({
                "collectionAddress": "0xbb92fdb23b41c1f47f01691a0aa6e747fab36847", // potato collection
                "owner": "0x38F0FA12Ff9d87345186995D2Bece9612309BA4a",
                "contractType": "ERC1155",
                "marketplace": "opensea", // reservoir
                "listing": {
                    "tokenId": "2",
                    "quantity": "1",
                    "expiry": "1727970574",
                    "currencyAddress": "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
                    "pricePerToken": "1000000000000000000"
                }
            })
        })

        const respBody = await response.json();

        const signatureData = respBody["steps"][0]["signature"]
        const signData = {
            account: "0x38F0FA12Ff9d87345186995D2Bece9612309BA4a",
            domain: signatureData.domain,
            types: signatureData.types,
            primaryType: signatureData.primaryType,
            message: signatureData.value,
        } as const satisfies SignTypedDataParameters

        signTypedData(signData, {onSuccess, onError});

        const post = respBody["steps"][0]["post"]

        setReservoirBody(post["body"])
    };

    const CreateListing = async () => {
        const url = "https://dev-marketplace-api.sequence.app/amoy/rpc/Marketplace/Execute"

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Access-Key": "AQAAAAAAAAHz7AVY4j_zT_2RNiFws80Kt00"
            },
            body: JSON.stringify({
                "signature": signature,
                "endpoint": "/order/v3",
                "method": "POST",
                "body": reservoirBody,
            })
        })

        const respBody = await response.json();

        console.log("reservoirBody", respBody)

        return (
            <>
                <p>Signature set {signature}</p>
            </>
        );
    }

    return (
        <div>
            {isConnected ? <Connected/> : <Disconnected/>}
            <button onClick={() => onSignTypedData()}>Sign message</button>

            {signature && reservoirBody ? <button onClick={() => CreateListing()}>Create Listing</button> : <></> }
        </div>
    );
};

export default Home;
