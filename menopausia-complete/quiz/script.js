document.addEventListener('DOMContentLoaded', () => {
    // ===================================
    // ANALYTICS TRACKER
    // ===================================
    // AnalyticsTracker is loaded from analytics-tracker.js



    // --- DATA & CONTENT ---
    const ageFeedback = {
        '35-39': "Aunque estes antes de los 40, tu cuerpo ya puede mostrar primeros signos de cambio hormonal.",
        '40-44': "El 62% de las mujeres entre 40 y 44 ya presentan síntomas iniciales de desajuste hormonal.",
        '45-49': "El 67% de las mujeres entre 45 y 49 desarrollan inflamación silenciosa sin saberlo.",
        '50-54': "El 71% de las mujeres entre 50 y 54 tienen al menos un bloqueo metabólico activo.",
        '55+': "Después de los 55, corregir los bloqueos metabólicos es clave para recuperar energía y reducir inflamación."
    };

    const sleepFeedback = {
        'menos5': "El 68% de las mujeres en menopausia duerme menos de 6 horas — y la falta de sueño bloquea la quema de grasa y aumenta la inflamación hormonal.",
        '5-6': "El 68% de las mujeres en menopausia duerme menos de 6 horas — y la falta de sueño bloquea la quema de grasa y aumenta la inflamación hormonal.",
        '7-8': "Dormir bien es fundamental, pero si aún sientes cansancio, el problema puede ser la calidad profunda del sueño.",
        'mas8': "Dormir muchas horas y aun así despertar cansada es señal clara de ritmo biológico desajustado."
    };

    const diagnosisContent = {
        'circadiano': {
            name: "Bloqueo Circadiano",
            icon: "⏰",
            text: "Tu reloj biológico interno está desincronizado. Esto impide que tu cuerpo active los procesos de quema de grasa nocturna y regeneración celular. Por eso te despiertas cansada y acumulas peso aunque comas poco."
        },
        'inflamacion': {
            name: "Bloqueo Inflamatorio",
            icon: "🔥",
            text: "Tu cuerpo presenta una respuesta inflamatoria crónica, probablemente vinculada a la resistencia a la insulina. Esto hace que las células 'guarden' energía en forma de grasa abdominal en lugar de usarla como combustible."
        },
        'estructura': {
            name: "Bloqueo de Estructura",
            icon: "🦴",
            text: "La pérdida de masa muscular y densidad ósea está ralentizando tu metabolismo basal. Tu estructura necesita soporte específico para volver a quemar calorías en reposo y sostener tu cuerpo."
        },
        'misto': {
            name: "Perfil Mixto (Metabólico)",
            icon: "⚠️",
            text: "Tienes señales activas de varios bloqueos (Inflamación y Ritmo). Es muy común en la menopausia. Significa que necesitamos un enfoque integral que regule insulina y descanso simultáneamente."
        }
    };

    // --- STATE ---
    // --- STATE ---
    const quizState = {
        currentStepId: 'intro',
        scores: {
            circadiano: 0,
            inflamacion: 0,
            estructura: 0
        },
        answers: {},
        totalSteps: 15,
        history: [] // Stack to track navigation
    };

    // --- LOCAL STORAGE FUNCTIONS ---
    function saveProgress() {
        const dataToSave = {
            currentStepId: quizState.currentStepId,
            scores: quizState.scores,
            answers: quizState.answers,
            history: quizState.history
        };
        localStorage.setItem('quizProgress', JSON.stringify(dataToSave));
    }

    function loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                quizState.currentStepId = data.currentStepId || 'intro';
                quizState.scores = data.scores || { circadiano: 0, inflamacion: 0, estructura: 0 };
                quizState.answers = data.answers || {};
                quizState.history = data.history || [];
                return true;
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    function clearProgress() {
        localStorage.removeItem('quizProgress');
    }

    // --- INITIALIZATION ---
    initQuiz();

    function initQuiz() {
        // Option Cards (Single Select)
        document.querySelectorAll('.option-card, .option-card-large').forEach(btn => {
            btn.addEventListener('click', handleOptionClick);
        });

        // === ANALYTICS ===
        AnalyticsTracker.setupConsentBanner();
        AnalyticsTracker.initSession();

        // Continue Buttons
        document.querySelectorAll('.continue-btn').forEach(btn => {
            btn.addEventListener('click', handleContinueClick);
        });

        // Checkboxes (Step 7 & 9)
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', handleCheckboxChange);
        });

        // Intro Start
        const startBtn = document.querySelector('.start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => navigateTo('step_initial_problem'));
        }

        // Back Button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', handleBackClick);
            updateBackButton();
        }

        // Load saved progress
        if (loadProgress() && quizState.currentStepId !== 'intro') {
            // Restore to saved step
            navigateTo(quizState.currentStepId, false);
        }

        // FAQ Accordion
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', function () {
                window.toggleFaq(this);
            });
        });

        // Plan Selection (radio labels)
        document.querySelectorAll('.plan-label').forEach(label => {
            label.addEventListener('click', function () {
                const container = this.closest('.plans-vertical');
                if (container) {
                    container.querySelectorAll('.plan-label').forEach(el => {
                        el.classList.remove('selected');
                        const input = el.querySelector('input');
                        if (input) input.checked = false;
                    });
                }
                this.classList.add('selected');
                const input = this.querySelector('input');
                if (input) input.checked = true;
            });
        });

        // Offer CTA Buttons - Hotmart Checkout
        const checkoutUrls = {
            '7dias': 'https://buy.stripe.com/test_6oUaEXcTagoW5Agf6j6g801',
            '4semanas': 'https://buy.stripe.com/test_28EeVddXe1u26Ek9LZ6g802',
            '12semanas': 'https://buy.stripe.com/test_5kQdR98CU0pY1k08HV6g803'
        };

        document.querySelectorAll('.offer-cta-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                // Find the nearest plans-vertical or use the first one
                const section = this.closest('.offer-section');
                let selectedPlan = null;

                if (section) {
                    const checked = section.querySelector('.plan-radio:checked');
                    if (checked) selectedPlan = checked.value;
                }

                // Fallback: check all plan selectors
                if (!selectedPlan) {
                    const allChecked = document.querySelector('.plan-radio:checked');
                    if (allChecked) selectedPlan = allChecked.value;
                }

                // Default to 4semanas
                if (!selectedPlan) selectedPlan = '4semanas';

                // TRACK CHECKOUT CLICK
                AnalyticsTracker.trackCheckout(selectedPlan, 'offer_section');

                const url = checkoutUrls[selectedPlan] || '#checkout-4semanas';
                // Small delay not strictly needed if trackCheckout is async non-blocking, but guide suggests specific pattern?
                // Guide says: await AnalyticsTracker.trackCheckout... and wait 100ms.

                // Since function is not async in listener currently, I need to make the listener async?
                // The guide shows: btn.addEventListener('click', async function () { ...
                // But here I'm modifying existing code. I'll make it async if possible or just fire and forget. 
                // Guide snippet at 223 uses setTimeout.

                setTimeout(() => {
                    window.location.href = url;
                }, 100);
            });
        });

        // Initialize view
        updateProgressBar(0);
    }

    // --- HANDLERS ---

    function handleBackClick() {
        if (quizState.history.length === 0) return;
        const prevStepId = quizState.history.pop();

        // TRACK BACK NAVIGATION
        AnalyticsTracker.trackEvent('back_button_clicked', {
            step_id: quizState.currentStepId,
            navigation_direction: 'back',
            metadata: {
                from_step: quizState.currentStepId,
                to_step: prevStepId
            }
        });

        navigateTo(prevStepId, false); // false = don't save to history (we are popping)
    }

    // --- EMAIL CAPTURE ---
    const emailSubmitBtn = document.getElementById('emailSubmitBtn');
    if (emailSubmitBtn) {
        emailSubmitBtn.addEventListener('click', async (e) => {
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();

            if (!email || !validateEmail(email)) {
                alert('Por favor, ingresa un correo válido.');
                return;
            }

            // Track Lead
            // Track Lead
            await AnalyticsTracker.trackEmailCapture(email);

            // Proceed to next step
            // (Wait slightly/handled by handleContinueClick logic that follows, 
            // but we might want to ensure trackEmailCapture finishes first? It is awaited.)

            /* Old Supabase lead capture removed */

            handleContinueClick(e);
        });
    }

    function handleOptionClick(e) {
        const btn = e.currentTarget;
        const nextId = btn.dataset.next;
        const block = btn.dataset.block;
        const value = btn.dataset.value;
        const parentStep = btn.closest('.quiz-step');

        // Identify step for saving data
        const stepId = parentStep.id;

        // Save Answer
        if (value) {
            quizState.answers[stepId] = value;

            // Track Answer
            // Track Answer
            AnalyticsTracker.trackEvent('answer_selected', {
                step_id: stepId,
                step_number: parseInt(parentStep.dataset.step) || 0,
                answer_value: value,
                answer_text: btn.textContent.trim(),
                block_type: block || null
            });
        }

        // Add Score if Block present
        if (block) {
            if (quizState.scores[block] !== undefined) {
                quizState.scores[block]++;
            }
        }

        // Step Specific Logic
        if (stepId === 'step_age') {
            updateAgeValidation(value);
        } else if (stepId === 'step3') {
            updateSleepValidation(value);
        }

        // Visual Feedback - add selected class
        const siblings = parentStep.querySelectorAll('.option-card, .option-card-large');
        siblings.forEach(s => s.classList.remove('selected'));
        btn.classList.add('selected');

        // Navigate with delay for visual feedback
        if (nextId) {
            setTimeout(() => navigateTo(nextId), 300);
        }
    }

    function handleCheckboxChange(e) {
        const input = e.target;
        const stepId = input.closest('.quiz-step').id;

        // Determine associated Continue Button
        let continueBtnId = '';
        if (stepId === 'step7') continueBtnId = 'continueSymptoms';
        if (stepId === 'step9') continueBtnId = 'continueGoals';
        if (stepId === 'step_physical') continueBtnId = 'continuePhysicalProblems';

        const continueBtn = document.getElementById(continueBtnId);
        if (!continueBtn) return;

        // Check if at least one checked
        const inputs = input.closest('.quiz-step').querySelectorAll('input[type="checkbox"]:checked');
        continueBtn.disabled = inputs.length === 0;
    }

    function handleContinueClick(e) {
        const btn = e.currentTarget;
        const nextId = btn.dataset.next;
        const parentStep = btn.closest('.quiz-step');

        // TRACK MULTI-SELECT ANSWERS (para steps com checkboxes)
        if (parentStep.id === 'step7' || parentStep.id === 'step9' || parentStep.id === 'step_physical') {
            const checked = parentStep.querySelectorAll('input[type="checkbox"]:checked');
            const selectedValues = Array.from(checked).map(input => ({
                value: input.value,
                text: input.closest('label')?.textContent?.trim() || input.value,
                block: input.dataset.block || input.dataset.problem || null
            }));

            AnalyticsTracker.trackEvent('multi_answer_selected', {
                step_id: parentStep.id,
                step_number: parseInt(parentStep.dataset.step) || 0,
                multi_answers: selectedValues
            });
        }

        // If coming from Step 7 (Symptoms), calculate scores from checkboxes
        if (parentStep.id === 'step7') {
            processMultiSelectScores(parentStep);
        }

        // Physical Problem Validation Logic
        if (parentStep.id === 'step_physical') {
            const checked = parentStep.querySelectorAll('input:checked');
            const textEl = document.getElementById('physicalProblemsText');
            const imgEl = document.getElementById('physicalProblemsImage');

            let msg = "Es importante atender las señales de tu cuerpo a tiempo.";
            let imgSrc = "val_physical_general.png"; // Default

            // Priority Logic
            let hasPain = false;
            let hasMuscle = false;
            let hasFatigue = false;

            checked.forEach(input => {
                if (input.value === 'rodillas') hasPain = true;
                if (input.value === 'debilidad') hasMuscle = true;
                if (input.value === 'cansancio') hasFatigue = true;
            });

            if (hasPain) {
                msg = "El dolor articular aumenta cuando el estrógeno baja, pues actúa como un antiinflamatorio natural.";
                imgSrc = "val_physical_pain.png";
            } else if (hasMuscle) {
                msg = "Perder músculo es la causa #1 de por qué el metabolismo se vuelve lento después de los 40.";
                imgSrc = "val_physical_muscle.png";
            } else if (hasFatigue) {
                msg = "No es normal vivir cansada. Tu cuerpo está gastando energía en combatir inflamación interna.";
                imgSrc = "val_physical_fatigue.png";
            }

            if (textEl) textEl.textContent = msg;
            if (imgEl) imgEl.src = imgSrc;
        }

        if (nextId === 'loading') {
            // Start Loading Sequence
            navigateTo(nextId);
            startLoadingSequence();
        } else if (nextId) {
            navigateTo(nextId);
        }
    }

    // --- SUPPORT FUNCTIONS ---

    function navigateTo(stepId, saveHistory = true) {
        // Find Current Step
        const current = document.querySelector('.quiz-step.active');
        const stepNum = current ? parseInt(current.dataset.step) : 0; // Use current step number or next? 
        // Logic says we track the step we are GOING TO or the one we just Viewed? 
        // Guide says: LOGO APÓS next.classList.add('active'); ... AnalyticsTracker.trackEvent('step_view', { step_id: stepId...

        // So I will insert it LATER in the function as per guide.
        // But I need to remove the OLD trackEvent call here first.


        // Save to history if moving forward (and logic allows)
        if (current && saveHistory) {
            quizState.history.push(current.id);
        }

        // Hide Current
        if (current) current.classList.remove('active');

        // Show Next
        const next = document.getElementById(stepId);
        if (next) {
            next.classList.add('active');
            quizState.currentStepId = stepId;

            // TRACK STEP VIEW AND RESET TIMER
            AnalyticsTracker.trackEvent('step_view', {
                step_id: stepId,
                step_number: parseInt(next.dataset.step) || 0
            });
            AnalyticsTracker.resetStepTimer();

            // Save progress to localStorage (except special screens)
            const noSaveScreens = ['loading', 'diagnosis', 'offer_screen', 'checkout'];
            if (!noSaveScreens.includes(stepId)) {
                saveProgress();
            }

            // Update Progress Bar
            const stepNum = parseInt(next.dataset.step);
            if (!isNaN(stepNum)) {
                updateProgressBar(stepNum);
            }

            // Update Back Button State
            updateBackButton();

            // Header Mode Management
            const header = document.querySelector('.quiz-header');
            const headerLogo = document.getElementById('headerLogo');
            const headerOfferTimer = document.getElementById('headerOfferTimer');
            const headerCtaBtn = document.getElementById('headerCtaBtn');
            const stepCounter = document.getElementById('stepCounter');
            const progContainer = document.querySelector('.progress-container');

            if (header) {
                const isOffer = stepId === 'offer_screen';
                header.classList.toggle('offer-mode', isOffer);

                if (isOffer) {
                    // Hide Quiz elements
                    if (headerLogo) headerLogo.style.display = 'none';
                    if (stepCounter) stepCounter.style.display = 'none';
                    if (progContainer) progContainer.style.display = 'none';

                    // Show Offer elements
                    if (headerOfferTimer) headerOfferTimer.style.display = 'block';
                    if (headerCtaBtn) headerCtaBtn.style.display = 'block';

                    startOfferTimer();
                } else {
                    // Restore Quiz elements
                    if (headerLogo) headerLogo.style.display = 'flex';
                    if (stepCounter) stepCounter.style.display = 'block';
                    if (progContainer) progContainer.style.display = 'block';

                    // Hide Offer elements
                    if (headerOfferTimer) headerOfferTimer.style.display = 'none';
                    if (headerCtaBtn) headerCtaBtn.style.display = 'none';

                    // Restore validation loaders
                    if (stepId === 'validation7') {
                        animateValidationLoader();
                    } else if (stepId === 'validation_comfort') {
                        animateComfortLoader();
                    }
                }
            }

            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    function animateValidationLoader() {
        const circle = document.getElementById('validationLoaderCircle');
        const percentageEl = document.getElementById('validationLoaderPercentage');
        const textEl = document.getElementById('symptomsValidationText');
        const btn = document.getElementById('validation7Btn');

        if (!circle || !percentageEl) return;

        // Reset
        const circumference = 2 * Math.PI * 60;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        percentageEl.textContent = '0%';
        if (textEl) textEl.textContent = "Analizando tus síntomas...";
        if (btn) btn.disabled = true;

        // Animate
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;

            // Update Circle
            const offset = circumference - (progress / 100) * circumference;
            circle.style.strokeDashoffset = offset;

            // Update Text
            percentageEl.textContent = `${progress}%`;

            // Text Updates
            if (progress === 30 && textEl) textEl.textContent = "Identificando patrones inflamatorios...";
            if (progress === 70 && textEl) textEl.textContent = "Calculando déficit metabólico...";

            if (progress >= 100) {
                clearInterval(interval);
                if (textEl) textEl.textContent = "Análisis completado.";
                if (btn) btn.disabled = false;
            }
        }, 30);
    }

    function updateBackButton() {
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.disabled = quizState.history.length === 0;
        }
    }

    function updateProgressBar(stepNum) {
        const progress = Math.min((stepNum / quizState.totalSteps) * 100, 100);
        const bar = document.getElementById('progressBar');
        if (bar) {
            bar.style.width = `${progress}%`;
        }

        const counter = document.getElementById('stepCounter');
        if (counter && stepNum > 0 && stepNum <= quizState.totalSteps) {
            counter.textContent = `${stepNum}/${quizState.totalSteps}`;
        }
    }

    const ageImages = {
        '35-39': "val_age_40_44.png",
        '40-44': "val_age_40_44.png",
        '45-49': "val_age_45_49.png",
        '50-54': "val_age_50_54.png",
        '55+': "val_age_55_59.png"
    };

    function updateAgeValidation(value) {
        const textElement = document.getElementById('ageValidationText');
        if (textElement && ageFeedback[value]) {
            textElement.textContent = ageFeedback[value];
        }

        const imgElement = document.getElementById('ageValidationImage');
        if (imgElement && ageImages[value]) {
            imgElement.src = ageImages[value];
            // Preload image or handle loading if needed, but browser handles src change well
        }

        const spanAge = document.getElementById('selectedAge');
        if (spanAge) spanAge.textContent = value;
    }

    function updateSleepValidation(value) {
        const textElement = document.getElementById('sleepValidationText');
        if (textElement && sleepFeedback[value]) {
            textElement.textContent = sleepFeedback[value];
        } else if (textElement) {
            textElement.textContent = "El sueño es el pilar de la regulación hormonal. Vamos a optimizar esto.";
        }
    }

    function processMultiSelectScores(stepElement) {
        const checked = stepElement.querySelectorAll('input:checked');
        checked.forEach(input => {
            const block = input.dataset.block;
            if (block && quizState.scores[block] !== undefined) {
                quizState.scores[block]++;
            }
        });
    }

    function startLoadingSequence() {
        const duration = 7000; // 7 seconds
        const msgElement = document.getElementById('loadingMessage');
        const percentageEl = document.getElementById('analysisPercentage');
        const barFill = document.getElementById('analysisBarFill');

        const transitions = [
            { threshold: 0.24, msg: "Analizando tus síntomas principales" },
            { threshold: 0.53, msg: "Evaluando el tiempo y el impacto en tu cuerpo" },
            { threshold: 0.79, msg: "Comparando con mujeres en tu misma etapa de vida" },
            { threshold: 1.00, msg: "Generando tu diagnóstico personalizado" }
        ];

        const startTime = Date.now();
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const percent = Math.round(progress * 100);

            if (percentageEl) percentageEl.textContent = `${percent}%`;
            if (barFill) barFill.style.width = `${percent}%`;

            // Update message based on progress thresholds
            let currentMsg = transitions[0].msg;
            for (let i = 0; i < transitions.length; i++) {
                if (progress >= transitions[i].threshold) {
                    currentMsg = transitions[i].msg;
                }
            }

            if (msgElement && msgElement.textContent !== currentMsg) {
                msgElement.style.opacity = '0';
                msgElement.style.transform = 'translateY(5px)';
                setTimeout(() => {
                    msgElement.textContent = currentMsg;
                    msgElement.style.opacity = '1';
                    msgElement.style.transform = 'translateY(0)';
                }, 200);
            }

            if (progress >= 1) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    generateDiagnosis();
                    navigateTo('diagnosis');
                }, 800);
            }
        }, 50);
    }

    function generateDiagnosis() {
        const scores = quizState.scores;
        const answers = quizState.answers;
        const maxScore = Math.max(scores.circadiano, scores.inflamacion, scores.estructura);

        let winner = null;
        let winners = [];
        if (scores.circadiano === maxScore) winners.push('circadiano');
        if (scores.inflamacion === maxScore) winners.push('inflamacion');
        if (scores.estructura === maxScore) winners.push('estructura');

        if (winners.length > 1 || maxScore < 2) {
            winner = 'misto';
        } else {
            winner = winners[0];
        }

        // === TEXTO PERSONALIZADO ===

        // Idade
        const age = answers.step_age || '45-49';
        const ageText = {
            '35-39': 'Primeros síntomas (35-39)',
            '40-44': 'Cambios iniciales (40-44)',
            '45-49': 'Perimenopausia activa (45-49)',
            '50-54': 'Menopausia (50-54)',
            '55+': 'Postmenopausia (55+)'
        };

        // Como se sente ao despertar
        const energy = answers.step2 || '';
        const energyProblems = energy.includes('cansada') || energy.includes('sueño') || energy.includes('agota');

        // Horas de sono
        const sleep = answers.step3 || '';
        const sleepProblems = sleep.includes('menos5') || sleep.includes('5-6');

        // Sintomas selecionados
        const symptoms = answers.step7 || [];
        const physicalSymptoms = answers.step_physical || [];

        // Tempo desconfortável
        const comfortTime = answers.step_comfort || '';

        // Objetivos
        const goals = answers.step9 || [];

        // === MONTAR TEXTO PERSONALIZADO ===
        const stageLabel = ageText[age] || 'Tu etapa actual';
        let personalText = `Con base en tus respuestas y en la etapa de vida que indicaste, estás en <strong>${stageLabel}</strong>. Tu cuerpo está atravesando cambios hormonales importantes. `;

        if (energyProblems) {
            personalText += `El hecho de que despiertes cansada indica que tu ritmo circadiano está desajustado. `;
        }

        if (sleepProblems) {
            personalText += `Dormir menos de 7 horas está bloqueando tu capacidad de quemar grasa y regular la insulina. `;
        }

        if (comfortTime.includes('mas-1-ano') || comfortTime.includes('6-meses-1-ano')) {
            personalText += `Llevas tiempo sintiéndote incómoda con tu cuerpo — <em>esto no es tu culpa, es hormonal</em>.`;
        }

        // Síntomas identificados
        let symptomsList = [];
        if (Array.isArray(symptoms)) {
            symptoms.forEach(s => {
                if (s === 'sofocos') symptomsList.push('sofocos');
                if (s === 'barriga') symptomsList.push('acumulación abdominal');
                if (s === 'ansiedad') symptomsList.push('ansiedad');
                if (s === 'cansancio') symptomsList.push('cansancio constante');
                if (s === 'insomnio') symptomsList.push('problemas de sueño');
            });
        }
        if (Array.isArray(physicalSymptoms)) {
            physicalSymptoms.forEach(s => {
                if (s === 'rodillas') symptomsList.push('dolor articular');
                if (s === 'rigidez') symptomsList.push('rigidez muscular');
                if (s === 'debilidad') symptomsList.push('pérdida de fuerza');
                if (s === 'cansancio') symptomsList.push('fatiga rápida');
            });
        }

        // Texto de síntomas
        let symptomsText = symptomsList.length > 0
            ? `Identificamos: <strong>${symptomsList.slice(0, 4).join(', ')}</strong>. Estos síntomas están conectados con el desequilibrio hormonal.`
            : 'Tus síntomas son típicos del cambio hormonal después de los 40.';

        // Bloqueo principal
        const blockInfo = {
            'circadiano': {
                name: 'Bloqueo Circadiano',
                desc: 'Tu reloj biológico interno está desincronizado. Esto impide que tu cuerpo active la quema de grasa nocturna.',
                icon: '🌙'
            },
            'inflamacion': {
                name: 'Bloqueo Inflamatorio',
                desc: 'Tu cuerpo presenta inflamación crónica vinculada a la resistencia a la insulina. Esto hace que acumules grasa abdominal.',
                icon: '🔥'
            },
            'estructura': {
                name: 'Bloqueo de Estructura',
                desc: 'La pérdida de masa muscular está ralentizando tu metabolismo. Necesitas soporte específico.',
                icon: '🦴'
            },
            'misto': {
                name: 'Perfil Mixto Metabólico',
                desc: 'Tienes señales de varios bloqueos activos. Necesitamos un enfoque integral que regule todo simultáneamente.',
                icon: '⚠️'
            }
        };

        const block = blockInfo[winner] || blockInfo['misto'];

        // Soluciones baseadas nos objetivos
        let solutions = [];
        if (Array.isArray(goals)) {
            if (goals.includes('barriga')) solutions.push('Estrategia específica para reducir grasa abdominal');
            if (goals.includes('dormir')) solutions.push('Protocolo para mejorar la calidad del sueño');
            if (goals.includes('energia')) solutions.push('Plan para recuperar tu energía natural');
            if (goals.includes('sofocos')) solutions.push('Técnicas para reducir sofocos');
            if (goals.includes('ligera')) solutions.push('Alimentación antiinflamatoria personalizada');
        }
        if (solutions.length === 0) {
            solutions = ['Combinaciones estratégicas de alimentos', 'Horarios que regulan tus hormonas', 'Protocolo antiinflamatorio'];
        }

        // === APLICAR NO HTML ===
        const personalEl = document.getElementById('diagPersonalText');
        if (personalEl) personalEl.innerHTML = personalText;

        const subtitle = document.getElementById('diagSubtitle');
        if (subtitle) subtitle.textContent = `Mujer de ${age === '60+' ? '60+ años' : age.replace('-', ' a ') + ' años'} • Análisis completado`;

        const text1 = document.getElementById('diagText1');
        if (text1) text1.innerHTML = symptomsText;

        // Secondary Pattern and Block info removed from UI, consolidated into '3 Fallas' static section for now.
        // If dynamic behavior is needed for the 3 Fallas, add IDs back to index.html.

        // Soluções
        const sol1 = document.getElementById('diagSol1');
        const sol2 = document.getElementById('diagSol2');
        const sol3 = document.getElementById('diagSol3');
        if (sol1 && solutions[0]) sol1.textContent = solutions[0];
        if (sol2 && solutions[1]) sol2.textContent = solutions[1];
        if (sol3 && solutions[2]) sol3.textContent = solutions[2];

        // Animate Marker
        setTimeout(() => {
            const marker = document.querySelector('.diag-bar-marker');
            if (marker) marker.style.left = winner === 'misto' ? '75%' : '85%';
        }, 800);

        // TRACK QUIZ COMPLETION (Replacing logic from previous chunk comment - doing it here is better)
        AnalyticsTracker.trackEvent('quiz_completed', {
            step_id: 'diagnosis',
            metadata: {
                score_circadiano: scores.circadiano,
                score_inflamacion: scores.inflamacion,
                score_estructura: scores.estructura,
                dominant_profile: winner
            }
        });

        // UPDATE SESSION WITH FINAL SCORES
        AnalyticsTracker.updateSessionStatus('completed', {
            completed_at: new Date().toISOString(),
            score_circadiano: scores.circadiano,
            score_inflamacion: scores.inflamacion,
            score_estructura: scores.estructura,
            dominant_profile: winner,
            time_spent_seconds: Math.floor((Date.now() - AnalyticsTracker.sessionStartTime) / 1000)
        });
    }

    function animateComfortLoader() {
        const circle = document.getElementById('comfortLoaderCircle');
        const percentageEl = document.getElementById('comfortLoaderPercentage');
        const textEl = document.getElementById('validationComfortText');
        const btn = document.getElementById('validationComfortBtn');

        if (!circle || !percentageEl) return;

        // Reset
        const circumference = 2 * Math.PI * 60;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        percentageEl.textContent = '0%';
        if (textEl) textEl.textContent = "Analizando impacto emocional...";
        if (btn) btn.disabled = true;

        // Animate
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            const offset = circumference - (progress / 100) * circumference;
            circle.style.strokeDashoffset = offset;
            percentageEl.textContent = `${progress}%`;

            if (progress === 50 && textEl) textEl.textContent = "Conectando síntomas...";

            if (progress >= 100) {
                clearInterval(interval);
                if (textEl) textEl.textContent = "Análisis completado.";
                if (btn) btn.disabled = false;
            }
        }, 25);
    }


    // Offer Page Logic
    window.selectPlan = function (element) {
        document.querySelectorAll('.plan-label').forEach(el => {
            el.classList.remove('selected');
            const input = el.querySelector('input');
            if (input) input.checked = false;
        });
        element.classList.add('selected');
        const input = element.querySelector('input');
        if (input) input.checked = true;
    };

    window.toggleFaq = function (button) {
        const item = button.closest('.faq-item');
        const answer = button.nextElementSibling;
        const arrow = button.querySelector('.faq-arrow');

        if (answer.classList.contains('open')) {
            answer.classList.remove('open');
            if (item) item.classList.remove('open');
            if (arrow) arrow.textContent = '+';
        } else {
            answer.classList.add('open');
            if (item) item.classList.add('open');
            if (arrow) arrow.textContent = '−';
        }
    };

    function startOfferTimer() {
        const timerDisplay = document.getElementById('headerTimer');
        const offerTimer = document.getElementById('offerTimer');
        if (!timerDisplay) return;

        let duration = 14 * 60 + 59;
        const timer = setInterval(() => {
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            const timeStr = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            timerDisplay.textContent = timeStr;
            if (offerTimer) offerTimer.textContent = timeStr;
            if (--duration < 0) {
                clearInterval(timer);
                timerDisplay.textContent = "00:00";
                if (offerTimer) offerTimer.textContent = "00:00";
            }
        }, 1000);
    }

    // Offer CTA in Header
    const headerCta = document.getElementById('headerCtaBtn');
    if (headerCta) {
        headerCta.addEventListener('click', function () {
            const plansFirst = document.getElementById('plansFirst');
            if (plansFirst) {
                plansFirst.scrollIntoView({ behavior: 'smooth' });
            } else {
                const checked = document.querySelector('.plan-radio:checked');
                const plan = checked ? checked.value : '4semanas';
                const urls = { '7dias': 'https://buy.stripe.com/test_6oUaEXcTagoW5Agf6j6g801', '4semanas': 'https://buy.stripe.com/test_28EeVddXe1u26Ek9LZ6g802', '12semanas': 'https://buy.stripe.com/test_5kQdR98CU0pY1k08HV6g803' };
                window.location.href = urls[plan] || '#checkout-4semanas';
            }
        });
    }

    function autoScrollTestimonials() {
        const stack = document.querySelector('.testimonials-stack');
        if (!stack) return;
        const cards = stack.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return;

        // Init styles
        cards.forEach((c, i) => {
            c.style.display = i === 0 ? 'block' : 'none';
            c.style.animation = 'none';
        });

        let current = 0;
        setInterval(() => {
            cards[current].style.display = 'none';
            current = (current + 1) % cards.length;
            cards[current].style.display = 'block';
            cards[current].style.animation = 'fadeInUp 0.5s ease forwards';
        }, 4000);
    }
});
