import requests
from datetime import datetime, timedelta
import pandas as pd

def get_one_month_interval():
    date_interval = [datetime.now() - timedelta(days=30), datetime.now() + timedelta(days=30)]
    for i in range(len(date_interval)):
        nearest_sunday = (6 - date_interval[i].weekday()) % 7
        date_interval[i] = (date_interval[i] + timedelta(days=nearest_sunday)).date().strftime("%Y-%m-%d")
    return date_interval

def fetch_room_schedule(room_id, start_date, end_date):
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
        'mode': 'pro',
        'obj_cache_accl': '0',
        'start_dt': start_date,
        'end_dt': end_date,
        'comptype': 'cal_location',
        'sort': 'evdates_event_name',
        'compsubject': 'location',
        'space_id': room_id,
        'caller': 'pro-CalendarService.getData',
    }

    response = requests.get(
        'https://25live.collegenet.com/25live/data/berkeley/run/home/calendar/calendardata.json',
        params=params,
        headers=headers,
    )

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Request failed with status code {response.status_code}")

def update_room_schedules(sql_engine, table_name):
    start_date, end_date = get_one_month_interval()
    rooms_df = pd.read_sql("rooms", sql_engine)
    room_ids = rooms_df["room_id"]
    schedule_df = pd.DataFrame()

    for room_id in room_ids:
        data = fetch_room_schedule(room_id, start_date, end_date)
        all_dates = data["root"]["events"]
        reserved_dates = [all_dates[i] for i in range(len(all_dates)) if "rsrv" in all_dates[i].keys()]
        collected = []

        for date_data in reserved_dates:
            date = date_data["date"]
            reservations = date_data["rsrv"]

            for reservation in reservations:
                collected.append({
                    "room_id": room_id,
                    "event_id": reservation["event_id"],
                    "event_name": reservation["event_name"],
                    "start_dt": datetime.fromisoformat(reservation["rsrv_start_dt"]),
                    "end_dt": datetime.fromisoformat(reservation["rsrv_end_dt"]),
                })

            schedule_df = pd.concat([schedule_df, pd.DataFrame(collected)], ignore_index=True)

        print(f"Processed room {room_id}")

    schedule_df.to_sql(table_name, sql_engine, index=False, if_exists="replace")