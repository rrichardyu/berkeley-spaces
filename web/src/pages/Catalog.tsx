import { useEffect, useState } from "react";
import FiltersSidebar from "../components/FiltersSidebar";
import Room from "../components/RoomResult";
import RoomListing from "../components/RoomListing";
import { Filters } from "../types/Types";

export default function Catalog() {
    const [roomSearchData, setRoomSearchData] = useState([{
        id: 0,
        display_name: "",
        reservation_status: ""
    }]);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(0);
    const [filters, setFilters] = useState<Filters>({
        start_t: [],
        end_t: [],
        date: "",
        buildings: [],
        features: [],
        categories: [],
        status: []
    });

    const [availableFilters, setAvailableFilters] = useState({
        buildings: [],
        features: [],
        categories: [],
    });
    const [filtersLoaded, setFiltersLoaded] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`http://127.0.0.1:8000/rooms`);
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error ${response.status}`);
    //             }
    //             const result = await response.json();
    //             setAllRoomsData(result);
    //             console.log(result);
    //         } catch (error) {
    //             console.log(error);
    //         } finally {
    //             setCatalogLoading(false);
    //         }
    //     };
    
    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams();

                for (const key in filters) {
                    if (Array.isArray(filters[key])) {
                        (filters[key] as string[]).forEach(value => params.append(key, value));
                    } else {
                        params.append(key, (filters[key] as string));
                    }
                }

                const queryParamsString = params.toString();
                const response = await fetch(`http://localhost:8000/rooms?${queryParamsString}`);
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                const result = await response.json();
                setRoomSearchData(result);
                console.log(result);
            } catch (error) {
                console.log(error);
            } finally {
                setCatalogLoading(false);
            }
        };
    
        fetchData();
    }, [filters]);

    useEffect(() => {
        fetch("http://localhost:8000/filters")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setAvailableFilters(data);
                setFiltersLoaded(true);
            })
            .catch(err => console.error(err));
    }, [])


    const handleRoomSelection = (roomID: number) => {
        setSelectedRoom(roomID);
    }

    const handleFilterUpdate = (filters: Filters) => {
        setFilters(filters)
        console.log(filters)
    }

    return (
        <>
            <div className="flex flex-grow h-full">
                <div className="w-1/4 p-4 border-r">
                    { filtersLoaded ?
                        <FiltersSidebar availableFilters={availableFilters} filterUpdate={handleFilterUpdate} />
                        : <></>
                    }
                </div>
                <div className="w-1/4 p-4 overflow-y-auto border-r">
                    {
                        !catalogLoading ?
                            roomSearchData.map((item) => (
                                <div onClick={() => handleRoomSelection(item.id)}>
                                    <Room displayName={item.display_name} status={item.reservation_status} />
                                </div>
                            ))
                        : <></>
                    }
                </div>
                <div className="w-1/2 p-4 overflow-y-auto">
                    {
                        selectedRoom 
                        ? <RoomListing roomID={selectedRoom} />
                        : <div className="flex items-center justify-center h-full">
                            <h3 className="text-xl text-center text-gray-400">Room not selected</h3>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}