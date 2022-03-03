import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose } from "@fortawesome/free-solid-svg-icons";

import "./typeahead.css";

export const TypeAhead = ({ showCloseButton }) => {
  const [search, setSearch] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const searchInputRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {}, []);

  const updateShowOverlay = (event) => {};

  const onChangeSearch = (event) => {
    let searchValue = event.target.value;
    setSearch(searchValue);
  };

  return (
    <div className="typeahead">
      <div
        className="search-container"
        id="search-container"
        ref={searchInputRef}
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
        />
        {search && showCloseButton && (
          <div className="icon-wrapper close">
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
          {search && (
            <div className="search-list-container" id="search-list">
              I am search list
            </div>
          )}
        </div>
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
