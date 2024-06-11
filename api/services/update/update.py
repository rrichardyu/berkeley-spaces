from api.models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from room_update import update_classrooms
from schedule_update import update_room_schedules
from hours_update import update_room_hours

db_engine = create_engine("postgresql://postgres:cal@localhost:5432")
Base.metadata.create_all(db_engine)

Session = sessionmaker(bind=db_engine)
session = Session()

update_classrooms(session)
update_room_schedules(session)
update_room_hours(session)