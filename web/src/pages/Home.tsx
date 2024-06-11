import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <p className="text-lg break-words w-96">
                Effortlessly find unreserved and vacant spaces on UC Berkeley's campus, equipped with the features you need for studying and meetings.
            </p>
            <div className="mt-4 w-96">
                <button className="bg-blue-500 hover:bg-blue-700 transition-colors border text-white font-bold py-2 px-4 rounded mr-2">
                    <Link to="/catalog">
                        Catalog
                    </Link>
                </button>
                <button className="bg-blue-500 hover:bg-blue-700 transition-colors border text-white font-bold py-2 px-4 rounded">
                    <Link to="/scheduler">
                        Scheduler
                    </Link>
                </button>
            </div>
        </div>
    )
};

export default Home;