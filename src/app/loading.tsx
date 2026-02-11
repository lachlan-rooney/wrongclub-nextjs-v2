'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <style>{`
        @keyframes swing {
          0% { transform: rotate(-45deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(-45deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .golf-club {
          animation: swing 1.5s ease-in-out infinite;
          transform-origin: top left;
        }
        
        .golf-ball {
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className="flex flex-col items-center gap-8">
        {/* Golf Swing Animation */}
        <div className="relative w-32 h-32">
          {/* Golf Club */}
          <div className="golf-club absolute bottom-0 left-1/2 w-24 h-1 bg-[#5f6651] rounded-full"></div>
          
          {/* Golf Ball */}
          <div className="golf-ball absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-2 border-[#5f6651] rounded-full"></div>
        </div>
        
        <p className="text-[#5f6651] font-bold text-lg">Loading your game...</p>
      </div>
    </div>
  )
}
