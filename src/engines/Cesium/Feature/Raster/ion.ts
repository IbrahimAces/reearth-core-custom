import { IonImageryProvider } from "cesium";
import { useEffect, useMemo, useState } from "react";

import { useData, useImageryProvider } from "./hooks";
import type { Props } from "./types";

export const useIon = ({
  isVisible,
  property,
  layer,
  cesiumIonAccessToken,
}: Pick<Props, "isVisible" | "property" | "layer"> & {
  cesiumIonAccessToken?: string;
}) => {
  const { show = true, minimumLevel, maximumLevel, credit } = property ?? {};
  const { type } = useData(layer);
  const [imageryProvider, setImageryProvider] = useState<IonImageryProvider>();

  // Extract ionAssetId from layer data
  const ionAssetId = useMemo(() => {
    if (layer?.layer.type !== "simple") return undefined;
    const assetId = (layer.layer.data as any)?.ionAssetId;
    return assetId;
  }, [layer]);

  useEffect(() => {
    if (!isVisible || !show || type !== "tiles" || !ionAssetId) {
      setImageryProvider(undefined);
      return;
    }

    const create = async () => {
      try {
        const provider = await IonImageryProvider.fromAssetId(ionAssetId, {
          accessToken: cesiumIonAccessToken,
        });
        setImageryProvider(provider);
      } catch (error) {
        console.error(`Failed to create IonImageryProvider for asset ${ionAssetId}:`, error);
        setImageryProvider(undefined);
      }
    };

    create();
  }, [isVisible, show, type, ionAssetId, cesiumIonAccessToken]);

  useImageryProvider(imageryProvider, layer?.id, property);
}; 