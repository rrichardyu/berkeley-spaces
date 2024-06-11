import React, { useState } from 'react';

const Update: React.FC = () => {
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const handleUpdate = async () => {
        try {
            await fetch('http://localhost:8000/update_data', {
                method: 'POST',
            });
            console.log('Update started');
            setMessage('Update started.');
            setSuccess(true);
        } catch (error) {
            console.error('Update failed', error);
            setMessage(`Update failed: ${error}`);
            setSuccess(false);
        }
    };

    return (
        <div className="flex flex-col items-center h-screen">
            <h1 className="text-2xl my-4">Update Data</h1>
            <p className="text-md break-words w-96 my-2">
                Populate the database with the latest rooms, schedules, and open hours.
            </p>
            <p className="text-md break-words text-red-600 w-96 my-2">
                This process can take up to 5 minutes to complete as the backend pulls and processes data from external sources.
            </p>
            <div className="mt-4 w-96">
                <button
                    className="bg-blue-500 hover:bg-blue-700 transition-colors border text-white font-bold py-2 px-4 rounded"
                    onClick={handleUpdate}
                >
                    Update
                </button>
            </div>
            <p className={`text-md break-words w-96 my-2 ${success ? "text-green-500" : "text-red-600"}`}>
                {message}
            </p>
        </div>
    );
};

export default Update;