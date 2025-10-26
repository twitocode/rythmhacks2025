from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import Annotated, Dict
from questionmaker import question_maker
import json
import random
from datetime import datetime, timedelta

app = FastAPI()


def update_sm2(quality: int, n: int, ef: float, interval: int) -> Dict:
    """
    Implements the SM-2 algorithm to update flashcard review parameters.
    This function still uses the original 0-5 quality scale.
    """
    if quality < 3:
        n = 1
        interval = 1
    else:
        n += 1
        if n == 1:
            interval = 1
        elif n == 2:
            interval = 6
        else:
            interval = round(interval * ef)

        ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        if ef < 1.3:
            ef = 1.3

    return {"n": n, "ef": ef, "interval": interval}


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/ai/question")
async def get_question():
    """
    Gets a question that is due for review.
    If no questions are due, it returns a new question.
    """
    try:
        with open("set.json", "r") as file:
            questions = json.load(file) or []
    except (FileNotFoundError, json.JSONDecodeError):
        return {
            "message": "No questions found. Please upload a PDF to generate flashcards."
        }

    if not questions:
        return {
            "message": "No questions found. Please upload a PDF to generate flashcards."
        }

    today = datetime.now().date()

    due_questions = [
        q
        for q in questions
        if "due_date" in q
        and datetime.strptime(q["due_date"], "%Y-%m-%d").date() <= today
    ]

    if due_questions:
        return random.choice(due_questions)

    new_questions = [q for q in questions if q.get("n") == 0]
    if new_questions:
        return random.choice(new_questions)

    return {"message": "No questions are currently due for review."}


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
    flashcards_list = question_maker(uploaded_file)

    # Initialize SM-2 parameters for each new card
    for card in flashcards_list:
        card["n"] = 0
        card["ef"] = 2.5
        card["interval"] = 0
        card["due_date"] = datetime.now().strftime("%Y-%m-%d")

    with open("set.json", "w") as f:
        json.dump(flashcards_list, f, indent=4)
    print("Questions saved to set.json")

    return {
        "message": "Questions generated and saved successfully!",
        "filename": uploaded_file.filename,
    }


@app.post("/ai/question/review")
async def review_question(question: str, quality: int):
    """
    Reviews a question and updates its SM-2 parameters.
    `quality` should be an integer from 1 to 3:
    - 1: Hard (Incorrect or recalled with great difficulty)
    - 2: Good (Recalled correctly, but with some hesitation)
    - 3: Easy (Recalled perfectly)
    """
    if not (1 <= quality <= 3):
        raise HTTPException(
            status_code=400, detail="Quality must be an integer between 1 and 3."
        )

    # Map the simplified 1-3 scale to the SM-2 algorithm's 0-5 scale
    quality_map = {
        1: 2,  # Hard -> incorrect response, but the correct one seemed easy to recall
        2: 4,  # Good -> correct response after a hesitation
        3: 5,  # Easy -> perfect response
    }
    sm2_quality = quality_map[quality]
    question = question + "?"

    try:
        with open("set.json", "r") as file:
            questions = json.load(file) or []
    except (FileNotFoundError, json.JSONDecodeError):
        raise HTTPException(status_code=404, detail="Question set not found.")

    question_to_update = None
    for i, q in enumerate(questions):
        if q["Question"] == question:
            print("question is the same")
            n = q.get("n", 0)
            ef = q.get("ef", 2.5)
            interval = q.get("interval", 0)

            # The update_sm2 function is called with the mapped quality score
            updated_params = update_sm2(sm2_quality, n, ef, interval)
            questions[i].update(updated_params)

            new_due_date = datetime.now() + timedelta(days=updated_params["interval"])
            questions[i]["due_date"] = new_due_date.strftime("%Y-%m-%d")
            question_to_update = questions[i]
            break

    if not question_to_update:
        raise HTTPException(status_code=404, detail="Question not found.")

    with open("set.json", "w") as f:
        json.dump(questions, f, indent=4)

    return {
        "message": "Question review updated successfully!",
        "updated_question": question_to_update,
    }
