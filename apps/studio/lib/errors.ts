export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

export type GraphErrorData = {
  type: "graph";
  message: string;
  node: string;
  component?: {
    id: string;
    type: "input" | "output" | "control";
  };
  input?: {
    key: string;
    type: "metadata" | "attributes" | "parameters";
  };
};

export class GraphError extends Error {
  name = "GraphError";
  constructor(
    message: string,
    public node: string,
    public component?: {
      id: string;
      type: "input" | "output" | "control";
    },
    public input?: {
      key: string;
      type: "metadata" | "attributes" | "parameters";
    },
  ) {
    super(message);
  }
  serialize = (): GraphErrorData => {
    return {
      type: "graph",
      message: this.message,
      node: this.node,
      component: this.component,
      input: this.input,
    };
  };
}

export class EngineInputError extends Error {
  name = "InputDataError";
  constructor(
    public type: "metadata" | "attribute" | "parameter",
    public key: string,
    public node?: string,
    message?: string,
  ) {
    const defaultMessage = `This ${type} is used, so it needs to be defined`;
    super(message || defaultMessage);
  }
}

export type UnkownErrorData = {
  type: "unknown";
  message: string;
};

export type SimulationCheck =
  | {
      success: true;
    }
  | {
      success: false;
      error: GraphErrorData | UnkownErrorData;
    };
