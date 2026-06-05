import { auth } from "./firebase.js";
import { sendPasswordResetEmail } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

console.log("Forgot password loaded");

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("forgotForm");
    const emailInput = document.getElementById("fpEmail");
    const msg = document.getElementById("step1Msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        msg.textContent = "";

        if (!email) {
            msg.style.color = "red";
            msg.textContent = "Enter email first";
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email, {
            url: "https://aravinth152.github.io/TestProjectJour/reset-password.html",
            handleCodeInApp: true
            });
            msg.style.color = "green";
            msg.textContent = "Reset link sent to email!";
            form.reset();

        } catch (err) {
            console.log(err);

            msg.style.color = "red";
            msg.textContent = err.code;
        }
    });

});