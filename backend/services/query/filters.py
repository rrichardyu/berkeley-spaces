from backend.models import Room, Schedule, Hours, Category, Feature, Building

def filters(session):
    buildings = session.query(Building).all()
    categories = session.query(Category).all()
    features = session.query(Feature).all()

    return {
        "buildings": [
            {
                "internal_name": building.internal_name,
                "display_name": building.display_name
            } for building in buildings],
        "categories": [category.name for category in categories],
        "features": [feature.name for feature in features]
    }