import { useState } from "react";

interface RoomListingProps {
    roomID: number;
}

export default function RoomListing({ roomID }: RoomListingProps) {
    const [roomData, setRoomData] = useState(null);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold">Room</h1>
            <h3 className="text-lg">Room Number</h3>
            <h2 className="text-2xl font-bold mt-4">Features</h2>
            <h2 className="text-2xl font-bold mt-4">Schedule</h2>
        </div>
    )
}