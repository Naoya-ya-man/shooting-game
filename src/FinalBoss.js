function FinalBoss({ x, y }) {
  return (
    <img
      src={process.env.PUBLIC_URL + "/ufo.png"}
      alt="final-boss"
      className="final-boss"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '250px',
        height: '250px',
        transform: 'translateX(-50%)'
      }}
    />
  );
}

export default FinalBoss;


