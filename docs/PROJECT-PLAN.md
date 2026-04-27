# In den Boule Projectplan

## Doel
We bouwen In den Boule om van statische multipage prototype naar een beheersbare horecawebsite in Next.js, met Sanity als contentlaag, Supabase voor operationele data en Mollie voor betalingen. De focus voor de week van **27 april 2026 tot 3 mei 2026** is een live demo die al geloofwaardig de eindoplossing benadert.

## Productrichting
- Multipage horecasite, niet als one-pager
- Sterke landing page op home, met afzonderlijke pagina's voor hoofdacties
- Visuele richting behouden uit het bestaande prototype
- Mobielvriendelijk, grafisch sterk en merkgericht
- Per pagina maximaal een duidelijke primaire CTA

## Kernmodules
### 1. Menu
- Publieke menupagina
- Beheerbaar via Sanity
- Structuur per categorie, item, prijs en eventuele labels
- Demo nu met seeded content uit het prototype

### 2. Events
- Overzichtspagina met event cards
- Standalone eventpagina per event
- Beheerbare velden:
  - titel
  - slug
  - datum en uur
  - omschrijving
  - hero-afbeelding
  - tickettypes
  - prijs
  - voorraad / beschikbaar aantal
- Later: publicatieflow, check-in of eenvoudige backoffice

### 3. Shop
- MVP scope: cadeaubonnen
- Digitale levering via e-mail
- Voorbereid om later fysieke producten toe te voegen
- Mollie checkout als gekozen betaalpad

### 4. Reservaties
- Start als aanvraagflow, zonder tafelplan
- Velden:
  - datum
  - uur
  - aantal personen
  - contactgegevens
  - opmerking
- Notificaties naar eigenaar of personeel
- Later uitbreidbaar naar zones, tafels en capaciteit

### 5. Verhuur
- Informatieve landingspagina met leadformulier
- Focus op het afhuren van het café als geheel
- Later uitbreidbaar met brochures, formules en leadopvolging

## Technische architectuur
### Frontend
- Next.js App Router
- Herbruikbare layouts en sectiecomponenten
- Seed data voor snelle demo, later vervangen door Sanity/Supabase fetches

### CMS
- Sanity voor:
  - menu-items
  - events
  - pagina-inhoud
  - shopproducten
  - hero's en sfeerblokken

### Database
- Supabase voor:
  - reservatie-aanvragen
  - eventorders / voorraadboekingen
  - cadeaubonbestellingen
  - contact- en verhuuraanvragen

### Payments
- Mollie voor:
  - cadeaubonnen
  - eventtickets
- Webhooks landen in Next API routes en schrijven terug naar Supabase

## Demo-doel deze week
### Demo-ready
- Next.js multipage front-end live
- Home, menu, events, event detail, reservatie, shop, verhuur, contact en privacy
- Geloofwaardige seeded data
- Duidelijke contentstructuur als opstap naar CMS

### Indien haalbaar voor oplevering
- Sanity studio en schema's
- Supabase schema en inserts
- Eerste formulieren die echt submitten
- Mollie testflow voor cadeaubonnen

## Aanbevolen bouwvolgorde
1. Next.js basis en routing
2. UI-componenten en overzetten van huidige prototype
3. Seeded contentlaag en event detail routes
4. Sanity schema's en content fetching
5. Supabase tabellen en write flows
6. Mollie MVP voor cadeaubonnen
7. Demo polish, QA en deploy

## Data-entiteiten
### Sanity
- `siteSettings`
- `homePage`
- `menuCategory`
- `menuItem`
- `event`
- `shopProduct`
- `privacyPage`

### Supabase
- `reservation_requests`
- `contact_requests`
- `venue_requests`
- `gift_card_orders`
- `event_orders`

## Openstaande inhoudelijke punten
- Definitieve contactgegevens en mailboxen
- Exacte verhuurcapaciteiten en formules
- Definitieve gift card types en bedragen
- Welke events al bij livegang zichtbaar moeten zijn
- Juridisch finale privacytekst

## Uitvoeringsbesluit
We bouwen meteen door op de echte stack, zonder tijdelijke tussenfase. De huidige prototypevisie blijft de creatieve basis, maar wordt nu omgezet naar een production-ready structuur met echte content- en datalagen.
