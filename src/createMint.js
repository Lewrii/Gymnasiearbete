// Denna fil skapar själva token-minten och sen sparar adressen i mint.json.
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import fs from 'fs';
import { loadWallet } from './utils.js';
// Antal decimaler för token, 6 är vanligaste och det säger hur fördelbara tokenen är.
const DECIMALS = 6; 

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const wallet = loadWallet();

  // Skapar en mint där plånbokne är både mint authority och freeze authority.
  const mintPubkey = await createMint(
    connection,
    wallet,
    wallet.publicKey, 
    wallet.publicKey, 
    DECIMALS
  );

  // Mint-adressen och decimaler sparas som str i mint.json
  fs.writeFileSync('mint.json', JSON.stringify({ mint: mintPubkey.toBase58(), decimals: DECIMALS }, null, 2));
  console.log('Mint skapad:', mintPubkey.toBase58());
  console.log('Sparat i mint.json');
}

main().catch(err => console.error('Fel:', err));
