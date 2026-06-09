import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";

export type UserInfo = {
  publicKey: string;
  connectedAt: string;
};

export function useUser() {
  const { publicKey, connected } = useWallet();
  const [claims, setClaims] = useState<UserInfo | null>(null);
  const [authState, setAuthState] = useState<"disconnected" | "connected">("disconnected");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (connected && publicKey) {
      const userInfo: UserInfo = {
        publicKey: (publicKey as PublicKey).toBase58(),
        connectedAt: new Date().toISOString(),
      };
      if (mounted) {
        setClaims(userInfo);
        setAuthState("connected");
      }
    } else {
      if (mounted) {
        setClaims(null);
        setAuthState("disconnected");
      }
    }

    if (mounted) {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [connected, publicKey]);

  return {
    publicKey,
    connected,
    claims,
    authState,
    loading,
  };
}


