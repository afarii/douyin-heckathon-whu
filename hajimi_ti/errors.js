export class HajimiTIError extends Error {}

export class FeatureVectorValidationError extends HajimiTIError {
  constructor(message, { field = null } = {}) {
    super(message);
    this.field = field;
  }
}

export class UnknownPersonalityCodeError extends HajimiTIError {
  constructor(code) {
    super(`未知人格代号：${code}`);
    this.code = code;
  }
}

