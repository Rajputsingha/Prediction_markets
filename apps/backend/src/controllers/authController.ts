import type { Request, Response } from 'express'
import { signinToken } from "../middleware/middleware";
import { verifySolanaSignature } from "../services/walletService";
  const nonceStore = new Map<string, string>()
export function getNonce(req: Request, res: Response) {
  const wallet = req.query.wallet as string
  if (!wallet) return res.status(400).json({ error: 'wallet required' })

  const   nonce=`Prediction Market logic: ${crypto.randomUUID()}`;
    nonceStore.set(wallet,nonce);
    setTimeout(() => nonceStore.delete(wallet), 5 * 60 * 1000)

  return res.json({ nonce })
  
}

export function verifyWallet(req:Request,res:Response){
   const { wallet_address, signature, nonce } = req.body
    const stored = nonceStore.get(wallet_address)
  if (!stored || stored !== nonce) {
    return res.status(401).json({ error: 'Invalid or expired nonce' })
  }
    
   const valid = verifySolanaSignature(nonce, signature, wallet_address)
  if (!valid) return res.status(401).json({ error: 'Bad signature' });

  nonceStore.delete(wallet_address)
   
   const token = signinToken(wallet_address)
  return res.json({ token, wallet: wallet_address })

}