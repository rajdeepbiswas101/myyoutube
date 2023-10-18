import { useState } from 'react';
import './App.scss';
import MainDisplayArea from './components/MainDisplayArea/MainDisplayArea';
import MainHeader from './components/MainHeader/MainHeader';

function App() {
  const [searchString, setSearchString] = useState("");
  return (
    <div className="App" data-testid="App">
      <MainHeader searchForVideos={(searchParam) => { setSearchString(searchParam.trim()) }} />
      <MainDisplayArea searchString={searchString} />

    </div>
  );
}

export default App;
