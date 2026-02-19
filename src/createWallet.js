// Skapar en ny Keypair (plånbok) och gör en airdrop på devnet.
// Sparar den hemliga nyckeln i wallet.json (Det är den som ska behållas privat).
import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  // Skapar en ny plånbok (pubkey, privkey)
  const wallet = Keypair.generate();

  // Skriver den hemliga nyckeln till wallet.json
  fs.writeFileSync('wallet.json', JSON.stringify(Array.from(wallet.secretKey)));

  console.log('Du har nu skapat din nya plånbok. Publik nyckel:', wallet.publicKey.toBase58());
  console.log('\nDu behöver göra en airdrop manuellt:');
  console.log('1. Gå till https://faucet.solana.com');
  console.log('2. Klistra in din publika nyckel ovan och välj 0.5 i "AMOUNT"');
  console.log('3. Klicka på "Airdrop" för att få SOL på devnet');
  console.log('Klart! Spara wallet.json säkert.');
}

main().catch(err => {
  console.error('Fel:', err);
});
