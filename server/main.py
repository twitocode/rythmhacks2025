import os
import shutil
from typing import Union
from fastapi import FastAPI, UploadFile
from pypdf import PdfReader
import sys
from fastapi import FastAPI, UploadFile, File
from typing import Annotated
import io
from pypdf import PdfReader
from questionmaker import generate_flashcards_from_pdf
import json
import random

app = FastAPI()
# a very horrible solution for this
# this makes it so that it only works for 1 user
# there is no time so dont worry about it
current_question_index = 0
uploaded_files = []

uploads_folder = os.getcwd() + "/pdfs"
print(uploads_folder)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/ai/question")
async def get_question():
    with open("set.json", "r") as file:
        questions = json.load(file) or {}

    randIndex = random.randint(0, len(questions) - 1)
    randomQuestion = questions[randIndex]
    return randomQuestion

@app.post("/upload-pdf")
async def upload_pdf(uploaded_file: Annotated[UploadFile, File(...)]):
    file_location = f"{uploads_folder}/{uploaded_file.filename}"
    print(uploaded_file.filename)
    # Open the destination file in write-binary mode
    with open(file_location, "wb") as buffer:
        # Copy the contents of the uploaded file to the buffer
        shutil.copyfileobj(uploaded_file.file, buffer)

    # generate_flashcards_from_pdf(file_location)

    # text = ""
    # for page in pdf_reader.pages:
    #     text += page.extract_text()
    return {"message": f"Successfully uploaded {uploaded_file.filename}"}


@app.get("/hey")
async def bro():
    return ""
