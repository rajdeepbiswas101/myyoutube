import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './MainDisplayArea.module.scss';
import CircularProgress from '@mui/material/CircularProgress';
import Thumbnail from '../Thumbnail/Thumbnail';
import { debounce } from 'lodash';

const MainDisplayArea = ({ searchString }) => {
  const [videos, setVideos] = useState([]);
  const [pageToken, setpageToken] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const scrollableElementRef = useRef(null);

  useEffect(() => {
    setVideos([]);
    searchVideos();
  }, [searchString]);

  useEffect(() => {
    // Attach the scroll event listener to the scrollable element
    const handleScroll = () => {
      const scrollableElement = scrollableElementRef.current;
      if (Math.abs(scrollableElement.scrollHeight - (scrollableElement.scrollTop + scrollableElement.clientHeight)) < 1) {
        // Fetch more data when scrolled to the bottom
        searchVideos(pageToken);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 200);

    const scrollableElement = scrollableElementRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', debouncedHandleScroll);
    }

    // Detach the scroll event listener when the component unmounts
    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', debouncedHandleScroll);
      }
    };
  }, [pageToken]);

  const searchVideos = useMemo(() => async(nextPage) => {
    setisLoading(true);
    const params = new URLSearchParams({
      part: 'snippet',
      q: searchString,
      type: "video",
      maxResults: 20,
      key: "AIzaSyBoNd3Mwm1qlF23vrQELCo0LXzCYz69NIA",
    });
    if (nextPage && nextPage !== "") {
      params.append("pageToken", nextPage);
    }

    const url = `https://youtube.googleapis.com/youtube/v3/search?${params}`;
    if(isLoading){
      return;
    }
    fetch(url)
      .then(async response => {

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (nextPage) {
          const seen = new Set();
          setVideos([...videos, ...data.items.map(item => { return { ...item.snippet, id: item.id.videoId } })]
            .filter((item) => {
              if (!seen.has(item.id)) {
                seen.add(item.id);
                return true;
              }
              return false;
            })
          );
        } else {
          setVideos(data.items.map(item => { return { ...item.snippet, id: item.id.videoId } }));
        }
        setisLoading(false)
        // setTimeout(() => setisLoading(false), 1000);
        setpageToken(data.nextPageToken);
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      });
  }
    , [searchString, videos, pageToken]);

  return (
    <div className={styles.MainDisplayArea} data-testid="MainDisplayArea">
      <div className={styles.videoCardThumbnails} data-testid="scrollArea" ref={scrollableElementRef}>
        {
          videos.map(video => <Thumbnail key={video.id} videoMetaData={video} />)
        }
        {
          isLoading && 
          <div className={styles.spinner}><CircularProgress /></div>
        }
      </div>
    </div>
  )
};

MainDisplayArea.propTypes = {
  searchString: PropTypes.string
};

MainDisplayArea.defaultProps = {};

export default MainDisplayArea;
