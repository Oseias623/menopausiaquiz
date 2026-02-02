/**
 * AnalyticsTracker - Quiz Events & Session Tracking
 * Tracks all user interactions and sends to Supabase
 *
 * Usage in script.js:
 * 1. Add this code before the DOMContentLoaded event listener
 * 2. Call AnalyticsTracker.initSession() inside initQuiz()
 * 3. Call AnalyticsTracker.trackEvent() in event handlers
 */

const AnalyticsTracker = {
    // Configuration
    sessionId: null,
    sessionStartTime: null,
    currentStepStartTime: null,
    supabaseUrl: 'https://pmscpydblddkwbgkzdmw.supabase.co',
    supabaseAnonKey: 'sb_publishable_g3qVdfbiJo942PAs-V-zqA_S8HKfivc',
    consentGiven: false,

    /**
     * Initialize session and check consent
     */
    async initSession() {
        // Check if consent was previously given
        const savedConsent = localStorage.getItem('analytics_consent');
        if (savedConsent === 'true') {
            this.consentGiven = true;
        }

        // Hide consent banner if already accepted
        const consentBanner = document.getElementById('consent-banner');
        if (consentBanner && this.consentGiven) {
            consentBanner.style.display = 'none';
        }

        // Only initialize tracking if consent is given
        if (!this.consentGiven) {
            console.log('[Analytics] Waiting for consent...');
            return;
        }

        // Check if session exists in sessionStorage (survives page refresh)
        let sessionId = sessionStorage.getItem('quiz_session_id');

        if (!sessionId) {
            // Create new session
            sessionId = this.generateUUID();
            sessionStorage.setItem('quiz_session_id', sessionId);

            // Create session record in Supabase
            await this.createSessionRecord(sessionId);
            console.log('[Analytics] New session created:', sessionId);
        } else {
            console.log('[Analytics] Session restored:', sessionId);
        }

        this.sessionId = sessionId;
        this.sessionStartTime = Date.now();
        this.currentStepStartTime = Date.now();

        // Track session start
        this.trackEvent('session_start', {
            metadata: {
                device_info: this.getDeviceInfo(),
                utm_params: this.captureUTMParams()
            }
        });

        // Setup visibility tracking
        this.setupVisibilityTracking();

        console.log('[Analytics] Session initialized');
    },

    /**
     * Setup consent banner
     */
    setupConsentBanner() {
        const acceptBtn = document.getElementById('accept-consent');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                this.consentGiven = true;
                localStorage.setItem('analytics_consent', 'true');

                // Hide banner
                const banner = document.getElementById('consent-banner');
                if (banner) banner.style.display = 'none';

                // Initialize tracking
                this.initSession();

                console.log('[Analytics] Consent accepted');
            });
        }
    },

    /**
     * Track an event (async, non-blocking)
     */
    async trackEvent(eventType, data = {}) {
        // Don't track if no consent
        if (!this.consentGiven) return;

        // Don't track if no session
        if (!this.sessionId) return;

        try {
            const payload = {
                session_id: this.sessionId,
                event_type: eventType,
                step_id: data.step_id || (typeof quizState !== 'undefined' ? quizState.currentStepId : 'unknown'),
                step_number: data.step_number || null,
                answer_value: data.answer_value || null,
                answer_text: data.answer_text || null,
                block_type: data.block_type || null,
                multi_answers: data.multi_answers || null,
                time_on_step_seconds: this.getTimeOnCurrentStep(),
                navigation_direction: data.navigation_direction || 'forward',
                metadata: data.metadata || null
            };

            // Send to Supabase
            this.sendToSupabase('quiz_events', payload);

            console.log(`[Analytics] Event tracked: ${eventType}`, payload);
        } catch (error) {
            console.error('[Analytics] Error tracking event:', error);
        }
    },

    /**
     * Update session status and metadata
     */
    async updateSessionStatus(status, additionalData = {}) {
        if (!this.sessionId || !this.consentGiven) return;

        try {
            const payload = {
                session_id: this.sessionId,
                status: status,
                updated_at: new Date().toISOString(),
                ...additionalData
            };

            // Use UPSERT to update or create
            this.sendToSupabase('quiz_sessions', payload, 'upsert');

            console.log(`[Analytics] Session updated:`, payload);
        } catch (error) {
            console.error('[Analytics] Error updating session:', error);
        }
    },

    /**
     * Create initial session record
     */
    async createSessionRecord(sessionId) {
        if (!this.consentGiven) return;

        try {
            const utmParams = this.captureUTMParams();
            const deviceInfo = this.getDeviceInfo();

            const payload = {
                session_id: sessionId,
                status: 'in_progress',
                utm_source: utmParams.utm_source || null,
                utm_medium: utmParams.utm_medium || null,
                utm_campaign: utmParams.utm_campaign || null,
                referrer: document.referrer || null,
                user_agent: navigator.userAgent,
                device_type: deviceInfo.deviceType,
                browser: deviceInfo.browser,
                os: deviceInfo.os,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            this.sendToSupabase('quiz_sessions', payload);
        } catch (error) {
            console.error('[Analytics] Error creating session record:', error);
        }
    },

    /**
     * Track checkout click
     */
    async trackCheckout(planSelected, checkoutLocation) {
        if (!this.sessionId || !this.consentGiven) return;

        try {
            const payload = {
                session_id: this.sessionId,
                plan_selected: planSelected,
                checkout_location: checkoutLocation || 'unknown',
                email: (typeof quizState !== 'undefined' && quizState.email) ? quizState.email : null,
                metadata: null
            };

            this.sendToSupabase('quiz_checkouts', payload);

            // Also track event
            this.trackEvent('checkout_clicked', {
                metadata: {
                    plan_selected: planSelected,
                    checkout_location: checkoutLocation
                }
            });

            console.log('[Analytics] Checkout tracked:', planSelected);
        } catch (error) {
            console.error('[Analytics] Error tracking checkout:', error);
        }
    },

    /**
     * Track email capture
     */
    async trackEmailCapture(email) {
        if (!this.sessionId || !this.consentGiven) return;

        try {
            // Update session with email
            await this.updateSessionStatus('in_progress', {
                email: email.toLowerCase()
            });

            // Store in quizState if available
            if (typeof quizState !== 'undefined') {
                quizState.email = email;
            }

            // Track event
            this.trackEvent('email_captured', {
                metadata: { email: email }
            });

            console.log('[Analytics] Email captured:', email);
        } catch (error) {
            console.error('[Analytics] Error tracking email:', error);
        }
    },

    /**
     * Helper: Generate UUID v4
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },

    /**
     * Helper: Get time spent on current step
     */
    getTimeOnCurrentStep() {
        if (!this.currentStepStartTime) return 0;
        return Math.floor((Date.now() - this.currentStepStartTime) / 1000);
    },

    /**
     * Helper: Reset step timer
     */
    resetStepTimer() {
        this.currentStepStartTime = Date.now();
    },

    /**
     * Helper: Capture UTM parameters from URL
     */
    captureUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign')
        };
    },

    /**
     * Helper: Get device information
     */
    getDeviceInfo() {
        const ua = navigator.userAgent;
        let deviceType = 'desktop';
        let browser = 'unknown';
        let os = 'unknown';

        // Detect device type
        if (/mobile|android|iPhone|iPad|iPod/i.test(ua)) {
            deviceType = /iPad/i.test(ua) ? 'tablet' : 'mobile';
        }

        // Detect browser
        if (/Chrome/.test(ua)) browser = 'Chrome';
        else if (/Safari/.test(ua)) browser = 'Safari';
        else if (/Firefox/.test(ua)) browser = 'Firefox';
        else if (/Edge/.test(ua)) browser = 'Edge';
        else if (/MSIE|Trident/.test(ua)) browser = 'IE';

        // Detect OS
        if (/Windows/.test(ua)) os = 'Windows';
        else if (/Mac/.test(ua)) os = 'macOS';
        else if (/Linux/.test(ua)) os = 'Linux';
        else if (/Android/.test(ua)) os = 'Android';
        else if (/iPhone|iPad/.test(ua)) os = 'iOS';

        return { deviceType, browser, os };
    },

    /**
     * Setup visibility tracking (detect when user leaves/minimizes)
     */
    setupVisibilityTracking() {
        // Track when user leaves page
        window.addEventListener('beforeunload', () => {
            if (typeof quizState !== 'undefined') {
                const currentStep = quizState.currentStepId;
                const noTrackScreens = ['loading', 'diagnosis', 'offer_screen', 'transition_email', 'transition_result'];

                if (!noTrackScreens.includes(currentStep)) {
                    this.trackEvent('page_left', {
                        metadata: { last_step: currentStep }
                    });
                }
            }
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden', {});
            } else {
                this.trackEvent('page_visible', {});
            }
        });
    },

    /**
     * Send data to Supabase via REST API
     */
    async sendToSupabase(table, data, operation = 'insert') {
        try {
            const url = `${this.supabaseUrl}/rest/v1/${table}`;

            const headers = {
                'apikey': this.supabaseAnonKey,
                'Authorization': `Bearer ${this.supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': operation === 'upsert' ? 'resolution=merge-duplicates' : 'return=minimal'
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                console.error(`[Analytics] HTTP Error ${response.status}:`, await response.text());
            }

            return response.ok;
        } catch (error) {
            console.error(`[Analytics] Error sending to Supabase:`, error);
            return false;
        }
    },

    /**
     * Get all event logs for debugging
     */
    getSessionEvents() {
        return fetch(
            `${this.supabaseUrl}/rest/v1/quiz_events?session_id=eq.${this.sessionId}&order=created_at.asc`,
            {
                headers: {
                    'apikey': this.supabaseAnonKey,
                    'Authorization': `Bearer ${this.supabaseAnonKey}`
                }
            }
        )
            .then(r => r.json())
            .then(events => {
                console.log('[Analytics] Session events:', events);
                return events;
            })
            .catch(err => console.error('[Analytics] Error fetching events:', err));
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsTracker;
}
