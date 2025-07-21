// Bullet.jsx
import React from 'react';

const Bullet = ({ x, y }) => {
  return (
    <div
      className="bullet"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default Bullet;

