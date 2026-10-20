import React, { useState } from 'react';
import {
  BookOpen,
  MapPin,
  Fish,
  Calendar,
  Waves,
  HardDrive,
  X,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  Compass,
  Layers,
  ArrowRight,
  Camera,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface UserManualModalProps {
  onClose: () => void;
  onOpenTideGraph?: () => void;
  onOpenCompass?: () => void;
  onOpenTackleBox?: () => void;
  onOpenPatternPrediction?: () => void;
  onOpenBackup?: () => void;
  onOpenPrivacyPolicy?: () => void;
}

type ManualSectionId = 
  | 'start' 
  | 'map-spots' 
  | 'catches' 
  | 'tactical' 
  | 'photos-analytics' 
  | 'offline-backup' 
  | 'faq';

interface SectionNav {
  id: ManualSectionId;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionNav[] = [
  { id: 'start', title: 'Guida di Avvio Rapido', shortTitle: 'Avvio', icon: Sparkles },
  { id: 'map-spots', title: 'Mappa & Spot GPS', shortTitle: 'Mappa', icon: MapPin },
  { id: 'catches', title: 'Diario Catture & Calendario', shortTitle: 'Catture', icon: Fish },
  { id: 'tactical', title: 'Maree, Bussola & Tattica', shortTitle: 'Tattica', icon: Waves },
  { id: 'photos-analytics', title: 'Foto & Statistiche Trofei', shortTitle: 'Statistiche', icon: BarChart3 },
  { id: 'offline-backup', title: 'Modalità Offline & Backup', shortTitle: 'Backup', icon: HardDrive },
  { id: 'faq', title: 'Domande Frequenti (FAQ)', shortTitle: 'FAQ', icon: HelpCircle },
];

export const UserManualModal: React.FC<UserManualModalProps> = ({
  onClose,
  onOpenTideGraph,
  onOpenCompass,
  onOpenTackleBox,
  onOpenPatternPrediction,
  onOpenBackup,
  onOpenPrivacyPolicy,
}) => {
  const [activeSection, setActiveSection] = useState<ManualSectionId>('start');

  return (
    <div
      className="fixed inset-0 z-[1300] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl h-[94vh] max-h-[850px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 id="manual-modal-title" className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight truncate">
                  {'Guida Utente & Manuale Pratico di AnglerLog'}
                </h2>
                <span className="text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold shrink-0">
                  {'Guida Pratica'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                {'Tutto su spot GPS, tavole di marea solunari, gestione attrezzatura e diario di pesca offline'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label={'Chiudi manuale'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout Body: Sidebar Navigation + Content Panel */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Sidebar / Subnav */}
          <nav className="w-full md:w-60 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-2 sm:p-3 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto scrollbar-none">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span className="hidden md:inline">{section.title}</span>
                  <span className="md:hidden">{section.shortTitle}</span>
                </button>
              );
            })}
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* 1. Quick Start */}
            {activeSection === 'start' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>{'Avvio Rapido (3 semplici passaggi)'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Benvenuto su AnglerLog! Inizia la tua esperienza seguendo questi 3 passaggi fondamentali.'}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-white text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-mono shrink-0">1</span>
                      <span>{'Segnare uno spot di pesca sulla mappa'}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1.5 pl-0 sm:pl-7 leading-relaxed">
                      <p>
                        {'Accedi alla Mappa Spot. Tocca un punto qualsiasi vicino all\'acqua o premi "La mia posizione" per salvare un waypoint GPS esatto con un solo tocco.'}
                      </p>
                      <p>
                        {'Registra profondità, tipologia di fondale (sabbia, scogli, posidonia), parcheggi e rischio di incaglio.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-white text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-mono shrink-0">2</span>
                      <span>{'Registrare una cattura (specie, esca, attrezzatura e meteo)'}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1.5 pl-0 sm:pl-7 leading-relaxed">
                      <p>
                        {'Premi "+ Registra Cattura" o seleziona uno spot esistente. Annota la specie, lunghezza in cm, peso in kg, esca utilizzata e condizioni meteorologiche.'}
                      </p>
                      <p>
                        {'Anche le uscite a vuoto (cappotti) possono essere memorizzate attivando "Uscita a vuoto (Cappotto)", utile per raccogliere dati preziosi su pressione e temperatura dell\'acqua.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2.5 font-bold text-white text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-mono shrink-0">3</span>
                      <span>{'Aggiungere alla schermata home (PWA Offline)'}</span>
                    </div>
                    <div className="text-xs text-slate-400 pl-0 sm:pl-7 leading-relaxed">
                      <p>
                        {'Tocca "Installa App" o usa il menu del browser ("Aggiungi a schermata Home"). AnglerLog funziona in acqua anche in totale assenza di connessione internet.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-sky-950/40 to-slate-900 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white">{'Prossimo passo: Padroneggiare la mappa e le funzioni GPS'}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{'Scopri i sub-spot, le mappe satellitari e la memorizzazione in cache offline'}</p>
                  </div>
                  <button
                    onClick={() => setActiveSection('map-spots')}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg text-xs transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <span>{'Sezione successiva'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Map & Spots */}
            {activeSection === 'map-spots' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{'Mappa Spot & Gestione GPS'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Strumenti cartografici avanzati per pescatori da riva e dalla barca.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>{'Molteplici Livelli Cartografici'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Passa dall\'immagine satellitare ad alta risoluzione (Esri World Imagery), alla mappa topografica (OpenTopoMap per curve di livello e rilievi costieri) alla mappa standard (OpenStreetMap). Le aree consultate vengono salvate automaticamente nella cache per l\'uso offline.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{'Sub-spot GPS (Hotspot Precisi)'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'All\'interno di uno spot principale (un golfo, una foce o un lago), puoi impostare sub-spot di precisione per contrassegnare la secca esatta, il salto di fondale o la legnaia sommersa.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{'Rischio Incaglio & Zone Tutelate'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Registra il livello di incaglio (scogliere sommerse, alberi caduti) e annota zone di divieto, riserve marine o accessi pericolosi.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Catches & Calendar */}
            {activeSection === 'catches' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <Fish className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>{'Diario Catture & Calendario'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Registra ogni cattura nei minimi dettagli per individuare gli schemi di alimentazione dei pesci.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'Registrazione Multipla & Dimensioni'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Registra più esemplari per sessione con lunghezza esatta in cm, peso in kg, esca e profondità di attacco.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>{'Calendario Mensile con Fasi Lunari'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Visualizza lo storico delle uscite in un calendario chiaro completo di fasi lunari (luna piena, nuova) e coefficienti di marea.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'Scheda di Condivisione con Spot Protetto'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Genera eleganti schede trofeo per i social network, dove le coordinate GPS e i nomi precisi degli spot rimangono completamente nascosti.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Tactical Tools */}
            {activeSection === 'tactical' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <Waves className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>{'Strumenti Tattici: Maree, Bussola & Previsione'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Pianifica al meglio la battuta di pesca combinando calcoli astronomici e parametri meteo.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Waves className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{'Grafico Maree & Livello dell\'Acqua'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Curve di marea in tempo reale con indicazione di alta marea, bassa marea e momenti di stanca per coste ed estuari.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{'Bussola di Pesca & Deriva da Vento'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Orientamento rapido con rosa dei venti, individuazione delle sponde battute e linee di scarroccio dell\'imbarcazione.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{'Previsione Solunare di Attività dei Pesci'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Elaborazione combinata di posizione della luna, ore solari, maree e pressione barometrica per stimare i migliori momenti di frenesia alimentare.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Photos & Analytics */}
            {activeSection === 'photos-analytics' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span>{'Galleria Foto & Record Personali (PB)'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Conserva i ricordi più belli e analizza i tuoi record di pesca.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-pink-400 shrink-0" />
                      <span>{'Galleria Fotografica'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Galleria visiva di tutte le foto di cattura con filtro per specie e data. Le foto vengono compresse e salvate localmente nel browser.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'Trofei & Personal Best (PB)'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Classifica automatica dei tuoi pesci più grandi suddivisi per specie (lunghezza massima in cm e peso massimo in kg).'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Offline & Backup */}
            {activeSection === 'offline-backup' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{'Funzionamento Offline & Salvataggio Dati'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Sicurezza totale e protezione assoluta dei tuoi spot segreti.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{'Salvataggio 100% Locale (IndexedDB)'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Tutti i tuoi spot, coordinate GPS, foto e note sono custoditi nella memoria interna del tuo dispositivo. Nessun dato viene trasmesso a server esterni.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{'Esportazione & Importazione JSON'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Esporta l\'intero diario in un file JSON con un clic per trasferirlo su un nuovo smartphone o conservarlo come copia di sicurezza sul PC.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. FAQ */}
            {activeSection === 'faq' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />
                    <span>{'Domande Frequenti (FAQ)'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {'Risposte ai quesiti più comuni sull\'utilizzo dell\'applicazione.'}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'L\'app funziona anche senza rete cellulare?'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Certamente! Una volta installata come PWA, la registrazione delle catture, la consultazione degli spot e la bussola operano completamente offline.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'I miei spot segreti vengono condivisi con altri pescatori?'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'No. AnglerLog non è un social network, bensì il tuo diario di pesca rigorosamente personale e riservato. I tuoi dati non escono mai dal dispositivo.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{'Come posso cambiare telefono senza perdere i miei dati?'}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {'Apri il menu "Backup", seleziona "Esporta Backup" e scarica il file JSON. Sul nuovo dispositivo, clicca su "Ripristina Backup" e carica lo stesso file.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 text-[11px] text-slate-400">
          <span>{'AnglerLog v1.0.0 — Edizione Italiana'}</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            {'Chiudi'}
          </button>
        </div>

      </div>
    </div>
  );
};
