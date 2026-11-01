# Topo oefenen

Een kleine browserapp om de provincies en steden van Nederland te oefenen.

## Starten

Start vanuit deze projectmap een lokale webserver, bijvoorbeeld:

```sh
python -m http.server 8000
```

Open daarna [http://localhost:8000](http://localhost:8000) in je browser. Een lokale webserver is nodig om het JSON-oefenbestand te laden.

## Oefenstof aanpassen

Bewerk [`data/plaatsen.json`](data/plaatsen.json). Voeg provincies toe met hun hoofdstad en steden met de provincie waar ze bij horen:

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

De app is een statische website en kan rechtstreeks op GitHub Pages draaien:

1. Open de repository op GitHub en ga naar **Settings → Pages**.
2. Kies bij **Build and deployment** voor **Deploy from a branch**.
3. Kies de branch met de app en de map **/ (root)**, en sla op.
4. Open de website-URL die GitHub Pages toont.