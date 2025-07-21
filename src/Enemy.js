function Enemy({ x, y }) {
  return (
    <img
      src={process.env.PUBLIC_URL + "/invader.png"}
      alt="invader"
      className="enemy"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '60px',
        height: '60px'
      }}
    />
  );
}

export default Enemy;


