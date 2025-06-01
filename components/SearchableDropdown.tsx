import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  id?: string;
  label?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  disabled?: boolean; // New prop
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  id,
  label,
  required,
  className = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500",
  labelClassName = "block text-sm font-medium text-slate-700",
  disabled = false, // Default to false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    setInputValue(selectedOption ? selectedOption.label : '');
  }, [value, options]);

  useEffect(() => {
    if (isOpen && !disabled) {
      if (inputValue) {
        setFilteredOptions(
          options.filter(option =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      } else {
        setFilteredOptions(options);
      }
    } else if (disabled) {
      setFilteredOptions([]);
      setIsOpen(false);
    }
  }, [inputValue, options, isOpen, disabled]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      if (!disabled) {
        const selectedOption = options.find(option => option.value === value);
        setInputValue(selectedOption ? selectedOption.label : '');
      }
    }
  }, [value, options, disabled]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setInputValue(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option: Option) => {
    if (disabled) return;
    onChange(option.value);
    setInputValue(option.label);
    setIsOpen(false);
  };
  
  const handleInputFocus = () => {
    if (disabled) return;
    if(!isOpen) {
        setFilteredOptions(options);
        setIsOpen(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && <label htmlFor={id} className={labelClassName}>{label}{required && '*'}</label>}
      <input
        type="text"
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={`${className} ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
        autoComplete="off"
        disabled={disabled}
      />
      {isOpen && !disabled && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-slate-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map(option => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="px-3 py-2 text-sm text-slate-700 hover:bg-sky-100 hover:text-sky-700 cursor-pointer"
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {isOpen && !disabled && filteredOptions.length === 0 && inputValue && (
         <div className="absolute z-10 w-full bg-white border border-slate-300 rounded-md mt-1 shadow-lg p-3 text-sm text-slate-500">
            No matching cities found.
         </div>
      )}
    </div>
  );
};

export default SearchableDropdown;