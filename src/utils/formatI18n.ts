/**
 * Universal formatting & translation utilities for fishing domain data (Italian Edition)
 * Automatically normalizes stored strings to clean Italian.
 */

export function formatTideName(name?: string | null): string {
  if (!name) return '';
  const n = name.trim();
  if (n.includes('大潮') || n.toLowerCase().includes('spring') || n.includes('vives') || n.toLowerCase().includes('vivas') || n.toLowerCase().includes('sizigiali')) return 'Maree sizigiali (vive)';
  if (n.includes('中潮') || n.toLowerCase().includes('mid') || n.toLowerCase().includes('middle') || n.includes('moyenne') || n.toLowerCase().includes('intermedie')) return 'Maree intermedie';
  if (n.includes('小潮') || n.toLowerCase().includes('neap') || n.includes('mortes') || n.toLowerCase().includes('muertas') || n.toLowerCase().includes('quadratura')) return 'Maree di quadratura (morte)';
  if (n.includes('長潮') || n.toLowerCase().includes('standstill') || n.includes('transition') || n.toLowerCase().includes('lunga')) return 'Marea lunga';
  if (n.includes('若潮') || n.toLowerCase().includes('young') || n.toLowerCase().includes('giovane')) return 'Marea giovane';
  return n;
}

export function formatTideState(state?: string | null): string {
  if (!state) return '';
  const s = state.trim();
  if (s.includes('上げ3分') || s.includes('Rising (Early)') || s.includes('Montante (Début)') || s.includes('Auflaufend (Beginn)') || s.includes('Llenante (inicio)') || s.includes('Montante (inizio)')) {
    return 'Montante (inizio)';
  }
  if (s.includes('上げ7分') || s.includes('Rising (Late)') || s.includes('Peak Flow') || s.includes('Montante (Plein flot)') || s.includes('Auflaufend (Hauptstrom)') || s.includes('Llenante (flujo principal)') || s.includes('Montante (flusso di punta)')) {
    return 'Montante (flusso di punta)';
  }
  if (s.includes('下げ3分') || s.includes('Falling (Early)') || s.includes('Descendante (Début)') || s.includes('Ablaufend (Beginn)') || s.includes('Vaciante (inicio)') || s.includes('Calante (inizio)')) {
    return 'Calante (inizio)';
  }
  if (s.includes('下げ7分') || s.includes('Falling (Late)') || s.includes('Descendante (Plein jusant)') || s.includes('Ablaufend (Hauptstrom)') || s.includes('Vaciante (reflujo principal)') || s.includes('Calante (reflusso di punta)')) {
    return 'Calante (reflusso di punta)';
  }
  if (s.includes('満潮前後') || s.includes('High Tide (Turn)') || s.includes('Hochwasser (Kippphase)') || s.includes('Pleamar (Repunte)')) return 'Alta marea (Stanca)';
  if (s.includes('干潮前後') || s.includes('Low Tide (Turn)') || s.includes('Niedrigwasser (Kippphase)') || s.includes('Bajamar (Repunte)')) return 'Bassa marea (Stanca)';
  if (s.includes('満潮') || s === 'High Tide' || s.includes('Pleine mer') || s.includes('Hochwasser') || s.includes('Pleamar') || s.includes('Alta marea')) return 'Alta marea';
  if (s.includes('干潮') || s === 'Low Tide' || s.includes('Basse mer') || s.includes('Niedrigwasser') || s.includes('Bajamar') || s.includes('Bassa marea')) return 'Bassa marea';
  if (s.includes('潮止まり') || s.toLowerCase().includes('slack') || s.includes('Étale') || s.includes('Stauwasser') || s.includes('Repunte') || s.includes('Stanca')) return 'Stanca di marea';
  if (s.includes('上げ') || s.includes('上潮') || s.toLowerCase().includes('flood') || s.toLowerCase().includes('rising') || s.includes('Auflaufend') || s.includes('Montante')) {
    return 'Marea in aumento (Montante)';
  }
  if (s.includes('下げ') || s.includes('引潮') || s.toLowerCase().includes('ebb') || s.toLowerCase().includes('falling') || s.includes('Ablaufend') || s.includes('Calante')) {
    return 'Marea in calo (Calante)';
  }
  return s;
}

