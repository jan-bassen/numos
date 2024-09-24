import {
  NodeDefinitions,
  ControlDefinition,
  SocketDefinition,
} from "@/types/nodes.types";

export type TimeNodeType = "now" | "time-difference" | "time-information";

export const timeNodes: NodeDefinitions<TimeNodeType> = {
  now: {
    type: "now",
    title: "Now",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description:
        "This node outputs the current time. This will be the time of exection.",
      link: "#",
    },
    outputs: [{ key: "output", type: "datetime", label: "Output" }],
  },
  "time-difference": {
    type: "time-difference",
    title: "Time Difference",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description: "This node outputs the difference between two times.",
      example: "(Unit: Hours): 12:00:00 - 10:00:00 = 2",
      link: "#",
    },
    controls: [
      {
        key: "unit",
        type: "enum",
        label: "Unit",
        defaultValue: "seconds",
        options: [
          { value: "seconds", label: "Seconds" },
          { value: "minutes", label: "Minutes" },
          { value: "hours", label: "Hours" },
          { value: "days", label: "Days" },
          { value: "weeks", label: "Weeks" },
          { value: "months", label: "Months" },
          { value: "years", label: "Years" },
        ],
      },
    ],
    inputs: [
      { key: "time1", type: "datetime", label: "Time 1" },
      { key: "time2", type: "datetime", label: "Time 2" },
    ],
    outputs: [{ key: "output", type: "number", label: "Difference" }],
  },
  "time-information": {
    type: "time-information",
    title: "Time Information",
    root: false,
    componentType: "generic",
    nodeInfo: {
      description: "This node outputs information about a time.",
      example: "(Unit: Hours): 12:00:00 = 12",
      link: "#",
    },
    controls: [
      {
        key: "unit",
        type: "enum",
        label: "Unit",
        defaultValue: "seconds",
        options: [
          { value: "second", label: "Second of the minute" },
          { value: "minute", label: "Minute of the hour" },
          { value: "hour", label: "Hour of the day" },
          { value: "day", label: "Day of the week" },
          { value: "day-of-month", label: "Day of the month" },
          { value: "week", label: "Week of the year" },
          { value: "month", label: "Month of the year" },
          { value: "year", label: "Year" },
        ],
      },
    ],
    inputs: [{ key: "time", type: "datetime", label: "Time" }],
    outputs: [{ key: "output", type: "number", label: "Value" }],
  },
};
