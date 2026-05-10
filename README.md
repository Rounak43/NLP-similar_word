# 🔤 NLP Similar Word Predictor

A full-stack web application that uses **Natural Language Processing** to predict and suggest semantically similar words. Built with a **FastAPI** backend (GloVe embeddings) and a modern **React + Vite** frontend.

![Language](https://img.shields.io/badge/Language-Python%20%7C%20JavaScript-blue)
![Status](https://img.shields.io/badge/Status-Active-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

✅ **Word Similarity Search** — Find semantically similar words using GloVe embeddings  
✅ **Word Analogies** — Solve analogies like *king − man + woman = queen*  
✅ **Cosine Similarity** — Compute similarity score between two words  
✅ **Vocabulary Check** — Verify if words exist in the model  
✅ **Real-time API** — FastAPI with interactive Swagger docs  
✅ **Modern UI** — React + Vite frontend with smooth interactions  
✅ **Production Ready** — Fully documented and structured code  

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** — Modern async Python web framework
- **Gensim** — NLP library for word embeddings
- **GloVe Embeddings** — Pre-trained 50-dimensional word vectors (6B tokens)
- **Uvicorn** — ASGI server
- **Python 3.8+**

### Frontend
- **React 18** — UI library
- **Vite** — Next-gen build tool
- **JavaScript** — Scripting language
- **CSS** — Styling

---

## 📁 Project Structure

```
NLP-similar_word/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Backend documentation
│
├── frontend/
│   ├── src/                  # React source files
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── README.md             # Frontend documentation
│
├── README.md                 # This file
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- pip and npm

### Run Locally

**1. Start the Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
> Backend runs at: `http://localhost:8000`  
> API Docs: `http://localhost:8000/docs`

**2. Start the Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at: `http://localhost:5173`

**3. Open Browser**
```
http://localhost:5173
```

---

## 📦 Installation

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# The server will download GloVe model (~66 MB) on first run
```

**requirements.txt includes:**
- fastapi
- uvicorn
- gensim
- numpy

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 💻 Usage

### 1. Via Web Interface
- Open `http://localhost:5173`
- Enter any word in the search box
- View similar words with similarity scores
- Click suggestions to explore more words

### 2. Via API

#### Get Similar Words
```bash
curl -X POST "http://localhost:8000/similar" \
  -H "Content-Type: application/json" \
  -d '{"word": "king", "topn": 10}'
```

**Response:**
```json
{
  "query": "king",
  "in_vocabulary": true,
  "results": [
    { "word": "queen", "score": 0.7502 },
    { "word": "prince", "score": 0.7354 },
    { "word": "monarch", "score": 0.7120 }
  ]
}
```

#### Solve Analogies
```bash
curl -X POST "http://localhost:8000/analogy" \
  -H "Content-Type: application/json" \
  -d '{"positive": ["king", "woman"], "negative": ["man"], "topn": 5}'
```

#### Compute Similarity
```bash
curl -X POST "http://localhost:8000/similarity" \
  -H "Content-Type: application/json" \
  -d '{"word1": "cat", "word2": "dog"}'
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check server & model status |
| `POST` | `/similar` | Get top-N similar words |
| `POST` | `/analogy` | Solve word analogies |
| `POST` | `/similarity` | Compute word similarity score |
| `GET` | `/vocab/check/{word}` | Check if word in vocabulary |
| `GET` | `/vocab/stats` | Get model metadata |

See [backend/README.md](backend/README.md) for detailed API documentation.

---

## 🧠 How It Works

This project uses **GloVe (Global Vectors for Word Representation)**, a pre-trained word embedding model from Stanford NLP:

1. **Word Embeddings**: Each word is represented as a 50-dimensional vector
2. **Similarity**: Computed using cosine similarity between word vectors
3. **Vocabulary**: ~400,000 words trained on Wikipedia + Gigaword corpus
4. **Fast Inference**: Leverages pre-trained vectors for instant predictions

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

### Guidelines
- Follow PEP 8 (Python) and Prettier (JavaScript) code style
- Write descriptive commit messages
- Test your changes before submitting
- Update documentation if needed

---

## 📝 License

This project is open source and available under the **MIT License**.

---

## 👨‍💻 Author

**[Rounak43](https://github.com/Rounak43)**

---

## 📞 Support

For questions or issues:
- Open an [GitHub Issue](https://github.com/Rounak43/NLP-similar_word/issues)
- Check existing documentation in `backend/` and `frontend/` folders
- Review API documentation at `http://localhost:8000/docs`

---

**Made with ❤️ using FastAPI, React, and GloVe embeddings**
