import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainHeader from './MainHeader';

describe('<MainHeader />', () => {
  const mockSearchForVideos = jest.fn();

  test('renders correctly', () => {
    render(<MainHeader searchForVideos={mockSearchForVideos} />);
    const mainHeaderElement = screen.getByTestId('MainHeader');
    const searchInput = screen.getByPlaceholderText('Search');

    expect(mainHeaderElement).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();
  });

  test('calls searchForVideos function on enter key press', () => {
    render(<MainHeader searchForVideos={mockSearchForVideos} />);
    const searchInput = screen.getByPlaceholderText('Search');

    fireEvent.keyDown(searchInput, { keyCode: 13 });

    expect(mockSearchForVideos).toHaveBeenCalledTimes(1);
  });

  test('calls searchForVideos function on search icon click', () => {
    render(<MainHeader searchForVideos={mockSearchForVideos} />);
    const searchIcon = screen.getByTestId('searchButton');

    fireEvent.click(searchIcon);

    expect(mockSearchForVideos).toHaveBeenCalledTimes(1);
  });

  test('updates searchString state on input change', () => {
    render(<MainHeader searchForVideos={mockSearchForVideos} />);
    const searchInput = screen.getByPlaceholderText('Search');

    fireEvent.change(searchInput, { target: { value: 'new value' } });

    expect(searchInput.value).toBe('new value');
  });
});