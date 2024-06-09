from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from backend.services.query.query import query_room
from backend.services.query.sequential_search import find_sequential_rooms
from backend.services.query.search import search
from sqlalchemy.orm import sessionmaker

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine("postgresql://postgres:cal@localhost:5432")
Session = sessionmaker(bind=engine)
session = Session()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/filters")
async def get_filters():
    pass

@app.get("/rooms")
async def get_rooms(start_t: str = None, end_t: str = None, buildings: str = None, categories: str = None, features: str = None, status: str = None):
    return search(session, start_t=start_t, end_t=end_t, buildings=buildings, categories=categories, features=features, status=status)

@app.get("/rooms/{room_id}")
async def get_room_data(room_id: int):
    return query_room(session, room_id)