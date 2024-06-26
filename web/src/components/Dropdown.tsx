import { useState, useEffect, useRef } from "react";

interface DropdownProps {
    dropdownText: string;
    options: { display: string, value: string }[];
    selectDropdownItem: React.Dispatch<React.SetStateAction<string[]>>;
    allowMultipleSelect?: boolean;
}

export default function Dropdown({ dropdownText, options, selectDropdownItem, allowMultipleSelect }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDropdownItems, setSelectedDropdownItems] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        if (allowMultipleSelect) {
            const updatedSelectedItems = selectedDropdownItems.includes(value)
                ? selectedDropdownItems.filter(item => item !== value)
                : [...selectedDropdownItems, value];
            setSelectedDropdownItems(updatedSelectedItems);
            selectDropdownItem(updatedSelectedItems.map(item => options.find(option => option.display === item)?.value).filter(Boolean) as string[]);
        } else {
            setSelectedDropdownItems([value]);
            selectDropdownItem([options.find(option => option.display === value)?.value || '']);
            setIsOpen(false);
        }
    };

    const resetDropdown = () => {
        setSelectedDropdownItems([]);
        selectDropdownItem([]);
        setIsOpen(false);
    }

    return (
        <div className="relative w-full my-2" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="text-left w-full bg-white py-2 px-2 border rounded flex justify-between items-center"
            >
                {selectedDropdownItems.length > 0 ? selectedDropdownItems.join(", ") : dropdownText}
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
                        <li
                            key="default"
                            className={`px-2 py-2 hover:bg-gray-100 text-gray-400 cursor-pointer ${
                                selectedDropdownItems.length === 0 ? 'bg-gray-100' : ''
                            }`}
                            onClick={() => resetDropdown()}
                        >
                            {`${dropdownText} (click to reset)`}
                        </li>
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className={`px-2 py-2 hover:bg-gray-100 transition-colors cursor-pointer ${
                                    selectedDropdownItems.includes(option.display) ? 'bg-gray-100' : ''
                                }`}
                                onClick={() => handleOptionClick(option.display)}
                            >
                                {option.display}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}