import { FishingSpot, CatchLog, StoredPhoto, TackleSet } from '../types/fishing';
import { 
  formatTideName, 
  formatTideState, 
  formatWaveCondition, 
  formatWeatherCondition, 
  formatSpotType, 
  formatBottomType, 
  formatSpeciesName, 
  formatSeason, 
  formatTimeOfDay, 
  formatSnagRisk, 
  formatSpotName 
} from '../utils/formatI18n';

const DB_NAME = 'AnglerLogDatabase_v2';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('spots')) {
        const spotStore = db.createObjectStore('spots', { keyPath: 'id' });
        spotStore.createIndex('spotType', 'spotType', { unique: false });
        spotStore.createIndex('favorite', 'favorite', { unique: false });
      }

      if (!db.objectStoreNames.contains('catches')) {
        const catchStore = db.createObjectStore('catches', { keyPath: 'id' });
        catchStore.createIndex('spotId', 'spotId', { unique: false });
        catchStore.createIndex('species', 'species', { unique: false });
        catchStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains('photos')) {
        const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
        photoStore.createIndex('spotId', 'spotId', { unique: false });
        photoStore.createIndex('catchLogId', 'catchLogId', { unique: false });
      }

      if (!db.objectStoreNames.contains('tackles')) {
        const tackleStore = db.createObjectStore('tackles', { keyPath: 'id' });
        tackleStore.createIndex('targetFish', 'targetFish', { unique: false });
      }
    };

    request.onsuccess = async (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      await seedInitialDataIfEmpty(db);
      await migrateLegacyData(db);
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

export const SAMPLE_SPOT_IDS = new Set([
  'spot-sardegna-orosei',
  'spot-delta-del-po',
  'spot-lago-di-bolsena',
  'spot-galicia-rias-baixas',
  'spot-delta-del-ebro',
  'spot-embalse-ourellana',
]);

export const SAMPLE_CATCH_IDS = new Set([
  'catch-001',
  'catch-002',
  'catch-003',
]);

export function isSampleSpotItem(s: FishingSpot): boolean {
  return Boolean(s.isSample || SAMPLE_SPOT_IDS.has(s.id));
}

export function isSampleCatchItem(c: CatchLog): boolean {
  return Boolean(c.isSample || SAMPLE_CATCH_IDS.has(c.id));
}

async function seedInitialDataIfEmpty(db: IDBDatabase): Promise<void> {
  const transaction = db.transaction(['spots', 'catches'], 'readonly');
  const spotsStore = transaction.objectStore('spots');
  const countReq = spotsStore.count();

  return new Promise((resolve) => {
    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        const writeTx = db.transaction(['spots', 'catches'], 'readwrite');
        const writeSpots = writeTx.objectStore('spots');
        const writeCatches = writeTx.objectStore('catches');

        const initialSpots: FishingSpot[] = getInitialSampleSpots();
        const initialCatches: CatchLog[] = getInitialSampleCatches();

        initialSpots.forEach((s) => writeSpots.put(s));
        initialCatches.forEach((c) => writeCatches.put(c));

        writeTx.oncomplete = () => {
          seedTacklesIfEmpty(db).then(resolve);
        };
        writeTx.onerror = () => {
          seedTacklesIfEmpty(db).then(resolve);
        };
      } else {
        seedTacklesIfEmpty(db).then(resolve);
      }
    };
  });
}

