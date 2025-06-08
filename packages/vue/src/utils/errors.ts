export class XYFlowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'XYFlowError';
  }
}

export class InvalidHandlePositionError extends XYFlowError {
  constructor() {
    super('Invalid handle position');
  }
}

export class ConnectionExistsError extends XYFlowError {
  constructor() {
    super('Connection already exists');
  }
}

export function error(code: string) {
  switch(code) {
    case '002':
      throw new InvalidHandlePositionError();
    default:
      throw new XYFlowError(`Unknown error code: ${code}`);
  }
}