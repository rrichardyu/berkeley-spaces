import { useState, useEffect, useRef } from "react";
import Calendar from "./Calendar";
import Dropdown from "./Dropdown";

function convertDateToString(dateObject: Date) {
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export default function Preferences({ availablePreferences, preferenceUpdate }) {
    const [start_t, setStartTime] = useState("")
    const [end_t, setEndTime] = useState("")
    const [date, setDate] = useState(convertDateToString(new Date()));
    const [buildings, setBuildings] = useState([])
    const [features, setFeatures] = useState([])
    const [categories, setCategories] = useState([])

    const prevFilterState = useRef({
        start_t: "",
        end_t: "",
        date: date,
        buildings: [],
        features: [],
        categories: [],
    });

    useEffect(() => {
        if (
            prevFilterState.current.start_t !== start_t ||
            prevFilterState.current.end_t !== end_t ||
            prevFilterState.current.date !== date ||
            prevFilterState.current.buildings !== buildings ||
            prevFilterState.current.features !== features ||
            prevFilterState.current.categories !== categories
        ) {
            preferenceUpdate({
                start_t,
                end_t,
                date,
                buildings,
                features,
                categories,
            });

            prevFilterState.current = {
                start_t,
                end_t,
                date,
                buildings,
                features,
                categories,
            };
        }
    }, [start_t, end_t, date, buildings, features, preferenceUpdate, categories]);

    const times = Array.from({ length: 24 }, (_, i) => {
        const hour = i % 12 || 12;
        const ampm = i < 12 ? "AM" : "PM";
        const displayValue = `${hour.toString()}:00 ${ampm}`;
        return { display_value: displayValue, internal_value: displayValue };
    });

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold">Preferences</h2>
            <div className="flex">
                <Dropdown dropdownText="Start" options={times.map(time => ({ display: time.display_value, value: time.internal_value }))} selectDropdownItem={setStartTime} />
                <div className="w-4"></div>
                <Dropdown dropdownText="End" options={times.map(time => ({ display: time.display_value, value: time.internal_value }))} selectDropdownItem={setEndTime} />
            </div>
            <Calendar onDateClick={setDate} />
            <Dropdown 
                dropdownText="Buildings" 
                allowMultipleSelect={true} 
                options={availablePreferences.buildings.map(building => ({ display: building.display_name, value: building.internal_name }))} 
                selectDropdownItem={setBuildings} 
            />
            <Dropdown 
                dropdownText="Features" 
                allowMultipleSelect={true} 
                options={availablePreferences.features.map(feature => ({ display: feature.display_name, value: feature.internal_name }))} 
                selectDropdownItem={setFeatures} 
            />
            <Dropdown 
                dropdownText="Categories" 
                allowMultipleSelect={true} 
                options={availablePreferences.categories.map(category => ({ display: category.display_name, value: category.internal_name }))} 
                selectDropdownItem={setCategories} 
            />
        </div>
    );
}