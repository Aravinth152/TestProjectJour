import { auth } from "./firebase.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("forgotForm");
const messageEl = document.getElementById("step1Msg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("fpEmail").value.trim();

    // 👇 Replace with your actual GitHub Pages URL
    const continueUrl = "https://aravinth152.github.io/TestProjectJour/reset-password.html";

    const actionCodeSettings = {
        url: continueUrl,
        handleCodeInApp: false,
    };

    try {
        await sendPasswordResetEmail(auth, email, actionCodeSettings);

        messageEl.style.color = "green";
        messageEl.textContent = "✅ Reset link sent! Check your email.";

        // Disable the form so they don't spam
        document.getElementById("fpEmail").disabled = true;
        form.querySelector("button[type=submit]").disabled = true;

    } catch (error) {
        messageEl.style.color = "red";

        if (error.code === "auth/user-not-found") {
            messageEl.textContent = "❌ No account found with this email.";
        } else if (error.code === "auth/invalid-email") {
            messageEl.textContent = "❌ Invalid email address.";
        } else {
            messageEl.textContent = `❌ Error: ${error.message}`;
        }
    }
});