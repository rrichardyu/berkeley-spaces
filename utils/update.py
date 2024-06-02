import sqlalchemy
from room_update import update_classrooms
from schedule_update import update_room_schedules
from hours_update import update_room_hours

db_engine = sqlalchemy.create_engine("postgresql://postgres:cal@localhost:5432")

rooms_df = update_classrooms(db_engine, "rooms")
schedule_df = update_room_schedules(db_engine, "schedule")
hours_df = update_room_hours(db_engine, "hours")