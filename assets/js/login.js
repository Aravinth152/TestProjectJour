import { auth } from "./firebase.js";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = document.getElementById("loginIdentifier").value.trim();
    const password = document.getElementById("loginPassword").value;
    const remember = document.getElementById("rememberMe").checked;
    const errorEl  = document.getElementById("loginError");

    errorEl.textContent = "";

    try {
        await setPersistence(
            auth,
            remember ? browserLocalPersistence : browserSessionPersistence
        );

        await signInWithEmailAndPassword(auth, email, password);

        alert("Login successful!");
        window.location.href = "dashboard.html";

    } catch (err) {
        errorEl.textContent = "Invalid email or password.";
    }
});