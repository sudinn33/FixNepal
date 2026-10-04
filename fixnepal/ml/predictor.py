from pathlib import Path
import joblib

_MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
_model = None  # loaded once, on first request


def get_model():
    global _model
    if _model is None:
        _model = joblib.load(_MODEL_PATH)
    return _model


def suggest(text, top_n=3):
    model = get_model()
    probs = model.predict_proba([text])[0]
    ranked = sorted(zip(model.classes_, probs), key=lambda x: x[1], reverse=True)[:top_n]
    return [{"category": c, "confidence": round(float(p), 3)} for c, p in ranked]
