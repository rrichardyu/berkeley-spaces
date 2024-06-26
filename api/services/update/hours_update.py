import requests
from datetime import datetime
from api.models import Room, Hours
from sqlalchemy.exc import SQLAlchemyError

def fetch_room_hours(room_id):
    headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'origin': 'https://25live.collegenet.com',
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
        'request_method': 'get',
        'caller': 'pro-SpaceService.getSpacesIncludes',
    }

    json_data = {
        'mapxml': {
            'space_id': room_id,
            'scope': 'extended',
            'include': 'hours',
        },
    }

    response = requests.post(
        'https://25live.collegenet.com/25live/data/berkeley/run/spaces.json',
        params=params,
        headers=headers,
        json=json_data,
    )

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Request failed with status code {response.status_code}")

def update_room_hours(session):
    room_ids_raw = session.query(Room.id).all()
    room_ids = [room_id for (room_id,) in room_ids_raw]

    for room_id in room_ids:
        data = fetch_room_hours(room_id)
        hours_data = data["spaces"]["space"]["hours"]

        existing_room = session.get(Room, room_id)

        for weekday in hours_data:
            day_id, day_name, room_open_time, room_close_time = weekday["day_id"], weekday["day_name"], weekday["open"], weekday["close"]

            hours_entry = Hours(
                day_id=day_id,
                day_name=day_name,
                open_t=datetime.strptime(room_open_time, '%H:%M:%S').time(),
                close_t=datetime.strptime(room_close_time, '%H:%M:%S').time(),
                room=existing_room
            )
            session.add(hours_entry)

        print(f"Processed room hours {room_id}")

    try:
        session.commit()
        print("Room hours updated")
    except SQLAlchemyError as e:
        session.rollback()
        print("Failed to add new rooms:", str(e))