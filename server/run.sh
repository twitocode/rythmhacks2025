#!/bin/bash
virtualenv venv
source venv/bin/activate
pip install fastapi uvicorn python-dotenv groq langchain_community pypdf python-multipart tiktoken
uvicorn main:app --reload
 