import Filters from "./components/Filters";
import Room from "./components/Room";
import RoomListing from "./components/RoomListing";

export default function Catalog() {
    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/4 p-4 border-r">
                    <Filters />
                </div>
                <div className="w-1/4 p-4 overflow-y-auto border-r">
                    <Room roomID={-1} displayName="Room" status="Closed" />
                    <Room roomID={-1} displayName="Room" status="Unreserved" />
                    <Room roomID={-1} displayName="Room" status="Reserved" />
                </div>
                <div className="w-1/2 p-4">
                    <RoomListing roomID={-1} />
                </div>
            </div>
        </>
    )
}