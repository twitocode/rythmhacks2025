import os
from pathlib import Path
import dotenv
from groq import Groq
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import TokenTextSplitter
import tempfile

def question_maker(pdf_file):
    """
    pdf_file: a file-like object (e.g., from open('file.pdf', 'rb') or Flask upload)
    """

    # Load environment variables
    dotenv.load_dotenv("key.env")

    # Initialize Groq client
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    # Save the uploaded PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(pdf_file.read())
        tmp_path = tmp.name

    # Load and split PDF
    loader = PyPDFLoader(tmp_path)
    docs = loader.load()

    splitter = TokenTextSplitter(chunk_size=800, chunk_overlap=150)
    chunks = splitter.split_documents(docs)
    combined_text = "\n".join([chunk.page_content for chunk in chunks[:10]])

    # Prompt for flashcards
    prompt = f"""
    You are an expert tutor creating study flashcards.
    Create 10 flashcards from the following notes.
    Form: "question": "<question text>",
    "answer": "<answer text>"
  
    Notes:
    {combined_text}
    """

    # Query Groq
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a tutor that makes clear and accurate flashcards. Based on content. No heading or extra text."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=800
    )

    flashcards = response.choices[0].message.content.strip()

    # Save flashcards
    with open("set.json", "a+") as f:
        f.write(flashcards)

    print("\nFlashcards Generated:\n")
    print(flashcards)

    # Clean up temp file
    os.remove(tmp_path)
