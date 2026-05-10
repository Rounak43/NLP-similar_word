# 🔤 Similar Word Prediction — Mini Project

A FastAPI backend that predicts similar words using **GloVe word embeddings** (pre-trained on Wikipedia + Gigaword corpus, 6B tokens).

---

## 📁 Project Structure

```
backend/
├── main.py           # FastAPI application
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> **Note:** On first run, gensim will automatically download the GloVe model (~66 MB). Subsequent runs use the cached model.

### 3. Visit the interactive docs
```
http://localhost:8000/docs
```

---

## 🔌 API Endpoints

### `GET /health`
Check if the server and model are ready.

---

### `POST /similar`
Get the top-N most similar words to a query word.

**Request:**
```json
{
  "word": "king",
  "topn": 10
}
```

**Response:**
```json
{
  "query": "king",
  "in_vocabulary": true,
  "results": [
    { "word": "queen", "score": 0.7502 },
    { "word": "prince", "score": 0.7354 },
    ...
  ]
}
```

---

### `POST /analogy`
Solve word analogies: *king + woman − man ≈ ?*

**Request:**
```json
{
  "positive": ["king", "woman"],
  "negative": ["man"],
  "topn": 5
}
```

**Response:**
```json
{
  "query": "king + woman - man",
  "results": [{ "word": "queen", "score": 0.8523 }, ...]
}
```

---

### `POST /similarity`
Compute cosine similarity between two words.

**Request:**
```json
{ "word1": "cat", "word2": "dog" }
```

**Response:**
```json
{
  "word1": "cat",
  "word2": "dog",
  "similarity": 0.8219,
  "interpretation": "Very closely related"
}
```

---

### `GET /vocab/check/{word}`
Check if a word is in the model's vocabulary.

---

### `GET /vocab/stats`
Return model metadata (vocab size, vector dimensions).

---

## 🧠 How It Works

The backend uses **GloVe (Global Vectors for Word Representation)** — a pre-trained word embedding model from Stanford NLP. Each word is represented as a 50-dimensional vector. Similar words have vectors that are close together in vector space (high cosine similarity).

| Feature | Detail |
|---|---|
| Model | GloVe Wikipedia + Gigaword |
| Dimensions | 50 |
| Vocabulary | ~400,000 words |
| Similarity metric | Cosine similarity |

---

## 🛠️ Tech Stack

- **FastAPI** — modern async Python web framework  
- **Gensim** — NLP library for word vectors  
- **GloVe embeddings** — pre-trained 50d word vectors  
- **Uvicorn** — ASGI server  
