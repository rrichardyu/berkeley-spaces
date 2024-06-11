from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from api.database import Base

class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True)
    display_name = Column(String)
    internal_name = Column(String)

    rooms = relationship("Room", back_populates="building", passive_deletes=True)

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True)
    display_name = Column(String)
    number = Column(String)
    capacity = Column(Integer)

    building_id = Column(Integer, ForeignKey("buildings.id", ondelete="CASCADE"))
    building = relationship("Building", back_populates="rooms")

    schedule = relationship("Schedule", back_populates="room", passive_deletes=True)
    hours = relationship("Hours", back_populates="room", passive_deletes=True)
    categories = relationship("Category", secondary="room_categories", back_populates="rooms", passive_deletes=True)
    features = relationship("Feature", secondary="room_features", back_populates="rooms", passive_deletes=True)

    def get_status(self):
        now = datetime.now()
        current_day = now.strftime('%A').lower()
        current_time = now.time()

        # Check if the room is open
        for hour in self.hours:
            if hour.day_name.lower() == current_day:
                if hour.open_t <= current_time <= hour.close_t:
                    # The room is open, check if it is reserved
                    for schedule in self.schedule:
                        if schedule.event_date == now.date() and schedule.start_t <= current_time <= schedule.end_t:
                            return "reserved"
                    return "unreserved"
        return "closed"

class Schedule(Base):
    __tablename__ = "schedule"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)
    event_name = Column(String)
    event_date = Column(Date)
    day_id = Column(Integer)
    start_t = Column(Time)
    end_t = Column(Time)

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"))
    room = relationship("Room", back_populates="schedule")

class Hours(Base):
    __tablename__ = "hours"

    id = Column(Integer, primary_key=True)
    day_id = Column(Integer)
    day_name = Column(String)
    open_t = Column(Time)
    close_t = Column(Time)

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"))
    room = relationship("Room", back_populates="hours")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    rooms = relationship("Room", secondary="room_categories", back_populates="categories", passive_deletes=True)

class RoomCategory(Base):
    __tablename__ = "room_categories"

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True)

class Feature(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True)
    name = Column(String)

    rooms = relationship("Room", secondary="room_features", back_populates="features", passive_deletes=True)

class RoomFeature(Base):
    __tablename__ = "room_features"

    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), primary_key=True)
    feature_id = Column(Integer, ForeignKey("features.id", ondelete="CASCADE"), primary_key=True)
