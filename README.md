# Solana Token Gymnasiearbete

En simpel strukturerad guide till att skapa sin egna token på Solanas devnet.

## Steg och filer
Vad dom olika filerna gör.
1. `src/createWallet.js` – Skapar plånbok och airdroppar SOL.
2. `src/balance.js` - (optional) Låter dig se hur mycket SOL din wallet har.
3. `src/createMint.js` – Skapar token-mint och sparar adress i `mint.json`.
4. `metadata.json` – Lokal fil med metadata (name, symbol, description, image) Denna fil behövs läggas up till en url för att kunna användas i `src/setMetadata.js`
5. `src/setMetadata.js` – Kopplar hostad metadata till mint via Metaplex programmet.
6. `src/mintTokens.js` – Mintar valfri mängd tokens till din wallet.

## I metadata så måste det vara en giltig URL som pekar på en bildfil och inte en fil på din dator

Installera beroenden (behövs bara göra en gång):
bash
    npm install

Skapa wallet:
bash
    npm run create:wallet

Skapa mint:
bash
    npm run create:mint


Du måste ändra `METADATA` som ligger i `src/setMetadata.js` efter att du hostat metadata.json.

Koppla metadata:

bash
    npm run set:metadata


Mint tokens (du kan välja `AMOUNT_WHOLE` i `mintTokens.js`):

bash
    npm run mint:tokens

## Korta förklaring på vad olika saker betyder
- Wallet: Nyckelpar som används för signering och avgifter.
- Mint: Själva token-definitionen (decimals, authority).
- Metadata: Standardiserad info som kan visas i wallets (namn, symbol, bild).
- Associated Token Account: Specifikt konto som håller saldo av  token för din plånbok.
- Airdrop: Solana utdelats till din plånbok gratis för att användas och testa ditt/dina projekt med
- PDA: innebär att en privata nyckeln till adressen inte styrs av en wallet utan ett program på solana.

## Devnet
Allt körs på devnet med hjälp av (`clusterApiUrl('devnet')`), det är inga riktiga värden utan bara till för att developa.
Jag har bara använt mig av Solanas directory i node_modules bibloteket
## Säkerhet
- För säkerhet ska man aldrig dela innehållet i sin `wallet.json` offentligt då det kan leda till att man får tillgång till din wallet.
- Ska man köra det här på mainnet behöver man hantera nycklar och avgifter mycket nogrannare.