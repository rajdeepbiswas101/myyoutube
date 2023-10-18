import React from 'react';
import { render, screen,  } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Thumbnail from './Thumbnail';

describe('<Thumbnail />', () => {
  const sampleData = { title: 'Video 1',channelTitle:"Channel 1", thumbnails: { medium: { height: 100, width: 100, url: "http://example.com" } } };

  test('it should mount', () => {

    render(<Thumbnail videoMetaData={sampleData} />);
    
    const thumbnail = screen.getByTestId('Thumbnail');

    expect(thumbnail).toBeInTheDocument();
  });

  test('renders correctly', () => {
    render(<Thumbnail videoMetaData={sampleData} />);

    const thumbnailElement = screen.getByTestId('Thumbnail');
    const imageElement = screen.getByAltText(sampleData.title);
    const titleElement = screen.getByText(sampleData.title);
    const channelTitleElement = screen.getByText(sampleData.channelTitle);

    expect(thumbnailElement).toBeInTheDocument();
    expect(imageElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
    expect(channelTitleElement).toBeInTheDocument();

    expect(imageElement).toHaveAttribute('src', sampleData.thumbnails.medium.url);
    expect(thumbnailElement).toHaveStyle('maxWidth: 100px');
    expect(imageElement).toHaveStyle('height: 100px');
    expect(imageElement).toHaveStyle('width: 100px');
  });
});