import React from "react";

import { Header } from "../../components/header";
import { Main } from "../../components/main";

import "./home.css";

export const Home = () => {
  return (
    <div className="home-root">
      <Header />
      <Main />
    </div>
  );
};