export function formatWaveCondition(wave?: string | null): string {
  if (!wave) return '';
  const w = wave.trim();
  if (w.includes('ベタ凪') || w.toLowerCase() === 'calm' || w.includes('calme') || w.includes('Ruhige') || w.includes('calma') || w.includes('calmo')) return 'Mare calmo';
  if (w.includes('凪') || w.toLowerCase().includes('light chop') || w.includes('Légèrement') || w.includes('Leichte') || w.includes('Marejadilla') || w.includes('Poco mosso')) return 'Quasi calmo / Poco mosso';
  if (w.includes('やや波あり') || w.toLowerCase().includes('moderate') || w.includes('agitée') || w.includes('Mäßige') || w.includes('Marejada') || w.includes('Mosso')) return 'Mosso';
  if (w.includes('波高') || w.includes('荒れ') || w.toLowerCase().includes('rough') || w.includes('forte') || w.includes('Raue') || w.includes('Oleaje') || w.includes('Mareggiata')) return 'Molto mosso / Mareggiata';
  return w;
}

export function formatWeatherCondition(condition?: string | null): string {
  if (!condition) return '';
  const c = condition.trim().toLowerCase();
  if (c.includes('晴') || c === 'sunny' || c === 'clear' || c.includes('ensoleillé') || c.includes('sonnig') || c.includes('soleado') || c.includes('sereno') || c.includes('soleggiato')) return 'Soleggiato / Sereno';
  if (c.includes('曇') || c === 'cloudy' || c.includes('nuageux') || c.includes('bewölkt') || c.includes('nublado') || c.includes('nuvoloso')) return 'Nuvoloso';
  if (c.includes('大雨') || c.includes('豪雨') || c === 'heavy_rain' || c.includes('orage') || c.includes('starkregen') || c.includes('torrencial') || c.includes('temporale')) return 'Pioggia battente / Temporale';
  if (c.includes('雨') || c === 'rain' || c.includes('pluie') || c.includes('regen') || c.includes('lluvia') || c.includes('pioggia')) return 'Pioggia';
  if (c.includes('霧') || c.includes('fog') || c.includes('brouillard') || c.includes('nebel') || c.includes('niebla') || c.includes('nebbia')) return 'Nebbia / Foschia';
  if (c.includes('強風') || c === 'windy' || c.includes('vent') || c.includes('windig') || c.includes('viento') || c.includes('vento')) return 'Vento forte';
  return condition;
}

export function formatSpotType(type?: string | null): string {
  if (!type) return 'Sconosciuto';
  const t = type.trim();
  if (t === 'breakwater' || t.includes('堤防') || t.includes('Digue') || t.includes('Jetée') || t.includes('Mole') || t.includes('Espigón') || t.includes('Molo')) return 'Molo / Scogliera frangiflutti';
  if (t === 'rocky' || t.includes('磯') || t.includes('rocheuse') || t.includes('Felsküste') || t.includes('Pedrero') || t.includes('Scogliera')) return 'Scogliera naturale / Costa rocciosa';
  if (t === 'surf' || t.includes('サーフ') || t.includes('Plage') || t.includes('Brandungsstrand') || t.includes('Playa') || t.includes('Spiaggia')) return 'Spiaggia / Surfcasting';
  if (t === 'estuary' || t.includes('河口') || t.includes('Estuaire') || t.includes('Flussmündung') || t.includes('Ría') || t.includes('Foce') || t.includes('Laguna')) return 'Foce / Estuario / Laguna';
  if (t === 'lake_pond' || t.includes('湖') || t.includes('Lac') || t.includes('See') || t.includes('Embalse') || t.includes('Lago')) return 'Lago / Bacino / Cava';
  if (t === 'port' || t.includes('漁港') || t.includes('Port') || t.includes('Hafen') || t.includes('Puerto') || t.includes('Porto')) return 'Porto / Darsena / Marina';
  if (t === 'boat' || t.includes('ボート') || t.includes('Bateau') || t.includes('Boot') || t.includes('Embarcación') || t.includes('Barca')) return 'Barca / Mare aperto';
  if (t === 'stream' || t.includes('渓流') || t.includes('Ruisseau') || t.includes('Bach') || t.includes('Río') || t.includes('Torrente')) return 'Torrente / Fiume montano';
  return type;
}

