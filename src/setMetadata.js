// Kopplar metadatan du skapat (JSON + bild) till din mint via Metaplex Token Metadata programmet.
// Förutsätter att du redan har hostat metadata.json och bilden på en publik URL.
import { Connection, clusterApiUrl, PublicKey, Transaction } from '@solana/web3.js';
import { loadWallet } from './utils.js';
import fs from 'fs';
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID, createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata';

// Ändra denna till den publika URL där din metadata.json ligger
const METADATA = 'https://exempel/metadata.json';

function getMintPublicKey() {
  if (!fs.existsSync('mint.json')) throw new Error('mint.json saknas. Kör createMint.js först.');
  const { mint } = JSON.parse(fs.readFileSync('mint.json', 'utf8'));
  return new PublicKey(mint);
}

async function main() {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const wallet = loadWallet();
  const mintPubkey = getMintPublicKey();

  // PDA-Program Derived Address för metadata-konto
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintPubkey.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  );

  // Du kan läsa lokala metadata.json för namn/symbol, men uri måste peka på hostad version
  const localMeta = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
  const { name, symbol } = localMeta;

  const tx = new Transaction().add(
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: mintPubkey,
        mintAuthority: wallet.publicKey,
        payer: wallet.publicKey,
        updateAuthority: wallet.publicKey
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name,
            symbol,
            uri: METADATA, // Offentlig URI för din uppladdade metadata.json
            sellerFeeBasisPoints: 0, // 0 eftersom detta är en vanlig fungible token
            creators: null,
            collection: null,
            uses: null
          },
          isMutable: true,
          collectionDetails: null
        }
      }
    )
  );

  const signature = await connection.sendTransaction(tx, [wallet]);
  await connection.confirmTransaction(signature, 'confirmed');
  console.log('Metadata kopplad. Tx signature:', signature);
  console.log('Metadata PDA:', metadataPDA.toBase58());
}

main().catch(err => console.error('Fel:', err));

