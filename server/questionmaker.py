import sys
import dotenv
import sqlite3
sys.modules['sqlite3'] = sqlite3

import os
from pathlib import Path

from groq import Groq
from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import TokenTextSplitter

dotenv.load_dotenv(os.path.join(Path(__file__).parent, 'key.env'))
# --- Configuration ---
DB_CONFIG = {
    "pdf": {
        "data_path": "/Users/DSoni/Documents/RythmHacks/rythmhacks2025/server/Electrical Current.pdf",
        "db_path": "/Users/DSoni/Downloads/RythmHacks/chroma_db"
    }
}

# --- Groq Client ---
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# --- Initialize Chroma database ---
def initialize_databases():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    databases = {}

    for db_type, config in DB_CONFIG.items():
        db_path = config["db_path"]
        data_path = config["data_path"]
        os.makedirs(db_path, exist_ok=True)

        loader = PyPDFLoader(data_path)
        docs = loader.load()

        splitter = TokenTextSplitter(chunk_size=600, chunk_overlap=150)
        chunks = splitter.split_documents(docs)

        databases[db_type] = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=db_path
        )

    return databases["pdf"]

# --- Generate Flashcards ---
def generate_flashcards_from_pdf(pdf_db, k=10):
    all_docs = pdf_db.get()['documents']
    combined_text = "\n".join(all_docs[:k])

    prompt = f"""
You are an expert tutor creating study flashcards.
The flashcards should be formatted as json objects that have question and answer fields.
Clear and related to the notes. Don't include headings. 
Notes:
{combined_text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a tutor. Based on the content provided, generate 10 study flashcards. these should be clear and based on the notes. Don't include headings. Simply format the flashcards as Q: <question> A: <answer>."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=800
    )

    return response.choices[0].message.content.strip()

# --- Main Execution ---
if __name__ == "__main__":
    print("📚 Initializing vector database...")
    pdf_db = initialize_databases()
    print("Database ready!\n")

    print("⚡ Generating flashcards...")
    flashcards = generate_flashcards_from_pdf(pdf_db)
    print("\nFlashcards Generated:\n")
    print(flashcards)
    with open('set.json', 'a+') as f:
        f.write(flashcards)
