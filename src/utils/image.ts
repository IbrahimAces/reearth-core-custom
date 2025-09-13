import { useState, useEffect, useRef } from "react";

export const useImage = (src?: string): HTMLImageElement | undefined => {
  const imgRef = useRef<HTMLImageElement>();
  const [img, setImg] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!src) {
      setImg(undefined);
      if (imgRef.current) {
        imgRef.current.src = "";
      }
      return;
    }
    
    console.log('[useImage] Loading image:', src, typeof src);
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      console.log('[useImage] Image loaded successfully:', src);
      setImg(img); // Fix: should be img, not imgRef.current
    };
    img.onerror = (e) => {
      console.error('[useImage] Image failed to load:', src, e);
    };
    img.src = src;
    imgRef.current = img;
  }, [src]);

  return img;
};
