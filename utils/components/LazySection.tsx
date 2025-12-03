import React, { useState, useRef, useEffect } from 'react';

interface LazySectionProps {
    children: React.ReactNode;
    placeholder: React.ReactNode;
    className?: string;
}

const LazySection: React.FC<LazySectionProps> = ({ children, placeholder, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '0px', // Start loading when the section enters the viewport
                threshold: 0.01
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div ref={ref} className={className}>
            {isVisible ? children : placeholder}
        </div>
    );
};

export default LazySection;