export function formatBottomType(bottom?: string | null): string {
  if (!bottom) return '';
  const b = bottom.trim();
  const map: Record<string, string> = {
    '砂地': 'Sabbia',
    '砂': 'Sabbia',
    'Sand': 'Sabbia',
    'Sable': 'Sabbia',
    'Arena': 'Sabbia',
    'Sabbia': 'Sabbia',
    '泥': 'Fango / Melma',
    '泥底': 'Fango / Melma',
    'Mud': 'Fango / Melma',
    'Vase / Boue': 'Fango / Melma',
    'Schlamm / Modder': 'Fango / Melma',
    'Fango / Cieno': 'Fango / Melma',
    'Fango / Melma': 'Fango / Melma',
    '敷石': 'Scogliera frangiflutti / Massi',
    'Enrochement / Pierres': 'Scogliera frangiflutti / Massi',
    'Steinpackung / Schotter': 'Scogliera frangiflutti / Massi',
    'Escollera / Piedra suelta': 'Scogliera frangiflutti / Massi',
    'Scogliera frangiflutti / Massi': 'Scogliera frangiflutti / Massi',
    '沈み根': 'Secche rocciose / Relitti',
    'Récif submergé': 'Secche rocciose / Relitti',
    'Unterwasserberg / Riff': 'Secche rocciose / Relitti',
    'Bajos rocosos / Arrecife': 'Secche rocciose / Relitti',
    'Secche rocciose / Relitti': 'Secche rocciose / Relitti',
    '海藻・ウィード': 'Alghe / Praterie di Posidonia',
    'Algues / Herbier': 'Alghe / Praterie di Posidonia',
    'Herbier': 'Alghe',
    'Krautfeld / Wasserpflanzen': 'Alghe / Praterie di Posidonia',
    'Krautfeld': 'Alghe',
    'Algas / Praderas submarinas': 'Alghe / Praterie di Posidonia',
    'Alghe / Praterie di Posidonia': 'Alghe / Praterie di Posidonia',
    'テトラポッド': 'Blocchi di cemento / Tetrapodi',
    'Tétrapodes': 'Blocchi di cemento / Tetrapodi',
    'Tetrapoden / Deckwerk': 'Blocchi di cemento / Tetrapodi',
    'Bloques de hormigón': 'Blocchi di cemento / Tetrapodi',
    'Blocchi di cemento / Tetrapodi': 'Blocchi di cemento / Tetrapodi',
    'ブレイク・カケアガリ': 'Gradino di risacca / Caduta',
    'Tombant / Cassure': 'Gradino di risacca / Caduta',
    'Abbruchkante / Unterwasserkante': 'Gradino di risacca / Caduta',
    'Cantil / Desnivel': 'Gradino di risacca / Caduta',
    'Gradino di risacca / Caduta': 'Gradino di risacca / Caduta',
    'ゴロタ石': 'Ciottoli / Sassi',
    'Galets / Gros blocs': 'Ciottoli / Sassi',
    'Geröll / Grobe Steine': 'Ciottoli / Sassi',
    'Guijarros / Cantos rodados': 'Ciottoli / Sassi',
    'Ciottoli / Sassi': 'Ciottoli / Sassi',
    'Roches / Récif': 'Rocce / Fondali misti',
    'Felsen / Riff': 'Rocce / Fondali misti',
    'Rocas / Arrecife': 'Rocce / Fondali misti',
    'Rocce / Fondali misti': 'Rocce / Fondali misti',
    '立ち木': 'Alberi sommersi / Legnaie',
    'Bois immergé': 'Alberi sommersi / Legnaie',
    'Totholz / Versunkene Bäume': 'Alberi sommersi / Legnaie',
    'Árboles sumergidos': 'Alberi sommersi / Legnaie',
    'Alberi sommersi / Legnaie': 'Alberi sommersi / Legnaie',
  };
  return map[b] || b;
}

