import requests
from api.models import Room, Building, Category, Feature
from sqlalchemy.exc import SQLAlchemyError

def fetch_rooms():
    headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'priority': 'u=1, i',
        'referer': 'https://25live.collegenet.com/pro/berkeley',
        'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    }

    params = {
        'compsubject': 'location',
        'page': '1',
        'page_size': '250',
        'obj_cache_accl': '0',
        'query_id': '2195',
        'caller': 'pro-ListService.getData',
    }

    response = requests.get(
        'https://25live.collegenet.com/25live/data/berkeley/run/list/listdata.json',
        params=params,
        headers=headers,
    )

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Request failed with status code {response.status_code}")

def update_classrooms(session):
    data = fetch_rooms()

    for i in range(data["rows"][0]["count"]):
        room_data = data["rows"][i]["row"]
        room_id, room_name_internal = room_data[0]["itemId"], room_data[0]["itemName"]
        room_name_display, room_categories, room_features, room_capacity = room_data[1], room_data[2], room_data[3], room_data[5]
        building_name_internal, room_number = room_name_internal[:4], room_name_internal[4:]

        building_name = room_name_display.split(", ")[0]
        existing_building = session.query(Building).filter_by(display_name=building_name).first()

        categories = []
        for category_name in room_categories.split(", "):
            existing_category = session.query(Category).filter_by(name=category_name).first()
            if existing_category:
                categories.append(existing_category)
            else:
                new_category = Category(name=category_name)
                categories.append(new_category)

        features = []
        for feature_name in room_features.split(", "):
            existing_feature = session.query(Feature).filter_by(name=feature_name).first()
            if existing_feature:
                features.append(existing_feature)
            else:
                new_feature = Feature(name=feature_name)
                features.append(new_feature)

        if existing_building:
            new_building = existing_building
        else:
            new_building = Building(display_name=building_name, internal_name=building_name_internal)

        new_room = Room(
            id = room_id,
            display_name=room_name_display, 
            number=room_number, 
            capacity=room_capacity,
            building=new_building,
            categories=categories,
            features=features
        )
        
        session.add(new_room)
        
    try:
        session.commit()
        print("Room data updated")
    except SQLAlchemyError as e:
        session.rollback()
        print("Failed to add new rooms:", str(e))

    session.close()