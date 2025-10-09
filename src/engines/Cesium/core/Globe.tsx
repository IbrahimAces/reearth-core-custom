import {
  ArcGISTiledElevationTerrainProvider,
  CesiumTerrainProvider,
  EllipsoidTerrainProvider,
  IonResource,
  TerrainProvider,
} from "cesium";
import { useEffect, useMemo, useState } from "react";
import { Globe as CesiumGlobe } from "resium";

import type { ViewerProperty, TerrainProperty } from "../..";
import { AssetsCesiumProperty } from "../../../Map";
import { toColor } from "../common";

export type Props = {
  property?: ViewerProperty;
  cesiumIonAccessToken?: string;
  onTerrainProviderChange?: () => void;
};

export default function Globe({
  property,
  cesiumIonAccessToken,
  onTerrainProviderChange,
}: Props): JSX.Element | null {
  const terrainProperty = useMemo(
    (): TerrainProperty => ({
      ...property?.terrain,
    }),
    [property?.terrain],
  );

  // State to hold the resolved terrain provider
  const [resolvedTerrainProvider, setResolvedTerrainProvider] = useState<TerrainProvider>(defaultTerrainProvider);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration dependencies
  const terrainConfig = useMemo(() => ({
    enabled: terrainProperty?.enabled,
    type: terrainProperty?.type,
    normal: terrainProperty?.normal,
    ionAccessToken: property?.assets?.cesium?.terrain?.ionAccessToken || cesiumIonAccessToken,
    ionAsset: property?.assets?.cesium?.terrain?.ionAsset,
    ionUrl: property?.assets?.cesium?.terrain?.ionUrl,
  }), [
    terrainProperty?.enabled,
    terrainProperty?.type,
    terrainProperty?.normal,
    property?.assets?.cesium?.terrain?.ionAccessToken,
    property?.assets?.cesium?.terrain?.ionAsset,
    property?.assets?.cesium?.terrain?.ionUrl,
    cesiumIonAccessToken,
  ]);

  // Effect to load and resolve terrain provider
  useEffect(() => {
    // If terrain is disabled, use flat ellipsoid immediately
    if (!terrainConfig.enabled) {
      setResolvedTerrainProvider(defaultTerrainProvider);
      setIsLoading(false);
      return;
    }
    
    const provider = terrainProviders[terrainConfig.type || "cesium"];
    
    // If provider is a function (returns Promise or Provider)
    if (typeof provider === "function") {
      const result = provider(terrainConfig);
      
      if (result instanceof Promise) {
        setIsLoading(true);
        
        result
          .then((resolved) => {
            setResolvedTerrainProvider(resolved);
            setIsLoading(false);
          })
          .catch((error) => {
            setResolvedTerrainProvider(defaultTerrainProvider);
            setIsLoading(false);
          });
      } else {
        // Synchronous provider
        setResolvedTerrainProvider(result ?? defaultTerrainProvider);
        setIsLoading(false);
      }
    } else {
      // Static provider
      setResolvedTerrainProvider(provider ?? defaultTerrainProvider);
      setIsLoading(false);
    }
  }, [terrainConfig]);

  const baseColor = useMemo(
    () => toColor(property?.globe?.baseColor),
    [property?.globe?.baseColor],
  );

  useEffect(() => {
    if (!isLoading) {
      onTerrainProviderChange?.();
    }
  }, [resolvedTerrainProvider, isLoading, onTerrainProviderChange]);

  return (
    <CesiumGlobe
      baseColor={baseColor}
      enableLighting={!!property?.globe?.enableLighting}
      showGroundAtmosphere={property?.globe?.atmosphere?.enabled ?? true}
      atmosphereLightIntensity={property?.globe?.atmosphere?.lightIntensity}
      atmosphereSaturationShift={property?.globe?.atmosphere?.saturationShift}
      atmosphereHueShift={property?.globe?.atmosphere?.hueShift}
      atmosphereBrightnessShift={property?.globe?.atmosphere?.brightnessShift}
      terrainProvider={resolvedTerrainProvider}
      depthTestAgainstTerrain={!!property?.globe?.depthTestAgainstTerrain}
    />
  );
}

const defaultTerrainProvider = new EllipsoidTerrainProvider();

const terrainProviders: {
  [k in NonNullable<TerrainProperty["type"]>]:
    | TerrainProvider
    | ((
        opts: Pick<TerrainProperty, "normal"> & AssetsCesiumProperty["terrain"],
      ) => Promise<TerrainProvider> | TerrainProvider | null);
} = {
  cesium: ({ ionAccessToken, normal }) =>
    CesiumTerrainProvider.fromUrl(
      IonResource.fromAssetId(1, {
        accessToken: ionAccessToken,
      }),
      {
        requestVertexNormals: normal,
        requestWaterMask: false,
      },
    ),
  arcgis: () =>
    ArcGISTiledElevationTerrainProvider.fromUrl(
      "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
    ),
  cesiumion: ({ ionAccessToken, ionAsset, ionUrl, normal }) =>
    ionAsset
      ? CesiumTerrainProvider.fromUrl(
          ionUrl ||
            IonResource.fromAssetId(parseInt(ionAsset, 10), {
              accessToken: ionAccessToken,
            }),
          {
            requestVertexNormals: normal,
          },
        )
      : null,
};
