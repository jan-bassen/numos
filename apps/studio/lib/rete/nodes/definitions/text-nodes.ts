import { NodeDefinitions } from "@/types/nodes.types";

export type TextNodeType = "text-combine" | "truncate" | "replace" | "length";

export const textNodes: NodeDefinitions<TextNodeType> = {
  "text-combine": {
    type: "text-combine",
    title: "Combine",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description:
        "This node allows you to concenate two texts into a single one. The seperator is a space by default.",
      link: "#text-combine",
      example: "'Hello' + 'World' = 'Hello World'",
    },
    inputs: [
      { key: "part1", type: "string", label: "Part 1" },
      { key: "part2", type: "string", label: "Part 2" },
    ],
    controls: [
      {
        key: "separator",
        type: "string",
        label: "Separator",
        placeholder: "Seperator",
        defaultValue: " ",
      },
    ],
    outputs: [{ key: "output", type: "string", label: "Output" }],
  },
  truncate: {
    type: "truncate",
    title: "Truncate",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description:
        "This node allows you to truncate a string to a given length.",
      link: "#truncate",
      example: "(Length: 3): 'Hello World' = 'Hel'",
    },
    inputs: [
      { key: "text", type: "string", label: "Text" },
      { key: "length", type: "number", label: "Length" },
    ],
    outputs: [{ key: "output", type: "string", label: "Output" }],
  },
  replace: {
    type: "replace",
    title: "Replace",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description: "This node allows you to replace a string with another one.",
      link: "#replace",
      example:
        "(Search: 'World', Replace: 'Frens'): 'Hello World' = 'Hello Frens'",
    },
    inputs: [
      { key: "text", type: "string", label: "Text" },
      { key: "search", type: "string", label: "Search" },
      { key: "replace", type: "string", label: "Replace" },
    ],
    outputs: [{ key: "output", type: "string", label: "Output" }],
  },
  length: {
    type: "length",
    title: "Length",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description: "This node returns the length of a string.",
      example: "'Hello' = 5",
      link: "#length",
    },
    inputs: [{ key: "text", type: "string", label: "Text" }],
    outputs: [{ key: "output", type: "number", label: "Output" }],
  },
};
