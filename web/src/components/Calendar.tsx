import React, { useState } from "react";

interface CalendarProps {
    onDateClick: React.Dispatch<React.SetStateAction<string>>;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick }) => {
    const currentDate = new Date();
    // const currentMonth = currentDate.getMonth();
    // const currentYear = currentDate.getFullYear();
    const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };
    
    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handleDateClick = (date: number) => {
        setSelectedDate(date);
        const selectedDateObj = new Date(currentYear, currentMonth, date);
        const formattedDate = selectedDateObj.toISOString().split("T")[0];
        onDateClick(formattedDate);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
        const calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add cells for each day in the month
        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = i === selectedDate && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
            const classNames = `calendar-day ${isSelected ? "bg-blue-500 text-white" : "text-black"} p-2 w-10 h-10 rounded-full hover:bg-gray-400 hover:text-white transition-colors cursor-pointer`;
            calendarDays.push(
                <div key={i} className={classNames} onClick={() => handleDateClick(i)}>
                    {i}
                </div>
            );
        }

        return calendarDays;
    };

    return (
        <div className="calendar">
            <div className="calendar-header flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </h2>
                <div className="flex">
                    <svg onClick={handlePreviousMonth} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <svg onClick={handleNextMonth} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
            <div className="calendar-body">
                <div className="calendar-days grid grid-cols-7 gap-1 text-center bg-gray-200 rounded p-2 place-items-center">
                    {renderCalendar()}
                </div>
            </div>
        </div>
    );
};

export default Calendar;