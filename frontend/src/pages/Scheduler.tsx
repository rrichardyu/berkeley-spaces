import { useEffect, useState } from "react";
import Preferences from "../components/Preferences";

export default function Scheduler() {
    const [preferences, setPreferences] = useState(null);
    const [availablePreferences, setAvailablePreferences] = useState(null);
    const [preferencesLoaded, setPreferencesLoaded] = useState(false);
    const [sequentialSearchData, setSequentialSearchData] = useState(null);
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
                let params = new URLSearchParams();

                for(let key in preferences) {
                    if (Array.isArray(preferences[key])) {
                        preferences[key].forEach(value => params.append(key, value));
                    } else {
                        params.append(key, preferences[key]);
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

    const handlePreferenceUpdate = (preferences) => {
        setPreferences(preferences)
        console.log(preferences)
    }
    
    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/4 p-4 border-r">
                    { preferencesLoaded ?
                        <Preferences availablePreferences={availablePreferences} preferenceUpdate={handlePreferenceUpdate} />
                        : <></>
                    }
                </div>
                <div>
                    { sequentialSearchDataLoaded ? JSON.stringify(sequentialSearchData) : <></>}
                </div>
            </div>
        </>
    )
}