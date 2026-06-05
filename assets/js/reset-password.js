import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    confirmPasswordReset,
    verifyPasswordResetCode
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCfCCCZQz-fzNR6aSM85fHjJOeOdqrHDzM",
    authDomain: "testauth-b380f.firebaseapp.com",
    projectId: "testauth-b380f",
    storageBucket: "testauth-b380f.firebasestorage.app",
    messagingSenderId: "278543117601",
    appId: "1:278543117601:web:2b506250221f0c74f42260"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI blocks
const loadingBlock = document.getElementById("loadingBlock");
const invalidBlock  = document.getElementById("invalidBlock");
const resetForm     = document.getElementById("resetForm");
const msgEl         = document.getElementById("msg");

// Read oobCode from URL
const params  = new URLSearchParams(window.location.search);
const oobCode = params.get("oobCode");

// ── On page load: verify the oobCode first ──
if (!oobCode) {
    // No code in URL at all
    loadingBlock.style.display = "none";
    invalidBlock.style.display = "block";
} else {
    // Verify with Firebase that code is still valid
    verifyPasswordResetCode(auth, oobCode)
        .then(() => {
            // Code is valid → show the form
            loadingBlock.style.display = "none";
            resetForm.style.display    = "block";
        })
        .catch(() => {
            // Code is expired or already used
            loadingBlock.style.display = "none";
            invalidBlock.style.display = "block";
        });
}

// ── Form submit ──
resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword     = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    msgEl.textContent = "";

    if (newPassword !== confirmPassword) {
        msgEl.style.color   = "red";
        msgEl.textContent   = "❌ Passwords do not match.";
        return;
    }

    if (newPassword.length < 8) {
        msgEl.style.color = "red";
        msgEl.textContent = "❌ Password must be at least 8 characters.";
        return;
    }

    try {
        await confirmPasswordReset(auth, oobCode, newPassword);

        msgEl.style.color = "green";
        msgEl.textContent = "✅ Password reset successful! Redirecting to login...";
        resetForm.querySelector("button[type=submit]").disabled = true;

        setTimeout(() => window.location.href = "login.html", 3000);

    } catch (error) {
        msgEl.style.color = "red";

        if (error.code === "auth/expired-action-code") {
            msgEl.textContent = "❌ Reset link expired. Please request a new one.";
        } else if (error.code === "auth/invalid-action-code") {
            msgEl.textContent = "❌ Link already used or invalid.";
        } else if (error.code === "auth/weak-password") {
            msgEl.textContent = "❌ Password is too weak.";
        } else {
            msgEl.textContent = `❌ ${error.message}`;
        }
    }
});