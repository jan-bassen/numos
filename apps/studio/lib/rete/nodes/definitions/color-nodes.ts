import {
  NodeDefinitions,
  ControlDefinition,
  SocketDefinition,
} from "@/types/nodes.types";
import { SocketType } from "@/types/database.types";

export type ColorNodeType = "split-color" | "combine-color";

export const colorNodes: NodeDefinitions<ColorNodeType> = {
  "split-color": {
    type: "split-color",
    title: "Split",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description: "This node allows you to split a color into its components.",
      link: "#split-color",
    },
    inputs: [{ key: "color", type: "color", label: "Color" }],
    outputs: [
      { key: "red", type: "number", label: "Red" },
      { key: "green", type: "number", label: "Green" },
      { key: "blue", type: "number", label: "Blue" },
      { key: "alpha", type: "number", label: "Alpha" },
    ],
  },
  "combine-color": {
    type: "combine-color",
    title: "Combine",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description: "This node allows you to combine the components of a color.",
      link: "#combine-color",
    },
    inputs: [
      { key: "red", type: "number", label: "Red" },
      { key: "green", type: "number", label: "Green" },
      { key: "blue", type: "number", label: "Blue" },
      { key: "alpha", type: "number", label: "Alpha" },
    ],
    outputs: [{ key: "color", type: "color", label: "Color" }],
  },
};
