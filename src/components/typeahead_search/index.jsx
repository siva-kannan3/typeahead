import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose, faStar } from "@fortawesome/free-solid-svg-icons";

import MOCK_DATA from "./mock.data.json";

import "./typeahead.css";

export const TypeAhead = ({ showCloseButton }) => {
  const [search, setSearch] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const searchInputRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {}, []);

  const updateShowOverlay = (event) => {
    const searchListElement = document.getElementById("search-list");
    if (
      event.target !== searchListElement &&
      !searchListElement.contains(event.target)
    ) {
      setShowOverlay(false);
    }
  };

  const onChangeSearch = (event) => {
    let searchValue = event.target.value;
    setSearch(searchValue);
  };

  return (
    <div className="typeahead">
      <div
        className="search-container"
        id="search-container"
        tabIndex="-1"
        onFocus={() => {
          setShowOverlay(true);
        }}
      >
        <input
          value={search}
          onChange={onChangeSearch}
          name="search-input"
          aria-label="search-input"
          className="search-input"
          ref={searchInputRef}
        />
        {search && showCloseButton && (
          <div
            className="icon-wrapper close"
            onClick={() => {
              setSearch("");
              searchInputRef.current && searchInputRef.current.focus();
            }}
          >
            <FontAwesomeIcon icon={faClose} className="close-icon" />
          </div>
        )}
        <div className="icon-wrapper search">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
      </div>

      {showOverlay && (
        <div
          className="dark-overlay"
          ref={overlayRef}
          onClick={updateShowOverlay}
        >
          {search && <SearchList searchText={search} />}
        </div>
      )}
    </div>
  );
};

const SearchList = ({ searchText }) => {
  const { results } = MOCK_DATA;
  return (
    <div className="search-list-container" id="search-list">
      {results.map((movie) => {
        return (
          <div key={movie.id} className="search-list-movie">
            <div className="movie-image-wrapper">
              <img
                src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                alt={movie.original_title}
              />
            </div>
            <div className="movie-context">
              <span className="movie-title">{movie.original_title}</span>
              <span className="movie-overview">{movie.overview}</span>
            </div>
            <div className="movie-rating-wrapper">
              <div className="movie-rating">
                <FontAwesomeIcon icon={faStar} className="star-icon" />
                <span>{movie.vote_average}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

SearchList.propTypes = {
  searchText: PropTypes.string,
};

TypeAhead.propTypes = {
  getSuggestion: PropTypes.func,
  renderSuggestion: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  debounceDelayTime: PropTypes.number,
  cacheSize: PropTypes.number,
  cacheExpiration: PropTypes.any,
  showCloseButton: PropTypes.bool,
  onClose: PropTypes.func,
  onClear: PropTypes.func,
  closeOnEscape: PropTypes.bool,
  renderLoader: PropTypes.func,
};
