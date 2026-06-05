import { auth, db } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const email     = document.getElementById("email").value.trim();
    const username  = document.getElementById("username").value.trim();
    const password  = document.getElementById("password").value;
    const confirm   = document.getElementById("confirmPassword").value;
    const errorEl   = document.getElementById("passwordError");

    errorEl.textContent = "";

    // Password match check
    if (password !== confirm) {
        errorEl.textContent = "Passwords do not match!";
        return;
    }

    try {
        // 1. Create Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Update display name
        await updateProfile(user, {
            displayName: username
        });

        // 3. Save extra data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            email,
            username,
            createdAt: new Date().toISOString()
        });

        alert("Registration successful!");
        window.location.href = "login.html";

    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            errorEl.textContent = "Email already in use.";
        } else if (err.code === "auth/weak-password") {
            errorEl.textContent = "Password is too weak.";
        } else {
            errorEl.textContent = err.message;
        }
    }
});