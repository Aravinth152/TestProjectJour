import { auth } from "./firebase.js";
import {
    verifyPasswordResetCode,
    confirmPasswordReset
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const msg = document.getElementById("msg");
const form = document.getElementById("resetForm");

// 1. Get oobCode from URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get("oobCode");

// 2. Validate link
async function checkCode() {
    try {
        await verifyPasswordResetCode(auth, oobCode);
        msg.style.color = "green";
        msg.textContent = "Valid reset link. Enter new password.";
    } catch (err) {
        msg.style.color = "red";
        msg.textContent = "Invalid or expired link.";
    }
}

checkCode();

// 3. Reset password
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pass = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (pass !== confirm) {
        msg.style.color = "red";
        msg.textContent = "Passwords do not match!";
        return;
    }

    try {
        await confirmPasswordReset(auth, oobCode, pass);

        msg.style.color = "green";
        msg.textContent = "Password updated successfully! Redirecting...";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);

    } catch (err) {
        msg.style.color = "red";
        msg.textContent = err.message;
    }
});