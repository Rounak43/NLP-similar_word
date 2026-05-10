"""
Similar Word Prediction API
Uses gensim Word2Vec trained on a rich vocabulary corpus
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import gensim.downloader as api
from gensim.models import KeyedVectors
import numpy as np
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Similar Word Prediction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model reference
model: Optional[KeyedVectors] = None

# ── Startup: load Word2Vec model ──────────────────────────────────────────────
@app.on_event("startup")
async def load_model():
    global model
    logger.info("Loading word vectors (glove-wiki-gigaword-50)…")
    try:
        model = api.load("glove-wiki-gigaword-50")   # ~66 MB, fast download
        logger.info(f"Model loaded ✓  Vocab size: {len(model)}")
    except Exception as e:
        logger.error(f"Model load failed: {e}")
        raise


# ── Schemas ───────────────────────────────────────────────────────────────────
class SimilarRequest(BaseModel):
    word: str
    topn: int = 10

class AnalogyRequest(BaseModel):
    positive: List[str]   # e.g. ["king", "woman"]
    negative: List[str]   # e.g. ["man"]
    topn: int = 5

class SimilarityRequest(BaseModel):
    word1: str
    word2: str

class WordResult(BaseModel):
    word: str
    score: float

class SimilarResponse(BaseModel):
    query: str
    results: List[WordResult]
    in_vocabulary: bool

class SimilarityResponse(BaseModel):
    word1: str
    word2: str
    similarity: float
    interpretation: str


# ── Helpers ───────────────────────────────────────────────────────────────────
def interpret_similarity(score: float) -> str:
    if score >= 0.85:   return "Nearly identical in meaning"
    if score >= 0.70:   return "Very closely related"
    if score >= 0.50:   return "Moderately related"
    if score >= 0.25:   return "Somewhat related"
    if score >= 0.0:    return "Weakly related"
    return "Unrelated or opposite"


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "message": "Similar Word Prediction API is running"}


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "vocab_size": len(model) if model else 0,
    }


@app.post("/similar", response_model=SimilarResponse)
def get_similar_words(req: SimilarRequest):
    """Return the top-N most similar words to the given word."""
    if model is None:
        raise HTTPException(503, "Model not loaded yet")

    word = req.word.strip().lower()
    if not word:
        raise HTTPException(400, "Word cannot be empty")

    in_vocab = word in model
    if not in_vocab:
        # Try to find close-ish words by checking common variations
        candidates = []
        for w in [word + "s", word + "ed", word + "ing", word[:-1], word[:-2]]:
            if w in model:
                candidates.append(w)
        if candidates:
            word = candidates[0]
            in_vocab = True
        else:
            return SimilarResponse(query=req.word, results=[], in_vocabulary=False)

    similar = model.most_similar(word, topn=req.topn)
    results = [WordResult(word=w, score=round(float(s), 4)) for w, s in similar]
    return SimilarResponse(query=word, results=results, in_vocabulary=True)


@app.post("/analogy", response_model=SimilarResponse)
def word_analogy(req: AnalogyRequest):
    """
    Word analogy: positive - negative → similar words.
    e.g. king + woman - man ≈ queen
    """
    if model is None:
        raise HTTPException(503, "Model not loaded yet")

    pos = [w.strip().lower() for w in req.positive]
    neg = [w.strip().lower() for w in req.negative]

    missing = [w for w in pos + neg if w not in model]
    if missing:
        raise HTTPException(400, f"Words not in vocabulary: {missing}")

    try:
        similar = model.most_similar(positive=pos, negative=neg, topn=req.topn)
        results = [WordResult(word=w, score=round(float(s), 4)) for w, s in similar]
        query = f"{' + '.join(pos)} - {' + '.join(neg)}"
        return SimilarResponse(query=query, results=results, in_vocabulary=True)
    except Exception as e:
        raise HTTPException(400, str(e))


@app.post("/similarity", response_model=SimilarityResponse)
def word_similarity(req: SimilarityRequest):
    """Compute cosine similarity between two words."""
    if model is None:
        raise HTTPException(503, "Model not loaded yet")

    w1 = req.word1.strip().lower()
    w2 = req.word2.strip().lower()

    for w in [w1, w2]:
        if w not in model:
            raise HTTPException(400, f"'{w}' not found in vocabulary")

    score = float(model.similarity(w1, w2))
    return SimilarityResponse(
        word1=w1,
        word2=w2,
        similarity=round(score, 4),
        interpretation=interpret_similarity(score),
    )


@app.get("/vocab/check/{word}")
def check_vocab(word: str):
    """Check if a word exists in the vocabulary."""
    if model is None:
        raise HTTPException(503, "Model not loaded yet")
    w = word.strip().lower()
    return {"word": w, "in_vocabulary": w in model}


@app.get("/vocab/stats")
def vocab_stats():
    """Return vocabulary statistics."""
    if model is None:
        raise HTTPException(503, "Model not loaded yet")
    return {
        "vocab_size": len(model),
        "vector_dimensions": model.vector_size,
        "model": "GloVe Wikipedia + Gigaword (50d)"
    }
