/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { SelectedMovieContext } from "../../page/home";
import { useKeyPress } from "./hooks";
import { KEY_CODES } from "./constants";
import movieImageAlt from "./movie-image-alt.jpg";

import "./typeahead.css";

export const SearchList = React.memo(
  ({ inputKeyDown, onClose, movieResults }) => {
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
          let imageSource = movie.poster_path
            ? `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
            : movieImageAlt;
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
                <img src={imageSource} alt={movie.original_title} />
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
  }
);

SearchList.propTypes = {
  searchText: PropTypes.string,
};
