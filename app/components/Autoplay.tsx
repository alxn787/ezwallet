"use-client"
import { useEffect, useRef } from "react";

export const AutoPlayVideo = () => {
        const videoRef = useRef<HTMLVideoElement | null>(null); 
      
        useEffect(() => {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                videoRef.current?.play();
              } else {
                videoRef.current?.pause();
              }
            },
            { threshold: 0.5 } // Play when at least 50% of the video is visible
          );
      
          if (videoRef.current) {
            observer.observe(videoRef.current);
          }
      
          return () => {
            if (videoRef.current) {
              observer.unobserve(videoRef.current);
            }
          };
        }, []);
      
        return (
          <video
            ref={videoRef}
            src="/demo.mp4"
            muted
            loop
            playsInline
            className="w-[760px]"
          />
        );
      };