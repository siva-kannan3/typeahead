import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose, faStar } from "@fortawesome/free-solid-svg-icons";

import { SelectedMovieContext } from "../../page/home";

import "./typeahead.css";

const KEY_CODES = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  BOTTOM: "ArrowDown",
  ENTER: "Enter",
  ESCAPE: "Escape",
};

const debounce = function (fn, d) {
  let timer;
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, d);
  };
};

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
    debounce((searchValue) => getMoviesFromApi(searchValue), 300),
    []
  );

  const onChangeSearch = (event) => {
    let searchValue = event.target.value;
    setSearch(searchValue);
    searchValue && debounceDropDown(searchValue);
  };

  const onClose = useCallback(() => {
    setShowOverlay(false);
    setIsInputKeyDown(false);
  }, []);

  const getMoviesFromApi = async (searchText) => {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=319adf4f4e6b88ce0c4b7ee9b398cbb5&language=en-US&page=1&include_adult=false&query=${searchText}`;
    const getMovies = await fetch(url);
    const response = await getMovies.json();
    setMovieResults(response.results);
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

const SearchList = React.memo(({ inputKeyDown, onClose, movieResults }) => {
  const { setSelectedMovie } = useContext(SelectedMovieContext);
  const downPress = useKeyPress(KEY_CODES.BOTTOM);
  const upPress = useKeyPress(KEY_CODES.UP);
  const enterPress = useKeyPress(KEY_CODES.ENTER);

  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (movieResults.length && downPress) {
      setCursor((prevState) =>
        prevState < movieResults.length - 1 ? prevState + 1 : prevState
      );
      setTimeout(() => {
        let activeElement = document.querySelector(
          ".search-list-movie.selected"
        );
        activeElement?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [downPress]);
  useEffect(() => {
    if (movieResults.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
      setTimeout(() => {
        let activeElement = document.querySelector(
          ".search-list-movie.selected"
        );
        activeElement?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [upPress]);
  useEffect(() => {
    if (movieResults.length && enterPress) {
      let selectedMovie = movieResults[cursor];
      setSelectedMovie(selectedMovie);
      onClose();
    }
  }, [cursor, enterPress]);

  return (
    <div className="search-list-container" id="search-list">
      {movieResults.map((movie, index) => {
        return (
          <div
            key={movie.id}
            className={`search-list-movie ${
              inputKeyDown && cursor === index && "selected"
            }`}
            role={"button"}
            onClick={() => {
              setSelectedMovie(movie);
              onClose();
            }}
          >
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
});

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
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
