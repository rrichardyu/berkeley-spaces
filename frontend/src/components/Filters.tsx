import { useState, useEffect, useRef } from "react";
import Calendar from "./Calendar";
import Dropdown from "./Dropdown";

export default function Filters({ availableFilters, filterUpdate }) {
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [date, setDate] = useState(new Date())
    const [buildings, setBuildings] = useState([])
    const [features, setFeatures] = useState([])
    const [categories, setCategories] = useState([])
    const [status, setStatus] = useState("")

    // const uniqueBuildings = [...new Set(data.map(obj => obj.room_name_display.split(",")[0]))].sort();
    // const uniqueStatuses = [...new Set(data.map(obj => obj.reservation_status))];

    const prevFilterState = useRef({
        startTime: "",
        endTime: "",
        date: new Date(),
        buildings: [],
        features: [],
        categories: [],
        status: ""
    });

    useEffect(() => {
        if (
            prevFilterState.current.startTime !== startTime ||
            prevFilterState.current.endTime !== endTime ||
            prevFilterState.current.date !== date ||
            prevFilterState.current.buildings !== buildings ||
            prevFilterState.current.features !== features ||
            prevFilterState.current.categories !== categories ||
            prevFilterState.current.status !== status
        ) {
            filterUpdate({
                startTime,
                endTime,
                date,
                buildings,
                features,
                categories,
                status
            });

            prevFilterState.current = {
                startTime,
                endTime,
                date,
                buildings,
                features,
                categories,
                status
            };
        }
    }, [startTime, endTime, date, buildings, features, status, filterUpdate, categories]);

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold">Filters</h2>
            <div className="flex">
                <Dropdown dropdownText="Start" options={[]} selectDropdownItem={setStartTime} />
                <div className="w-4"></div>
                <Dropdown dropdownText="End" options={[]} selectDropdownItem={setEndTime} />
            </div>
            <Calendar onDateClick={setDate} />
            <Dropdown dropdownText="Buildings" allowMultipleSelect={true} options={availableFilters.buildings.map(building => building.display_name)} selectDropdownItem={setBuildings} />
            <Dropdown dropdownText="Features" allowMultipleSelect={true} options={availableFilters.features} selectDropdownItem={setFeatures} />
            <Dropdown dropdownText="Categories" allowMultipleSelect={true} options={availableFilters.categories} selectDropdownItem={setCategories} />
            <Dropdown dropdownText="Status" options={["Unreserved", "Reserved", "Closed"]} selectDropdownItem={setStatus} />
        </div>
    );
}