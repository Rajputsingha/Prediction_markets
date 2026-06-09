import { ConnectionProvider,WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider,WalletDisconnectButton, useWalletModal } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css"
import { useUser } from "./hooks/useUser";

export function App(){
    const endpoint="https://api.mainnet-beta.solana.com";
    return (
        <ConnectionProvider  endpoint={endpoint}>
            <WalletProvider wallets={[]}autoConnect>
                <WalletModalProvider>
                  <Tollbar/>
                </WalletModalProvider>
            </WalletProvider>

        </ConnectionProvider>
    )
}

function Tollbar(){
    const { publicKey, claims, authState, loading } = useUser();
    const { setVisible } = useWalletModal();

    return (
      <div style={{display:"flex", alignItems: "center", gap: 12, justifyContent:"flex-end"}}>
        {!publicKey && (
          <button
            onClick={() => setVisible(true)}
            aria-label="Sign up and connect wallet"
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              cursor: 'pointer',
              background: '#2563EB',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              boxShadow: '0 6px 18px rgba(37,99,235,0.18)',
            }}
          >
            Sign up 
          </button>
        )}
        {publicKey && <WalletDisconnectButton/>}
        {loading ? <span style={{marginLeft:8}}>Loading…</span> : null}
        {!loading && authState === "connected" && claims ? (
          <span style={{fontSize:12, color:'#444'}}> {claims.publicKey.slice(0,6)}…{claims.publicKey.slice(-4)} </span>
        ) : null}
      </div>
    )
  }
export default App;