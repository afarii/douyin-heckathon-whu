import test from "node:test";
import assert from "node:assert/strict";

import {
  FEATURE_VECTOR_FIELDS,
  RADAR_DATA_FIELDS,
  FeatureVectorValidationError,
  createFeatureVector,
} from "../hachimi_scoring/index.js";

test("hachimi_scoring FeatureVector: defaults fill fixed fields and reject unknown fields", () => {
  const vector = createFeatureVector();

  for (const field of FEATURE_VECTOR_FIELDS) {
    assert.ok(Object.prototype.hasOwnProperty.call(vector, field), `missing field: ${field}`);
    assert.notEqual(vector[field], undefined);
  }

  assert.equal(vector.personality, "");
  assert.equal(vector.hisLevel, 0);
  assert.equal(vector.avgDB, 0);

  for (const field of RADAR_DATA_FIELDS) {
    assert.ok(Object.prototype.hasOwnProperty.call(vector.radarData, field), `missing radar field: ${field}`);
    assert.equal(vector.radarData[field], 0);
  }

  assert.throws(() => createFeatureVector({ extra: 1 }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "extra");
    return true;
  });

  assert.throws(() => createFeatureVector({ radarData: { extra: 1 } }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "radarData.extra");
    return true;
  });
});

test("hachimi_scoring FeatureVector: rejects illegal types and ranges with field", () => {
  assert.throws(() => createFeatureVector({ avgDB: "60" }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "avgDB");
    return true;
  });

  assert.throws(() => createFeatureVector({ hisLevel: 1.2 }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "hisLevel");
    return true;
  });

  assert.throws(() => createFeatureVector({ personality: "hptc" }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "personality");
    return true;
  });

  assert.throws(() => createFeatureVector({ personalityMatch: 1.01 }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "personalityMatch");
    return true;
  });

  assert.throws(
    () => createFeatureVector({ duration: 1, activeDuration: 2 }),
    (err) => err instanceof FeatureVectorValidationError && err.field === "activeDuration",
  );

  assert.throws(() => createFeatureVector({ radarData: { loudness: 10.1 } }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "radarData.loudness");
    return true;
  });
});

