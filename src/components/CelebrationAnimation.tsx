import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Trophy, Sparkles } from 'lucide-react';

interface CelebrationAnimationProps {
  isVisible: boolean;
  taskTitle: string;
  onAnimationComplete: () => void;
}

const CelebrationAnimation: React.FC<CelebrationAnimationProps> = ({
  isVisible,
  taskTitle,
  onAnimationComplete,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // 컨페티 애니메이션 시작
      setShowConfetti(true);
      
      // 메시지 표시
      const messageTimer = setTimeout(() => {
        setShowMessage(true);
      }, 300);

      // 전체 애니메이션 완료
      const completeTimer = setTimeout(() => {
        setShowConfetti(false);
        setShowMessage(false);
        onAnimationComplete();
      }, 3000);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isVisible, onAnimationComplete]);

  if (!isVisible) return null;

  // 컨페티 파티클 생성
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'][Math.floor(Math.random() * 7)],
  }));

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 오버레이 배경 */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
      
      {/* 컨페티 애니메이션 */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 opacity-80"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.color,
                animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s forwards`,
                transform: 'rotate(45deg)',
              }}
            />
          ))}
        </div>
      )}

      {/* 중앙 축하 메시지 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center transform transition-all duration-500 ${
            showMessage ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-8'
          }`}
        >
          {/* 아이콘 애니메이션 */}
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle 
                size={48} 
                className="text-green-600 dark:text-green-400 animate-bounce" 
              />
            </div>
            
            {/* 주변 장식 아이콘들 */}
            <Star 
              size={24} 
              className="absolute -top-2 -right-2 text-yellow-500 animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
            <Trophy 
              size={20} 
              className="absolute -bottom-1 -left-2 text-orange-500 animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            <Sparkles 
              size={18} 
              className="absolute top-1/2 -right-6 text-purple-500 animate-pulse"
              style={{ animationDelay: '1.5s' }}
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            🎉 축하합니다! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            작업이 완료되었습니다
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              "{taskTitle}"
            </p>
          </div>
        </div>
      </div>

      {/* CSS 애니메이션을 위한 스타일 */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CelebrationAnimation;