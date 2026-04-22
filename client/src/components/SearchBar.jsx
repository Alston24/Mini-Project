// SearchBar.jsx — City search input with autocomplete suggestions
import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const POPULAR_CITIES = [
  "Mumbai", "Delhi", "Tokyo", "New York", "London", "Sydney",
  "Dubai", "Singapore", "Paris", "Los Angeles", "Berlin", "Toronto",
  "Cairo", "Moscow", "Beijing", "Lagos", "Jakarta", "Istanbul",
  "Bangkok", "São Paulo", "Chicago", "Seoul", "Shanghai", "Rome",
];

/**
 * City search bar with live autocomplete dropdown.
 * @param {{ onSearch: (city: string) => void, placeholder: string }} props
 */
export const SearchBar = ({ onSearch, placeholder = "Search any city..." }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /** Filters city suggestions based on input. */
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filtered = POPULAR_CITIES.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  /** Submits search via Enter key or button click. */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  /** Selects a suggestion from the dropdown. */
  const handleSelect = (city) => {
    setQuery(city);
    setShowSuggestions(false);
    onSearch(city);
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef} id="city-search-bar">
      <form className="search-bar" onSubmit={handleSubmit}>
        <FiSearch className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((city) => (
            <li key={city} onClick={() => handleSelect(city)}>{city}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
