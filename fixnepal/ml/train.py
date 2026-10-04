"""Trains the FixNepal category classifier and saves ml/model.joblib.
Run from the backend folder:  python ml/train.py
"""
from pathlib import Path
import joblib, pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.model_selection import GroupKFold, cross_val_score
from sklearn.pipeline import Pipeline

BASE = Path(__file__).resolve().parent
df = pd.read_csv(BASE / "dataset.csv")

def tfidf():
    return TfidfVectorizer(lowercase=True, analyzer="char_wb", ngram_range=(2, 5), sublinear_tf=True)

models = {
    "Naive Bayes": MultinomialNB(alpha=0.3),
    "Logistic Regression": LogisticRegression(max_iter=2000, C=10),
    "Linear SVM": LinearSVC(C=1),
}
cv = GroupKFold(n_splits=5)
for name, clf in models.items():
    s = cross_val_score(Pipeline([("tfidf", tfidf()), ("clf", clf)]), df["text"], df["category"],
                        groups=df["group"], cv=cv, scoring="f1_macro")
    print(f"{name:20s} macro-F1 = {s.mean():.3f} (+/- {s.std():.3f})")

# Logistic Regression is used in the app because it gives class probabilities (confidence scores).
final = Pipeline([("tfidf", tfidf()), ("clf", LogisticRegression(max_iter=2000, C=10))])
final.fit(df["text"], df["category"])
joblib.dump(final, BASE / "model.joblib")
print("Saved", BASE / "model.joblib")
