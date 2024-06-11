import { useEffect, useState } from "react";
import PreferencesSidebar from "../components/PreferencesSidebar";
import type { Preferences } from "../types/Types";
import SchedulerResult from "../components/SchedulerResult";
import { RoomSchedulerResult } from "../types/Types";

export default function Scheduler() {
    const [preferences, setPreferences] = useState<Preferences>({
        start_t: [],
        end_t: [],
        date: "",
        buildings: [],
        features: [],
        categories: []
    });
    const [availablePreferences, setAvailablePreferences] = useState({
        start_t: [],
        end_t: [],
        date: "",
        buildings: [],
        features: [],
        categories: []
    });
    const [preferencesLoaded, setPreferencesLoaded] = useState(false);

    const [sequentialSearchData, setSequentialSearchData] = useState<RoomSchedulerResult[]>([]);
    const [sequentialSearchDataLoaded, setSequentialSearchDataLoaded] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8000/filters")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setAvailablePreferences(data);
                setPreferencesLoaded(true);
            })
            .catch(err => console.error(err));
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams();

                for (const key in preferences) {
                    if (Array.isArray(preferences[key])) {
                        (preferences[key] as string[]).forEach(value => params.append(key, value));
                    } else {
                        params.append(key, (preferences[key] as string));
                    }
                }

                const queryParamsString = params.toString();
                const response = await fetch(`http://localhost:8000/sequential_rooms?${queryParamsString}`);
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                const result = await response.json();
                setSequentialSearchData(result);
                setSequentialSearchDataLoaded(true);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchData();
    }, [preferences])

    const handlePreferenceUpdate = (preferences: Preferences) => {
        setPreferences(preferences)
        console.log(preferences)
    }
    
    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/4 p-4 border-r">
                    { preferencesLoaded ?
                        <PreferencesSidebar availablePreferences={availablePreferences} preferenceUpdate={handlePreferenceUpdate} />
                        : <></>
                    }
                </div>
                <div>
                    { sequentialSearchDataLoaded ? <SchedulerResult rooms={sequentialSearchData} /> : <></>}
                </div>
            </div>
        </>
    )
}