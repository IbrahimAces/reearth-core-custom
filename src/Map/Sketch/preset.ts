import { SketchAppearance } from "./types";

export const PRESET_APPEARANCE: SketchAppearance = {
  marker: {
    height: 0,
    heightReference: "clamp",
    hideIndicator: true,
    selectedFeatureColor: "#00bebe",
    // Default marker appearance options
    style: "point",
    pointSize: 10,
    pointColor: "#00bebe",
    pointOutlineColor: "#ffffff",
    pointOutlineWidth: 2,
    // Image options
    image: undefined,
    imageSize: 32,
    imageSizeInMeters: false,
    imageHorizontalOrigin: "center",
    imageVerticalOrigin: "center",
  },
  polygon: {
    classificationType: "terrain",
    extrudedHeight: {
      expression: "${extrudedHeight}",
    },
    fillColor: "#FFFFFF",
    heightReference: "clamp",
    hideIndicator: true,
    selectedFeatureColor: "#00bebe",
    shadows: "enabled",
  },
  polyline: {
    clampToGround: true,
    hideIndicator: true,
    selectedFeatureColor: "#00bebe",
    shadows: "enabled",
    strokeColor: "#FFFFFF",
    strokeWidth: 2,
  },
};

export const PRESET_COLOR: string = "#FFFFFF";
