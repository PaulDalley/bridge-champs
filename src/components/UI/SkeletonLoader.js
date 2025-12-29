import React from 'react';
import './SkeletonLoader.css';

/**
 * Skeleton loader component for better loading states
 * Usage: <SkeletonLoader type="article" /> or <SkeletonLoader type="card" />
 */
const SkeletonLoader = ({ type = 'default', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'article':
        return (
          <div className="SkeletonLoader SkeletonLoader--article">
            <div className="SkeletonLoader-line SkeletonLoader-line--title" />
            <div className="SkeletonLoader-line SkeletonLoader-line--meta" />
            <div className="SkeletonLoader-line" />
            <div className="SkeletonLoader-line" />
            <div className="SkeletonLoader-line SkeletonLoader-line--short" />
          </div>
        );
      
      case 'card':
        return (
          <div className="SkeletonLoader SkeletonLoader--card">
            <div className="SkeletonLoader-box SkeletonLoader-box--image" />
            <div className="SkeletonLoader-content">
              <div className="SkeletonLoader-line SkeletonLoader-line--title" />
              <div className="SkeletonLoader-line" />
              <div className="SkeletonLoader-line SkeletonLoader-line--short" />
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="SkeletonLoader SkeletonLoader--list">
            <div className="SkeletonLoader-line" />
            <div className="SkeletonLoader-line" />
            <div className="SkeletonLoader-line SkeletonLoader-line--short" />
          </div>
        );
      
      default:
        return (
          <div className="SkeletonLoader">
            <div className="SkeletonLoader-line" />
            <div className="SkeletonLoader-line" />
            <div className="SkeletonLoader-line SkeletonLoader-line--short" />
          </div>
        );
    }
  };

  if (count > 1) {
    return (
      <div className="SkeletonLoader-container">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default SkeletonLoader;

