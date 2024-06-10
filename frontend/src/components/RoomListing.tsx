import { useState, useEffect } from "react";
import Schedule from "./Schedule";

interface RoomListingProps {
    roomID: number;
}

export default function RoomListing({ roomID }: RoomListingProps) {
    const [roomData, setRoomData] = useState(null);
    const [roomListingLoading, setRoomListingLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomResponse = await fetch(`http://127.0.0.1:8000/rooms/${roomID}`);
                if (!roomResponse.ok) {
                    throw new Error(`HTTP error ${roomResponse.status}`);
                }
                const roomData = await roomResponse.json();
                setRoomData(roomData);
                console.log(roomData);
            } catch (error) {
                console.log(error);
            } finally {
                setRoomListingLoading(false);
            }
        };
    
        fetchData();
    }, [roomID]);

    return (
        <div className="p-4">
            { !roomListingLoading ?
                <>
                    <h1 className="text-3xl font-bold">{roomData.display_name.split(",")[0]}</h1>
                    <h3 className="text-lg">Room {roomData.number}</h3>
                    <div>
                        <h2 className="text-2xl font-bold mt-4">Features</h2>
                        <p className="text-lg">Capacity {roomData.capacity}</p>
                        <br />
                        {
                            roomData.room_features.map((item, index) => (
                                <p className="text-lg">{item}</p>
                            ))
                        }
                    </div>
                    <h2 className="text-2xl font-bold mt-4">Schedule</h2>
                    <Schedule events={[]} />
                </>
                : <></>
            }
        </div>
    )
}