const SPECIES_TRANSLATION_MAP: Record<string, string> = {
  // Multilingual mapping to Italian
  'Hecht': 'Luccio',
  'Pike': 'Luccio',
  'Northern Pike': 'Luccio',
  'Brochet': 'Luccio',
  'Lucio': 'Luccio',
  'Luccio': 'Luccio',

  'Zander': 'Lucioperca / Sandra',
  'Sandre': 'Lucioperca / Sandra',
  'Walleye': 'Lucioperca / Sandra',
  'Lucioperca': 'Lucioperca / Sandra',
  'Lucioperca / Sandra': 'Lucioperca / Sandra',

  'Flussbarsch': 'Persico reale',
  'Barsch': 'Persico reale',
  'Perch': 'Persico reale',
  'European Perch': 'Persico reale',
  'Perche': 'Persico reale',
  'Perche commune': 'Persico reale',
  'Perca': 'Persico reale',
  'Persico reale': 'Persico reale',

  'Forelle': 'Trota',
  'Bachforelle': 'Trota fario',
  'Brown Trout': 'Trota fario',
  'Truite fario': 'Trota fario',
  'Trucha común / Fario': 'Trota fario',
  'Trota fario': 'Trota fario',
  'Trota': 'Trota',

  'Regenbogenforelle': 'Trota iridea',
  'Rainbow Trout': 'Trota iridea',
  'Truite arc-en-ciel': 'Trota iridea',
  'Trucha arcoíris': 'Trota iridea',
  'Trota iridea': 'Trota iridea',

  'Seeforelle': 'Trota lacustre',
  'Lake Trout': 'Trota lacustre',
  'Truite de lac': 'Trota lacustre',
  'Trota lacustre': 'Trota lacustre',

  'Meerforelle': 'Trota di mare',
  'Sea Trout': 'Trota di mare',
  'Truite de mer': 'Trota di mare',

  'Dorsch': 'Merluzzo',
  'Kabeljau': 'Merluzzo',
  'Cod': 'Merluzzo',
  'Bacalao': 'Merluzzo',
  'Merluzzo': 'Merluzzo',

  'Wolfsbarsch': 'Spigola / Branzino',
  'Sea Bass': 'Spigola / Branzino',
  'Bar commun (Loup)': 'Spigola / Branzino',
  'Bar commun': 'Spigola / Branzino',
  'シーバス': 'Spigola / Branzino',
  'スズキ': 'Spigola / Branzino',
  'Lubina': 'Spigola / Branzino',
  'Róbalo': 'Spigola / Branzino',
  'Spigola': 'Spigola / Branzino',
  'Branzino': 'Spigola / Branzino',
  'Spigola / Branzino': 'Spigola / Branzino',

  'Karpfen': 'Carpa',
  'Carp': 'Carpa',
  'Common Carp': 'Carpa comune',
  'Carpe': 'Carpa',
  'Carpa': 'Carpa',
  'Carpa común': 'Carpa comune',
  'Carpa comune': 'Carpa comune',

  'Wels': 'Siluro',
  'Waller': 'Siluro',
  'Catfish': 'Siluro / Pesce gatto',
  'Silure': 'Siluro',
  'Siluro': 'Siluro',

  'Aal': 'Anguilla',
  'Eel': 'Anguilla',
  'Anguille': 'Anguilla',
  'Anguila': 'Anguilla',
  'Anguilla': 'Anguilla',

  'Tenca': 'Tinca',
  'Tench': 'Tinca',
  'Tanche': 'Tinca',
  'Tinca': 'Tinca',

  'Barbe': 'Barbo',
  'Barbel': 'Barbo',
  'Barbeau': 'Barbo',
  'Barbo': 'Barbo',

  'Brasse': 'Breme',
  'Bream': 'Breme',
  'Brème': 'Breme',
  'Brema': 'Breme',
  'Breme': 'Breme',

  'Makrele': 'Sgombro',
  'Mackerel': 'Sgombro',
  'Maquereau': 'Sgombro',
  'Caballa': 'Sgombro',
  'Sgombro': 'Sgombro',

  'Daurade royale': 'Orata',
  'Goldbrasse / Dorade': 'Orata',
  'Dorade': 'Orata',
  'Dorada': 'Orata',
  'Orata': 'Orata',

  'Daurade / Pagre': 'Pagro / Pagello',
  'Meerbrasse': 'Sarago / Pagro',
  'Sargo': 'Sarago',
  'Sar commun': 'Sarago',
  'Sarago': 'Sarago',

  'Dentex': 'Dentice',
  'Dentón': 'Dentice',
  'Dentice': 'Dentice',

  'Mero': 'Cernia',
  'Mérou': 'Cernia',
  'Grouper': 'Cernia',
  'Cernia': 'Cernia',

  'Bonito': 'Palamita',
  'Palamita': 'Palamita',
  'Atún': 'Tonno rosso',
  'Tonno': 'Tonno rosso',
  'Tonno rosso': 'Tonno rosso',
  'Jurel': 'Sugarello',
  'Chinchard': 'Sugarello',
  'Sugarello': 'Sugarello',

  'Ricciola': 'Ricciola',
  'Amberjack': 'Ricciola',

  'Seiche': 'Seppia',
  'Sepia / Choco': 'Seppia',
  'Sepia': 'Seppia',
  'Seppia': 'Seppia',

  'Calmar / Seiche': 'Calamaro',
  'Calamar': 'Calamaro',
  'Calamaro': 'Calamaro',

  'Pulpo': 'Polpo',
  'Octopus': 'Polpo',
  'Poulpe': 'Polpo',
  'Polpo': 'Polpo',

  'Black Bass': 'Black Bass (Persico trota)',
  'Bass': 'Black Bass (Persico trota)',
  'Persico trota': 'Black Bass (Persico trota)',

  'Cavedano': 'Cavedano',
  'Mormora': 'Mormora',
  'Aguglia': 'Aguglia',
};

