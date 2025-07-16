import { UrlTemplateImageryProvider } from "cesium";
import { useMemo } from "react";

import { useData, useImageryProvider } from "./hooks";
import type { Props } from "./types";
import { normalizeUrl } from "./utils";

export const useTiles = ({
  isVisible,
  property,
  layer,
}: Pick<Props, "isVisible" | "property" | "layer">) => {
  const { show = true, minimumLevel, maximumLevel, credit } = property ?? {};
  const { type, url } = useData(layer);

  // Check if this layer has ionAssetId - if so, skip URL-based tiles processing
  const hasIonAssetId = useMemo(() => {
    if (layer?.layer.type !== "simple") return false;
    return !!(layer.layer.data as any)?.ionAssetId;
  }, [layer]);

  const imageryProvider = useMemo(() => {
    if (!isVisible || !show || !url || type !== "tiles" || hasIonAssetId) return;
    return new UrlTemplateImageryProvider({
      url: normalizeUrl(url, "png"),
      minimumLevel,
      maximumLevel,
      credit,
    });
  }, [isVisible, show, url, type, minimumLevel, maximumLevel, credit, hasIonAssetId]);

  useImageryProvider(imageryProvider, layer?.id, property);
};
