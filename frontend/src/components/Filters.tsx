import { useState } from "react";
import Calendar from "./Calendar";
import Dropdown from "./Dropdown";

export default function Filters() {
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [date, setDate] = useState(new Date())
    const [buildings, setBuildings] = useState("")
    const [features, setFeatures] = useState("")
    const [type, setType] = useState("")
    const [status, setStatus] = useState("")

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold">Filters</h2>
            <div className="flex">
                <Dropdown dropdownText="Start" options={["Test"]} selectDropdownItem={setStartTime} />
                <div className="w-4"></div>
                <Dropdown dropdownText="End" options={["Test"]} selectDropdownItem={setEndTime} />
            </div>
            <Calendar onDateClick={setDate} />
            <Dropdown dropdownText="Buildings" options={[]} selectDropdownItem={setBuildings} />
            <Dropdown dropdownText="Features" options={[]} selectDropdownItem={setFeatures} />
            <Dropdown dropdownText="Type" options={[]} selectDropdownItem={setType} />
            <Dropdown dropdownText="Status" options={[]} selectDropdownItem={setStatus}  />
        </div>
    );
}