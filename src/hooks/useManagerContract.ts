import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, Cell, OpenedContract, address, toNano } from "@ton/ton";
import { useTonAddress } from "@tonconnect/ui-react";
import { useTonConnect } from "./useTonConnect";
import { Manager } from "../contracts/Manager";

export function useManagerContract(): {
  address: string | null;
  tokenLauncher: (metadata: Cell, maxSupply: bigint) => Promise<void>;
} | null {
  const client = useTonClient();
  const tn = useTonConnect();
  const addr = useTonAddress();
  const managerContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new Manager(
      address("EQA8stwYdp-NUnGskLiylE-h2TEUCq-Qk3JSe5g9XGJnUPZ_")
    );
    return client.open(contract) as OpenedContract<Manager>;
  }, [client]);
  if (tn) {
    const launchToken = async function (metadata: Cell, maxSupply: bigint) {
      if (!managerContract) return;
      const resp = await managerContract.send(
        tn.sender,
        {
          value: toNano(0.8),
        },
        {
          $$type: "NewToken",
          queryId: 0n,
          content: metadata,
          max_supply: maxSupply,
          tokenLauncher: Address.parse(addr),
        }
      );
      console.log("Response for new token launch is: ", resp);
    };

    return {
      address: managerContract?.address.toString() ?? null,
      tokenLauncher: launchToken,
    };
  }
  return null;
}
