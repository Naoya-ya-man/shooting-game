import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import Player from './Player';
import Enemy from './Enemy';
import MiniEnemy from './MiniShip';
import Bullet from './Bullet';
import Explosion from './Explosion';
import MidBoss from './MidBoss';
import MidBossBeam from './MidBossBeam';
import FinalBoss from './FinalBoss';

const BOSS_MAX_HP = 100;
const FINAL_BOSS_MAX_HP = 200;

function App() {
  const [playerX, setPlayerX] = useState(50);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [explosions, setExplosions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [isStarted, setIsStarted] = useState(false);
  const [boss, setBoss] = useState(null);
  const [bossBeams, setBossBeams] = useState([]);
  const [bossHits, setBossHits] = useState(0);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [finalBoss, setFinalBoss] = useState(null);
  const [finalBossBeams, setFinalBossBeams] = useState([]);
  const [finalBossHits, setFinalBossHits] = useState(0);
  const [finalBossExploded, setFinalBossExploded] = useState(false);
  const [isShooting, setIsShooting] = useState(false);
  const [isGameCleared, setIsGameCleared] = useState(false);

  const playerXRef = useRef(playerX);
  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

useEffect(() => {
  const checkOrientation = () => {
    const isMobileLandscape =
      window.innerWidth < 768 &&
      window.matchMedia('(orientation: landscape)').matches;
    setIsShooting(isMobileLandscape);
  };

  checkOrientation(); // 初回チェック
  window.addEventListener('resize', checkOrientation); // 向きが変わったとき

  return () => {
    window.removeEventListener('resize', checkOrientation);
  };
}, []);


  const playExplosionSound = () => {
    const audio = new Audio(process.env.PUBLIC_URL + '/explosion.mp3');
    audio.volume = 0.5;
    audio.play();
  };

  const resetGame = () => {
    setPlayerX(50);
    setBullets([]);
    setEnemies([]);
    setExplosions([]);
    setScore(0);
    setLives(5);
    setIsStarted(true);
    setBoss(null);
    setBossBeams([]);
    setBossHits(0);
    setBossDefeated(false);
    setFinalBoss(null);
    setFinalBossBeams([]);
    setFinalBossHits(0);
    setFinalBossExploded(false);
    setIsShooting(false);
    setIsGameCleared(false);
  };

  useEffect(() => {
    if (!isStarted) return;
    const handleKeyDown = (e) => {
      if (e.code === 'Space') setIsShooting(true);
      if (e.code === 'ArrowLeft' && lives > 0) {
        setPlayerX((prev) => Math.max(0, prev - 5));
      }
      if (e.code === 'ArrowRight' && lives > 0) {
        setPlayerX((prev) => Math.min(100, prev + 5));
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') setIsShooting(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isStarted, lives]);

  useEffect(() => {
    if (!isStarted || lives <= 0 || !isShooting) return;
    const interval = setInterval(() => {
      setBullets((prev) => [
        ...prev,
        { id: Date.now(), x: playerXRef.current, y: 85 },
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, [isShooting, isStarted, lives]);

  useEffect(() => {
    if (!isStarted || lives <= 0 || boss || finalBoss) return;
    const interval = setInterval(() => {
      const type = bossDefeated
        ? Math.random() < 0.5
          ? 'normal'
          : 'mini'
        : 'normal';
      setEnemies((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 0,
          hp: type === 'mini' ? 5 : 1,
          type,
        },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isStarted, lives, boss, bossDefeated, finalBoss]);

  useEffect(() => {
    if (!isStarted || lives <= 0) return;
    const interval = setInterval(() => {
      const updatedBullets = bullets
        .map((b) => ({ ...b, y: b.y - 5 }))
        .filter((b) => b.y > 0);
      const updatedEnemies = enemies
        .map((e) => {
          const hitBullet = bullets.find(
            (b) => Math.abs(b.x - e.x) < 4 && Math.abs(b.y - e.y) < 6
          );
          if (hitBullet) {
            playExplosionSound();
            const explosionId = crypto.randomUUID();
            setExplosions((prev) => [
              ...prev,
              {
                id: explosionId,
                x: e.x,
                y: e.y,
                size: e.type === 'mini' ? 2 : 1,
              },
            ]);
            setTimeout(
              () =>
                setExplosions((prev) =>
                  prev.filter((ex) => ex.id !== explosionId)
                ),
              800
            );
            const newHp = (e.hp ?? 1) - 1;
            if (newHp <= 0) {
              setScore((s) => s + 1);
              return null;
            } else {
              return { ...e, hp: newHp };
            }
          }
          if (e.y > 100) {
            setLives((l) => Math.max(0, l - 1));
            return null;
          }
          return { ...e, y: e.y + 2 };
        })
        .filter(Boolean);

      setBullets(updatedBullets);
      setEnemies(updatedEnemies);
    }, 100);
    return () => clearInterval(interval);
  }, [bullets, enemies, isStarted, lives]);

  useEffect(() => {
    if (score >= 20 && !boss && !bossDefeated) {
      setBoss({ x: 50, y: 5 });
    }
  }, [score, boss, bossDefeated]);

  useEffect(() => {
    if (!boss || lives <= 0) return;
    const interval = setInterval(() => {
      setBoss((prev) => {
        if (!prev) return null;
        const moveX = (Math.random() - 0.5) * 10;
        const newX = Math.max(0, Math.min(90, prev.x + moveX));
        return { ...prev, x: newX };
      });
      setBossBeams((prev) => [
        ...prev,
        { id: Date.now(), x: boss.x + 3, y: boss.y + 5 },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [boss, lives]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBossBeams((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y + 2 }))
          .filter((b) => {
            const hit = Math.abs(b.x - playerX) < 5 && b.y > 85;
            if (hit) {
              setLives((l) => Math.max(0, l - 1));
              return false;
            }
            return b.y < 100;
          })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [playerX]);

  useEffect(() => {
    if (!boss || lives <= 0) return;
    const interval = setInterval(() => {
      bullets.forEach((b) => {
        if (Math.abs(b.x - boss.x) < 6 && Math.abs(b.y - boss.y) < 6) {
          playExplosionSound();
          setBossHits((prev) => prev + 1);
          const explosionId = crypto.randomUUID();
          setExplosions((prev) => [
            ...prev,
            { id: explosionId, x: boss.x, y: boss.y, size: 2 },
          ]);
          setTimeout(
            () =>
              setExplosions((prev) =>
                prev.filter((ex) => ex.id !== explosionId)
              ),
            800
          );
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [bullets, boss, lives]);

  useEffect(() => {
    if (bossHits >= BOSS_MAX_HP) {
      setBoss(null);
      setBossDefeated(true);
    }
  }, [bossHits]);

  useEffect(() => {
    if (score >= 50 && !finalBoss && !finalBossExploded) {
      setFinalBoss({ x: 50, y: 5 });
    }
  }, [score, finalBoss, finalBossExploded]);

  useEffect(() => {
    if (!finalBoss || lives <= 0) return;
    const interval = setInterval(() => {
      setFinalBoss((prev) => {
        if (!prev) return null;
        const moveX = (Math.random() - 0.5) * 10;
        const newX = Math.max(0, Math.min(90, prev.x + moveX));
        return { ...prev, x: newX };
      });
      setFinalBossBeams((prev) => [
        ...prev,
        { id: Date.now(), x: finalBoss.x + 3, y: finalBoss.y + 5 },
      ]);
      setEnemies((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 0,
          hp: 1,
          type: 'normal',
        },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, [finalBoss, lives]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFinalBossBeams((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y + 2 }))
          .filter((b) => {
            const hit = Math.abs(b.x - playerX) < 5 && b.y > 85;
            if (hit) {
              setLives((l) => Math.max(0, l - 1));
              return false;
            }
            return b.y < 100;
          })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [playerX]);

  useEffect(() => {
    if (!finalBoss || lives <= 0) return;
    const interval = setInterval(() => {
      bullets.forEach((b) => {
      const bossCenterX = finalBoss.x;
      const bossCenterY = finalBoss.y;
        if (
          Math.abs(b.x - bossCenterX) < 6 &&
          Math.abs(b.y - bossCenterY) < 6
        ) {
          playExplosionSound();
          setFinalBossHits((prev) => prev + 1);
          const explosionId = crypto.randomUUID();
          setExplosions((prev) => [
            ...prev,
            { id: explosionId, x: finalBoss.x, y: finalBoss.y, size: 3 },
          ]);
          setTimeout(
            () =>
              setExplosions((prev) =>
                prev.filter((ex) => ex.id !== explosionId)
              ),
            800
          );
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, [bullets, finalBoss, lives]);

  useEffect(() => {
    if (finalBossHits >= FINAL_BOSS_MAX_HP) {
      setFinalBoss(null);
      setFinalBossBeams([]);
      setFinalBossExploded(true);
      setTimeout(() => {
        setIsGameCleared(true);
        setIsStarted(false);
      }, 1000);
    }
  }, [finalBossHits]);

  return (
    <>
      <div className='rotate-message'>
        スマホを横向きにしてプレイしてください
      </div>
      <div className='game-area'>
        {!isStarted && !isGameCleared && (
          <div className='start-screen'>
            <h1>侵略者の逆襲</h1>
            <p style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              ・スペースキー長押しでビーム発射
              <br />
              ・矢印キー（←・→）で移動
            </p>
            <button onClick={() => setIsStarted(true)} className='start-button'>
              ゲーム開始
            </button>
          </div>
        )}

        {isGameCleared && (
          <div className='hud centered'>
            <div>🎉 ゲームクリア！ 🎉</div>
            <button
              className='start-button'
              onClick={resetGame}
              style={{ marginTop: '1rem' }}
            >
              もう一度遊ぶ
            </button>
          </div>
        )}

        {isStarted && (
          <>
            <div className='hud'>
              スコア: {score}　ライフ: {'♥'.repeat(Math.max(lives, 0))}
            </div>
            {boss && (
              <div className='boss-hp-bar'>
                <div
                  className='boss-hp-inner'
                  style={{
                    width: `${Math.max(
                      0,
                      ((BOSS_MAX_HP - bossHits) / BOSS_MAX_HP) * 100
                    )}%`,
                  }}
                />
              </div>
            )}
            {finalBoss && !finalBossExploded && (
              <div className='boss-hp-bar' style={{ top: '4rem' }}>
                <div
                  className='boss-hp-inner'
                  style={{
                    width: `${Math.max(
                      0,
                      ((FINAL_BOSS_MAX_HP - finalBossHits) /
                        FINAL_BOSS_MAX_HP) *
                        100
                    )}%`,
                    backgroundColor: 'red',
                  }}
                />
              </div>
            )}


              {/* スマホ移動ボタン */}
              {window.innerWidth < 768 && (
                <div className="touch-controls">
                  <button onTouchStart={() => setPlayerX((x) => Math.max(0, x - 5))}>←</button>
                  <button onTouchStart={() => setPlayerX((x) => Math.min(100, x + 5))}>→</button>
                </div>
              )}



            <Player x={playerX} />
            {bullets.map((b) => (
              <Bullet key={b.id} x={b.x} y={b.y} />
            ))}
            {enemies.map((e) =>
              e.type === 'mini' ? (
                <MiniEnemy key={e.id} x={e.x} y={e.y} />
              ) : (
                <Enemy key={e.id} x={e.x} y={e.y} />
              )
            )}
            {explosions.map((ex) => (
              <Explosion key={ex.id} x={ex.x} y={ex.y} size={ex.size} />
            ))}
            {boss && <MidBoss x={boss.x} y={boss.y} />}
            {bossBeams.map((b) => (
              <MidBossBeam key={b.id} x={b.x} y={b.y} />
            ))}
            {finalBoss && !finalBossExploded && (
              <FinalBoss x={finalBoss.x} y={finalBoss.y} />
            )}
            {finalBossBeams.map((b) => (
              <MidBossBeam key={b.id} x={b.x} y={b.y} />
            ))}
            {lives <= 0 && (
              <div className='hud centered'>
                <div>GAME OVER</div>
                <button
                  className='start-button'
                  onClick={resetGame}
                  style={{ marginTop: '1rem' }}
                >
                  コンティニュー
                </button>
              </div>
            )}
          </>
        )}
      </div>{' '}
      {/* ← game-area の閉じタグ */}
    </>
  );
}

export default App;
