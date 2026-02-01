import React, { useEffect, useRef, useState } from 'react';

interface ProblemSectionProps {
  content: {
    title: string;
    subtitle: string;
    text: string;
    text2: string;
    highlight: string;
    closing: string;
    cta: string;
    checkoutUrl?: string;
  }
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 bg-white text-navy-900 relative overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gold-400 blur-[100px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-navy-900 blur-[100px]"></div>
      </div>

      <div className={`max-w-4xl mx-auto px-4 sm:px-6 relative z-10 transition-transform duration-1000 transform ${isVisible ? 'translate-y-0' : 'translate-y-20'}`}>
        <div className="text-center space-y-12">

          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 leading-tight">
              {content.title}
            </h2>
            <h3 className="text-2xl md:text-4xl font-serif font-bold text-navy-900 opacity-60">
              {content.subtitle}
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-lg md:text-xl text-navy-800 leading-relaxed font-medium">
            <p className="font-serif italic font-light text-2xl">
              "{content.text}"
            </p>

            <p className="text-slate-600">
              {content.text2}
            </p>

            <div className="bg-navy-50 p-8 rounded-2xl border-l-4 border-gold-500 shadow-sm my-8 transform transition-transform duration-700 hover:scale-[1.02]">
              <p className="text-xl md:text-2xl font-bold text-navy-900">
                {content.highlight}
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-slate-600">
                {content.closing}
              </p>

              <a
                href={content.checkoutUrl || "#pricing"}
                target={content.checkoutUrl ? "_blank" : "_self"}
                rel={content.checkoutUrl ? "noopener noreferrer" : ""}
                className="inline-block bg-gold-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gold-600 hover:shadow-gold-500/30 hover:scale-105 transform transition-all duration-300 uppercase tracking-wide"
              >
                {content.cta}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
