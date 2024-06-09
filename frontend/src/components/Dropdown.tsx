import { useState, useEffect, useRef } from "react";

interface DropdownProps {
    dropdownText: string;
    options: string[];
    selectDropdownItem: (selectedItem: string) => void; 
}

export default function Dropdown({ dropdownText, options, selectDropdownItem }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDropdownItem, setSelectedDropdownItem] = useState("");
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionClick = (value: string) => {
        selectDropdownItem(value);
        setSelectedDropdownItem(value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full my-2" ref={dropdownRef}>
        <button
            onClick={toggleDropdown}
            className="text-left w-full bg-white py-2 px-2 border rounded flex justify-between items-center"
        >
            {selectedDropdownItem ? selectedDropdownItem : dropdownText}
            <svg
                className={`w-6 h-6 transition-transform transform ${isOpen ? 'rotate-180' : ''}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
            >
            <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
            </svg>
        </button>
        {isOpen && (
            <div className="absolute w-full mt-2 bg-white border rounded shadow-lg z-10 max-h-64 overflow-y-auto">
            <ul>
                <li key="default" className="px-2 py-2 text-gray-400 cursor-pointer" onClick={() => handleOptionClick(null)}>
                    {dropdownText}
                </li>
                {options.map((option, index) => (
                    <li 
                        key={index} 
                        className="px-2 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
}