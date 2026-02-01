import React from 'react';

interface DailyRoutineAppContent {
    title: string;
    subtitle: string;
    description: string;
    items: string[];
    closing: string;
    image: string;
}

interface DailyRoutineAppProps {
    content: DailyRoutineAppContent;
}

const DailyRoutineApp: React.FC<DailyRoutineAppProps> = ({ content }) => {
    return (
        <section className="py-24 bg-navy-50 text-navy-900 border-t border-navy-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Column */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div>
                            <span className="text-gold-500 font-bold uppercase tracking-wider text-sm mb-2 block">
                                {content.subtitle}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 leading-tight">
                                {content.title}
                            </h2>
                        </div>

                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            {content.description}
                        </p>

                        <div className="space-y-6">
                            {content.items.map((item, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center mt-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gold-500"></div>
                                    </div>
                                    <span className="text-navy-800 text-lg font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-navy-100 shadow-sm mt-8">
                            <p className="text-lg font-serif font-medium text-navy-900 italic">
                                {content.closing}
                            </p>
                        </div>
                    </div>

                    {/* Mockup Column */}
                    <div className="relative order-1 lg:order-2">
                        {/* Decorative Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 rounded-full blur-3xl -z-10"></div>

                        <img
                            src={content.image}
                            alt="App Daily Routine Interface"
                            width="500"
                            height="750"
                            className="relative z-10 w-full max-w-sm mx-auto transform hover:-translate-y-2 transition-transform duration-500 drop-shadow-2xl rounded-3xl border-4 border-navy-900/10"
                        />
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 lg:right-10 bg-white p-4 rounded-xl shadow-xl flex items-center space-x-3 max-w-xs z-20 border border-gold-400/20">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-navy-900">Rutina organizada</p>
                                <p className="text-xs text-slate-500">Mente tranquila</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DailyRoutineApp;
