import { useState } from "react";

interface CalendarProps {
    onDateClick: (date: Date) => void;
}

export default function Calendar({ onDateClick }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        onDateClick(date);
    };

    const prevMonth = () => {
        setCurrentDate((prevDate) => {
            return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
        });
    };
    
    const nextMonth = () => {
        setCurrentDate((prevDate) => {
            return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
        });
    };

    const renderCalendar = () => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        const days = [];
        const blanks = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            blanks.push(<div key={`blank-${i}`} className="p-2" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentMonth, i);
            const isCurrentDay = currentDate.toDateString() === date.toDateString();
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

            days.push(
                <div
                    key={i}
                    onClick={() => handleDateClick(date)}
                    className={`cursor-pointer p-2 w-10 h-10 rounded-full hover:bg-gray-400 hover:text-white transition-colors ${
                        isCurrentDay ? 'bg-blue-500 text-white' : isSelected ? 'bg-blue-500 text-white' : ''
                    }`}
                >
                    {i}
                </div>
            );
        }

        return [...blanks, ...days];
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </h2>
                <div className="flex">
                    <svg onClick={prevMonth} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg onClick={nextMonth} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center bg-gray-200 rounded p-2 place-items-center">
                {renderCalendar()}
            </div>
        </div>
    );
}