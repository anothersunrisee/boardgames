import React, { useState } from 'react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Komponen QR Code responsif & aman.
 * Menghasilkan visual QR Code tajam untuk di-scan oleh kamera HP pemain.
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 180,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const encodedUrl = encodeURIComponent(value);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&margin=10`;

  if (hasError) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#1E1E24]/30 flex flex-col items-center justify-center p-3 text-center ${className}`}
      >
        <span className="text-xs font-bold text-[#1E1E24]">Scan / Buka:</span>
        <span className="font-display text-xs font-black text-[#2568EF] break-all mt-1">
          {value}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-2xl overflow-hidden bg-white p-2 shadow-xs border-2 border-[#1E1E24]/10 flex items-center justify-center ${className}`}
    >
      <img
        src={qrApiUrl}
        alt={`QR Code untuk ${value}`}
        width={size - 16}
        height={size - 16}
        onError={() => setHasError(true)}
        className="object-contain"
        loading="lazy"
      />
    </div>
  );
};
