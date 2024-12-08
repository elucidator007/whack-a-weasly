'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [score, setScore] = useState(0)
  const [curr, setCurr] = useState(0)
  const [clicked, setClicked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [gameActive, setGameActive] = useState(true)
  const [speed, setSpeed] = useState(1000)
  const boxes = Array(9).fill(0)

  const calculateSpeed = (currentScore) => {
    const levelSpeed = Math.max(300, 1000 - Math.floor(currentScore / 10) * 150)
    return levelSpeed
  }

  const handleClick = (index) => {
    if (index === curr && !clicked && gameActive) {
      const newScore = score + 1
      setScore(newScore)
      setClicked(true)
      
      setSpeed(calculateSpeed(newScore))
    }
  }

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive])

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setCurr(() => Math.floor(Math.random() * 9))
      setClicked(false)
    }, speed)

    return () => clearInterval(interval)
  }, [speed, gameActive])

  const resetGame = () => {
    setScore(0)
    setTimeLeft(90)
    setGameActive(true)
    setSpeed(1000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentLevel = Math.floor(score / 10) + 1

  const Candles = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${20 + i * 20}%`,
            animationDelay: `${i * 0.5}s`,
            top: '-20px'
          }}
        >
          🕯️
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1016] flex justify-center items-center flex-col p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-10"></div>
      
      <Candles />

      <div className="relative z-10 w-full max-w-2xl">
        <h1 className="text-6xl mb-8 text-[#e2b53f] font-serif text-center animate-pulse">
          Whack-a-Weasley
        </h1>
        
        <div className="flex justify-between items-center mb-6 text-[#c19a49] font-serif">
          <div className="text-2xl">
            <span className="mr-2">✨</span>
            Score: {score}
            <span className="ml-2">✨</span>
          </div>
          <div className="text-2xl">
            Level {currentLevel}
          </div>
          <div className="text-2xl">
            <span className="mr-2">⏳</span>
            Time: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="text-center mb-4 text-[#8b7355] font-serif">
          {speed}ms - {gameActive && `Next level at ${Math.ceil(score / 10) * 10} points`}
        </div>

        <div className="grid grid-cols-3 gap-6 bg-[#1c1f2e] p-8 rounded-2xl shadow-[0_0_15px_rgba(226,181,63,0.3)] backdrop-blur-sm">
          {boxes.map((item, index) => (
            <div 
              key={index} 
              className={`
                relative
                h-32 w-32 
                border-2 
                border-[#2a2f45]
                rounded-xl
                bg-gradient-to-br
                from-[#161823]
                to-[#1c1f2e]
                cursor-pointer 
                transform 
                transition-all 
                duration-300
                hover:shadow-[0_0_10px_rgba(226,181,63,0.4)]
                overflow-hidden
                ${curr === index && gameActive ? 'shadow-[0_0_15px_rgba(226,181,63,0.5)]' : ''}
              `}
              onClick={() => handleClick(index)}
            >
              {curr === index && gameActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <img 
                    src="https://i.pinimg.com/736x/8b/4f/80/8b4f80a02dec675cdcc9b3a09dcb2974.jpg"
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
              )}
            </div>
          ))}
        </div>

        {!gameActive && (
          <div className="mt-6 text-center">
            <div className="text-2xl text-[#e2b53f] mb-4 font-serif">
              Game Over! Final Score: {score}
            </div>
            <div className="text-[#c19a49] mb-4">
              You reached Level {currentLevel}!
            </div>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-[#2a2f45] text-[#e2b53f] rounded-lg font-serif
                hover:bg-[#363b54] transition-colors duration-300
                shadow-[0_0_10px_rgba(226,181,63,0.3)]"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-8 text-[#8b7355] text-center font-serif italic">
          {gameActive 
            ? "Bloody hell! Try to catch me if you can! - Ron Weasley"
            : "Well played! Care for another round? - Ron Weasley"
          }
        </div>
      </div>
    </div>
  );
}