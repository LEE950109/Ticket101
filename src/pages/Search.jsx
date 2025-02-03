import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [searchResults, setSearchResults] = useState({
        musical: [], 
        popular: [], 
        korean: [], 
        classical: []
    });
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (query) {
                setLoading(true);
                try {
                    const url = new URL(`http://api.ticket101.kr/api/search`);
                    url.searchParams.append('query', query);
                    const response = await fetch(url);
                    
                    if (!response.ok) {
                        throw new Error(`검색 중 오류가 발생했습니다.`);
                    }
                    
                    const data = await response.json();
                    if (data.success) {
                        setSearchResults(data.categorizedResults);
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [query]);

    const getTotalResults = () => {
        return Object.values(searchResults).reduce((total, category) => 
            total + category.length, 0);
    };

    const getFilteredResults = () => {
        if (selectedCategory === '전체') {
            return Object.values(searchResults).flat();
        }
        
        const categoryMap = {
            '뮤지컬': 'musical',
            '대중음악': 'popular',
            '국악': 'korean',
            '클래식': 'classical'
        };
        
        return searchResults[categoryMap[selectedCategory]] || [];
    };

    if (loading) return <div className="search__loading">검색 중...</div>;
    if (error) return <div className="search__error">{error}</div>;

    const total = getTotalResults();
    const filteredResults = getFilteredResults();

    return (
        <section className="search">
            <div className="search__header">
                <h2>"{query}" 검색 결과</h2>
                <p>총 {total}개의 공연을 찾았습니다.</p>
            </div>
            
            <div className="search__filter">
                <div className="category__buttons">
                    {['전체', '뮤지컬', '대중음악', '국악', '클래식'].map(category => (
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
                {filteredResults.map(show => (
                    <div key={show.performance_id} className="result__item">
                        <Link to={`/detail/${show.performance_id}`}>
                            <div className="item__image">
                                <img src={show.image} alt={show.title} />
                            </div>
                            <div className="item__info">
                                <h3>{show.title}</h3>
                                <p>{show.start_date} ~ {show.end_date}</p>
                                <p>{show.location} | {show.city}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Search;
