import React, { useState, useEffect } from 'react';
import { exportBackup, importBackup, validateBackupData, BackupData, BackupSummary } from '../../services/db';
import { X, Download, Upload, Shield, Check, Layers, Database, Trash2, ShieldCheck, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import { getOfflineCacheStats, CacheStats, clearMapTilesCache } from '../../services/offlineCache';

interface BackupModalProps {
  onClose: () => void;
  onDataRestored: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  onClose,
  onDataRestored,
  onOpenPrivacyPolicy,
}) => {
  const [includePhotos, setIncludePhotos] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [isClearingTiles, setIsClearingTiles] = useState(false);

  // Restore Mode & Preview
  const [pendingBackup, setPendingBackup] = useState<{
    data: BackupData;
    summary: BackupSummary;
    fileName: string;
  } | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [confirmReplace, setConfirmReplace] = useState(false);

  const loadCache = async () => {
    try {
      const stats = await getOfflineCacheStats();
      setCacheStats(stats);
    } catch (e) {
      console.warn('Failed to load cache stats:', e);
    }
  };

  useEffect(() => {
    loadCache();
  }, []);

  const handleClearTiles = async () => {
    if (!confirm('Cancellare i riquadri della mappa memorizzati nella cache? Gli spot e i registri di cattura rimarranno intatti.')) {
      return;
    }
    setIsClearingTiles(true);
    try {
      await clearMapTilesCache();
      await loadCache();
    } finally {
      setIsClearingTiles(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const backup = await exportBackup(includePhotos);
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `AnglerLog_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Esportazione del backup fallita.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setIsImporting(true);
    setValidationError(null);
    setImportStatus(null);
    setPendingBackup(null);
    setConfirmReplace(false);
    setRestoreMode('merge');

    try {
      const text = await file.text();
      let raw: unknown;
      try {
        raw = JSON.parse(text);
      } catch {
        throw new Error('Analisi del file fallita. Non è un file JSON valido.');
      }

      const validation = validateBackupData(raw);
      if (!validation.isValid || !validation.data || !validation.summary) {
        throw new Error(validation.error || 'Formato del file di backup non valido.');
      }

      setPendingBackup({
        data: validation.data,
        summary: validation.summary,
        fileName: file.name,
      });
    } catch (err: any) {
      console.error(err);
      setValidationError(err.message || 'Formato del file di backup non valido.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleExecuteRestore = async () => {
    if (!pendingBackup) return;

    if (restoreMode === 'replace') {
      if (!confirmReplace) {
        alert('Seleziona la casella di conferma per eseguire la sovrascrittura totale.');
        return;
      }
      const finalConfirm = confirm('【AVVISO FINALE】\nTutti i dati esistenti (spot, catture, foto, attrezzature) su questo dispositivo verranno cancellati definitivamente e sostituiti con il file di backup.\n\nQuesta azione non può essere annullata. Vuoi procedere?');
      if (!finalConfirm) return;
    }

    setIsImporting(true);
    setValidationError(null);
    setImportStatus(null);

    try {
      const res = await importBackup(pendingBackup.data, restoreMode);
      const modeText = restoreMode === 'replace' ? 'Ripristino con sovrascrittura completato: ' : 'Ripristino con unione completato: ';
      setImportStatus(`${modeText}${res.spotCount} spot, ${res.catchCount} catture, ${res.tackleCount || 0} attrezzature, ${res.photoCount} foto`);
      setPendingBackup(null);
      onDataRestored();
    } catch (err: any) {
      console.error(err);
      setValidationError('Operazione di ripristino fallita: ' + (err.message || 'Error'));
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancelRestore = () => {
    setPendingBackup(null);
    setValidationError(null);
    setConfirmReplace(false);
    setRestoreMode('merge');
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-950/70 border border-sky-800/50 flex items-center justify-center text-sky-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Dati & Backup</h2>
              <p className="text-[11px] text-slate-400 hidden xs:block">Gestisci dati locali e ripristina</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs overflow-y-auto">
          
          {/* Info Banner */}
          <div className="p-3 bg-sky-950/30 rounded-xl border border-sky-800/40 text-xs text-sky-200 leading-relaxed flex items-start gap-2.5">
            <Database className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              I tuoi spot segreti e le foto delle catture sono salvati al sicuro su questo dispositivo. Puoi esportare e ripristinare tutto come file JSON in qualsiasi momento.
            </div>
          </div>

          {/* Offline Cache Stats Box */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Stato offline</span>
              </h3>
              {cacheStats && cacheStats.mapTilesCount > 0 && (
                <button
                  onClick={handleClearTiles}
                  disabled={isClearingTiles}
                  className="text-[11px] text-slate-400 hover:text-rose-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-rose-950/30"
                  title="Clear cached map tiles"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" />
                  <span>{isClearingTiles ? 'Cancellazione...' : 'Cancella mappe'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80">
                <div className="text-[11px] text-slate-400 truncate">Mappe salvate nella cache</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5 truncate">
                  {cacheStats ? `${cacheStats.mapTilesCount} riquadri` : 'Misurazione...'}
                </div>
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80">
                <div className="text-[11px] text-slate-400 truncate">Memoria dispositivo utilizzata</div>
                <div className="text-sm font-bold font-mono text-white mt-0.5 truncate">
                  {cacheStats?.totalStorageUsageMB !== null && cacheStats?.totalStorageUsageMB !== undefined
                    ? `${cacheStats.totalStorageUsageMB} MB`
                    : 'Non disponibile'}
                </div>
              </div>
            </div>
          </div>

          {/* Export Box */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>1. Esporta dati (Salva)</span>
              </h3>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/60">
                JSON
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includePhotos}
                onChange={(e) => setIncludePhotos(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-0 shrink-0"
              />
              <span className="font-medium text-slate-200">Includi foto delle catture</span>
              <span className="text-[10px] text-slate-400 font-normal">(aumenta la dimensione)</span>
            </label>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-2.5 px-3 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-950/40 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
              <span>{isExporting ? 'Preparazione esportazione...' : 'Scarica file di backup'}</span>
            </button>
          </div>

          {/* Import Box */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Ripristina dati (Importa)</span>
              </h3>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Seleziona un file JSON di backup da ripristinare. Puoi unire ai dati esistenti o sovrascrivere tutto.
            </p>

            {/* Error Banner */}
            {validationError && (
              <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-950/40 p-3 rounded-xl border border-rose-800/80 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed flex-1">{validationError}</div>
              </div>
            )}

            {/* Success Banner */}
            {importStatus && (
              <div className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{importStatus}</span>
              </div>
            )}

            {/* Pending Restore Confirmation / Mode Selection UI */}
            {pendingBackup ? (
              <div className="p-3.5 bg-slate-900 rounded-xl border border-sky-800/60 space-y-3.5 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs truncate">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">{pendingBackup.fileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {pendingBackup.summary.exportedAt ? new Date(pendingBackup.summary.exportedAt).toLocaleDateString() : 'Data sconosciuta'}
                  </span>
                </div>

                {/* Summary badges */}
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5 text-[11px]">
                  <div className="p-1.5 bg-slate-950/70 rounded-lg text-center border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Spot</div>
                    <div className="font-bold text-slate-200 mt-0.5">{pendingBackup.summary.spotCount}</div>
                  </div>
                  <div className="p-1.5 bg-slate-950/70 rounded-lg text-center border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Catture</div>
                    <div className="font-bold text-slate-200 mt-0.5">{pendingBackup.summary.catchCount}</div>
                  </div>
                  <div className="p-1.5 bg-slate-950/70 rounded-lg text-center border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Foto</div>
                    <div className="font-bold text-slate-200 mt-0.5">{pendingBackup.summary.photoCount}</div>
                  </div>
                  <div className="p-1.5 bg-slate-950/70 rounded-lg text-center border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Attrezzatura</div>
                    <div className="font-bold text-slate-200 mt-0.5">{pendingBackup.summary.tackleCount}</div>
                  </div>
                </div>

                {/* Mode Selection */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-bold text-slate-300">Seleziona modalità di ripristino:</div>
                  
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    restoreMode === 'merge' ? 'bg-sky-950/40 border-sky-600' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="restoreMode"
                      value="merge"
                      checked={restoreMode === 'merge'}
                      onChange={() => setRestoreMode('merge')}
                      className="mt-0.5 w-3.5 h-3.5 text-sky-500 bg-slate-900 border-slate-700 focus:ring-0"
                    />
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span>Aggiungi e unisci</span>
                        <span className="text-[10px] text-sky-400 bg-sky-950 px-1.5 py-0.2 rounded border border-sky-800">Consigliato</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Mantiene i dati esistenti e integra il backup (gli ID corrispondenti vengono aggiornati).
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    restoreMode === 'replace' ? 'bg-rose-950/30 border-rose-600' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}>
                    <input
                      type="radio"
                      name="restoreMode"
                      value="replace"
                      checked={restoreMode === 'replace'}
                      onChange={() => setRestoreMode('replace')}
                      className="mt-0.5 w-3.5 h-3.5 text-rose-500 bg-slate-900 border-slate-700 focus:ring-0"
                    />
                    <div>
                      <div className="font-bold text-rose-200">
                        Cancella tutto e sostituisci (Sovrascrittura totale)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        Cancella definitivamente tutti i dati presenti su questo dispositivo e ripristina solo il backup.
                      </div>
                    </div>
                  </label>
                </div>

                {/* Replace Warning & Checkbox */}
                {restoreMode === 'replace' && (
                  <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/80 space-y-2 text-rose-200 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Attenzione: tutti i dati attuali verranno cancellati</span>
                    </div>
                    <p className="text-[11px] text-rose-300/90 leading-relaxed">
                      Tutti gli spot, le catture, le foto e le attrezzature memorizzati su questo dispositivo saranno eliminati permanentemente.
                    </p>
                    <label className="flex items-center gap-2 pt-1 cursor-pointer select-none text-[11px] font-semibold text-rose-200">
                      <input
                        type="checkbox"
                        checked={confirmReplace}
                        onChange={(e) => setConfirmReplace(e.target.checked)}
                        className="w-4 h-4 rounded border-rose-700 bg-slate-900 text-rose-500 focus:ring-0 shrink-0"
                      />
                      <span>Comprendo che tutti i dati correnti del dispositivo verranno cancellati</span>
                    </label>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleExecuteRestore}
                    disabled={isImporting || (restoreMode === 'replace' && !confirmReplace)}
                    className={`flex-1 py-2.5 px-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 whitespace-nowrap text-white ${
                      restoreMode === 'replace'
                        ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 shadow-rose-950/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-emerald-950/40'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 shrink-0 stroke-[2.5] ${isImporting ? 'animate-spin' : ''}`} />
                    <span>{isImporting ? 'Ripristino in corso...' : restoreMode === 'replace' ? 'Esegui sovrascrittura' : 'Esegui unione'}</span>
                  </button>
                  <button
                    onClick={handleCancelRestore}
                    disabled={isImporting}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            ) : (
              /* File Select Button */
              <label className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700 hover:border-slate-600 shadow-sm whitespace-nowrap">
                <Upload className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>{isImporting ? 'Verifica del file...' : 'Seleziona file di backup'}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleSelectFile}
                  disabled={isImporting}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Privacy & Data Protection Link */}
          {onOpenPrivacyPolicy && (
            <div className="pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Memorizzato al 100% localmente su questo dispositivo</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrivacyPolicy();
                }}
                className="text-sky-400 hover:text-sky-300 font-semibold text-[11px] hover:underline"
              >
                Informativa sulla privacy
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
