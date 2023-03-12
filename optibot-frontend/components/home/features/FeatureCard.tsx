import React, { useRef } from 'react';

type CardProps = {
    title: string;
    description: string;
    video: string
};

const FeatureCard = ({ title, description, video }: CardProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <div className="block text-white" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <video
                ref={videoRef}
                src={video}
                className="h-56 w-full rounded-md object-cover sm:h-64 lg:h-72"
                loop
                muted
            />

            <div className="mt-4 px-8">
                <h2 className="font-medium text-left">{title}</h2>
                <p className="mt-4 text-left text-lg">{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
