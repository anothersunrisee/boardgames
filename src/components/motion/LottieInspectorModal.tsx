import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, X } from 'lucide-react';
import { TactileButton } from '../ui/TactileElements';
import { sfx } from '../../assets-library/soundEngine';

// ============================================================================
// LOTTIE JSON INSPECTOR MODAL (COPY & DOWNLOAD .JSON)
// ============================================================================
export const LottieInspectorModal: React.FC<{
  title: string;
  jsonData: Record<string, unknown> | null;
  onClose: () => void;
  onNotify: (msg: string) => void;
}> = ({ title, jsonData, onClose, onNotify }) => {
  const [copied, setCopied] = useState(false);

  if (!jsonData) return null;
  const formatted = JSON.stringify(jsonData, null, 2);
  const kbSize = (new Blob([formatted]).size / 1024).toFixed(2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(formatted).catch(() => {});
    setCopied(true);
    sfx.playSuccess();
    onNotify(`Lottie JSON "${title}" berhasil disalin!`);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify(`File Lottie "${a.download}" diunduh!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-[#1E1E24]/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FAF7F2] rounded-[32px] border-[3px] border-[#1E1E24] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="bg-[#1E1E24] text-[#FAF7F2] px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4AE3B5]">
              BODYMOVIN / LOTTIE v5.7.14 • 60 FPS • CUBIC BEZIER
            </span>
            <h3 className="font-display text-xl font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 bg-[#F2ECE1] border-b border-[#1E1E24]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#64616C]">
          <span>Ukuran: {kbSize} KB • Siap pakai di lottie-react / dotLottie / Antigravity</span>
          <div className="flex items-center gap-2">
            <TactileButton variant="emerald" size="sm" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Copy JSON'}</span>
            </TactileButton>
            <TactileButton variant="cobalt" size="sm" onClick={handleDownload}>
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .json</span>
            </TactileButton>
          </div>
        </div>

        <pre className="p-5 overflow-auto text-xs font-mono bg-[#18181D] text-[#A7F3D0] leading-relaxed flex-1">
          {formatted}
        </pre>
      </motion.div>
    </motion.div>
  );
};