export function getInitialSampleSpots(): FishingSpot[] {
  return [
    {
      id: 'spot-sardegna-orosei',
      name: 'Sardegna - Golfo di Orosei & Cala Gonone',
      spotType: 'rocky',
      lat: 40.2850,
      lng: 9.6450,
      description: 'Acque cristalline del Tirreno e spettacolari falesie calcaree a picco sul mare. Paradiso per lo spinning costiero e lo shore jigging a caccia di dentici, ricciole e grosse spigole nelle calette.',
      waterDepth: 'Da 3 m sotto riva fino a oltre 35 m a breve distanza da terra',
      bottomType: ['Secche rocciose / Relitti', 'Sabbia', 'Alghe / Praterie di Posidonia'],
      snagRisk: 'medium',
      currentNotes: 'Massima attività con correnti di scirocco e moto ondoso che infrange sulle punte rocciose.',
      parkingInfo: 'Porto di Cala Gonone (parcheggio comunale e scivolo di varo)',
      hazardAndAccessNotes: 'Prestare attenzione alla scivolosità delle rocce bagnate. Indossare calzature con grip antiscivolo e giubbotto di salvataggio autogonfiabile.',
      bestSeasons: ['Autunno', 'Primavera', 'Inverno'],
      bestTimeOfDay: ['Alba', 'Tramonto'],
      targetSpecies: ['Dentice', 'Spigola / Branzino', 'Ricciola', 'Orata', 'Calamaro'],
      favorite: true,
      rating: 5,
      isSample: true,
      photoIds: [],
      subPoints: [
        { id: 'sub-sardegna-1', name: 'Punta Nera - Salto nel blu', lat: 40.2880, lng: 9.6480, note: 'Gradino di roccia da 10m a 30m, punto di passaggio per ricciole e dentici' },
        { id: 'sub-sardegna-2', name: 'Secca delle Grotte', lat: 40.2820, lng: 9.6420, note: 'Fondali misti con posidonia, ottimo per spigole all\'alba' }
      ],
      createdAt: '2026-03-10T06:00:00.000Z',
      updatedAt: '2026-03-10T06:00:00.000Z'
    },
    {
      id: 'spot-delta-del-po',
      name: 'Veneto / Emilia-Romagna - Delta del Po & Sacca di Scardovari',
      spotType: 'estuary',
      lat: 44.8650,
      lng: 12.4450,
      description: 'Uno dei più grandi delta fluviali d\'Europa. Vasti canneti, lagune salmastre e foci ricchissime di pesce foraggio. Spot leggendario per spigole da record a topwater, orate e grossi siluri nei rami interni.',
      waterDepth: '1-2 m nelle barene lagunari, 4-8 m nei canali di marea',
      bottomType: ['Fango / Melma', 'Sabbia', 'Gradino di risacca / Caduta'],
      snagRisk: 'low',
      currentNotes: 'Forte escursione di marea adriatica; picco di attività nel cambio di marea montante quando l\'acqua pulita risale i canali.',
      parkingInfo: 'Porticciolo di Barricata e argini di Scardovari con piazzole di sosta',
      hazardAndAccessNotes: 'Rispettare le delimitazioni del Parco Naturale Regionale del Delta del Po. Attenzione ai banchi di fango molle durante il guado.',
      bestSeasons: ['Primavera', 'Autunno', 'Estate'],
      bestTimeOfDay: ['Alba', 'Tramonto', 'Durante il giorno'],
      targetSpecies: ['Spigola / Branzino', 'Orata', 'Siluro', 'Luccio', 'Cefalo'],
      favorite: true,
      rating: 5,
      isSample: true,
      photoIds: [],
      createdAt: '2026-04-18T18:30:00.000Z',
      updatedAt: '2026-04-18T18:30:00.000Z'
    },
    {
      id: 'spot-lago-di-bolsena',
      name: 'Lazio - Lago di Bolsena & Isole Bisentina',
      spotType: 'lake_pond',
      lat: 42.5950,
      lng: 11.9350,
      description: 'Il più grande lago di origine vulcanica d\'Europa. Acque purissime celebri a livello internazionale per la pesca al Black Bass trofeo (pesce persico trota) e lucci enormi tra gli erbai.',
      waterDepth: '2-6 m sui plateau di canneto ed erbai, fino a 30 m attorno alle isole',
      bottomType: ['Alghe / Praterie di Posidonia', 'Sabbia', 'Alberi sommersi / Legnaie'],
      snagRisk: 'medium',
      currentNotes: 'In assenza di correnti, l\'attività dei predatori si concentra sui bordi esterni degli erbai e nelle sponde battute dal vento di tramontana.',
      parkingInfo: 'Lungolago di Bolsena e porto turistico di Capodimonte',
      hazardAndAccessNotes: 'Pesca regolamentata dalla Provincia di Viterbo. Obbligo di licenza di pesca acque interne di tipo B e rispetto dei periodi di divieto.',
      bestSeasons: ['Primavera', 'Autunno', 'Estate'],
      bestTimeOfDay: ['Alba', 'Tramonto', 'Durante il giorno'],
      targetSpecies: ['Black Bass (Persico trota)', 'Luccio', 'Persico reale', 'Carpa comune', 'Cavedano'],
      favorite: false,
      rating: 4,
      isSample: true,
      photoIds: [],
      createdAt: '2026-05-02T05:30:00.000Z',
      updatedAt: '2026-05-02T05:30:00.000Z'
    }
  ];
}

