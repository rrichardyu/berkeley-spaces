import { useEffect, useState } from "react";
import Filters from "../components/Filters";
import Room from "../components/Room";
import RoomListing from "../components/RoomListing";

export default function Catalog() {
    const [allRoomsData, setAllRoomsData] = useState(null);
    const [roomSearchData, setRoomSearchData] = useState(null);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [filters, setFilters] = useState(null);

    const [availableFilters, setAvailableFilters] = useState(null);
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
                let params = new URLSearchParams();

                for(let key in filters) {
                    if (Array.isArray(filters[key])) {
                        filters[key].forEach(value => params.append(key, value));
                    } else {
                        params.append(key, filters[key]);
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


    const handleRoomSelection = (roomID) => {
        setSelectedRoom(roomID);
    }

    const handleFilterUpdate = (filters) => {
        setFilters(filters)
        console.log(filters)
    }

    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/4 p-4 border-r">
                    { filtersLoaded ?
                        <Filters availableFilters={availableFilters} filterUpdate={handleFilterUpdate} />
                        : <></>
                    }
                </div>
                <div className="w-1/4 p-4 overflow-y-auto border-r">
                    {
                        !catalogLoading ?
                            roomSearchData.map((item, index) => (
                                <div onClick={() => handleRoomSelection(item.id)}>
                                    <Room roomID={item.id} displayName={item.display_name} status={item.reservation_status} />
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