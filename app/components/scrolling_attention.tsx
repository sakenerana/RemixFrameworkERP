// src/components/ScrollingAttentionBanner.tsx
import React from 'react';

interface ScrollingAttentionBannerProps {
    text?: string;
    speed?: number;
    backgroundColor?: string;
    textColor?: string;
}

const ScrollingAttentionBanner: React.FC<ScrollingAttentionBannerProps> = ({
    text = "Important Notice!",
    speed = 15,
    backgroundColor = "bg-yellow-100",
    textColor = "text-yellow-800"
}) => {
    return (
        <div className={`w-full overflow-hidden ${backgroundColor} border-opacity-30`}>
            <div className="whitespace-nowrap" style={{ animation: `infinite-scroll ${speed}s linear infinite` }}>
                {[...Array(8)].map((_, i) => (
                    <span key={i} className={`inline-block mx-8 font-medium text-[11px] ${textColor}`}>
                        {text}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ScrollingAttentionBanner;