// Mintar en vald mängd av din nyskapade token till din egna wallet alltså(associated token account).
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import fs from 'fs';
import { loadWallet } from './utils.js';

// Hur många "hela" tokens du vill mint:a (bortsett från decimaldelen)
const AMOUNT_WHOLE = 1000; // Kan ändras efter behov

function getMintInfo() {
  if (!fs.existsSync('mint.json')) throw new Error('mint.json saknas. Kör createMint.js först.');
  const data = JSON.parse(fs.readFileSync('mint.json', 'utf8'));
  return { mint: new PublicKey(data.mint), decimals: data.decimals };
}

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const wallet = loadWallet();
  const { mint, decimals } = getMintInfo();

  // Räknar om till dom "minsta enheterna" (lamports-liknande för token)
  const amountRaw = BigInt(AMOUNT_WHOLE) * BigInt(10 ** decimals);

  // Hämtar eller skapa associated token account för plånboken
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    wallet,
    mint,
    wallet.publicKey
  );

  const signature = await mintTo(
    connection,
    wallet,
    mint,
    ata.address,
    wallet.publicKey,
    Number(amountRaw) // spl-token funktionen tar en sffrorna här oftast ett stort nummer
  );

  console.log(`Mintade ${AMOUNT_WHOLE} tokens (rå mängd: ${amountRaw}) till`, ata.address.toBase58());
  console.log('Transaktion:', signature);
}

main().catch(err => console.error('Fel:', err));
