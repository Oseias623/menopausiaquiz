import React from 'react';

interface ProductShowcaseContent {
    title: string;
    description: string;
    items: string[];
    closing: string;
    image: string;
}

interface ProductShowcaseProps {
    content: ProductShowcaseContent;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ content }) => {
    return (
        <section className="py-24 bg-white text-navy-900 border-t border-navy-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Mockup Column */}
                    <div className="order-2 lg:order-1 relative">
                        <div className="absolute inset-0 bg-gold-400/10 rounded-full blur-[100px] transform scale-75"></div>
                        <img
                            src={content.image}
                            alt="Book Mockup"
                            width="500"
                            height="750"
                            className="relative z-10 w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                        />
                    </div>

                    {/* Content Column */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 leading-tight">
                            {content.title}
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            {content.description}
                        </p>

                        <ul className="space-y-4">
                            {content.items.map((item, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0"></div>
                                    <span className="text-navy-800 text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="bg-navy-50 p-6 rounded-2xl border border-navy-100 mt-8">
                            <p className="text-lg font-serif font-medium text-navy-900 italic">
                                {content.closing}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
