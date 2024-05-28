import requests
import pandas as pd

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
        'obj_cache_accl': '1',
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

def update_classrooms(sql_engine, table_name):
    data = fetch_rooms()
    collected = []

    for i in range(data["rows"][0]["count"]):
        room_data = data["rows"][i]["row"]
        room_id, room_name_internal = room_data[0]["itemId"], room_data[0]["itemName"]
        room_name_display, room_categories, room_features, room_capacity = room_data[1], room_data[2], room_data[3], room_data[5]
        building_name_internal, room_number = room_name_internal[:4], room_name_internal[4:]

        collected.append({
            "room_id": room_id, 
            "room_name_internal": room_name_internal,
            "building_name_internal": building_name_internal, 
            "room_number": room_number,  
            "room_name_display": room_name_display, 
            "room_categories": room_categories, 
            "room_features": room_features
        })

    df = pd.DataFrame(collected)

    df.to_sql(table_name, sql_engine, index=False, if_exists="replace")