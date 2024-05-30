import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments } from "@ton/core";

export function useTonConnect(
  validUntil: number = Date.now() + 5 * 60 * 1000
): {
  sender: Sender;
  connected: boolean;
} | null {
  const [tonConnectUI] = useTonConnectUI();

  if (tonConnectUI)
    return {
      sender: {
        send: async (args: SenderArguments) => {
          tonConnectUI.sendTransaction({
            messages: [
              {
                address: args.to.toString(),
                amount: args.value.toString(),
                payload: args.body?.toBoc().toString("base64"),
              },
            ],
            validUntil,
          });
        },
      },
      connected: tonConnectUI.connected,
    };
  return null;
}
