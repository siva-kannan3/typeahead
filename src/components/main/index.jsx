import React, { useContext, useEffect, useState } from "react";

import { SelectedMovieContext } from "../../page/home";
import movieImageAlt from "./assets/movie-image-alt.jpg";

import "./main.css";

export const Main = () => {
  const { movie } = useContext(SelectedMovieContext);

  const [userOnline, setUserOnline] = useState(true);

  useEffect(() => {
    let networkStatusHandler = (event) => {
      let status = event.type;
      status === "offline" && setUserOnline(false);
      status === "online" && setUserOnline(true);
    };
    window.addEventListener("online", networkStatusHandler);
    window.addEventListener("offline", networkStatusHandler);

    return () => {
      window.removeEventListener("online", networkStatusHandler);
      window.removeEventListener("offline", networkStatusHandler);
    };
  }, []);

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
      <div className={`user-${userOnline ? "online" : "offline"}`} />
    </div>
  );
};
