import { useEffect, useState } from "react";
import Preferences from "./components/Preferences";

export default function Scheduler() {
    const [preferences, setPreferences] = useState(null);
    const [availablePreferences, setAvailablePreferences] = useState(null);
    const [preferencesLoaded, setPreferencesLoaded] = useState(false);

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
            </div>
        </>
    )
}