export function getInitialSampleCatches(): CatchLog[] {
  return [
    {
      id: 'catch-001',
      spotId: 'spot-sardegna-orosei',
      spotName: 'Sardegna - Golfo di Orosei & Cala Gonone',
      date: '2026-09-18',
      time: '06:45',
      isNoCatch: false,
      items: [
        {
          id: 'item-001-1',
          species: 'Dentice',
          sizeCm: 74.0,
          weightGrams: 5800,
          quantity: 1,
          lureOrBait: 'Slow Jig 80g colore Pink Glow con assist hook doppi'
        }
      ],
      species: 'Dentice',
      sizeCm: 74.0,
      weightGrams: 5800,
      quantity: 1,
      tackle: {
        rod: 'Slow Pitch Jigging Rod 6ft 3in (Max 150g)',
        reel: 'Rotante Baitcasting Mare 300',
        mainLine: 'Trecciato 8 capi PE 1.5 (25 lb / 0.18 mm)',
        leader: 'Terminale in Fluorocarbon 100% 0.40 mm (20 lb, 2 m)'
      },
      lureOrBait: 'Slow Jig 80g Pink Glow',
      actionOrRange: 'Risalita lenta con pitch regolari a mezz\'acqua su un gradino di roccia tra 25m e 35m.',
      weather: {
        condition: 'sunny',
        temperature: 22.0,
        waterTemperature: 21.4,
        windDirection: 'SE',
        windSpeedMs: 3.8,
        pressureHpa: 1017,
        tideName: 'Maree sizigiali (vive)',
        tideState: 'Montante (flusso di punta)',
        waveHeight: 'Quasi calmo / Poco mosso',
        moonPhase: 'Luna crescente'
      },
      notes: 'Attacco fulmineo durante la prima risalita a mezz\'acqua su un gradino di roccia da 28m! Combattimento potente con fughe violente verso il fondo.',
      photoIds: [],
      isSample: true,
      createdAt: '2026-09-18T07:15:00.000Z',
      updatedAt: '2026-09-18T07:15:00.000Z'
    },
    {
      id: 'catch-002',
      spotId: 'spot-delta-del-po',
      spotName: 'Veneto / Emilia-Romagna - Delta del Po & Sacca di Scardovari',
      date: '2026-07-22',
      time: '20:30',
      isNoCatch: false,
      items: [
        {
          id: 'item-002-1',
          species: 'Spigola / Branzino',
          sizeCm: 68.5,
          weightGrams: 3900,
          quantity: 1,
          lureOrBait: 'WTD Topwater 110 mm (Colore Muggine)'
        }
      ],
      species: 'Spigola / Branzino',
      sizeCm: 68.5,
      weightGrams: 3900,
      quantity: 1,
      tackle: {
        rod: 'Seabass Special 2.40 m (Azione 7-35 g Fast)',
        reel: 'Shimano Stradic FM 4000 XG',
        mainLine: 'Trecciato 8 capi PE 1.0 (18 lb / 0.14 mm)',
        leader: 'Terminale Fluorocarbon 0.30 mm (14 lb, 1.5 m)'
      },
      lureOrBait: 'WTD Topwater 110 mm',
      actionOrRange: 'Recupero a zig-zag (walk-the-dog) con frequenti pause sul gradino di fango.',
      weather: {
        condition: 'cloudy',
        temperature: 25.5,
        waterTemperature: 24.0,
        windDirection: 'E',
        windSpeedMs: 2.5,
        pressureHpa: 1015,
        tideName: 'Maree intermedie',
        tideState: 'Alta marea',
        waveHeight: 'Mare calmo',
        moonPhase: 'Luna piena'
      },
      notes: 'Bollata clamorosa a galla nel momento esatto del culmine dell\'alta marea lungo l\'argine di Scardovari. Spigola regina di laguna argentata e combattiva.',
      photoIds: [],
      isSample: true,
      createdAt: '2026-07-22T21:00:00.000Z',
      updatedAt: '2026-07-22T21:00:00.000Z'
    },
    {
      id: 'catch-003',
      spotId: 'spot-lago-di-bolsena',
      spotName: 'Lazio - Lago di Bolsena & Isole Bisentina',
      date: '2026-05-14',
      time: '10:15',
      isNoCatch: false,
      items: [
        {
          id: 'item-003-1',
          species: 'Black Bass (Persico trota)',
          sizeCm: 56.0,
          weightGrams: 2850,
          quantity: 1,
          lureOrBait: 'Jig 3/8 oz con gambero trailer in silicone'
        }
      ],
      species: 'Black Bass (Persico trota)',
      sizeCm: 56.0,
      weightGrams: 2850,
      quantity: 1,
      tackle: {
        rod: 'Canna Finesse 6ft 10in (Medium Light 3.5-14 g)',
        reel: 'Mulinello 2500 con frizione micrometrica',
        mainLine: 'Trecciato sottile PE 0.8 (12 lb / 0.10 mm)',
        leader: 'Fluorocarbon 0.22 mm (8 lb, 2 m)'
      },
      lureOrBait: 'Jig 3/8 oz con trailer gambero',
      actionOrRange: 'Lanci a ridosso degli erbai con saltelli lenti sul fondale vulcanico a circa 4 metri.',
      weather: {
        condition: 'sunny',
        temperature: 20.0,
        waterTemperature: 18.5,
        windDirection: 'N',
        windSpeedMs: 3.0,
        pressureHpa: 1018,
        tideName: 'Marea lunga',
        tideState: 'Stanca di marea',
        waveHeight: 'Mare calmo',
        moonPhase: 'Primo quarto'
      },
      notes: 'Lancio a ridosso di una secca sommersa con erbaio rigoglioso. Mangianza netta sul fondo dopo il primo salto.',
      photoIds: [],
      isSample: true,
      createdAt: '2026-05-14T10:45:00.000Z',
      updatedAt: '2026-05-14T10:45:00.000Z'
    }
  ];
}

