
import React from 'react';
import { Testimonial } from '../types';
import Icon from './Icon';

interface TestimonialsProps {
    testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
    return (
        <section id="testimonials" className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 md:text-5xl mb-6">Histórias de quem já está mais leve</h2>
                    <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(testimonials.length > 0 ? testimonials : Array(3).fill(null)).map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative">
                            <div className="absolute top-6 right-8 text-amber-200">
                                <Icon name="Quote" size={48} className="opacity-20 transform rotate-12" />
                            </div>

                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl mr-4 uppercase">
                                    {t?.author ? t.author.charAt(0) : "A"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{t?.author || "Ana Maria"}</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{t?.role || "Cliente Verificada"}</p>
                                </div>
                            </div>

                            <div className="flex text-amber-500 mb-4 space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Icon key={star} name="Star" size={16} className="fill-current" />
                                ))}
                            </div>

                            <p className="text-slate-600 italic leading-relaxed">
                                "{t?.content || "Eu não sabia mais o que fazer com tanto calor. Esse guia clareou tudo e me trouxe paz novamente."}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
