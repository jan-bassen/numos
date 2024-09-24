import { NodeDefinitions } from "@/types/nodes.types";

export type LocationNodeType = "location-distance";

export const locationNodes: NodeDefinitions<LocationNodeType> = {
  "location-distance": {
    type: "location-distance",
    title: "Location Distance",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description:
        "This node outputs the distance between two locations in the given unit.",
      link: "#",
    },
    controls: [
      {
        key: "unit",
        type: "enum",
        label: "Unit",
        defaultValue: "km",
        options: [
          { value: "km", label: "Kilometers" },
          { value: "meter", label: "Meters" },
          { value: "mile", label: "Miles" },
          { value: "yard", label: "Yards" },
          { value: "nautical mile", label: "Nautical Miles" },
        ],
      },
    ],
    inputs: [
      { key: "loc1", type: "location", label: "Location 1" },
      { key: "loc2", type: "location", label: "Location 2" },
    ],
    outputs: [{ key: "output", type: "number", label: "Distance" }],
  },
};
