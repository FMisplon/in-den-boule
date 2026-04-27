# Sanity Studio

Voor In den Boule draait de website op Hostinger, maar de contentomgeving wordt apart gehost door Sanity zelf.

## Wat staat in deze repo

- `sanity.config.ts`
- `sanity.cli.ts`
- `sanity/schema-types/*`
- `sanity/structure.ts`

Die bestanden vormen samen de Studio-config en de contentmodellen voor:

- site settings
- menu
- events
- shopproducten

## Eerste deploy

Run lokaal:

```bash
cd /Users/frederikmisplon/Sites/Boule
npm run sanity:deploy
```

Sanity vraagt dan een `studioHost`. Kies bijvoorbeeld:

```text
indenboule-cms
```

Daarna krijg je een Sanity-hosted Studio-URL.

## Nuttige commando's

Studio deployen:

```bash
npm run sanity:deploy
```

Project beheren in Sanity:

```bash
npm run sanity:manage
```

Menu en demo-content opnieuw seeden:

```bash
npm run sanity:seed
```

## Belangrijk

- De Studio wordt niet via Hostinger gehost.
- De website leest content uit dezelfde Sanity dataset (`production`).
- Als je de Studio-URL definitief hebt, kun je die optioneel bewaren in projectdocumentatie of in de site tonen als admin-link.
