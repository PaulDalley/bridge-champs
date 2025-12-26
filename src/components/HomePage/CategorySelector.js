import React from 'react';
import { Link } from 'react-router-dom';
import './CategorySelector.css';

const CategorySelector = () => {
  const categories = [
    {
      name: 'Defence',
      path: '/defence',
      icon: '♠♥',
      description: 'Master defensive strategies',
      color: 'primary',
    },
    {
      name: 'Declarer Play',
      path: '/cardPlay',
      icon: '♦♣',
      description: 'Enhance your declarer skills',
      color: 'secondary',
    },
    {
      name: 'Bidding',
      path: '/bidding',
      icon: '♠♦',
      description: 'Improve your bidding judgment',
      color: 'accent',
    },
  ];

  return (
    <div className="CategorySelector">
      <h2 className="CategorySelector-title">What would you like to study today?</h2>
      
      <div className="CategorySelector-grid">
        {categories.map((category) => (
          <Link 
            key={category.path}
            to={category.path} 
            className={`CategorySelector-card CategorySelector-card--${category.color}`}
          >
            <div className="CategorySelector-icon">{category.icon}</div>
            <h3 className="CategorySelector-name">{category.name}</h3>
            <p className="CategorySelector-description">{category.description}</p>
            <div className="CategorySelector-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
