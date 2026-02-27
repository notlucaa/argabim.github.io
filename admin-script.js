/**
 * ARGABIM - Administration Engine
 * Secured and externalized to comply with CSP
 */

/* global supabase */

// --- 1. Supabase Configuration (Obfuscated) ---
const _0x1a2b = (str) => atob(str);
const _0x4f3d = {
    u: 'aHR0cHM6Ly95dGpjaG15eWd3eGh6bHB1eXNwaS5zdXBhYmFzZS5jbw==',
    k: 'c2JfcHVibGlzaGFibGVfdWloOWEtNlRsdjBKMEpoaUREcWQzUV9fVVZUbGZVRQ=='
};

let sbClient;
try {
    if (window.supabase) {
        sbClient = window.supabase.createClient(_0x1a2b(_0x4f3d.u), _0x1a2b(_0x4f3d.k));
    } else {
        console.error("Supabase SDK not loaded");
        document.body.innerHTML = "<div style='color:white;text-align:center;padding:2rem;'>Erreur critique : Impossible de charger le module de sécurité.</div>";
    }
} catch (e) {
    console.error("Supabase Init Error:", e);
}

// --- 2. DOM Elements ---
document.addEventListener('DOMContentLoaded', () => {
    const initLoader = document.getElementById('init-loader');
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');
    const messagesBody = document.getElementById('messages-body');
    const loading = document.getElementById('loading');
    const logoutBtn = document.getElementById('logout-btn');

    // --- State Check ---
    async function checkSession() {
        try {
            if (!sbClient) throw new Error("Supabase non initialisé");

            const { data, error } = await sbClient.auth.getSession();
            if (error) throw error;

            if (data && data.session) {
                showDashboard();
            } else {
                showLogin();
            }
        } catch (err) {
            console.error("Session check error:", err);
            showLogin();
        } finally {
            if (initLoader) initLoader.style.display = 'none';
        }
    }

    function showLogin() {
        loginView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
    }

    function showDashboard() {
        loginView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        fetchMessages();
    }

    // --- Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (errorMsg) errorMsg.style.display = 'none';
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { error } = await sbClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error("Login Error:", error);
                let msg = "Erreur de connexion.";
                if (error.message.includes("Email not confirmed")) msg = "Veuillez confirmer votre email.";
                if (error.message.includes("Invalid login credentials")) msg = "Email ou mot de passe incorrect.";

                if (errorMsg) {
                    errorMsg.textContent = msg;
                    errorMsg.style.display = 'block';
                }
            } else {
                showDashboard();
            }
        });
    }

    // --- Logout Logic ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await sbClient.auth.signOut();
            showLogin();
        });
    }

    // --- Fetch Data ---
    async function fetchMessages() {
        if (!loading || !messagesBody) return;
        loading.style.display = 'block';
        messagesBody.innerHTML = '';

        const { data, error } = await sbClient
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

        loading.style.display = 'none';

        if (error) {
            messagesBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: red;">Erreur chargement: ${error.message}</td></tr>`;
            return;
        }

        if (!data || data.length === 0) {
            messagesBody.innerHTML = `<tr><td colspan="4" class="empty-state">Aucun message pour le moment.</td></tr>`;
            return;
        }

        data.forEach(msg => {
            const date = new Date(msg.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            });

            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="white-space: nowrap;">${date}</td>
                <td><strong>${escapeHtml(msg.first_name)} ${escapeHtml(msg.last_name)}</strong></td>
                <td><a href="mailto:${escapeHtml(msg.email)}" style="color: var(--primary); text-decoration: none;">${escapeHtml(msg.email)}</a></td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(msg.message)}</td>
            `;
            messagesBody.appendChild(row);
        });
    }

    // Util: Prevent XSS
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Init
    checkSession();
});
