import React from 'react';
import PropTypes from 'prop-types';
import styles from './Thumbnail.module.scss';

const Thumbnail = ({ videoMetaData }) => (
  <div className={styles.Thumbnail} style={{ maxWidth: videoMetaData.thumbnails.medium.width }} data-testid="Thumbnail">
    <div className={styles.thumbnailImage}>
      <img alt={videoMetaData.title}
        src={videoMetaData.thumbnails.medium.url}
        style={{ height: videoMetaData.thumbnails.medium.height, width: videoMetaData.thumbnails.medium.width }} />
    </div>
    <div className={styles.title}>
      {videoMetaData.title}
    </div>
    <div className={styles.channelTitle}>
      {videoMetaData.channelTitle}
    </div>

  </div>
);

Thumbnail.propTypes = {
  videoMetaData: PropTypes.object
};

Thumbnail.defaultProps = {};

export default Thumbnail;
