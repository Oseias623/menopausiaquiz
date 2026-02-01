
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface LoginScreenProps {
    onLoginSuccess: (email: string, ownedProducts: string[]) => void;
    mainProductCheckoutUrl?: string;
}

export default function LoginScreen({ onLoginSuccess, mainProductCheckoutUrl }: LoginScreenProps) {
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Initialize state from local storage
    React.useEffect(() => {
        const savedEmail = localStorage.getItem('menopausa_remember_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const cleanEmail = email.toLowerCase().trim();

        if (!cleanEmail) {
            setError('Por favor, ingresa tu email.');
            setLoading(false);
            return;
        }

        try {
            // Query Supabase to get all active purchases for this email
            const { data, error: dbError } = await supabase
                .from('purchases')
                .select('product_id')
                .ilike('email', cleanEmail)
                .in('status', ['active', 'approved', 'completed', 'COMPLETED', 'APPROVED', 'ACTIVE']);

            // Check for database error
            // Check for database error
            if (dbError) {
                console.error('Database error:', dbError);
                // DEBUG: Show actual error to user
                setError(`Error técnico: ${dbError.message || JSON.stringify(dbError)}`);
                setLoading(false);
                return;
            }

            // Check if user has any purchases
            if (data && data.length > 0) {
                // Save email if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('menopausa_remember_email', cleanEmail);
                } else {
                    localStorage.removeItem('menopausa_remember_email');
                }

                // Extract product IDs
                const ownedProductIds = data.map(p => p.product_id).filter(Boolean) as string[];

                console.log('✅ Login successful:', {
                    email: cleanEmail,
                    products: ownedProductIds
                });

                onLoginSuccess(cleanEmail, ownedProductIds);
            } else {
                // Email exists but no active purchases
                setError('No se encontraron compras activas para este email. Si compraste recientemente, espera unos minutos y vuelve a intentar.');
            }

        } catch (err: any) {
            console.error('Login error:', err);
            setError('Error inesperado. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center bg-brand-50 overflow-hidden font-sans">
            {/* Background Image - Artístico */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('/login-bg-watercolor.png')" }}
            />
            {/* Overlay suave para garantir leitura */}
            <div className="absolute inset-0 z-0 bg-brand-50/20 mix-blend-multiply" />

            {/* --- MAIN CONTENT CONTAINER --- */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-[450px] p-4">

                {/* BRANDING TITLE */}
                <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-brand-800 drop-shadow-sm mb-8 text-center">
                    Menopausia Con Claridad
                </h1>

                {/* --- LOGIN CARD --- */}
                <div className="w-full bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-xl border border-white">
                    <h2 className="text-2xl font-bold text-brand-900 mb-2">Ingresar</h2>
                    <p className="text-brand-600 mb-8 text-sm font-medium">Accede a tu programa de bienestar.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Floating Label Input Style */}
                        <div className="relative group">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="block px-4 pb-2.5 pt-4 w-full text-base text-brand-900 bg-white rounded-md border border-brand-200 appearance-none focus:outline-none focus:ring-1 focus:ring-brand-500 hover:bg-brand-50/50 transition-colors peer"
                                placeholder=" "
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-brand-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-brand-500"
                            >
                                Email de Compra
                            </label>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded border-l-2 border-red-500">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-md transition-colors duration-200 text-base mt-4 flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Ingresar'
                            )}
                        </button>


                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-brand-500 mt-4 gap-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded bg-white border-brand-300 text-brand-600 focus:ring-0 cursor-pointer w-4 h-4"
                                />
                                <label htmlFor="remember" className="cursor-pointer select-none">Recuérdame</label>
                            </div>
                            <a href="mailto:suporte.antiinflamatorio@gmail.com" className="hover:underline hover:text-brand-700 text-xs text-brand-400 flex items-center gap-1">
                                <span>✉️</span> soporte.antiinflamatorio@gmail.com
                            </a>
                        </div>
                    </form>

                    <div className="mt-12 border-t border-brand-100 pt-6 text-center">
                        <p className="text-brand-500 text-sm mb-4">¿Aún no tienes acceso?</p>
                        <a
                            href={mainProductCheckoutUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block w-full bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 hover:border-brand-300 font-bold py-3 px-6 rounded-md transition-all duration-200 shadow-sm hover:shadow text-sm uppercase tracking-wide"
                        >
                            Adquirir Programa Completo
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
