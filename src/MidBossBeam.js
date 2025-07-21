import React from 'react';

const MidBossBeam = ({ x, y }) => {
  return (
    <div
      className="boss-beam"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '8px',
        height: '25px',
        backgroundColor: 'red',
      }}
    />
  );
};

export default MidBossBeam;
