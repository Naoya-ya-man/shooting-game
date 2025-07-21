function Player({ x }) {
  return (
    <img
      src={process.env.PUBLIC_URL + "/ff.png"}
      alt="player"
      className="player"
      style={{
        position: 'absolute',
        bottom: '10px',
        left: `${x}%`,
        width: '150px',
        height: '150px',
        transform: 'translateX(-50%)'
      }}
    />
  );
}

export default Player;




