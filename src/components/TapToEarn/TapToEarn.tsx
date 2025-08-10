import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap } from 'lucide-react';

interface FloatingText {
  id: string;
  x: number;
  y: number;
  value: number;
}

interface ClickEffect {
  id: string;
  x: number;
  y: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const TapToEarn: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [energy, setEnergy] = useState(1000);
  const [maxEnergy] = useState(1000);
  const [coinsPerTap, _] = useState(1);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => Math.min(prev + 2, maxEnergy));
    }, 1000);
    return () => clearInterval(interval);
  }, [maxEnergy]);

  // Combo reset timer
  useEffect(() => {
    if (combo > 0) {
      const timer = setTimeout(() => {
        setCombo(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [combo, lastTapTime]);

  // Particle animation
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.5, // gravity
          life: particle.life - 0.02,
        })).filter(particle => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  const handleTap = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (energy < 1) return;

    const now = Date.now();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Combo system
    if (now - lastTapTime < 500) {
      setCombo(prev => Math.min(prev + 1, 10));
    } else {
      setCombo(1);
    }
    setLastTapTime(now);

    const bonusMultiplier = 1 + (combo * 0.1);
    const earnedCoins = Math.floor(coinsPerTap * bonusMultiplier);

    // Update coins and energy
    setCoins(prev => prev + earnedCoins);
    setEnergy(prev => Math.max(prev - 1, 0));

    // Add floating text
    const textId = `text-${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id: textId, x, y, value: earnedCoins }]);

    // Add click effect
    const effectId = `effect-${Date.now()}-${Math.random()}`;
    setClickEffects(prev => [...prev, { id: effectId, x, y }]);

    // Add particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 3 + Math.random() * 3;
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);

    // Remove floating text after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(text => text.id !== textId));
    }, 2000);

    // Remove click effect after animation
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== effectId));
    }, 1000);

    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(combo > 5 ? [50, 30, 50] : 50);
    }
  }, [energy, coinsPerTap, combo, lastTapTime]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white p-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <Coins className="w-6 h-6 text-yellow-400" />
          <motion.span 
            key={coins}
            initial={{ scale: 1.2, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-xl font-bold"
          >
            {formatNumber(coins)}
          </motion.span>
        </div>
        
        <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-semibold">
            {energy}/{maxEnergy}
          </span>
        </div>
      </div>

      {/* Combo Display */}
      <AnimatePresence>
        {combo > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-6 py-2 shadow-lg">
              <span className="text-white font-bold text-lg">
                🔥 COMBO x{combo}! 
              </span>
              <span className="text-yellow-200 text-sm ml-2">
                +{Math.floor(combo * 10)}% bonus
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Energy Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="bg-black/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${(energy / maxEnergy) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Coin Button */}
      <div className="relative mb-8">
        <motion.div
          className="relative cursor-pointer select-none"
          whileTap={{ scale: 0.95 }}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onClick={handleTap}
          style={{ userSelect: 'none' }}
        >
          {/* Coin Shadow */}
          <div className="absolute inset-0 bg-yellow-600/50 rounded-full blur-xl scale-110" />
          
          {/* Main Coin */}
          <motion.div
            className={`relative w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-8 border-yellow-200 shadow-2xl ${energy < 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            animate={{
              scale: isPressed ? 0.95 : 1,
              boxShadow: isPressed 
                ? '0 10px 40px rgba(234, 179, 8, 0.6)' 
                : '0 20px 60px rgba(234, 179, 8, 0.4)',
            }}
            transition={{ duration: 0.1 }}
          >
            {/* Coin Inner Design */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-500 flex items-center justify-center">
              <div className="text-6xl font-bold text-yellow-800 drop-shadow-lg">₵</div>
            </div>

            {/* Shine Effect */}
            <motion.div
              className="absolute top-4 left-4 w-16 h-16 bg-white/30 rounded-full blur-md"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Click Effects */}
          <AnimatePresence>
            {clickEffects.map((effect) => (
              <motion.div
                key={effect.id}
                className="absolute pointer-events-none"
                style={{
                  left: effect.x - 32,
                  top: effect.y - 32,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1.5, 2],
                  opacity: [1, 0.5, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {/* Ripple Effect */}
                <div className="w-16 h-16 border-4 border-yellow-400 rounded-full" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Particles */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute pointer-events-none w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: particle.x - 4,
                  top: particle.y - 4,
                  opacity: particle.life,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              />
            ))}
          </AnimatePresence>

          {/* Floating Text */}
          <AnimatePresence>
            {floatingTexts.map((text) => (
              <motion.div
                key={text.id}
                className="absolute pointer-events-none text-2xl font-bold text-yellow-300 drop-shadow-lg"
                style={{
                  left: text.x - 20,
                  top: text.y - 20,
                }}
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{ 
                  y: -60, 
                  opacity: 0, 
                  scale: 1.2,
                  x: (Math.random() - 0.5) * 40 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                +{text.value}
                {combo > 1 && (
                  <span className="text-orange-400 text-lg ml-1">
                    ×{combo}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm text-center">
          <div className="text-sm text-gray-300 mb-1">Coins per Tap</div>
          <div className="text-xl font-bold text-yellow-400">{coinsPerTap}</div>
        </div>
        
        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm text-center">
          <div className="text-sm text-gray-300 mb-1">Total Taps</div>
          <div className="text-xl font-bold text-cyan-400">{coins}</div>
        </div>
      </div>

      {/* Energy Warning */}
      {energy < 50 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-red-400 text-center"
        >
          ⚡ Low Energy! Wait for regeneration...
        </motion.div>
      )}
    </div>
  );
};

export default TapToEarn;
