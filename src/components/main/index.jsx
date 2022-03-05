import React, { useContext } from "react";

import { SelectedMovieContext } from "../../page/home";
import movieImageAlt from "./movie-image-alt.jpg";

import "./main.css";

export const Main = () => {
  const { movie } = useContext(SelectedMovieContext);
  return (
    <div className="main-wrapper">
      {movie && (
        <div className="movie-preview">
          <div className="movie-image">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                  : movieImageAlt
              }
              alt={movie.original_title}
            />
          </div>
          <div className="main-movie-desc">
            <div className="main-movie-title">{movie.original_title}</div>
            <div className="main-movie-description">{movie.overview}</div>
            <div className="main-movie-rating">{movie.vote_average} rating</div>
          </div>
        </div>
      )}
      {!movie && (
        <div style={{}}>Please search and select a movie to preview</div>
      )}
    </div>
  );
};
