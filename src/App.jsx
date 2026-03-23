import { useState } from 'react';
import Upload from './components/Upload';
import SlideContainer from './components/SlideContainer';

function App() {
  const [data, setData] = useState(null);

  const handleDataLoaded = (parsedData) => {
    setData(parsedData);
  };

  const handleRestart = () => {
    setData(null);
  };

  return (
    <>
      {data ? (
        <SlideContainer data={data} onRestart={handleRestart} />
      ) : (
        <Upload onDataLoaded={handleDataLoaded} />
      )}

      {/* Global noise overlay */}
      <div className="noise-overlay" />
    </>
  );
}

export default App;
