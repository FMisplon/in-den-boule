# Ideas For Later

## Tickets: Apple Wallet + Google Wallet

Bewust nog niet uitgevoerd in de huidige fase.

### Doel

Op ticketmails en/of ticketpagina's extra knoppen voorzien:

- `Add to Apple Wallet`
- `Add to Google Wallet`

### Waarom nu nog niet

De huidige repo bevat nog niet de nodige credentials en signing-configuratie om dit echt werkend af te ronden.

### Nodig voor Apple Wallet

- Apple Wallet pass certificate
- `passTypeIdentifier`
- `teamIdentifier`
- pass signing setup voor `.pkpass`
- wallet assets zoals icon/logo

### Nodig voor Google Wallet

- Google Wallet issuer account
- Google issuer ID
- Google Cloud service account key
- class/object configuratie voor event tickets
- signed JWT flow voor `Add to Google Wallet`

### Aanbevolen aanpak later

1. Credentials en identifiers verzamelen.
2. Ticketdata mappen naar wallet-pass structuur.
3. `pkpass` generatie en signing toevoegen voor Apple.
4. Google Wallet JWT/object generatie toevoegen.
5. Knoppen tonen op ticketmail en ticketpagina.
6. End-to-end testen met echte devices.

### Extra nuance

Als we dit later oppakken, is het slim om tegelijk ook de ticketuitgifte via Mollie webhook te verhuizen, zodat wallet-passen niet alleen afhangen van de terugkeer op de bedanktpagina.
