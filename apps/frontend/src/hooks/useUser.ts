import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
//import type { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

export type UserInfo = {
  publicKey: string;
  connectedAt: string;
};

export function useUser() {
  const { publicKey, connected, signMessage } = useWallet();
  const [claims, setClaims] = useState<UserInfo | null>(null);
   const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [authState, setAuthState] = useState<"disconnected" | "connected">("disconnected");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  if(connected && publicKey && signMessage){
    if(token){
      // already have a token - schedule state updates to avoid synchronous setState in effect
      setTimeout(() => {
        setClaims({ publicKey: publicKey?.toBase58() ?? "", connectedAt: new Date().toISOString() });
        setAuthState("connected");
        setLoading(false);
      }, 0);
      return;
    }
    async function authenticate(){
      setLoading(true);
      try{
        // get nonce
        const nonceRes=await fetch(
           `http://localhost:8080/api/nonce?wallet=${publicKey!.toBase58()}`
        )
         const { nonce } = await nonceRes.json()
         // 2. sign with Phantom
        const messageBytes = new TextEncoder().encode(nonce)
        const signature = await signMessage!(messageBytes);
        // verify Jwt
        const verifyRes=await fetch("http://localhost:8080/api/verify", {
          method:"POST",
          headers:{"Content-Type": "application/json"},
           body: JSON.stringify({
             wallet_address: publicKey!.toBase58(),
            signature: bs58.encode(signature),
            nonce,

           })
        })
         const data = await verifyRes.json()
          localStorage.setItem("token", data.token);
          setToken(data.token)
        setClaims({ publicKey: publicKey!.toBase58(), connectedAt: new Date().toISOString() })
        setAuthState("connected")
      }catch (err) {
        console.error("Auth failed", err)
      } finally {
        setLoading(false)
      }
    
    }
  
     authenticate();
  }
}, [connected, publicKey]);
 useEffect(() => {
    if (!connected) {
      localStorage.removeItem("token")
      setTimeout(() => {
        setToken(null)
        setClaims(null)
        setAuthState("disconnected")
      }, 0);
    }
  }, [connected])

return { publicKey, connected, claims, authState, loading, token }
}



