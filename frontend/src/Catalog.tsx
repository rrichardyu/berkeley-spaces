import { useEffect, useState } from "react";
import Filters from "./components/Filters";
import Room from "./components/Room";
import RoomListing from "./components/RoomListing";

export default function Catalog() {
    const [roomSearchData, setRoomSearchData] = useState(null);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/rooms");
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
    }, []);

    const handleRoomSelection = (roomID) => {
        setSelectedRoom(roomID);
    }

    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/4 p-4 border-r">
                    <Filters />
                </div>
                <div className="w-1/4 p-4 overflow-y-auto border-r">
                    {
                        !catalogLoading ?
                            roomSearchData.map((item, index) => (
                                <div onClick={() => handleRoomSelection(item.room_id)}>
                                    <Room roomID={item.room_id} displayName={item.room_name_display} status={item.reservation_status} />
                                </div>
                            ))
                        : <></>
                    }
                </div>
                <div className="w-1/2 p-4 overflow-y-auto">
                    {
                        selectedRoom ?
                            <RoomListing roomID={selectedRoom} />
                        : <h3 className="text-xl text-center text-gray-400">Room not selected</h3>
                    }
                </div>
            </div>
        </>
    )
}