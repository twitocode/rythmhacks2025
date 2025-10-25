import sys
import pysqlite3
sys.modules['sqlite3'] = pysqlite3

from groq import Groq

from langchain_community.vectorstores import Chroma
from langchain_chroma import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import TokenTextSplitter
import os
from pathlib import Path

DB_CONFIG = {
    "pdf": {
        "data_path": "/Users/DSoni/Downloads/RythmHacks/Chapter 1 Notes.pdf",
        "db_path": "/Users/DSoni/Downloads/RythmHacks/chroma_db"
    }
}

from groq import Groq

client = Groq(api_key="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")


# --- Initialize the vector database ---
def initialize_databases():
    embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
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
        databases[db_type].persist()

    return databases["pdf"]

# --- Generate Flashcards ---
def generate_flashcards_from_pdf(pdf_db, k=10):
    # Retrieve embedded document chunks
    all_docs = pdf_db.get()['documents']
    combined_text = "\n".join(all_docs[:k])  # Combine first k chunks

    prompt = f"""
    You are an expert tutor creating study flashcards.
    Read the following notes and generate 10 flashcards.
    Each flashcard must be in this format:
    Q: <question>
    A: <answer>

    Keep questions short, specific, and focused on key facts or concepts.
    Notes:
    {combined_text}
    """

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "system", "content": "You are an educational flashcard generator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=800
    )

    return response.choices[0].message.content.strip()

# --- Streamlit UI ---
def main():
    st.title("📘 PDF Flashcard Generator")

    with st.spinner("Initializing database..."):
        pdf_db = initialize_databases()

    if st.button("Generate Flashcards"):
        with st.spinner("Generating flashcards..."):
            flashcards = generate_flashcards_from_pdf(pdf_db)
            st.success("✅ Flashcards Generated!")
            st.text_area("Flashcards", flashcards, height=500)

if __name__ == "__main__":
    main()













# '''import sys
# import pysqlite3
# sys.modules['sqlite3'] = pysqlite3'''

# import streamlit as st
# from groq import Groq
# from langchain_community.vectorstores import Chroma
# from langchain_chroma import Chroma

# from langchain_community.embeddings import SentenceTransformerEmbeddings
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.document_loaders import JSONLoader, PyPDFLoader
# from langchain.text_splitter import TokenTextSplitter
# import base64
# import time
# import os
# from pathlib import Path
# from better_profanity import profanity
# import re
# from streamlit_extras.stylable_container import stylable_container

# DB_CONFIG = {
#     "pdf": {
#         "data_path": "/Users/DSoni/Downloads/RythmHacks/Chapter 1 Notes.pdf",
#         "db_path": "/Users/DSoni/Downloads/RythmHacks/chroma_db"
#     }
# }

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# def initialize_databases():
#     embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
#     databases = {}
    
#     for db_type, config in DB_CONFIG.items():
#         db_path = config["db_path"]
#         data_path = config["data_path"]
#         os.makedirs(db_path, exist_ok=True)

#         loader = PyPDFLoader(data_path)
#         docs = loader.load()

#         splitter = TokenTextSplitter(chunk_size=600, chunk_overlap=150)
#         chunks = splitter.split_documents(docs)

#         databases[db_type] = Chroma.from_documents(
#             documents=chunks,
#             embedding=embeddings,
#             persist_directory=db_path
#         )
#         databases[db_type].persist()
    
#     return databases["pdf"]

# def generate_questions_from_pdf(pdf_db, k=10):
#     # Fetch top chunks (no user query, just take random or all)
#     all_docs = pdf_db.get()['documents']  # Retrieve stored documents
#     combined_text = "\n".join(all_docs[:k])  # Limit to first k chunks for efficiency

#     prompt = f"""
#     You are an AI tutor. Based on the following notes, generate a question
#      that could test understanding of the content. The question should be clear and relevant.

#     Notes:
#     {combined_text}
#     """

#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": "You are an educational content generator."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.7,
#         max_tokens=600
#     )

#     return response.choices[0].message.content.strip()

# Example usage:
# pdf_db = initialize_databases()
# questions = generate_questions_from_pdf(pdf_db)
# print(questions)




# from langchain_community.vectorstores import Chroma
# from langchain_chroma import Chroma

# from langchain_community.embeddings import SentenceTransformerEmbeddings
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.document_loaders import JSONLoader, PyPDFLoader
# from langchain.text_splitter import TokenTextSplitter
# import base64
# import time
# import os
# from pathlib import Path
# from better_profanity import profanity
# import re
# from langchain.schema import Document

# DB_CONFIG = {
#     "pdf": {
#         "data_path": "/Users/DSoni/Downloads/RythmHacks/Chapter 1 Notes.pdf",
#         "db_path": "/Users/DSoni/Downloads/RythmHacks"
#     }
# }


# # Initialize vector databases
# def initialize_databases():
#     #Initialize or load Chroma vector databases
#     embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
#     databases = {}
    
#     for db_type, config in DB_CONFIG.items():
#         db_path = config["db_path"]
#         data_path = config["data_path"]
        
#         # Create directory if it doesn't exist
#         os.makedirs(db_path, exist_ok=True)
        
#         # Check if database exists
#         if Path(db_path).exists() and any(Path(db_path).iterdir()):
#             databases[db_type] = Chroma(
#                 persist_directory=db_path,
#                 embedding_function=embeddings
#             )
#         else:
#             try:
                
#                 # Load documents
#                 if db_type == "json":
#                     loader = JSONLoader(
#                         file_path=data_path,
#                         jq_schema=config["jq_schema"],
#                         text_content=False
#                     )
#                 else:  # pdf
#                     loader = PyPDFLoader(data_path)
                
#                 docs = loader.load()
                
#                 # Process documents
#                 splitter = TokenTextSplitter(chunk_size=600, chunk_overlap=150)
#                 chunks = splitter.split_documents(docs)
                
#                 # Create vector store
#                 databases[db_type] = Chroma.from_documents(
#                     documents=chunks,
#                     embedding=embeddings,
#                     persist_directory=db_path
#                 )
#                 databases[db_type].persist()
                
#             except Exception as e:
#                 print(f"Error initializing {db_type} database: {str(e)}")
    
#     return databases["pdf"]

# def rag_query(pdf_db, threshold=0.1, k=7):
#     try:
#         # # Search both databases
#         # #json_hits = json_db.similarity_search_with_relevance_scores(user_query, k=k)
#         # pdf_hits = pdf_db.similarity_search_with_relevance_scores(k=k)
        
#         # # Filter by relevance threshold
#         # #filtered_json = [doc for doc, score in json_hits if score >= threshold]
#         # filtered_pdf = [doc for doc, score in pdf_hits if score >= threshold]
        
#         # # Combine results
#         # all_docs = filtered_pdf #+ filtered_json
#         # if not all_docs:
#         #     return "Sorry, no"
        
#         # Generate context
#         context = "\n".join([doc.page_content for doc in all_docs])
        
#         # Query LLM
#         response = client.chat.completions.create(
#             model="llama3-8b-8192",
#             messages=[
#                 {"role": "system", "content": "Ask a question based on the context."},
#                 {"role": "user", "content": f"Context:\n{context}"}
#             ],
#             temperature=0.3,
#             max_tokens=1000
#         )
#         return response.choices[0].message.content.strip()
#     except Exception as e:
#         return f"An error occurred: {str(e)}"
