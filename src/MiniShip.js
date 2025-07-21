function MiniEnemy({ x, y }) {
  return (
    <img
      src={process.env.PUBLIC_URL + "/mini-ship.png"}
      alt="mini-enemy"
      className="mini-enemy"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '80px',
        height: '80px'
      }}
    />
  );
}

export default MiniEnemy;



