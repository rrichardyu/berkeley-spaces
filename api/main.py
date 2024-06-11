from typing import Annotated
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from api.services.query.query import query_room
from api.services.query.sequential_search import find_sequential_rooms
from api.services.query.search import search
from api.services.query.filters import filters
from sqlalchemy.orm import sessionmaker

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

engine = create_engine("postgresql://postgres:cal@db:5432/postgres")
Session = sessionmaker(bind=engine)
session = Session()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/filters")
async def get_filters():
    return filters(session)

@app.get("/rooms")
async def get_rooms(
    start_t: str = None, 
    end_t: str = None, 
    date: str = None,
    buildings: Annotated[list[str] | None, Query()] = None, 
    categories: Annotated[list[str] | None, Query()] = None, 
    features: Annotated[list[str] | None, Query()] = None, 
    status: str = None
):
    print(start_t, end_t, date, buildings, categories, features, status)
    return search(session, start_t=start_t, end_t=end_t, date=date, buildings=buildings, categories=categories, features=features, status=status)

@app.get("/rooms/{room_id}")
async def get_room_data(room_id: int):
    return query_room(session, room_id)

@app.get("/sequential_rooms")
async def get_sequential_rooms(
    start_t: str, 
    end_t: str, 
    date: str = None,
    buildings: Annotated[list[str] | None, Query()] = None,
    categories: Annotated[list[str] | None, Query()] = None,
    features: Annotated[list[str] | None, Query()] = None
):
    output = find_sequential_rooms(session, start_t, end_t, date=date, buildings=buildings, categories=categories, features=features)
    return output if output else []