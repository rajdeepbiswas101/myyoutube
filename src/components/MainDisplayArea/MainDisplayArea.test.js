import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainDisplayArea from './MainDisplayArea';

describe('<MainDisplayArea />', () => {
  test('it should mount', () => {
    render(<MainDisplayArea />);

    const mainDisplayArea = screen.getByTestId('MainDisplayArea');

    expect(mainDisplayArea).toBeInTheDocument();
  });

  test('fetches videos on mount', async () => {
    const mockFetch = jest.spyOn(global, 'fetch');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [{ id: { videoId: '1' }, snippet: { title: 'Video 1', thumbnails: { medium: { height: 100, width: 100, url: "http://example.com" } } } },
        { id: { videoId: '2' }, snippet: { title: 'Video 2', thumbnails: { medium: { height: 100, width: 100, url: "http://example.com" } } } }
        ],
        nextPageToken: 'nextPageToken',
      }),
    });

    render(<MainDisplayArea searchString="" />);

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Video 1")).toBeInTheDocument();
    });

    // Check if fetch was called with the correct URL
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('https://youtube.googleapis.com/youtube/v3/search?'));
    expect(mockFetch).not.toHaveBeenCalledWith(expect.stringContaining('pageToken'));


    // Check if videos are rendered
    expect(screen.getByText("Video 1")).toBeInTheDocument(); // Use a regex to match the partial text

    // Check if the loading spinner is not present after fetching
    expect(screen.queryByTestId('spinner')).toBeNull();

    mockFetch.mockRestore();
  });

  test('fetches more videos on scroll', async () => {
    const mockFetch = jest.spyOn(global, 'fetch');

    // Mocking fetch to have a custom implementation
    mockFetch.mockImplementation((url) => {
      if (url.includes('pageToken')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            items: [
              { id: { videoId: '3' }, snippet: { title: 'Video 3', thumbnails: { medium: { height: 100, width: 100, url: "http://example.com" } } } },
            ],
            nextPageToken: 'nextPageToken2',
          }),
        });
      } else {
        // Return a default response for other URLs
        return Promise.resolve({
          ok: true,
          json: async () => ({
            items: [
              { id: { videoId: '1' }, snippet: { title: 'Video 1', thumbnails: { medium: { height: 100, width: 100, url: "http://example.com" } } } },
              { id: { videoId: '2' }, snippet: { title: 'Video 2', thumbnails: { medium: { height: 100, width: 100, url: "http://example.com" } } } }
            ],
            nextPageToken: 'nextPageToken',
          })
        })
      }
    });

    render(<MainDisplayArea searchString="test" />);

    // // Wait for the initial fetch to complete
    await waitFor(() => {
      expect(screen.getByText("Video 1")).toBeInTheDocument();
    });

    // Simulate scrolling to the bottom
    const scrollableElement = screen.getByTestId('scrollArea');
    const scrollHeight = scrollableElement.scrollHeight;
    const clientHeight = scrollableElement.clientHeight;

    fireEvent.scroll(scrollableElement, { target: { getBoundingClientRect: () => ({ bottom: scrollHeight, height: clientHeight }) } });
    fireEvent.scroll(scrollableElement, { target: { getBoundingClientRect: () => ({ bottom: scrollHeight, height: clientHeight }) } });


    await waitFor(() => {
      expect(screen.getByText("Video 3")).toBeInTheDocument();
    });

    // Check if fetch was called with the correct URL and pageToken
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('https://youtube.googleapis.com/youtube/v3/search?'));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('pageToken=nextPageToken'));

    // Check if both videos are rendered
    expect(screen.getByText('Video 1')).toBeInTheDocument();
    expect(screen.getByText('Video 2')).toBeInTheDocument();
    expect(screen.getByText('Video 3')).toBeInTheDocument();

    // Check if the loading spinner is not present after fetching more videos
    expect(screen.queryByTestId('spinner')).toBeNull();

    mockFetch.mockRestore();
  });

});