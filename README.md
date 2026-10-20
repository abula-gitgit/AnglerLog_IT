# AnglerLog (Edizione Italiana) 🎣
### Diario di Pesca Personale Offline & Logger GPS di Spot

AnglerLog è una moderna applicazione web progressiva (PWA) progettata per pescatori di mare, fiumi e laghi. Grazie alla sua architettura locale (Offline-First), funziona perfettamente al largo o in zone remote senza copertura di rete mobile.

---

## 🌟 Funzionalità Principali

- 🗺️ Mappa degli Spot & Logger GPS:
  - Posizionamento GPS preciso in barca o da riva e salvataggio degli spot con un solo tocco
  - Diversi livelli di mappa: Satellitare (Esri World Imagery), Topografica (OpenTopoMap) e Standard (OpenStreetMap)
  - Supporto per sub-spot (secche, relitti, scogliere sommerse, cambi di profondità)
  - Registrazione del rischio di incaglio, fondale, parcheggi e zone a tutela biologica

- 🐟 Diario Dettagliato delle Catture:
  - Registrazione delle catture con lunghezza (cm), peso (kg) e quantità
  - Collegamento automatico con meteo, pressione atmosferica, fasi lunari e maree
  - Registrazione delle uscite a vuoto (cappotto) per imparare dalle condizioni ambientali
  - Scheda condivisibile sui social network con mascheramento automatico delle coordinate GPS segrete

- 🌊 Previsione Maree & Attività dei Pesci:
  - Grafico delle maree in tempo reale, alta marea e bassa marea
  - Coefficienti di marea e fasi di stanca
  - Tavole solunari e indice di attività dei predatori

- 🧭 Strumenti Tattici:
  - Bussola da pesca con direzione del vento e scarroccio della barca
  - Scatola porta-accessori digitale per canne, mulinelli, lenze ed esche
  - Registro dei record personali (Personal Best) e trofei
  - Calendario mensile con fasi lunari e storico catture

- 🔒 Massima Privacy:
  - I tuoi spot segreti non vengono mai caricati su server esterni
  - Tutti i dati risiedono localmente nel tuo browser (IndexedDB)
  - Backup e ripristino rapidi in formato JSON

---

## 🚀 Installazione & Avvio

### Prerequisiti
- Node.js (v18+)
- npm o pnpm

### Sviluppo locale
```bash
npm install
npm run dev
```

### Compilazione per la produzione
```bash
npm run build
```

---

## 📄 Licenza

MIT License
