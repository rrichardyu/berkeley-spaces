interface RoomProps {
    displayName: string;
    status: string;
}

export default function Room({ displayName, status }: RoomProps) {
    let statusColor = "text-gray-400";
    
    if (status === "Unreserved") {
        statusColor = "text-green-500";
    } else if (status === "Reserved") {
        statusColor = "text-red-600";
    }

    return (
        <div className="hover:bg-gray-100 transition-colors rounded p-4 mb-2 cursor-pointer">
            <h3 className="text-xl font-bold">{displayName}</h3>
            <h3 className={`text-lg flex items-center ${statusColor}`}>
                <svg className="inline-block w-4 h-4 align-middle mr-2" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
                {status}
            </h3>
        </div>
    )
}