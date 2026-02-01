import React from 'react';

interface RecipesSectionContent {
    title: string;
    cards: {
        image: string;
        text: string;
    }[];
    items: string[];
}

interface RecipesSectionProps {
    content: RecipesSectionContent;
}

const RecipesSection: React.FC<RecipesSectionProps> = ({ content }) => {
    return (
        <section className="py-24 bg-white text-navy-900 border-t border-navy-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy-900 leading-tight">
                        {content.title}
                    </h2>
                    <div className="h-1 w-24 bg-gold-500 mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {content.cards.map((card, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/5] bg-slate-100">
                            <img
                                src={card.image}
                                alt={card.text}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent flex items-end p-6">
                                <p className="text-white font-medium text-lg leading-snug shadow-sm">{card.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid gap-6 max-w-2xl mx-auto text-center">
                    {content.items.map((item, index) => (
                        <p key={index} className="text-lg text-slate-600 leading-relaxed font-medium">
                            {item}
                        </p>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default RecipesSection;
