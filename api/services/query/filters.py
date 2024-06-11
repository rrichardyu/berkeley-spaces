from api.models import Room, Schedule, Hours, Category, Feature, Building

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
        "categories": sorted([
            {
                "internal_name": category.name,
                "display_name": category.name,
            } for category in categories], key = lambda x: x["display_name"]),
        "features": sorted([
            {
                "internal_name": feature.name,
                "display_name": format_feature(feature.name)
            } for feature in features], key = lambda x: x["display_name"])
    }

def format_feature(feature):
    if "Board" in feature:
        if "Chalk" in feature:
            return "Chalkboard"
        elif "White" in feature:
            return "Whiteboard"
    elif "Seating-Movable" in feature:
        return "Movable Seating"
    elif "Window" in feature:
        if "None" in feature:
            return "No Windows"
        else:
            return "Windows"
    elif "Projector" in feature:
        return "Projector"
    
    return feature