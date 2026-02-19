import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { loadWallet } from './utils.js';

async function main() {
  const connection = new Connection('https://devnet.helius-rpc.com/?api-key=93ac7725-6222-4e1b-8ef6-b5e6b29a2385', 'confirmed');
  const wallet = loadWallet();
  
  console.log('Wallet adress:', wallet.publicKey.toBase58());
  
  const balance = await connection.getBalance(wallet.publicKey);
  
  console.log('Saldo (lamports):', balance);
  console.log('Saldo (SOL):', balance / LAMPORTS_PER_SOL);
}

main().catch(err => {
  console.error('Fel:', err);
});