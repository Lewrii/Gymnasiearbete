import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import fs from 'fs';
import * as mpl from '@metaplex-foundation/mpl-token-metadata';

const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const IMAGE_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWRWnwvFxGNpIEQOhP6BlprNv3SsZ-qnDx4g&s';

function loadWallet() {
  const secretKey = JSON.parse(fs.readFileSync('./wallet.json', 'utf8'));
  return Keypair.fromSecretKey(new Uint8Array(secretKey));
}

function getMintPublicKey() {
  const data = JSON.parse(fs.readFileSync('mint.json', 'utf8'));
  return new PublicKey(data.mint);
}

async function main() {
  const connection = new Connection('https://devnet.helius-rpc.com/?api-key=93ac7725-6222-4e1b-8ef6-b5e6b29a2385', 'confirmed');
  const wallet = loadWallet();
  const mintPubkey = getMintPublicKey();

  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintPubkey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const instruction = mpl.createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: mintPubkey,
      mintAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      updateAuthority: wallet.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name: "Gymnasie Token",
          symbol: "GYM",
          uri: IMAGE_URL,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    }
  );

  const tx = new Transaction().add(instruction);
  const signature = await connection.sendTransaction(tx, [wallet]);
  const latestBlockhash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature,
    ...latestBlockhash
  }, 'confirmed');

  console.log('Metadatan är uppladdad');
  console.log(`Du kan se din token här: https://explorer.solana.com/address/${mintPubkey.toBase58()}?cluster=devnet`);  
  console.log('Tx:', signature);
}

main().catch(err => {
    console.error(err.message);
}); 