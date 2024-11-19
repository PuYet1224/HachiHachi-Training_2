import React, { useState, useEffect, useRef } from "react";
import "./SearchableDropdown.css";

const SearchableDropdown = ({
  options = [],
  selectedOption,
  setSelectedOption,
  placeholder = "Select...",
  onSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const processedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { label: option, value: option, disabled: false };
    }
    // Ensure each option has a 'disabled' property
    return { ...option, disabled: option.disabled || false };
  });

  const filteredOptions = processedOptions.filter((option) =>
    option.label.toLowerCase().includes(filter.toLowerCase())
  );

  const handleOptionClick = (option) => {
    if (disabled || option.disabled) return;
    setSelectedOption(option.value);
    setIsOpen(false);
    setFilter("");
    setHighlightedIndex(-1);
    if (onSelect) {
      onSelect(option.value);
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
      setFilter("");
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return; // Do nothing if dropdown is disabled
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (isOpen && highlightedIndex >= 0) {
        e.preventDefault();
        handleOptionClick(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setFilter("");
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getLabelByValue = (options, value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : "-- Chọn --";
  };

  const displayLabel = getLabelByValue(processedOptions, selectedOption);

  return (
    <div
      className={`searchable-dropdown ${isOpen ? "open" : ""} ${
        disabled ? "disabled" : ""
      }`}
      ref={dropdownRef}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-owns="dropdown-list"
      aria-labelledby="dropdown-input"
    >
      <div className="dropdown-input-container">
        <input
          type="text"
          id="dropdown-input"
          ref={inputRef}
          className="dropdown-input"
          placeholder={placeholder}
          value={isOpen ? filter : displayLabel}
          onChange={(e) => {
            if (disabled) return;
            setFilter(e.target.value);
            setIsOpen(true);
          }}
          onClick={() => {
            if (disabled) return;
            setIsOpen((prev) => !prev);
          }}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-controls="dropdown-list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `dropdown-item-${highlightedIndex}`
              : undefined
          }
          disabled={disabled}
          style={{
            backgroundColor: disabled ? "#DBDEE7" : "#fff",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        <div
          className={`dropdown-arrow ${isOpen ? "open" : ""}`}
          onClick={() => {
            if (disabled) return;
            setIsOpen((prev) => !prev);
          }}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 451.846 451.847"
            width="16"
            height="16"
          >
            <path
              d="M225.923,353.169L31.73,159.977c-12.497-12.497-12.497-32.758,0-45.255
                c12.497-12.497,32.758-12.497,45.255,0L225.923,262.659L375.86,112.722c12.497-12.497,32.758-12.497,45.255,0
                c12.497,12.497,12.497,32.758,0,45.255L225.923,353.169z"
              fill="#1A6634"
            />
          </svg>
        </div>
      </div>
      {isOpen && (
        <ul
          className="dropdown-menu open"
          role="listbox"
          id="dropdown-list"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                id={`dropdown-item-${index}`}
                role="option"
                aria-selected={selectedOption === option.value}
                className={`dropdown-item ${
                  highlightedIndex === index ? "highlighted" : ""
                } ${option.disabled ? "disabled-option" : ""}`}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                style={{
                  cursor: option.disabled ? "not-allowed" : "pointer",
                  color: option.disabled ? "#999" : "#000",
                }}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="dropdown-item no-result">
              Không tìm thấy kết quả
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
