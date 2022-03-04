import React, { createContext, useState } from "react";

import { Header } from "../../components/header";
import { Main } from "../../components/main";

import "./home.css";

export const SelectedMovieContext = createContext(null);

export const Home = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  return (
    <div className="home-root">
      <SelectedMovieContext.Provider
        value={{ movie: selectedMovie, setSelectedMovie }}
      >
        <Header />
        <Main />
      </SelectedMovieContext.Provider>
    </div>
  );
};
