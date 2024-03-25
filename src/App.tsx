import React, { useState } from 'react';

function App() {
  const [content, setContent] = useState(null);
  const [banList, setBanList] = useState([]);

  // This function fetches data from the API and updates the state
  async function fetchContent() {
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const API_URL = `https://api.harvardartmuseums.org/object?apikey=47c00a67-f619-4099-b4cc-1b2b5def1a61&size=10&page=${randomPage}`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      // Filter out records that are banned or have no image
      const validRecords = data.records.filter(record => 
        !banList.includes(record.title) && 
        (record.primaryimageurl || (record.images && record.images.length > 0))
      );

      // Check if there are any valid records left after filtering
      if (validRecords.length > 0) {
        const item = validRecords[0]; // Take the first valid record
        setContent({
          imageUrl: item.primaryimageurl || item.images[0].baseimageurl,
          attribute1: item.title,
          attribute2: item.dated,
          attribute3: item.culture,
        });
      } else {
        console.log('No suitable records found');
        setContent(null);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setContent(null);
    }
  }

  // This function adds an attribute to the ban list
  function addToBanList(attribute) {
    setBanList(prevBanList => [...prevBanList, attribute]);
  }

  return (
    <div className="app">
      <h1>Veni Vici! Discover Art</h1>
      <button onClick={fetchContent}>Discover</button>
      {content && (
        <div className="content">
          <img 
  src={content.imageUrl} 
  alt="Artwork" 
  style={{ 
    maxWidth: '100%', // ensures image is responsive and doesn't exceed its container width
    width: '500px', // set a fixed width or use max-width for responsiveness
    height: 'auto' // maintains the aspect ratio of the image
  }} 
/>
          <p>{content.attribute1}</p>
          <p>{content.attribute2}</p>
          <p onClick={() => addToBanList(content.attribute3)}>{content.attribute3}</p>
        </div>
      )}
      <div className="ban-list">
        <h2>Ban List</h2>
        <ul>
          {banList.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;

