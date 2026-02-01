
import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS, MOCK_CHAPTERS } from './constants';
import Card from './components/Card';
import Section from './components/Section';
import UpgradeModal from './components/UpgradeModal';
import { Product, Chapter } from './types';
import { ArrowLeft, Book, FileText, Headphones, PlayCircle, ArrowUpRight, Mail, ChevronRight } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { useTranslation } from './i18n/useTranslation';
import { LanguageProvider } from './i18n/LanguageContext';
import LoginScreen from './components/LoginScreen';
import DailyTracker from './components/DailyTracker';
import AIRoutineTracker from './components/AIRoutineTracker';
import QuizModal from './components/QuizModal';
import RoutineModal from './components/RoutineModal';
import { geminiService } from './services/geminiService';
import { saveGeneratedRoutine } from './services/routineStorage';
import { getFallbackRoutine } from './services/routineFallback';
import { ProfileType, RoutineDuration } from './types/routine.types';

// View State Definition
type ViewState = 'HOME' | 'COLLECTION' | 'CHAPTERS' | 'READER';

function AppContent() {
    const { t, language } = useTranslation();

    // State for owned upsells
    const [ownedUpsells, setOwnedUpsells] = useState<string[]>([]);

    // App Navigation State
    const [currentView, setCurrentView] = useState<ViewState>('HOME');
    const [selectedBook, setSelectedBook] = useState<Product | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [readingDoc, setReadingDoc] = useState<{ url: string, title: string, downloadUrl?: string } | null>(null);

    // Products State
    const [products, setProducts] = useState<Product[]>(PRODUCTS);
    const [loading, setLoading] = useState(true);
    const [activeAudio, setActiveAudio] = useState<{ title: string; subtitle?: string; url: string } | null>(null);

    // Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'UPGRADE_PLAN' | 'BUY_UPSELL';
        product?: Product;
    }>({ isOpen: false, type: 'UPGRADE_PLAN' });

    // Auth State
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Routine Generation State
    const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);
    const [routineError, setRoutineError] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [showQuizModal, setShowQuizModal] = useState(false);

    // Modal States
    const [viewingProgram, setViewingProgram] = useState(false); // Navegação para dentro dos PDFs principais
    const [showRoutineModal, setShowRoutineModal] = useState(false);

    // TODO: Configure this URL for the new product
    const MAIN_PRODUCT_CHECKOUT_URL = "https://pay.hotmart.com/A103597268E?checkoutMode=10";

    // Restore Session
    useEffect(() => {
        const storedEmail = localStorage.getItem('menopausa_user_email');
        if (storedEmail) {
            setUserEmail(storedEmail);
            setIsAuthorized(true);
            const storedUpsells = JSON.parse(localStorage.getItem('menopausa_user_upsells') || '[]');
            setOwnedUpsells(storedUpsells);
        }
    }, []);

    // Fetch Products (Mock for now)
    const fetchProducts = async () => {
        setLoading(true);
        // For now, use local constants. Later connect to Supabase.
        setProducts(PRODUCTS);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products
    const mainProducts = products.filter(p => p.category === 'MAIN');
    const bonusProducts = products.filter(p => p.category === 'BONUS');
    const upsellProducts = products.filter(p => p.category === 'UPSELL');

    // --- Actions ---

    const handlePdfClick = async (product: Product | Chapter) => {
        const title = product.title;
        // Logic to open PDF
        let pdfUrl: string = '#';

        if ('pdfUrl' in product && product.pdfUrl) {
            pdfUrl = product.pdfUrl;
        } else if ('pdf_url' in product && product.pdf_url) {
            // Chapter
            pdfUrl = product.pdf_url;
        }

        if (pdfUrl === '#') {
            alert("PDF aún no disponible.");
            return;
        }

        // Handle local paths properly for the viewer
        if (pdfUrl.startsWith('/')) {
            pdfUrl = window.location.origin + pdfUrl;
        }

        // Use Mozilla PDF.js viewer
        const encodedPdfUrl = encodeURIComponent(pdfUrl);
        const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodedPdfUrl}`;
        setReadingDoc({ url: viewerUrl, title });
    };

    const handleFullCardClick = async (product: Product) => {
        // --- LOGIC: Check ownership for Upsells ---
        if (product.category === 'UPSELL') {
            const isOwned = ownedUpsells.includes(product.id.toString());

            if (!isOwned) {
                // Not owned -> Trigger Checkout Logic
                if (product.checkoutUrl) {
                    // Direct redirect to checkout without popup
                    window.open(product.checkoutUrl, '_blank');
                } else {
                    alert("🔒 Este contenido exclusivo no está disponible para compra en este momento.");
                }
                return; // STOP execution, do not open PDF
            }
        }

        // If owned or MAIN/BONUS, open it
        handlePdfClick(product);
    };

    const closeModal = () => {
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    // Handle quiz completion and routine generation
    const handleQuizComplete = async (profile: ProfileType, duration: RoutineDuration) => {
        console.log('Quiz completed:', profile, duration);

        // Close quiz modal
        setShowQuizModal(false);

        // Generate routine
        setIsGeneratingRoutine(true);
        setRoutineError(null);

        try {
            const routine = await geminiService.generatePersonalizedRoutine(profile, duration);
            saveGeneratedRoutine(routine);

            // Force re-render of AIRoutineTracker
            setForceUpdate(prev => prev + 1);
        } catch (error) {
            console.error('Error generating routine:', error);

            // Use fallback routine
            try {
                console.log('Using fallback routine');
                const fallbackRoutine = getFallbackRoutine(profile, duration);
                saveGeneratedRoutine(fallbackRoutine);
                setForceUpdate(prev => prev + 1);
            } catch (fallbackError) {
                setRoutineError('No se pudo generar la rutina. Por favor, intenta de nuevo.');
            }
        } finally {
            setIsGeneratingRoutine(false);
        }
    };

    // --- LOGIN SCREEN GUARD ---
    if (!isAuthorized) {
        return (
            <LoginScreen
                onLoginSuccess={(email, ownedIds) => {
                    setUserEmail(email);
                    setOwnedUpsells(ownedIds); // SAVE OWNERSHIP
                    setIsAuthorized(true);
                    localStorage.setItem('menopausa_user_email', email);
                    localStorage.setItem('menopausa_user_upsells', JSON.stringify(ownedIds)); // PERSIST OWNERSHIP
                }}
                mainProductCheckoutUrl={MAIN_PRODUCT_CHECKOUT_URL}
            />
        );
    }

    return (
        <div className="min-h-screen bg-brand-950 text-zinc-100 font-sans selection:bg-brand-500/30 relative">

            {/* Background - Dark/Nature Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Watercolor Texture */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-soft-light"
                    style={{ backgroundImage: "url('/login-bg-watercolor.png')" }}
                />
                {/* Gradient Overlay for Readability - Dark Theme */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-950 via-brand-900/90 to-brand-950" />
            </div>

            <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                {/* PDF Reader Overlay */}
                {readingDoc && (
                    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col animate-in fade-in duration-300">
                        <div className="flex items-center justify-between p-4 bg-brand-950 border-b border-brand-800 text-white shadow-md">
                            <button
                                onClick={() => setReadingDoc(null)}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-800 hover:bg-brand-700 rounded-lg transition-colors font-bold text-sm uppercase tracking-wider"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar
                            </button>
                            <h3 className="font-bold truncate text-brand-100 flex-1 text-right ml-4">{readingDoc.title}</h3>
                        </div>
                        <iframe src={readingDoc.url} className="w-full flex-1 border-0" />
                    </div>
                )}

                {/* --- VIEW: HOME --- */}
                {currentView === 'HOME' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">

                        {/* --- MAIN ACTION CARDS ou PROGRAM VIEW --- */}
                        <div className="py-8 md:py-12 border-b border-brand-100/30">
                            {!viewingProgram ? (
                                <>
                                    {/* Tela Principal - Dois Cards */}
                                    <div className="mb-8 px-4 md:px-0">
                                        <h2 className="text-2xl md:text-3xl font-bold text-brand-100 tracking-tight">Comienza por Aquí</h2>
                                        <p className="text-brand-300 mt-1 uppercase text-sm font-medium tracking-widest">Tu programa completo</p>
                                    </div>

                                    <div className="flex justify-center max-w-4xl mx-auto px-4">
                                        {/* Card 1: Entrar no Programa */}
                                        <button
                                            onClick={() => setViewingProgram(true)}
                                            className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all bg-black text-white aspect-[4/3] w-full md:w-2/3"
                                        >
                                            {/* Background Image - Updated to Meditation/Yoga Image */}
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80)' }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                                            </div>

                                            {/* Badge */}
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-bold uppercase tracking-wider">
                                                PROGRAMA
                                            </div>

                                            {/* Content */}
                                            <div className="relative h-full flex flex-col justify-end p-6">
                                                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                                    Tu Programa Completo
                                                </h3>
                                                <p className="text-zinc-300 text-sm mb-4 uppercase tracking-wider">
                                                    Guías y Recursos Principales
                                                </p>
                                                <div className="flex items-center gap-2 text-white font-medium">
                                                    <PlayCircle className="w-5 h-5" />
                                                    <span>ACCEDER</span>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Dentro do Programa - Mostrar PDFs */}
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                        {/* Header com botão de voltar */}
                                        <div className="mb-8 px-4 md:px-0 flex items-center gap-4">
                                            <button
                                                onClick={() => setViewingProgram(false)}
                                                className="p-2 hover:bg-brand-800 rounded-full transition-colors"
                                            >
                                                <ArrowLeft className="w-6 h-6 text-brand-100" />
                                            </button>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-brand-100 tracking-tight">Tu Programa Completo</h2>
                                                <p className="text-brand-300 mt-1 uppercase text-sm font-medium tracking-widest">Guías y Recursos Principales</p>
                                            </div>
                                        </div>

                                        {/* Grid de PDFs */}
                                        <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 scrollbar-hide">
                                            {mainProducts.map(product => (
                                                <Card
                                                    key={product.id}
                                                    product={product}
                                                    isUpsellOwned={true}
                                                    onPdfClick={() => handlePdfClick(product)}
                                                    onAudioClick={() => { }}
                                                    onCardClick={handleFullCardClick}
                                                    className="w-[85vw] sm:w-full shrink-0 snap-center bg-white text-zinc-900 border border-brand-100"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 2. Bonos - Esconder quando estiver vendo programa */}
                        {!viewingProgram && bonusProducts.length > 0 && (
                            <Section
                                title="Tus Regalos Exclusivos"
                                subtitle="Complementos para tu jornada"
                            >
                                {bonusProducts.map(product => (
                                    <Card
                                        key={product.id}
                                        product={product}
                                        isUpsellOwned={true}
                                        onPdfClick={() => handlePdfClick(product)}
                                        onAudioClick={() => { }}
                                        onCardClick={handleFullCardClick}
                                        className="w-[85vw] sm:w-full shrink-0 snap-center bg-white text-zinc-900 border border-brand-100"
                                    />
                                ))}
                            </Section>
                        )}

                        {/* 3. Upsells (Locked by default unless owned) - Esconder quando estiver vendo programa */}
                        {!viewingProgram && upsellProducts.length > 0 && (
                            <Section
                                title="Recursos Adicionales"
                                subtitle="Potencializa tus resultados"
                            >
                                {upsellProducts.map(product => (
                                    <Card
                                        key={product.id}
                                        product={product}
                                        isUpsellOwned={ownedUpsells.includes(product.id)}
                                        onPdfClick={() => handlePdfClick(product)}
                                        onAudioClick={() => { }}
                                        onCardClick={handleFullCardClick}
                                        className="w-[85vw] sm:w-full shrink-0 snap-center bg-white text-zinc-900 border border-brand-100"
                                    />
                                ))}
                            </Section>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 py-8 border-t border-brand-800 flex flex-col items-center text-brand-300/60 gap-4">
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <a
                            href="mailto:suporte.antiinflamatorio@gmail.com"
                            className="hover:text-brand-100 transition-colors flex items-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            Soporte
                        </a>
                        <button
                            onClick={() => {
                                if (window.confirm('¿Deseas salir de la aplicación?')) {
                                    localStorage.removeItem('menopausa_user_email');
                                    setIsAuthorized(false);
                                    setUserEmail(null);
                                    window.location.reload();
                                }
                            }}
                            className="hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                            Salir
                        </button>
                    </div>
                    <p className="text-sm">© 2024 Menopausia Con Claridad. Todos los derechos reservados.</p>
                </div>

            </main>

            {/* Modals */}
            <RoutineModal
                isOpen={showRoutineModal}
                onClose={() => setShowRoutineModal(false)}
                isGeneratingRoutine={isGeneratingRoutine}
                routineError={routineError}
                forceUpdate={forceUpdate}
                showQuizModal={showQuizModal}
                onQuizComplete={handleQuizComplete}
                onQuizClose={() => setShowQuizModal(false)}
                onOpenQuiz={() => setShowQuizModal(true)}
            />
        </div>
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}
