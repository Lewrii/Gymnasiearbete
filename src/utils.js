// Enkel hjälpfunktion för att läsa in din wallet från wallet.json
// Filen innehåller en array med hemliga nyckelbytes.
import fs from 'fs';
import { Keypair } from '@solana/web3.js';

export function loadWallet() {
  if (!fs.existsSync('wallet.json')) {
    throw new Error('wallet.json saknas. Kör scriptet createWallet först.');
  }
  const raw = fs.readFileSync('wallet.json', 'utf8');
  const arr = JSON.parse(raw);
  return Keypair.fromSecretKey(Uint8Array.from(arr));
}
