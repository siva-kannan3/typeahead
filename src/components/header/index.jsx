import React from "react";

import { TypeAhead } from "../typeahead_search";

import "./header.css";

export const Header = () => {
  return (
    <div className="header-container">
      <TypeAhead />
    </div>
  );
};
