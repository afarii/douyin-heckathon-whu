export class HachimiScoringError extends Error {}

export class FeatureVectorValidationError extends HachimiScoringError {
  constructor(message, { field = null } = {}) {
    super(message);
    this.field = field;
  }
}

