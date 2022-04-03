/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose } from "@fortawesome/free-solid-svg-icons";

import { SearchList } from "./search.list";
import { debounce } from "./utils";
import { LRUCache } from "./utils/lru.cache";
import { KEY_CODES } from "./constants";

import "./typeahead.css";

const CAPACITY = 50;

const lruCacheInstance = new LRUCache(CAPACITY);

export const TypeAhead = ({ showCloseButton }) => {
  const [search, setSearch] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isInputKeyDown, setIsInputKeyDown] = useState(false);
  const [movieResults, setMovieResults] = useState([]);

  const searchInputRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    searchInputRef.current.addEventListener("keydown", (event) => {
      if (event.key === KEY_CODES.BOTTOM) {
        setIsInputKeyDown(true);
        event.target.blur();
      } else if (event.key === KEY_CODES.ESCAPE) {
        setSearch("");
        setIsInputKeyDown(false);
        setShowOverlay(false);
        event.target.blur();
      }
      event.stopPropagation();
    });
  }, []);

  const updateShowOverlay = (event) => {
    const searchListElement = document.getElementById("search-list");
    if (
      event.target !== searchListElement &&
      !searchListElement?.contains(event.target)
    ) {
      setShowOverlay(false);
    }
  };

  const debounceDropDown = useCallback(
    debounce((searchValue) => {
      getMoviesFromApi(searchValue);
    }, 1000),
    []
  );

  const onChangeSearch = (event) => {
    let searchValue = event.target.value;
    setSearch(searchValue);
    searchValue && debounceDropDown(searchValue);
  };

  const onClose = useCallback(() => {
    setSearch("");
    setShowOverlay(false);
    setIsInputKeyDown(false);
  }, []);

  const getMoviesFromApi = async (searchText) => {
    if (lruCacheInstance.getItem(searchText) !== -1) {
      let cachedMovieResults = lruCacheInstance.getItem(searchText);
      setMovieResults(cachedMovieResults);
    } else {
      let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIE_DB_SECRET}&language=en-US&page=1&include_adult=false&query=${searchText}`;
      try {
        const getMovies = await fetch(url);
        const response = await getMovies.json();
        setMovieResults(response?.results || movieResults);
        lruCacheInstance.setItem(searchText, response.results);
      } catch (err) {
        setMovieResults([]);
      }
    }
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
          autoComplete={"off"}
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
      {search && showOverlay && (
        <SearchList
          inputKeyDown={isInputKeyDown}
          onClose={onClose}
          movieResults={movieResults}
        />
      )}
      {showOverlay && (
        <div
          className="dark-overlay"
          ref={overlayRef}
          onClick={updateShowOverlay}
        />
      )}
    </div>
  );
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
