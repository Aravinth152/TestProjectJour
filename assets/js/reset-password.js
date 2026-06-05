import { auth } from "./firebase.js";
import {
    confirmPasswordReset,
    verifyPasswordResetCode
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("resetForm");
const msgEl = document.getElementById("msg");

// Read oobCode from URL → ?oobCode=XXXXX
const params = new URLSearchParams(window.location.search);
const oobCode = params.get("oobCode");

// If no oobCode, block the form immediately
if (!oobCode) {
    msgEl.style.color = "red";
    msgEl.textContent = "❌ Invalid or expired reset link. Please request a new one.";
    form.style.display = "none";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword     = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    msgEl.textContent = "";

    // Client-side match check
    if (newPassword !== confirmPassword) {
        msgEl.style.color = "red";
        msgEl.textContent = "❌ Passwords do not match.";
        return;
    }

    // Minimum length check
    if (newPassword.length < 8) {
        msgEl.style.color = "red";
        msgEl.textContent = "❌ Password must be at least 8 characters.";
        return;
    }

    try {
        // 1. Verify the oobCode is still valid
        await verifyPasswordResetCode(auth, oobCode);

        // 2. Apply the new password
        await confirmPasswordReset(auth, oobCode, newPassword);

        msgEl.style.color = "green";
        msgEl.textContent = "✅ Password reset successful! Redirecting to login...";
        form.style.display = "none";

        // Redirect to login after 3 seconds
        setTimeout(() => window.location.href = "login.html", 3000);

    } catch (error) {
        msgEl.style.color = "red";

        if (error.code === "auth/expired-action-code") {
            msgEl.textContent = "❌ Reset link has expired. Please request a new one.";
        } else if (error.code === "auth/invalid-action-code") {
            msgEl.textContent = "❌ Reset link is invalid or already used.";
        } else if (error.code === "auth/weak-password") {
            msgEl.textContent = "❌ Password is too weak. Use a stronger password.";
        } else {
            msgEl.textContent = `❌ Error: ${error.message}`;
        }
    }
});