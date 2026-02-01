import React, { useEffect, useRef } from 'react';

interface TestimonialItem {
    quote: string;
    author: string;
    image?: string;
}

interface RealTestimonialsContent {
    title: string;
    subtitle?: string;
    items: TestimonialItem[];
    closing: string;
}

interface RealTestimonialsProps {
    content: RealTestimonialsContent;
}

const RealTestimonials: React.FC<RealTestimonialsProps> = ({ content }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationFrameId: number;
        let lastScrollTime = 0;
        const speed = 0.5; // Pixels per frame

        const scroll = (timestamp: number) => {
            if (!lastScrollTime) lastScrollTime = timestamp;

            if (scrollContainer) {
                if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2) {
                    scrollContainer.scrollLeft = 0;
                } else {
                    scrollContainer.scrollLeft += speed;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Duplicate items to create infinite scroll effect
    const displayItems = [...content.items, ...content.items, ...content.items];

    return (
        <section className="py-24 bg-navy-50 text-navy-900 border-t border-navy-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 leading-tight">
                        {content.title}
                    </h2>
                    {content.subtitle && (
                        <p className="text-lg text-slate-600 font-medium italic">
                            {content.subtitle}
                        </p>
                    )}
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 px-4 pb-8 scrollbar-hide snap-x"
                style={{ scrollBehavior: 'auto' }}
            >
                {displayItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-[300px] md:w-[350px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden snap-center flex flex-col"
                    >
                        <div className="p-8 flex flex-col flex-grow">
                            <div className="flex-grow">
                                <p className="text-lg text-slate-700 leading-relaxed italic mb-6 relative">
                                    <span className="text-4xl text-gold-300 absolute -top-4 -left-2 font-serif opacity-50">“</span>
                                    {item.quote}
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-50 mt-auto">
                                <p className="font-bold text-navy-900 text-sm uppercase tracking-wide opacity-80">— {item.author}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-12 text-center">
                <p className="text-xl md:text-2xl font-serif font-bold text-navy-900 opacity-80 max-w-2xl mx-auto leading-tight">
                    {content.closing}
                </p>
            </div>
        </section>
    );
};

export default RealTestimonials;
