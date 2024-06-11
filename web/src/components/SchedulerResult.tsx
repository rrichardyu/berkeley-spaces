import { RoomSchedulerResult } from "../types/Types";

interface SchedulerResultProps {
    rooms: RoomSchedulerResult[];
}

export default function SchedulerResult({ rooms }: SchedulerResultProps) {
    const formatTime = (time: string) => {
        const date = new Date(time);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    return (
        <div className="p-4">
            {
                rooms.map((room, index) => (
                    <>
                        <div className="hover:bg-gray-100 transition-colors rounded p-4 my-2 cursor-pointer">
                            <h3 className="text-xl font-bold">{room.room.display_name}</h3>
                            <h3 className="text-lg flex items-center">
                                {formatTime(room.start_t)} - {formatTime(room.end_t)}
                            </h3>
                        </div>
                        {
                            (index < rooms.length - 1) && (
                                <div className="flex justify-center">
                                    <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-full">
                                        <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                        </svg>
                                    </div>
                                </div>
                            )
                        }
                    </>
                ))
            }
        </div>
    )
}