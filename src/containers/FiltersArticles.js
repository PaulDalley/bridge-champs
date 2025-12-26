import React from 'react';
import { connect } from 'react-redux';
import { setDifficultyFilter, resetFilters } from '../store/actions/filtersActions';
import './FiltersCategoryArticles.css';

const FiltersArticles = ({ difficultyFilter, setDifficultyFilter, resetFilters }) => {
  const difficulties = [
    { value: '', label: 'All Levels', range: '' },
    { value: 'beginner', label: 'Beginner', range: '(1-3)' },
    { value: 'intermediate', label: 'Intermediate', range: '(4-7)' },
    { value: 'advanced', label: 'Advanced', range: '(8-10)' },
  ];

  return (
    <div className="Filters">
      <div className="Filters-header">
        <h3 className="Filters-title">Filter by Difficulty:</h3>
        {difficultyFilter && (
          <button 
            className="Filters-clear"
            onClick={() => resetFilters()}
          >
            Clear Filters
          </button>
        )}
      </div>
      
      <div className="Filters-grid">
        {difficulties.map(({ value, label, range }) => (
          <button
            key={value}
            className={`Filter-btn ${difficultyFilter === value ? 'active' : ''}`}
            onClick={() => setDifficultyFilter(value)}
          >
            {label} {range && <span className="Filter-range">{range}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  difficultyFilter: state.filters.difficulty,
});

const mapDispatchToProps = (dispatch) => ({
  setDifficultyFilter: (difficulty) => dispatch(setDifficultyFilter(difficulty)),
  resetFilters: () => dispatch(resetFilters()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltersArticles);
