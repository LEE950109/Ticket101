import React, { useState } from 'react';

const ArtistSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="아티스트 검색..."
      />
      <button type="submit">검색</button>
    </form>
  );
};

export default ArtistSearch;