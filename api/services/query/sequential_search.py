from datetime import datetime, timedelta
from queue import Queue
import random

from api.services.query.search import search

def subtract_singular_time_range(start1: datetime, end1: datetime, start2: datetime, end2: datetime) -> list[tuple[datetime, datetime]]:
    result = []
    
    if start1 < start2:
        result.append((start1, min(end1, start2 - timedelta(minutes=1))))
    
    if end1 > end2:
        result.append((max(start1, end2 + timedelta(minutes=1)), end1))
    
    return [(start, end) for start, end in result]

def subtract_multiple_time_ranges(primary_start: datetime, primary_end: datetime, sub_ranges: list[tuple[datetime, datetime]]):
    def subtract_single_range(start1, end1, start2, end2):
        if start1 >= end2 or end1 <= start2:
            return [(start1, end1)]
        
        result = []

        if start1 < start2: 
            result.append((start1, start2 - timedelta(minutes=1)))
        
        if end1 > end2:
            result.append((end2 + timedelta(minutes=1), end1))
        
        return result

    current_ranges = [(primary_start, primary_end)]
    
    for sub_start, sub_end in sub_ranges:
        new_ranges = []

        for start, end in current_ranges:
            new_ranges.extend(subtract_single_range(start, end, sub_start, sub_end))
        
        current_ranges = new_ranges
    
    return [(start, end) for start, end in current_ranges]

def find_sequential_rooms(session, start_time: str, end_time: str, date: str = None, buildings: list[str] = None, categories: list[str] = None, features: list[str] = None) -> list[tuple[datetime, datetime, dict]] | None:
    custom_search = lambda start_time, end_time: search(
        session, 
        start_t=start_time, 
        end_t=end_time, 
        date=date if date else None,
        status="Unreserved", 
        buildings=buildings, 
        categories=categories, 
        features=features
    )

    def scan_helper(start_time: str, end_time: str):
        scan_start_time, scan_end_time = start_time, end_time
        time_diff = end_time - start_time
        print(f"No rooms available for the given time range {start_time} - {end_time}")
        reduced_time_diff = time_diff - timedelta(hours=1)
        print(f"Reducing search range by 1 hour")

        while reduced_time_diff >= timedelta(hours=1) - timedelta(minutes=1):
            scan_start_time = start_time
            scan_end_time = scan_start_time + reduced_time_diff

            while scan_end_time.time() <= end_time.time():
                print(f"Searching for rooms available between {scan_start_time} and {scan_end_time}")
                scan_result = custom_search(scan_start_time.time(), scan_end_time.time())
                if scan_result:
                    print(f"Found available room for the given time range {scan_start_time} - {scan_end_time}")

                    return (scan_start_time, scan_end_time, random.choice(scan_result)), scan_start_time, scan_end_time
                else:
                    scan_start_time += timedelta(hours=1)
                    if scan_end_time + timedelta(hours=1) <= end_time:
                        scan_end_time += timedelta(hours=1)
                    else:
                        break

            print(f"Reducing search range by 1 hour")
            reduced_time_diff -= timedelta(hours=1)

        return None, scan_start_time, scan_end_time

    output = []
    queue = Queue()

    # start_time = datetime.strptime(str(start_time), '%Y-%m-%d %H:%M:%S')
    # end_time = datetime.strptime(str(end_time), '%Y-%m-%d %H:%M:%S')
    start_time = datetime.strptime(start_time.strip(), '%I:%M %p')
    end_time = (datetime.strptime(end_time.strip(), '%I:%M %p') - timedelta(minutes=1))

    queue.put((start_time, end_time))

    while not queue.empty():
        curr_start_time, curr_end_time = queue.get()
        global_result = custom_search(curr_start_time.time(), curr_end_time.time())

        if global_result:
            print(f"Found available room for the given time range {curr_start_time} - {curr_end_time}")
            
            output.append((curr_start_time, curr_end_time, random.choice(global_result)))
        else:
            scan_result, curr_start_time, curr_end_time = scan_helper(curr_start_time, curr_end_time)

            if scan_result:
                output.append(scan_result)
            else:
                print("No matching found")
                return
            
            ranges = subtract_multiple_time_ranges(start_time, end_time, [(start_found, end_found) for start_found, end_found, _ in output])
            for start, end in ranges:
                queue.put((start, end))

        output.sort(key=lambda x: x[0])

        if output[0][0] == start_time:
            valid = True
            for i in range(1, len(output)):
                if output[i][0] != output[i-1][1] + timedelta(minutes=1):
                    valid = False
            if valid and output[-1][1] == end_time:
                return [{
                    "start_t": start_t,
                    "end_t": end_t,
                    "room": room
                } for start_t, end_t, room in output]
            
        print(queue.queue)
            
    print("No matching found")
    return