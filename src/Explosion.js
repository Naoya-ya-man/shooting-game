function Explosion({ x, y, size = 1 }) {
  const pixelSize = 40 * size;

  return (
    <img
      src={process.env.PUBLIC_URL + "/explosion.png"}
      alt="explosion"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        transform: 'translate(-50%, -50%)',
        animation: 'explode 0.8s ease-out',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}

export default Explosion;


