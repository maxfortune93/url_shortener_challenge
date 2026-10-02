'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export function QrCode({ value, size = 96 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 1,
      color: { dark: '#3A2E27', light: '#FFFCF8' },
    }).catch(() => undefined);
  }, [value, size]);

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-xl" />;
}
