from typing import Annotated
from fastapi import BackgroundTasks, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from api import models
from api.database import engine, SessionLocal
from api.services.update.update import update
from api.services.query.query import query_room
from api.services.query.sequential_search import find_sequential_rooms
from api.services.query.search import search
from api.services.query.filters import filters

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/filters")
def get_filters(db: Session = Depends(get_db)):
    return filters(db)

@app.get("/rooms")
def get_rooms(
    start_t: str = None, 
    end_t: str = None, 
    date: str = None,
    buildings: Annotated[list[str] | None, Query()] = None, 
    categories: Annotated[list[str] | None, Query()] = None, 
    features: Annotated[list[str] | None, Query()] = None, 
    status: str = None,
    db: Session = Depends(get_db)
):
    print(start_t, end_t, date, buildings, categories, features, status)
    return search(db, start_t=start_t, end_t=end_t, date=date, buildings=buildings, categories=categories, features=features, status=status)

@app.get("/rooms/{room_id}")
def get_room_data(room_id: str = None, db: Session = Depends(get_db)):
    return query_room(db, room_id)

@app.get("/sequential_rooms")
def get_sequential_rooms(
    start_t: str, 
    end_t: str, 
    date: str = None,
    buildings: Annotated[list[str] | None, Query()] = None,
    categories: Annotated[list[str] | None, Query()] = None,
    features: Annotated[list[str] | None, Query()] = None,
    db: Session = Depends(get_db),
):
    output = find_sequential_rooms(db, start_t, end_t, date=date, buildings=buildings, categories=categories, features=features)
    return output if output else []

def update_data_background(db: Session):
    update(db)

@app.post("/update_data")
def update_data(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(update_data_background, db)
    return {"message": "Data update scheduled"}