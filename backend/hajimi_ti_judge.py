from __future__ import annotations

from hajimi_ti_models import DimensionMatch, FeatureVector, JudgeResult


CERTAIN_MATCH = 90
BOUNDARY_MATCH = 65


def judge(features: FeatureVector) -> JudgeResult:
    hidden = _judge_hidden(features)
    if hidden is not None:
        return hidden

    dim_hs, hs_match = _judge_hs(features)
    dim_lp, lp_match = _judge_lp(features)
    dim_tf, tf_match = _judge_tf(features)
    dim_cr, cr_match = _judge_cr(features)

    dimension_matches = (
        DimensionMatch("H/S", dim_hs, hs_match),
        DimensionMatch("L/P", dim_lp, lp_match),
        DimensionMatch("T/F", dim_tf, tf_match),
        DimensionMatch("C/R", dim_cr, cr_match),
    )
    personality_code = f"{dim_hs}{dim_lp}{dim_tf}{dim_cr}"
    personality_match = round(sum(item.match for item in dimension_matches) / len(dimension_matches))
    return JudgeResult(personality_code, int(personality_match), dimension_matches, hidden=False)


def judge_payload(payload: dict | None) -> dict:
    features = FeatureVector.from_mapping(payload)
    return judge(features).to_dict()


def _judge_hidden(features: FeatureVector) -> JudgeResult | None:
    if features.dominantFreq < 1500 and features.lowFreqDuration > 0.5:
        return JudgeResult("MEOOOW", CERTAIN_MATCH, tuple(), hidden=True)
    if features.avgDB < 20 or features.duration < 0.3:
        return JudgeResult("SILENT", CERTAIN_MATCH, tuple(), hidden=True)
    return None


def _judge_hs(features: FeatureVector) -> tuple[str, int]:
    if features.avgDB > 65 and features.peakFreq > 4000:
        return "H", CERTAIN_MATCH
    if features.avgDB < 45 or features.silenceRatio > 0.6:
        return "S", CERTAIN_MATCH
    return ("H", BOUNDARY_MATCH) if features.hisStrength > 5 else ("S", BOUNDARY_MATCH)


def _judge_lp(features: FeatureVector) -> tuple[str, int]:
    if features.duration > 1.5 and features.volumeVariance < 0.15:
        return "L", CERTAIN_MATCH
    if features.duration < 0.8 or features.volumeVariance > 0.3:
        return "P", CERTAIN_MATCH
    return ("L", BOUNDARY_MATCH) if features.duration > 1.0 else ("P", BOUNDARY_MATCH)


def _judge_tf(features: FeatureVector) -> tuple[str, int]:
    if features.peakFreq > 5000 or features.dominantFreq > 7000:
        return "T", CERTAIN_MATCH
    if features.dominantFreq < 3000 and features.lowFreqRatio > 0.4:
        return "F", CERTAIN_MATCH
    return ("T", BOUNDARY_MATCH) if features.dominantFreq > 4000 else ("F", BOUNDARY_MATCH)


def _judge_cr(features: FeatureVector) -> tuple[str, int]:
    if features.pitchChangeRate > 500 or features.freqVariance > 1500:
        return "C", CERTAIN_MATCH
    if features.pitchChangeRate < 200 and features.freqVariance < 500:
        return "R", CERTAIN_MATCH
    return ("C", BOUNDARY_MATCH) if features.pitchChangeRate > 350 else ("R", BOUNDARY_MATCH)
