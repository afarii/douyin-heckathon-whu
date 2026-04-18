from __future__ import annotations

from hajimi_ti_judge import BOUNDARY_MATCH, CERTAIN_MATCH, judge
from hajimi_ti_models import FeatureVector


def test_feature_vector_defaults_and_validation() -> None:
    features = FeatureVector.from_mapping({})
    assert features.silenceRatio == 0.0
    assert features.hisStrength == 0.0

    try:
        FeatureVector.from_mapping({"silenceRatio": 1.5})
    except ValueError as error:
        assert "silenceRatio" in str(error)
    else:
        raise AssertionError("expected validation error for silenceRatio")


def test_hidden_meooow() -> None:
    features = FeatureVector.from_mapping({"dominantFreq": 1400, "lowFreqDuration": 0.6})
    result = judge(features)
    assert result.hidden is True
    assert result.personalityCode == "MEOOOW"
    assert result.personalityMatch == CERTAIN_MATCH
    assert result.dimensionMatches == tuple()


def test_hidden_silent() -> None:
    features = FeatureVector.from_mapping({"avgDB": 10, "duration": 1.0})
    result = judge(features)
    assert result.hidden is True
    assert result.personalityCode == "SILENT"


def test_judge_all_certain_dimensions() -> None:
    features = FeatureVector.from_mapping(
        {
            "avgDB": 70,
            "peakFreq": 6500,
            "silenceRatio": 0.1,
            "duration": 2.0,
            "activeDuration": 1.0,
            "volumeVariance": 0.1,
            "dominantFreq": 7200,
            "lowFreqRatio": 0.1,
            "pitchChangeRate": 650,
            "freqVariance": 2000,
            "lowFreqDuration": 0.0,
            "hisStrength": 0.0,
        }
    )
    result = judge(features)
    assert result.hidden is False
    assert result.personalityCode == "HLTC"
    assert result.personalityMatch == CERTAIN_MATCH
    assert all(item.match == CERTAIN_MATCH for item in result.dimensionMatches)


def test_judge_all_boundary_dimensions() -> None:
    features = FeatureVector.from_mapping(
        {
            "avgDB": 55,
            "peakFreq": 3500,
            "silenceRatio": 0.3,
            "duration": 1.1,
            "activeDuration": 0.8,
            "volumeVariance": 0.2,
            "dominantFreq": 3800,
            "lowFreqRatio": 0.2,
            "pitchChangeRate": 300,
            "freqVariance": 800,
            "lowFreqDuration": 0.0,
            "hisStrength": 4,
        }
    )
    result = judge(features)
    assert result.hidden is False
    assert result.personalityCode == "SLFR"
    assert result.personalityMatch == BOUNDARY_MATCH
    assert all(item.match == BOUNDARY_MATCH for item in result.dimensionMatches)


if __name__ == "__main__":
    test_feature_vector_defaults_and_validation()
    test_hidden_meooow()
    test_hidden_silent()
    test_judge_all_certain_dimensions()
    test_judge_all_boundary_dimensions()
    print("hajimi ti judge tests passed")
