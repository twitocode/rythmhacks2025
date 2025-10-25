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


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/ai/question")
def get_question(item_id: int, q: Union[str, None] = None):
    return {"question": question, "q": "hey there"}


@app.post("/upload-pdf/")
async def upload_pdf(pdf_file: Annotated[UploadFile, File(...)]):
    if pdf_file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed."}

    content = await pdf_file.read()

    pdf_reader = PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()

    return {"filename": pdf_file.filename, "extracted_text": text}
