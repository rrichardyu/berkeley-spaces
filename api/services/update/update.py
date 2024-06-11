from api.models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.services.update.room_update import update_classrooms
from api.services.update.schedule_update import update_room_schedules
from api.services.update.hours_update import update_room_hours

def update(session):
    update_classrooms(session)
    update_room_schedules(session)
    update_room_hours(session)