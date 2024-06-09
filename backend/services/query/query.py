import sqlalchemy
from sqlalchemy.orm import sessionmaker, aliased
from datetime import datetime

from backend.models import Room, Schedule, Hours, Feature, RoomFeature

def query_room(session, room_id):
    try:
        room = session.query(Room).filter(Room.id == room_id).all()[0].__dict__
        features = session.query(Feature).join(RoomFeature).filter(RoomFeature.room_id == room_id).all()

        features_formatted = []
        for feature in features:
            feature = feature.name
            if "Board" in feature:
                if "Chalk" in feature:
                    features_formatted.append("Chalkboard")
                elif "White" in feature:
                    features_formatted.append("Whiteboard")
            elif "Seating-Movable" in feature:
                features_formatted.append("Movable Seating")
            elif "Window" in feature:
                if "None" in feature:
                    features_formatted.append("No Windows")
                else:
                    features_formatted.append("Windows")
            elif "Projector" in feature:
                features_formatted.append("Projector")

        room["room_features"] = features_formatted

        reservations = session.query(Schedule).filter(Schedule.room_id == room_id).all()
        room["schedule"] = reservations

        return room
    finally:
        session.close()