export function formatSpeciesName(species?: string | null): string {
  if (!species) return '';
  const s = species.trim();
  return SPECIES_TRANSLATION_MAP[s] || s;
}

export function formatSpotName(name?: string | null): string {
  if (!name) return 'Spot senza nome';
  return name.trim();
}

export function formatSeason(season?: string | null): string {
  if (!season) return '';
  const s = season.toLowerCase().trim();
  if (s.includes('primavera') || s.includes('spring') || s.includes('printemps') || s.includes('frühling') || s.includes('春')) return 'Primavera';
  if (s.includes('estate') || s.includes('summer') || s.includes('été') || s.includes('sommer') || s.includes('verano') || s.includes('夏')) return 'Estate';
  if (s.includes('autunno') || s.includes('autumn') || s.includes('fall') || s.includes('automne') || s.includes('herbst') || s.includes('otoño') || s.includes('秋')) return 'Autunno';
  if (s.includes('inverno') || s.includes('winter') || s.includes('hiver') || s.includes('invierno') || s.includes('冬')) return 'Inverno';
  return season;
}

export function formatTimeOfDay(tod?: string | null): string {
  if (!tod) return '';
  const t = tod.toLowerCase().trim();
  if (t.includes('alba') || t.includes('amanecer') || t.includes('dawn') || t.includes('aube') || t.includes('morgen') || t.includes('朝')) return 'Alba';
  if (t.includes('tramonto') || t.includes('atardecer') || t.includes('dusk') || t.includes('crépuscule') || t.includes('abend') || t.includes('夕')) return 'Tramonto';
  if (t.includes('giorno') || t.includes('día') || t.includes('day') || t.includes('jour') || t.includes('tag') || t.includes('昼')) return 'Durante il giorno';
  if (t.includes('notte') || t.includes('noche') || t.includes('night') || t.includes('nuit') || t.includes('nacht') || t.includes('夜')) return 'Notte';
  return tod;
}

export function formatSnagRisk(risk?: string | null): string {
  if (!risk) return 'Basso';
  const r = risk.trim().toLowerCase();
  if (r === 'low' || r === 'faible' || r === 'gering' || r === 'bajo' || r === 'basso' || r === '低' || r === 'none') return 'Basso';
  if (r === 'medium' || r === 'modéré' || r === 'mäßig' || r === 'mittel' || r === 'moderado' || r === 'medio' || r === 'moderato' || r === '中') return 'Moderato';
  if (r === 'high' || r === 'élevé' || r === 'hoch' || r === 'alto' || r === 'elevato' || r === '高') return 'Elevato';
  return risk;
}
