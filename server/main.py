from fastapi import FastAPI, UploadFile, File
from typing import Annotated
from questionmaker import question_maker, initialize_groq
import json
import random

app = FastAPI()

@app.get("/")
def read_root():
   return {"Hello": "World"}

@app.get("/ai/question")
async def get_question():
   try:
       with open("set.json", "r") as file:
           questions = json.load(file) or {}
       randIndex = random.randint(0, len(questions) - 1)
       randomQuestion = questions[randIndex]
       return randomQuestion
   except FileNotFoundError:
       return {}


@app.get("/ai/questions")
async def get_questions():
   try:
       with open("set.json", "r") as file:
           questions = json.load(file) or {}
       return questions
   except FileNotFoundError:
       return []


@app.post("/upload-pdf")
async def upload_pdf(uploaded_file: Annotated[UploadFile, File(...)]):
   print("Received file:", uploaded_file.filename)
   questions = question_maker(uploaded_file)

   return questions