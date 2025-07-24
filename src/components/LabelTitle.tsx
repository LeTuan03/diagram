import React from 'react';

interface LabelTitleProps {
    title: string;
    number?: string | number;
    width?: 'full' | 'fixed';
}

export const LabelTitleComponent: React.FC<LabelTitleProps> = ({
    title,
    number,
    width = 'full',
}) => {
    return (
        <div
            className={`
                ${width === 'full' ? 'w-full' : 'w-96'}
                h-7
                relative
                flex items-center
                px-4
                group
            `}
        >
            {/* Transparent fading background */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="
                        w-full h-full
                        bg-gradient-to-r from-black via-blue-500/30 to-transparent
                        backdrop-blur-sm
                        border border-cyan-300/30
                        group-hover:border-cyan-200/50
                        shadow-md shadow-cyan-500/10
                        group-hover:shadow-cyan-300/20
                        transition-all duration-500
                    "
                    style={{
                        clipPath: 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 20px 100%)',
                    }}
                />
            </div>

            {/* Left Accent Triangle */}
            <div className="absolute left-0 top-0 w-8 h-full flex items-center justify-center z-10">
                <div className="relative">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-cyan-300/80 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent" />
                    <div className="absolute inset-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-cyan-100/60 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent" />
                </div>
            </div>

            {/* Text content */}
            <div className="relative z-10 flex-1">
                <span className="
                    text-white 
                    font-semibold 
                    text-sm 
                    uppercase 
                    tracking-wide 
                    drop-shadow 
                    pl-6
                ">
                    {title}
                </span>
            </div>

            {/* Optional number bubble */}
            {number && (
                <div className="relative z-10 mr-6">
                    <span className="
                        text-cyan-100 
                        text-xs 
                        font-medium 
                        px-2 py-0.5 
                        rounded 
                        border border-cyan-300/30 
                        backdrop-blur-sm 
                        bg-cyan-400/10
                    ">
                        {number}
                    </span>
                </div>
            )}

            {/* Right glow accents */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                <div className="flex flex-col space-y-0.5">
                    <div className="w-4 h-px bg-gradient-to-r from-cyan-400/80 to-transparent" />
                    <div className="w-3 h-px bg-gradient-to-r from-cyan-300/50 to-transparent" />
                    <div className="w-2 h-px bg-gradient-to-r from-cyan-300/30 to-transparent" />
                    <div className="w-1 h-px bg-gradient-to-r from-cyan-200/20 to-transparent" />
                </div>
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div
                    className="
                        w-full h-full
                        bg-gradient-to-r from-cyan-300/10 via-blue-300/5 to-transparent
                        backdrop-blur-md
                        shadow-xl shadow-cyan-500/20
                    "
                    style={{
                        clipPath: 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 20px 100%)',
                    }}
                />
            </div>
        </div>
    );
};
