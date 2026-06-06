document.addEventListener("DOMContentLoaded", () => {

    const passwordInput = document.getElementById("password");
    const strengthBar = document.querySelector(".strength-bar");
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");
    const passwordRules = document.querySelector(".password-rules");

    if (!passwordInput) return;

    passwordInput.addEventListener("input", () => {

        const value = passwordInput.value;

        //SHOWS ONLY WHEN TYPING
        if (value.length > 0) {
            strengthBar.style.display = "block";
            passwordRules.style.display = "block";
        } else {
            strengthBar.style.display = "none";
            passwordRules.style.display = "none";
            strengthFill.style.width = "0%";
            strengthText.textContent = "";
            return;
        }

        const hasLength  = value.length >= 8;
        const hasUpper   = /[A-Z]/.test(value);
        const hasLower   = /[a-z]/.test(value);
        const hasNumber  = /[0-9]/.test(value);
        const hasSpecial = /[^A-Za-z0-9]/.test(value);

        // rules update
        document.getElementById("lengthRule").innerHTML =
            hasLength ? "✅ Minimum 8 characters" : "❌ Minimum 8 characters";

        document.getElementById("upperRule").innerHTML =
            hasUpper ? "✅ One uppercase letter" : "❌ One uppercase letter";

        document.getElementById("lowerRule").innerHTML =
            hasLower ? "✅ One lowercase letter" : "❌ One lowercase letter";

        document.getElementById("numberRule").innerHTML =
            hasNumber ? "✅ One number" : "❌ One number";

        document.getElementById("specialRule").innerHTML =
            hasSpecial ? "✅ One special character" : "❌ One special character";

        const score = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial]
            .filter(Boolean).length;

        if (score <= 2) {
            strengthFill.style.width = "33%";
            strengthFill.style.backgroundColor = "red";
            strengthText.textContent = "Weak Password";
        } 
        else if (score <= 4) {
            strengthFill.style.width = "66%";
            strengthFill.style.backgroundColor = "orange";
            strengthText.textContent = "Medium Password";
        } 
        else {
            strengthFill.style.width = "100%";
            strengthFill.style.backgroundColor = "green";
            strengthText.textContent = "Strong Password";
        }
    });

});