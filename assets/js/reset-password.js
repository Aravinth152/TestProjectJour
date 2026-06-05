import { auth } from "./firebase.js";
import {
    verifyPasswordResetCode,
    confirmPasswordReset
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const msg = document.getElementById("msg");
const form = document.getElementById("resetForm");

// Get oobCode from URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get("oobCode");

// Validate reset link
async function checkCode() {
    if (!oobCode) {
        msg.style.color = "red";
        msg.textContent = "Invalid reset link.";
        form.style.display = "none";
        return;
    }

    try {
        await verifyPasswordResetCode(auth, oobCode);

        msg.style.color = "green";
        msg.textContent = "Valid reset link. Enter your new password.";
    } catch (err) {
        msg.style.color = "red";
        msg.textContent = "Reset link has expired or is invalid.";
        form.style.display = "none";
    }
}

checkCode();

// Reset password
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pass = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (pass.length < 6) {
        msg.style.color = "red";
        msg.textContent = "Password must be at least 6 characters.";
        return;
    }

    if (pass !== confirm) {
        msg.style.color = "red";
        msg.textContent = "Passwords do not match.";
        return;
    }

    try {
        await confirmPasswordReset(auth, oobCode, pass);

        msg.style.color = "green";
        msg.textContent = "Password updated successfully! Redirecting...";

        setTimeout(() => {
            window.location.href =
                "https://aravinth152.github.io/TestProjectJour/login.html";
        }, 2000);

    } catch (err) {
        msg.style.color = "red";
        msg.textContent = err.message;
    }
});