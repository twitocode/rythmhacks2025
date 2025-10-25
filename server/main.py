from typing import Union
from fastapi import FastAPI, UploadFile
from pypdf import PdfReader
import sys
from fastapi import FastAPI, UploadFile, File
from typing import Annotated
import io
from pypdf import PdfReader


print(sys.executable)

app = FastAPI()

# a very horrible solution for this
# this makes it so that it only works for 1 user
# there is no time so dont worry about it
current_question_index = 0

questions = [
    {
        "question": "",
        "answer": "",
    },
    {"question": "", "answer": ""},
]

uploaded_files = []


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/ai/question")
def get_question():
    global current_question_index
    if len(uploaded_files) == 0:
        return {"error": "no questions loaded yet"}
    else:
        current_question_index += 1
        

    if current_question_index == len(uploaded_files):
        current_question_index = 0

    return uploaded_files[current_question_index]


@app.post("/upload-pdf")
async def upload_pdf(pdf_file: Annotated[UploadFile, File(...)]):
    if pdf_file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed."}

    content = await pdf_file.read()

    pdf_reader = PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    uploaded_files.append({"filename": pdf_file.file.name, "text": text})
    return {"value": f"Successfully uploaded {pdf_file.filename}"}
