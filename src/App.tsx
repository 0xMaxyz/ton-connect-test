import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { buildOnchainMetadata } from "./utils/jetton-helpers";
import { toNano } from "@ton/core";
import { useManagerContract } from "./hooks/useManagerContract";

function App() {
  const mngr = useManagerContract();
  const onclickHandler = async function () {
    const tokenParams = {
      name: "bitcoin",
      description: "1",
      symbol: "BTC",
      image:
        "https://i.pinimg.com/736x/6a/de/d6/6aded693f2f4fe3e41834d5ca9877a8b.jpg",
    };

    const content = buildOnchainMetadata(tokenParams);
    const max_supply = toNano(2e7);

    try {
      await mngr?.tokenLauncher(content, max_supply);
    } catch (error) {
      console.error("Failed to deploy token:", error);
    }
  };
  return (
    <>
      <div>
        <TonConnectButton />
      </div>
      <div onClick={onclickHandler}>
        <button>Send tx</button>
      </div>
    </>
  );
}

export default App;
