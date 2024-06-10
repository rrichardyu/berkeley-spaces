import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => {
    return (
        <nav>
            <div className="px-4 border-b">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-3xl">
                            Spaces
                        </Link>
                    </div>
                    <div className="flex text-md">
                        <Link
                            to="/catalog"
                            className="hover:bg-gray-100 px-2 py-2 mx-1 rounded transition-colors"
                        >
                            Catalog
                        </Link>
                        <Link
                            to="/scheduler"
                            className="hover:bg-gray-100 px-2 py-2 mx-1 rounded transition-colors"
                        >
                            Scheduler
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;