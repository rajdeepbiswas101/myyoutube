import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './MainHeader.module.scss';
import { ReactComponent as YoutubeLogo } from "../../assets/logo/YouTube-Logo.wine.svg";

const MainHeader = ({ searchForVideos }) => {
  const [searchString, setsearchString] = useState("");

  const actionOnEnterClick = (e) => {
    if (e.keyCode === 13) {
      search();
    }
  }

  const search = () => {
    searchForVideos(searchString);
  }


  return (
    <div className={styles.MainHeader} data-testid="MainHeader">
      <YoutubeLogo style={{ height: "4rem", width: "10rem" }} />
      <div className={styles.searchBar}>
        <div className={styles.searchContainer}>
          <input type="text"
            value={searchString}
            onKeyDown={(e) => actionOnEnterClick(e)}
            onChange={(e) => setsearchString(e.target.value)} className={styles.searchInput} placeholder="Search" />
          <div className={styles.searchIcon} onClick={(e) => search()}
            data-testid="searchButton"
          />
        </div>
      </div>

    </div>
  )
};

MainHeader.propTypes = {
  searchForVideos: PropTypes.func.isRequired
};

MainHeader.defaultProps = {};

export default MainHeader;