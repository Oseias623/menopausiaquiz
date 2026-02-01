import React from 'react';

interface WhyItWorksContent {
    title: string;
    description: string;
    items: string[];
    closing: string;
}

interface WhyItWorksProps {
    content: WhyItWorksContent;
}

const WhyItWorks: React.FC<WhyItWorksProps> = ({ content }) => {
    return (
        <section className="py-24 bg-navy-900 text-white relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] rounded-full bg-gold-600 blur-[120px]"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                        {content.title}
                    </h2>
                    <div className="h-1 w-24 bg-gold-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-12">
                    <p className="text-xl text-slate-300 leading-relaxed text-center max-w-3xl mx-auto whitespace-pre-line">
                        {content.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {content.items.map((item, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-gold-500/50 transition-colors">
                                <p className="text-lg font-medium text-slate-100 flex items-center">
                                    <span className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mr-3 text-sm font-bold">✓</span>
                                    {item}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-2xl font-serif text-gold-400 italic font-medium">
                            {content.closing}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyItWorks;
