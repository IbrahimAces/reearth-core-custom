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
    console.log("🔍 Ion Hook - Layer analysis:", {
      layerId: layer?.id,
      layerType: layer?.layer.type,
      dataType: layer?.layer.data?.type,
      extractedType: type,
      ionAssetId: assetId
    });
    return assetId;
  }, [layer]);

  useEffect(() => {
    // Debug: Log the conditions
    console.log("🔍 Ion Hook conditions:", {
      isVisible,
      show,
      type,
      ionAssetId,
      hasToken: !!cesiumIonAccessToken,
      shouldCreate: isVisible && show && type === "tiles" && !!ionAssetId
    });

    if (!isVisible || !show || type !== "tiles" || !ionAssetId) {
      setImageryProvider(undefined);
      return;
    }

    const create = async () => {
      try {
        console.log(`Creating Ion imagery for asset ${ionAssetId}`);
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