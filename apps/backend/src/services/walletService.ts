 import nacl from "tweetnacl";
 import bs58  from "bs58";
 import { PublicKey } from "@solana/web3.js";
export  function  verifySolanaSignature(
     message:string,
     signature:string,
     walletAddress:String
) : boolean {
    try {
    const messageBytes = new TextEncoder().encode(message)
    const sigBytes = bs58.decode(signature)
    const pubkeyBytes = new PublicKey(walletAddress).toBytes()
    return nacl.sign.detached.verify(messageBytes, sigBytes, pubkeyBytes)
  } catch {
    return false
  }
 }
 