import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Zap, Target } from "lucide-react";
import {
  useGetTappingInfo,
  useGetTappingStatus,
  useProcessTap,
} from "@/Api/queriesAndMutations";
import { toast } from "sonner";

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
  // Mobile detection for performance optimization
  const isMobile = useMemo(() => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  }, []);

  // API hooks
  const { data: tappingInfo, isLoading: isLoadingInfo } = useGetTappingInfo();
  const { data: tappingStatus, isLoading: isLoadingStatus } =
    useGetTappingStatus();
  console.log("tappingStatus", tappingStatus);
  const processTapMutation = useProcessTap();

  // Performance refs
  const animationRef = useRef<number | undefined>(undefined);
  const lastTapTime = useRef(0);

  // Local state for UI effects
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  // Extract data from API response
  const userState = tappingInfo?.data?.user_state;
  const settings = tappingInfo?.data?.settings;
  const remainingTaps = userState?.remaining_taps_today ?? 0;
  const currentTaps = userState?.current_taps ?? 0;
  const pointsPerTap = settings?.points_per_tap ?? 1;
  const rewardAmount = settings?.reward_amount ?? 10;
  const tapsForReward = settings?.taps_for_reward ?? 5;

  // Check if tapping is enabled from status
  const isTappingEnabled = tappingStatus?.data?.status ?? false;

  // Balance state to track locally for immediate UI feedback
  const [localBalance, setLocalBalance] = useState<number | null>(null);

  // Initialize local balance from API when data loads
  useEffect(() => {
    if (tappingInfo?.data && localBalance === null) {
      // We'll use current_taps as balance for now, or you can add balance field to API
      setLocalBalance(currentTaps);
    }
  }, [tappingInfo, currentTaps, localBalance]);

  // Optimized particle animation using requestAnimationFrame
  useEffect(() => {
    if (particles.length === 0) return;

    const animateParticles = () => {
      setParticles((prev) => {
        const updated = prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.3, // reduced gravity for performance
            life: particle.life - (isMobile ? 0.03 : 0.02), // faster cleanup on mobile
          }))
          .filter((particle) => particle.life > 0);

        if (updated.length > 0) {
          animationRef.current = requestAnimationFrame(animateParticles);
        }

        return updated;
      });
    };

    animationRef.current = requestAnimationFrame(animateParticles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length, isMobile]);

  const handleTap = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      // Check if tapping is disabled by status
      if (!isTappingEnabled) {
        toast.error("Tapping is currently disabled. Please try again later.", {
          duration: 3000,
        });
        return;
      }

      // Debounce rapid taps
      const now = Date.now();
      if (now - lastTapTime.current < 100) return; // 100ms debounce
      lastTapTime.current = now;

      if (remainingTaps < 1 || processTapMutation.isPending) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      try {
        // Process the tap via API
        const response = await processTapMutation.mutateAsync(undefined);
        const tapData = response.data;

        // Batch state updates for better performance
        const textId = `text-${now}-${Math.random()}`;
        const effectId = `effect-${now}-${Math.random()}`;

        // Reduce particles on mobile for performance
        const particleCount = isMobile ? 3 : 6;
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
          const angle = (i / particleCount) * Math.PI * 2;
          const speed = isMobile ? 1.5 + Math.random() : 2 + Math.random() * 2;
          newParticles.push({
            id: `particle-${now}-${i}`,
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            life: isMobile ? 0.8 : 1, // shorter life on mobile
          });
        }

        // Update local balance for immediate feedback
        setLocalBalance(tapData.new_balance);

        // Batch UI state updates with limits to prevent performance issues
        setFloatingTexts((prev) => {
          const updated = [...prev, { id: textId, x, y, value: pointsPerTap }];
          return updated.slice(-5); // Keep only last 5 floating texts
        });
        setClickEffects((prev) => {
          const updated = [...prev, { id: effectId, x, y }];
          return updated.slice(-3); // Keep only last 3 click effects
        });
        setParticles((prev) => {
          const updated = [...prev, ...newParticles];
          return updated.slice(isMobile ? -15 : -30); // Limit particles: 15 on mobile, 30 on desktop
        });

        // Show reward notification if reward was issued
        if (tapData.reward_issued) {
          toast.success(`🎉 Reward earned! +${tapData.reward_amount} coins!`, {
            duration: 3000,
          });
        }

        // Optimized cleanup with single timeout
        setTimeout(
          () => {
            setFloatingTexts((prev) =>
              prev.filter((text) => text.id !== textId)
            );
            setClickEffects((prev) =>
              prev.filter((effect) => effect.id !== effectId)
            );
          },
          isMobile ? 1500 : 2000
        ); // faster cleanup on mobile

        // Haptic feedback for mobile (reduced intensity)
        if ("vibrate" in navigator) {
          navigator.vibrate(tapData.reward_issued ? [50, 25, 50] : 25);
        }
      } catch (error) {
        console.error("Tap processing failed:", error);
      }
    },
    [
      remainingTaps,
      processTapMutation,
      pointsPerTap,
      isMobile,
      isTappingEnabled,
    ]
  );

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  // Optimized animation configs for mobile
  const animationConfig = useMemo(
    () => ({
      transition: {
        duration: isMobile ? 0.15 : 0.3,
        ease: "easeOut" as const,
      },
      floatingText: {
        duration: isMobile ? 1.5 : 2,
        ease: "easeOut" as const,
      },
      clickEffect: {
        duration: isMobile ? 0.8 : 1,
        ease: "easeOut" as const,
      },
    }),
    [isMobile]
  );

  // Determine if the coin should be disabled
  const isCoinDisabled =
    !isTappingEnabled || remainingTaps < 1 || processTapMutation.isPending;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white p-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <Coins className="w-6 h-6 text-yellow-400" />
          <motion.span
            key={localBalance}
            initial={{ scale: 1.2, color: "#fbbf24" }}
            animate={{ scale: 1, color: "#ffffff" }}
            className="text-xl font-bold"
          >
            {isLoadingInfo ? "..." : formatNumber(localBalance ?? 0)}
          </motion.span>
        </div>

        <div className="flex items-center gap-2 bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="text-lg font-semibold">
            {remainingTaps}/{settings?.daily_tap_limit ?? 0}
          </span>
        </div>
      </div>

      {/* Status Warning */}
      {!isTappingEnabled && !isLoadingStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-500/20 border border-red-500 rounded-xl px-6 py-3 backdrop-blur-sm"
        >
          <div className="text-red-400 text-center font-semibold">
            🚫 Tapping is currently disabled
          </div>
          <div className="text-red-300 text-sm text-center mt-1">
            Please check back later
          </div>
        </motion.div>
      )}

      {/* Reward Progress Display */}
      <AnimatePresence>
        {tapsForReward > 0 && isTappingEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-6 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-white" />
                <span className="text-white font-bold text-lg">
                  {currentTaps}/{tapsForReward} taps to reward!
                </span>
              </div>
              <div className="text-yellow-200 text-sm text-center mt-1">
                {rewardAmount} coins reward
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remaining Taps Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="text-center text-sm text-gray-300 mb-2">
          Remaining Taps Today
        </div>
        <div className="bg-black/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <motion.div
            className={`h-full bg-gradient-to-r rounded-full ${
              isTappingEnabled
                ? "from-blue-400 to-cyan-400"
                : "from-gray-500 to-gray-600"
            }`}
            initial={{ width: "100%" }}
            animate={{
              width: `${
                (remainingTaps / (settings?.daily_tap_limit ?? 1)) * 100
              }%`,
            }}
            transition={animationConfig.transition}
          />
        </div>
      </div>

      {/* Main Coin Button */}
      <div className="relative mb-8">
        <motion.div
          className={`relative select-none ${
            isCoinDisabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          whileTap={isCoinDisabled ? {} : { scale: 0.95 }}
          onMouseDown={() => !isCoinDisabled && setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onClick={isCoinDisabled ? undefined : handleTap}
          style={{ userSelect: "none" }}
        >
          {/* Coin Shadow */}
          <div
            className={`absolute inset-0 rounded-full blur-xl scale-110 ${
              isCoinDisabled ? "bg-gray-600/30" : "bg-yellow-600/50"
            }`}
          />

          {/* Main Coin */}
          <motion.div
            className={`relative w-64 h-64 rounded-full border-8 shadow-2xl ${
              isCoinDisabled
                ? "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 border-gray-300 opacity-50"
                : "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-yellow-200"
            }`}
            animate={{
              scale: isPressed && !isCoinDisabled ? 0.95 : 1,
              boxShadow:
                isPressed && !isCoinDisabled
                  ? isMobile
                    ? "0 5px 20px rgba(234, 179, 8, 0.5)"
                    : "0 10px 40px rgba(234, 179, 8, 0.6)"
                  : isMobile
                  ? isCoinDisabled
                    ? "0 10px 30px rgba(107, 114, 128, 0.2)"
                    : "0 10px 30px rgba(234, 179, 8, 0.3)"
                  : isCoinDisabled
                  ? "0 20px 60px rgba(107, 114, 128, 0.2)"
                  : "0 20px 60px rgba(234, 179, 8, 0.4)",
            }}
            transition={{ duration: isMobile ? 0.05 : 0.1 }}
          >
            {/* Coin Inner Design */}
            <div
              className={`absolute inset-4 rounded-full flex items-center justify-center ${
                isCoinDisabled
                  ? "bg-gradient-to-br from-gray-300 to-gray-500"
                  : "bg-gradient-to-br from-yellow-200 to-yellow-500"
              }`}
            >
              <div
                className={`text-6xl font-bold drop-shadow-lg ${
                  isCoinDisabled ? "text-gray-700" : "text-yellow-800"
                }`}
              >
                ₵
              </div>
            </div>

            {/* Shine Effect - Only show when enabled and not on mobile */}
            {!isMobile && isTappingEnabled && (
              <motion.div
                className="absolute top-4 left-4 w-16 h-16 bg-white/30 rounded-full blur-md"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>

          {/* Click Effects - Only when tapping is enabled */}
          <AnimatePresence>
            {isTappingEnabled &&
              clickEffects.map((effect) => (
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
                  transition={animationConfig.clickEffect}
                >
                  {/* Ripple Effect */}
                  <div className="w-16 h-16 border-4 border-yellow-400 rounded-full" />
                </motion.div>
              ))}
          </AnimatePresence>

          {/* Particles - Only when tapping is enabled */}
          <AnimatePresence>
            {isTappingEnabled &&
              particles.map((particle) => (
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

          {/* Floating Text - Only when tapping is enabled */}
          <AnimatePresence>
            {isTappingEnabled &&
              floatingTexts.map((text) => (
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
                    x: (Math.random() - 0.5) * 40,
                  }}
                  exit={{ opacity: 0 }}
                  transition={animationConfig.floatingText}
                >
                  +{text.value}
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm text-center">
          <div className="text-sm text-gray-300 mb-1">Points per Tap</div>
          <div
            className={`text-xl font-bold ${
              isTappingEnabled ? "text-yellow-400" : "text-gray-400"
            }`}
          >
            {pointsPerTap}
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4 backdrop-blur-sm text-center">
          <div className="text-sm text-gray-300 mb-1">Current Taps</div>
          <div
            className={`text-xl font-bold ${
              isTappingEnabled ? "text-cyan-400" : "text-gray-400"
            }`}
          >
            {currentTaps}
          </div>
        </div>
      </div>

      {/* Taps Warning */}
      {isTappingEnabled && remainingTaps < 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-red-400 text-center"
        >
          {remainingTaps === 0
            ? "🚫 No taps remaining today! Come back tomorrow!"
            : `⚠️ Only ${remainingTaps} taps remaining today!`}
        </motion.div>
      )}

      {/* Loading State */}
      {(isLoadingInfo || isLoadingStatus) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-blue-400 text-center"
        >
          Loading your tapping data...
        </motion.div>
      )}
    </div>
  );
};

export default TapToEarn;
