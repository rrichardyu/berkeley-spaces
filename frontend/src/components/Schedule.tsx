import { useState } from "react";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

interface HourlyScheduleProps {
  events: Event[];
}

export default function Schedule({ events }: HourlyScheduleProps) {
    const [date, setDate] = useState(new Date());

    const handlePrevDay = () => {
        const prevDay = new Date(date);
        prevDay.setDate(date.getDate() - 1);
        setDate(prevDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        setDate(nextDay);
    };

    const renderHourRows = () => {
        const rows = [];
        for (let i = 0; i < 24; i++) {
          const hour = i < 12 ? `${i === 0 ? 12 : i}:00 AM` : `${i === 12 ? i : i - 12}:00 PM`;
          rows.push(
            <div key={i} className="grid grid-cols-2 gap-4 border-b border-gray-200">
              <div className="text-right">{hour}</div>
              <div className="">{renderEventsForHour(i)}</div>
            </div>
          );
        }
        return rows;
      };
    
      // Function to render events for a specific hour
      const renderEventsForHour = (hour: number) => {
        return events
          .filter(event => event.startHour <= hour && event.endHour > hour)
          .map(event => (
            <div key={event.id} className="bg-blue-200 p-2 mb-1 rounded">
              {event.title}
            </div>
          ));
      };
    
      return (
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <div className="flex items-center justify-between mb-4">
                <h2>{date.toDateString()}</h2>
                <div className="flex">
                    <svg onClick={handlePrevDay} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg onClick={handleNextDay} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
            {/* Left side with hours */}
            {renderHourRows()}
          </div>
          <div className="col-span-2">
            {/* Right side for events */}
            {/* You can add some controls to add events here */}
          </div>
        </div>
      );
}
