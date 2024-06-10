import React, { useState } from "react";

interface CalendarProps {
    onDateClick: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const [selectedDate, setSelectedDate] = useState(currentDate.getDate());

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
            const classNames = `calendar-day ${isSelected ? "selected" : ""} ${isSelected ? "bg-blue-500 text-white" : "bg-white text-black"} hover:bg-blue-200 cursor-pointer`;
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
            <div className="calendar-header flex justify-between items-center mb-4">
                <button className="prev-month text-lg">&lt;</button>
                <h3 className="text-xl font-bold">{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h3>
                <button className="next-month text-lg">&gt;</button>
            </div>
            <div className="calendar-body">
                <div className="calendar-weekdays grid grid-cols-7 gap-2 mb-2">
                    <div className="text-center">Sun</div>
                    <div className="text-center">Mon</div>
                    <div className="text-center">Tue</div>
                    <div className="text-center">Wed</div>
                    <div className="text-center">Thu</div>
                    <div className="text-center">Fri</div>
                    <div className="text-center">Sat</div>
                </div>
                <div className="calendar-days grid grid-cols-7 gap-2">
                    {renderCalendar()}
                </div>
            </div>
        </div>
    );
};

export default Calendar;