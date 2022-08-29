import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

const colorThief = new ColorThief();

export function useDominantColor(url: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (url) {
      getDominantColor();
    }
    async function getDominantColor() {
      setLoading(true);
      const img = new Image();

      img.addEventListener('load', () => {
        const [r, g, b] = colorThief.getColor(img);
        const hex = rgbToHex(r, g, b);
        setColor(hex);
        setLoading(false);
      });
      img.addEventListener('error', () => {
        setError(true);
        setLoading(false);
      });
      img.crossOrigin = 'anonymous';
      img.src = url;
    }
  }, [url]);

  return {
    color,
    loading,
    error,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
