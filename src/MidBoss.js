function MidBoss({ x, y }) {
  return (
    <img
      src={process.env.PUBLIC_URL + "/midboss.png"}
      alt="mid-boss"
      className="mid-boss"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '150px',
        height: '110px',
        transform: 'translateX(-50%)'
      }}
    />
  );
}

export default MidBoss;

