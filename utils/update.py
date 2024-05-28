import sqlalchemy
from room_update import update_classrooms
from schedule_update import update_room_schedules

db_engine = sqlalchemy.create_engine("postgresql://postgres:cal@localhost:5432")

update_classrooms(db_engine, "rooms")
update_room_schedules(db_engine, "schedule")