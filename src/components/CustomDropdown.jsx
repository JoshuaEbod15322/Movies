import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

export default function CustomDropdown({
  value,
  options,
  onChange,
  placeholder,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-bold outline-none hover:bg-white/10 focus:border-red-600 transition-all"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "transition-transform flex-shrink-0 ml-2",
            isOpen && "rotate-180",
          )}
          size={18}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-full md:w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[100] py-2 max-h-64 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-3 text-sm font-bold transition-all hover:bg-white/5",
                value === option.value
                  ? "text-red-600 bg-red-600/5"
                  : "text-gray-400",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
