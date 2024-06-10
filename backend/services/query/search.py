from sqlalchemy import and_, case, or_
from datetime import datetime, timedelta
from sqlalchemy import func
from backend.models import Room, Schedule, Hours, Category, Feature, Building

def search(session, start_t=None, end_t=None, date=None, buildings=None, categories=None, features=None, status=None):
    today_day_id = datetime.now().isoweekday()
    current_time = func.current_time()
    current_date = func.current_date()

    if date:
        current_date = datetime.strptime(date, '%Y-%m-%d').date()

    if start_t and end_t:
        if type(start_t) == str and type(end_t) == str:
            start_t = datetime.strptime(start_t.strip(), '%I:%M %p').time()
            end_t = (datetime.strptime(end_t.strip(), '%I:%M %p') - timedelta(minutes=1)).time()

    query = session.query(Room)

    if buildings:
        query = query.join(Room.building).filter(Building.internal_name.in_(buildings))
    
    if categories:
        query = query.join(Room.categories).filter(Category.name.in_(categories))
    
    if features:
        query = query.join(Room.features).filter(Feature.name.in_(features))

    if start_t and end_t:
        # wrt to start_t and end_t
        open_rooms_cte = (
            query.add_columns(
                case(
                    (Hours.open_t == None, 'Closed'),
                    (and_(
                        Hours.open_t <= start_t,
                        Hours.close_t >= end_t
                    ), 'Open'),
                    else_='Closed'
                ).label('status')
            )
            .outerjoin(Hours, and_(Room.id == Hours.room_id, Hours.day_id == today_day_id))
            .cte('OpenRooms')
        )

        reserved_rooms_cte = session.query(
                open_rooms_cte.c.id,
                open_rooms_cte.c.display_name,
                case(
                    (open_rooms_cte.c.status == 'Closed', 'Closed'),
                    (Schedule.event_id == None, 'Unreserved'),
                    else_='Reserved'
                ).label('reservation_status')
            ).outerjoin(Schedule, and_(
                open_rooms_cte.c.id == Schedule.room_id,
                Schedule.event_date == current_date,
                or_(
                    and_(
                        Schedule.start_t >= start_t,
                        Schedule.end_t <= end_t
                        ),
                    and_(
                        Schedule.start_t <= start_t,
                        Schedule.end_t >= start_t
                    ),
                    and_(
                        Schedule.start_t <= end_t,
                        Schedule.end_t >= end_t
                    )
                )
            )).distinct().cte('ReservedRooms')

    else:
        # use current time
        open_rooms_cte = (
            query.add_columns(
                case(
                    (Hours.open_t == None, 'Closed'),
                    (current_time.between(Hours.open_t, Hours.close_t), 'Open'),
                    else_='Closed'
                ).label('status')
            )
            .outerjoin(Hours, and_(Room.id == Hours.room_id, Hours.day_id == today_day_id))
            .cte('OpenRooms')
        )

        reserved_rooms_cte = session.query(
                open_rooms_cte.c.id,
                open_rooms_cte.c.display_name,
                case(
                    (open_rooms_cte.c.status == 'Closed', 'Closed'),
                    (Schedule.event_id == None, 'Unreserved'),
                    else_='Reserved'
                ).label('reservation_status')
            ).outerjoin(Schedule, and_(
                open_rooms_cte.c.id == Schedule.room_id,
                Schedule.event_date == current_date,
                current_time.between(Schedule.start_t, Schedule.end_t)
            )).cte('ReservedRooms')


    query = session.query(reserved_rooms_cte)

    if status:
        query = query.filter(reserved_rooms_cte.c.reservation_status == status)

    results = query.all()
    results.sort(key=lambda x: x.id)

    # for r in results:
    #     print(f"{r.id} | {r.display_name} | {r.reservation_status}")

    # print(f"Found {len(results)} entries")

    # print(reserved_rooms_cte.compile(engine, compile_kwargs={"literal_binds": True}))

    return [result._mapping for result in results]