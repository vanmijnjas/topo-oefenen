# Topo oefenen

Een kleine browserapp om de provincies en steden van Nederland te oefenen.

## Starten

Start vanuit de hoofdmap van dit project een lokale webserver, bijvoorbeeld:

```sh
python -m http.server 8000 --directory site
```

Open daarna [http://localhost:8000](http://localhost:8000) in je browser. Een lokale webserver is nodig om het JSON-oefenbestand te laden.

## Oefenstof aanpassen

Bewerk [`site/data/plaatsen.json`](site/data/plaatsen.json). Voeg provincies toe met hun hoofdstad en steden met de provincie waar ze bij horen:

```json
{
  "provinces": [
    { "name": "Utrecht", "capital": "Utrecht" },
    { "name": "Gelderland", "capital": "Arnhem" }
  ],
  "cities": [
    { "name": "Amersfoort", "province": "Utrecht" },
    { "name": "Nijmegen", "province": "Gelderland" }
  ]
}
```

Gebruik voor provincies steeds dezelfde naam in `cities` als in `provinces`. De app heeft minstens twee provincies met verschillende hoofdsteden nodig. Steden zijn optioneel.

De app gebruikt deze gegevens voor twee soorten vragen:

- **Steden:** in welke provincie ligt deze stad?
- **Provincies en hoofdsteden:** wat is de hoofdstad van deze provincie?

Kies **Alles door elkaar** om beide soorten vragen af te wisselen. Na het aanpassen van het bestand laad je de pagina opnieuw.

## Publiceren met GitHub Pages

De websitebestanden staan in de map `site`. GitHub Actions publiceert die map automatisch naar GitHub Pages wanneer je een wijziging naar de branch `main` stuurt.

Stel dit eenmalig in op GitHub:

1. Open de repository en ga naar **Settings → Pages**.
2. Kies bij **Build and deployment → Source** voor **GitHub Actions**.
3. Sla de instelling op. De workflow publiceert de website bij de eerstvolgende wijziging op `main`.

Je kunt de voortgang bekijken via het tabblad **Actions**. Daar staat ook de website-URL zodra de publicatie klaar is.