export async function clearSampleData(): Promise<{ spotCount: number; catchCount: number }> {
  const db = await getDB();
  const spots = await getAllSpots();
  const catches = await getAllCatches();
  const sampleSpots = spots.filter(isSampleSpotItem);
  const sampleCatches = catches.filter(isSampleCatchItem);

  return new Promise((resolve, reject) => {
    const tx = db.transaction(['spots', 'catches'], 'readwrite');
    const spotStore = tx.objectStore('spots');
    const catchStore = tx.objectStore('catches');

    sampleSpots.forEach((s) => spotStore.delete(s.id));
    sampleCatches.forEach((c) => catchStore.delete(c.id));

    tx.oncomplete = () => resolve({ spotCount: sampleSpots.length, catchCount: sampleCatches.length });
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadSampleData(force = false): Promise<{ spotCount: number; catchCount: number }> {
  const db = await getDB();
  const spots = await getAllSpots();
  if (!force && spots.some(isSampleSpotItem)) {
    return { spotCount: 0, catchCount: 0 };
  }

  const sampleSpots = getInitialSampleSpots();
  const sampleCatches = getInitialSampleCatches();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(['spots', 'catches'], 'readwrite');
    const spotStore = tx.objectStore('spots');
    const catchStore = tx.objectStore('catches');

    sampleSpots.forEach((s) => spotStore.put(s));
    sampleCatches.forEach((c) => catchStore.put(c));

    tx.oncomplete = () => resolve({ spotCount: sampleSpots.length, catchCount: sampleCatches.length });
    tx.onerror = () => reject(tx.error);
  });
}

async function seedTacklesIfEmpty(db: IDBDatabase): Promise<void> {
  if (!db.objectStoreNames.contains('tackles')) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction('tackles', 'readonly');
      const store = tx.objectStore('tackles');
      const countReq = store.count();
      countReq.onsuccess = () => {
        if (countReq.result === 0) {
          const writeTx = db.transaction('tackles', 'readwrite');
          const writeStore = writeTx.objectStore('tackles');

          const initialTackles: TackleSet[] = [
            {
              id: 'tackle-spigola-spinning',
              name: 'Combo Spinning Costiero / Spigola & Serra',
              targetFish: 'Spigola / Branzino',
              rod: 'Seabass Special 2.40 m (Azione 7-35 g Fast)',
              reel: 'Shimano Stradic FM 4000 XG (Ratio 6.2:1)',
              mainLine: 'Trecciato 8 capi PE 1.0 (18 lb / 0.14 mm)',
              leader: 'Terminale Fluorocarbon 0.30 mm (14 lb, 1.5 m)',
              favoriteLures: ['Duo Tide Minnow 140/175', 'Patchinko 100/125', 'Black Minnow 120', 'Jighead 15g con Shad 4"'],
              notes: 'Assetto ideale per scogliere basse, foci e spiagge con mareggiata in scaduta.',
              isDefault: true,
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-03-01T00:00:00.000Z'
            },
            {
              id: 'tackle-dentice-jigging',
              name: 'Combo Shore Jigging & Slow Pitch (Dentice & Ricciola)',
              targetFish: 'Dentice / Ricciola',
              rod: 'Shore Jigging 2.90 m (Azione 30-90 g)',
              reel: 'Carrello 5000 High Gear con frizione rinforzata',
              mainLine: 'Trecciato PE 2.0 (30 lb / 0.23 mm)',
              leader: 'Terminale Fluorocarbon 0.45 mm (25 lb, 2.0 m)',
              favoriteLures: ['Slow Jig 60-80g Pink', 'Casting Jig 40g Sardina', 'Popper 130mm'],
              notes: 'Potenza e riserva di trazione per scogliere profonde e coste a picco.',
              isDefault: false,
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-03-01T00:00:00.000Z'
            },
            {
              id: 'tackle-bass-finesse',
              name: 'Combo Bass Fishing & Persico (Spinning Finesse)',
              targetFish: 'Black Bass (Persico trota)',
              rod: 'Canna Finesse 6ft 10in (Medium Light 3.5-14 g)',
              reel: 'Mulinello 2500 con frizione micrometrica',
              mainLine: 'Trecciato sottile PE 0.8 (12 lb / 0.10 mm)',
              leader: 'Fluorocarbon 0.22 mm (8 lb, 2 m)',
              favoriteLures: ['Wacky Rig con Senko 5"', 'Ned Rig 1/8 oz', 'Small Crankbait 50mm'],
              notes: 'Grande sensibilità per la pesca a vista nei grandi laghi vulcanici.',
              isDefault: false,
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-03-01T00:00:00.000Z'
            }
          ];

          initialTackles.forEach((t) => writeStore.put(t));
          writeTx.oncomplete = () => resolve();
          writeTx.onerror = () => resolve();
        } else {
          resolve();
        }
      };
      countReq.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// Spot API
export async function getAllSpots(): Promise<FishingSpot[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readonly');
    const store = tx.objectStore('spots');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getSpotById(id: string): Promise<FishingSpot | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readonly');
    const store = tx.objectStore('spots');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSpot(spot: FishingSpot): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readwrite');
    const store = tx.objectStore('spots');
    const req = store.put(spot);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteSpot(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('spots', 'readwrite');
    const store = tx.objectStore('spots');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Catch API
export async function getAllCatches(): Promise<CatchLog[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('catches', 'readonly');
    const store = tx.objectStore('catches');
    const req = store.getAll();
    req.onsuccess = () => {
      const results = (req.result || []) as CatchLog[];
      results.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getCatchesBySpot(spotId: string): Promise<CatchLog[]> {
  const all = await getAllCatches();
  return all.filter((c) => c.spotId === spotId);
}

export async function saveCatch(catchLog: CatchLog): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('catches', 'readwrite');
    const store = tx.objectStore('catches');
    const req = store.put(catchLog);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteCatch(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('catches', 'readwrite');
    const store = tx.objectStore('catches');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Photo API
export async function getAllPhotos(): Promise<StoredPhoto[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readonly');
    const store = tx.objectStore('photos');
    const req = store.getAll();
    req.onsuccess = () => {
      const results = (req.result || []) as StoredPhoto[];
      results.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));
      resolve(results);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function getPhotosByIds(ids: string[]): Promise<StoredPhoto[]> {
  if (!ids || ids.length === 0) return [];
  const db = await getDB();
  const photos: StoredPhoto[] = [];
  return new Promise((resolve) => {
    const tx = db.transaction('photos', 'readonly');
    const store = tx.objectStore('photos');
    let completed = 0;
    
    ids.forEach((id) => {
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) photos.push(req.result);
        completed++;
        if (completed === ids.length) resolve(photos);
      };
      req.onerror = () => {
        completed++;
        if (completed === ids.length) resolve(photos);
      };
    });
  });
}

export async function savePhoto(photo: StoredPhoto): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    const store = tx.objectStore('photos');
    const req = store.put(photo);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('photos', 'readwrite');
    const store = tx.objectStore('photos');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// Tackle API
export async function getAllTackles(): Promise<TackleSet[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      resolve([]);
      return;
    }
    const tx = db.transaction('tackles', 'readonly');
    const store = tx.objectStore('tackles');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function getTackleById(id: string): Promise<TackleSet | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      resolve(null);
      return;
    }
    const tx = db.transaction('tackles', 'readonly');
    const store = tx.objectStore('tackles');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveTackle(tackle: TackleSet): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      reject(new Error('Tackles store not initialized'));
      return;
    }
    const tx = db.transaction('tackles', 'readwrite');
    const store = tx.objectStore('tackles');
    store.put(tackle);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteTackle(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('tackles')) {
      resolve();
      return;
    }
    const tx = db.transaction('tackles', 'readwrite');
    const store = tx.objectStore('tackles');
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Backup & Restore
export interface BackupData {
  version: number;
  exportedAt: string;
  spots: FishingSpot[];
  catches: CatchLog[];
  photos: StoredPhoto[];
  tackles?: TackleSet[];
}

export async function exportBackup(includePhotos = true): Promise<BackupData> {
  const spots = await getAllSpots();
  const catches = await getAllCatches();
  const photos = includePhotos ? await getAllPhotos() : [];
  const tackles = await getAllTackles();

  return {
    version: DB_VERSION,
    exportedAt: new Date().toISOString(),
    spots,
    catches,
    photos,
    tackles,
  };
}

export async function importBackup(data: BackupData, mode: 'merge' | 'replace' = 'merge'): Promise<{ spotCount: number; catchCount: number; photoCount: number; tackleCount: number }> {
  const db = await getDB();

  return new Promise((resolve, reject) => {
    const stores = ['spots', 'catches', 'photos'];
    if (db.objectStoreNames.contains('tackles')) {
      stores.push('tackles');
    }

    const tx = db.transaction(stores, 'readwrite');
    const spotStore = tx.objectStore('spots');
    const catchStore = tx.objectStore('catches');
    const photoStore = tx.objectStore('photos');
    const tackleStore = db.objectStoreNames.contains('tackles') ? tx.objectStore('tackles') : null;

    if (mode === 'replace') {
      spotStore.clear();
      catchStore.clear();
      photoStore.clear();
      tackleStore?.clear();
    }

    let spotCount = 0;
    let catchCount = 0;
    let photoCount = 0;
    let tackleCount = 0;

    if (data.spots && Array.isArray(data.spots)) {
      data.spots.forEach((s) => {
        spotStore.put(s);
        spotCount++;
      });
    }

    if (data.catches && Array.isArray(data.catches)) {
      data.catches.forEach((c) => {
        catchStore.put(c);
        catchCount++;
      });
    }

    if (data.photos && Array.isArray(data.photos)) {
      data.photos.forEach((p) => {
        photoStore.put(p);
        photoCount++;
      });
    }

    if (tackleStore && data.tackles && Array.isArray(data.tackles)) {
      data.tackles.forEach((t) => {
        tackleStore.put(t);
        tackleCount++;
      });
    }

    tx.oncomplete = () => resolve({ spotCount, catchCount, photoCount, tackleCount });
    tx.onerror = () => reject(tx.error);
  });
}

async function migrateLegacyData(db: IDBDatabase): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(['spots', 'catches'], 'readwrite');
      const spotStore = tx.objectStore('spots');
      const catchStore = tx.objectStore('catches');

      const allSpotsReq = spotStore.getAll();
      allSpotsReq.onsuccess = () => {
        const spots: FishingSpot[] = allSpotsReq.result || [];
        spots.forEach((s) => {
          let updated = false;
          const newName = formatSpotName(s.name);
          if (newName !== s.name) {
            s.name = newName;
            updated = true;
          }
          if (s.spotType) {
            const newType = formatSpotType(s.spotType);
            const typeKeyMap: Record<string, string> = {
              'Molo / Scogliera frangiflutti': 'breakwater',
              'Scogliera naturale / Costa rocciosa': 'rocky',
              'Spiaggia / Surfcasting': 'surf',
              'Foce / Estuario / Laguna': 'estuary',
              'Lago / Bacino / Cava': 'lake_pond',
              'Porto / Darsena / Marina': 'port',
              'Barca / Mare aperto': 'boat',
              'Torrente / Fiume montano': 'stream'
            };
            const mappedKey = typeKeyMap[newType];
            if (mappedKey && mappedKey !== s.spotType) {
              s.spotType = mappedKey as any;
              updated = true;
            }
          }
          if (s.bottomType && Array.isArray(s.bottomType)) {
            const newBottom = s.bottomType.map(formatBottomType);
            if (JSON.stringify(newBottom) !== JSON.stringify(s.bottomType)) {
              s.bottomType = newBottom;
              updated = true;
            }
          }
          if (s.targetSpecies && Array.isArray(s.targetSpecies)) {
            const newTargets = s.targetSpecies.map(formatSpeciesName);
            if (JSON.stringify(newTargets) !== JSON.stringify(s.targetSpecies)) {
              s.targetSpecies = newTargets;
              updated = true;
            }
          }
          if (s.bestSeasons && Array.isArray(s.bestSeasons)) {
            const newSeasons = s.bestSeasons.map(formatSeason);
            if (JSON.stringify(newSeasons) !== JSON.stringify(s.bestSeasons)) {
              s.bestSeasons = newSeasons;
              updated = true;
            }
          }
          if (s.bestTimeOfDay && Array.isArray(s.bestTimeOfDay)) {
            const newTimes = s.bestTimeOfDay.map(formatTimeOfDay);
            if (JSON.stringify(newTimes) !== JSON.stringify(s.bestTimeOfDay)) {
              s.bestTimeOfDay = newTimes;
              updated = true;
            }
          }
          if (s.snagRisk) {
            const newRisk = formatSnagRisk(s.snagRisk).toLowerCase();
            if (newRisk !== s.snagRisk) {
              s.snagRisk = newRisk as any;
              updated = true;
            }
          }
          if ((s as any).recommendedTide) {
            const newTide = formatTideName((s as any).recommendedTide);
            if (newTide !== (s as any).recommendedTide) {
              (s as any).recommendedTide = newTide;
              updated = true;
            }
          }
          if ((s as any).recommendedTideState) {
            const newState = formatTideState((s as any).recommendedTideState);
            if (newState !== (s as any).recommendedTideState) {
              (s as any).recommendedTideState = newState;
              updated = true;
            }
          }
          if (updated) {
            spotStore.put(s);
          }
        });
      };

      const allCatchesReq = catchStore.getAll();
      allCatchesReq.onsuccess = () => {
        const catches: CatchLog[] = allCatchesReq.result || [];
        catches.forEach((c) => {
          let updated = false;
          if (c.species) {
            const newSpecies = formatSpeciesName(c.species);
            if (newSpecies !== c.species) {
              c.species = newSpecies;
              updated = true;
            }
          }
          if (c.spotName) {
            const newSpotName = formatSpotName(c.spotName);
            if (newSpotName !== c.spotName) {
              c.spotName = newSpotName;
              updated = true;
            }
          }
          if (c.items && Array.isArray(c.items)) {
            c.items.forEach((item) => {
              if (item.species) {
                const newSp = formatSpeciesName(item.species);
                if (newSp !== item.species) {
                  item.species = newSp;
                  updated = true;
                }
              }
            });
          }
          if (c.weather) {
            if (c.weather.tideName) {
              const newTide = formatTideName(c.weather.tideName);
              if (newTide !== c.weather.tideName) {
                c.weather.tideName = newTide as any;
                updated = true;
              }
            }
            if (c.weather.tideState) {
              const newState = formatTideState(c.weather.tideState);
              if (newState !== c.weather.tideState) {
                c.weather.tideState = newState as any;
                updated = true;
              }
            }
            if (c.weather.waveHeight) {
              const newWave = formatWaveCondition(c.weather.waveHeight);
              if (newWave !== c.weather.waveHeight) {
                c.weather.waveHeight = newWave as any;
                updated = true;
              }
            }
            if (c.weather.condition) {
              const newCond = formatWeatherCondition(c.weather.condition);
              if (newCond !== c.weather.condition) {
                c.weather.condition = newCond as any;
                updated = true;
              }
            }
          }
          if (updated) {
            catchStore.put(c);
          }
        });
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}
