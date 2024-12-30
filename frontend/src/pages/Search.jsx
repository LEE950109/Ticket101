import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');

    useEffect(() => {
        if (query) {
            // API 호출 또는 데이터 필터링
            fetchSearchResults(query);
        }
    }, [query]);

    const fetchSearchResults = async (searchQuery) => {
        // 실제 API 호출 로직으로 대체해야 함
        const mockResults = [
            { id: 1, title: '공연 1', date: '2024-03-20', category: '콘서트' },
            { id: 2, title: '공연 2', date: '2024-03-21', category: '뮤지컬' },
            // ... 더 많은 결과들
        ];
        setSearchResults(mockResults);
    };

    return (
        <section className="search">
            <div className="search__header">
                <h2>검색 결과 1</h2>
            </div>
            <div className="search__category">
                <h3>공연 제목 - 공연 날짜</h3>
                <div className="category__buttons">
                    {['전체', '콘서트', '뮤지컬', '클래식','국악'].map(category => (
                        <button
                            key={category}
                            className={selectedCategory === category ? 'active' : ''}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <div className="search__results">
                {searchResults
                    .filter(item => selectedCategory === '전체' || item.category === selectedCategory)
                    .map(result => (
                        <div key={result.id} className="result__item">
                            <h4>{result.title}</h4>
                            <p>{result.date}</p>
                        </div>
                    ))}
            </div>
        </section>
    );
};

export default Search;
