import React, { useContext } from "react";

import { SelectedMovieContext } from "../../page/home";

export const Main = () => {
  const { movie } = useContext(SelectedMovieContext);
  return <div>Main</div>;
};
