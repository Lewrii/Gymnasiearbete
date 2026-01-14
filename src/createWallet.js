// Skapar en ny Keypair (plånbok) och gör en airdrop på devnet.
// Sparar den hemliga nyckeln i wallet.json (Det är den som ska behållas privat).
import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  // Skapar en ny plånbok
  const wallet = Keypair.generate();

  // Skriver den hemliga nyckeln till filen
  fs.writeFileSync('wallet.json', JSON.stringify(Array.from(wallet.secretKey)));

  console.log('Ny plånbok skapad. Publik nyckel:', wallet.publicKey.toBase58());
  console.log('Airdrop begärs (1 SOL)...');

  const sig = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);
  await connection.confirmTransaction(sig, 'confirmed');

  const balance = await connection.getBalance(wallet.publicKey);
  console.log('Saldo efter airdrop (lamports):', balance);
  console.log('Klart. Spara wallet.json säkert.');
}

main().catch(err => {
  console.error('Fel:', err);
});
