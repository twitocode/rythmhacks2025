import os
from pathlib import Path
import dotenv
from groq import Groq
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import TokenTextSplitter
import re
import tempfile
import shutil


def question_maker(pdf_file):
    """
    pdf_file: a file-like object (e.g., from open('file.pdf', 'rb') or UploadFile)
    Returns a list of flashcards as JSON: [{"Q": "...", "A": "..."}, ...]
    """


    # Load environment variables
    dotenv.load_dotenv(os.path.join(Path(__file__).parent, "key.env"))


    # Initialize Groq client
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    # Save uploaded file to temporary location
    # PyPDFLoader requires a file path, not a file object
    temp_file = None
    try:
        # Create a temporary file with .pdf suffix
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')

        # Copy the uploaded file content to the temp file
        shutil.copyfileobj(pdf_file.file, temp_file)
        temp_file.close()

        # Load and split PDF using the temporary file path
        loader = PyPDFLoader(temp_file.name)
        docs = loader.load()

        splitter = TokenTextSplitter(chunk_size=800, chunk_overlap=150)
        chunks = splitter.split_documents(docs)
        combined_text = "\n".join([chunk.page_content for chunk in chunks[:10]])

        # Prompt for flashcards
        prompt = f"""
        You are an expert tutor creating study flashcards.
        Create 10 flashcards from the following notes.
        Format: Q: <question> A: <answer>
        Notes:
        {combined_text}
        """

        # Query Groq
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": """

 You are an expert tutor creating study flashcards.
 The flashcards should be formatted as json objects that have question and answer fields.
 Clear and related to the notes. Don't include headings or any other text.these should be clear and based on the notes. Don't include headings. Simply format the flashcards as Q: <question> A: <answer>
"""},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )

        flashcards_text = response.choices[0].message.content.strip()

        # Parse flashcards into JSON
        flashcards_list = []
        pattern = re.compile(r"Q:\s*(.*?)\s*A:\s*(.*?)(?=\nQ:|$)", re.DOTALL)
        matches = pattern.findall(flashcards_text)

        for q, a in matches:
            flashcards_list.append({"Question": q.strip(), "Answer": a.strip()})

        return flashcards_list

    finally:
        # Clean up the temporary file
        if temp_file and os.path.exists(temp_file.name):
            os.unlink(temp_file.name)
