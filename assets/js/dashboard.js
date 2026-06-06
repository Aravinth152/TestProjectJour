import { auth, db } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── UI Elements ──
const avatarImg        = document.getElementById("avatarImg");
const avatarInputLarge = document.getElementById("avatarInputLarge");
const heroName         = document.getElementById("heroName");
const heroUsername     = document.getElementById("heroUsername");
const infoFirstName    = document.getElementById("infoFirstName");
const infoLastName     = document.getElementById("infoLastName");
const infoEmail        = document.getElementById("infoEmail");
const infoUsername     = document.getElementById("infoUsername");
const infoJoined       = document.getElementById("infoJoined");

const logoutBtn        = document.getElementById("logoutBtn");
const openEditBtn      = document.getElementById("openEditBtn");
const closeEditBtn     = document.getElementById("closeEditBtn");
const saveEditBtn      = document.getElementById("saveEditBtn");
const editModal        = document.getElementById("editModal");

const editFirstName    = document.getElementById("editFirstName");
const editLastName     = document.getElementById("editLastName");
const editUsername     = document.getElementById("editUsername");
const editEmail        = document.getElementById("editEmail");
const modalMsg         = document.getElementById("modalMsg");
const toast            = document.getElementById("toast");

// ── Default avatar (initials-based) ──
function getInitialsAvatar(name) {
    const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "U";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#6c63ff;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#a89cff;stop-opacity:1" />
            </linearGradient>
        </defs>
        <circle cx="70" cy="70" r="70" fill="url(#grad)"/>
        <text x="70" y="85" font-family="Poppins,sans-serif" font-size="48"
              font-weight="800" fill="white" text-anchor="middle">${initials}</text>
    </svg>`;
    return "data:image/svg+xml;base64," + btoa(svg);
}

// ── Show toast notification ──
function showToast(msg, color = "#222") {
    toast.textContent = msg;
    toast.style.background = color;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Populate dashboard with user data ──
function populateDashboard(user, firestoreData) {
    const firstName = firestoreData?.firstName || "";
    const lastName  = firestoreData?.lastName  || "";
    const username  = firestoreData?.username  || user.displayName || "user";
    const email     = user.email || "";
    const joined    = firestoreData?.createdAt
        ? new Date(firestoreData.createdAt).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })
        : "—";

    const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

    // Hero section
    heroName.textContent     = fullName;
    heroUsername.textContent = "@" + username;

    // Info cards
    infoFirstName.textContent = firstName || "—";
    infoLastName.textContent  = lastName  || "—";
    infoEmail.textContent     = email;
    infoUsername.textContent  = username;
    infoJoined.textContent    = joined;

    // Avatar: use photoURL if set, else initials
    avatarImg.src = user.photoURL || getInitialsAvatar(fullName);
}

// ── Auth state check ──
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : {};
        populateDashboard(user, data);
    } catch (err) {
        console.error("Error loading profile:", err);
        populateDashboard(user, {});
    }
});

// ── Profile picture upload ──
avatarInputLarge.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
        avatarImg.src = ev.target.result;
        showToast("✅ Profile photo updated!");
    };
    reader.readAsDataURL(file);
});

// ── Open edit modal ──
openEditBtn.addEventListener("click", () => {
    editFirstName.value = infoFirstName.textContent === "—" ? "" : infoFirstName.textContent;
    editLastName.value  = infoLastName.textContent  === "—" ? "" : infoLastName.textContent;
    editUsername.value  = infoUsername.textContent;
    editEmail.value     = infoEmail.textContent;
    modalMsg.textContent = "";
    editModal.classList.add("active");
});

// ── Close edit modal ──
closeEditBtn.addEventListener("click", () => editModal.classList.remove("active"));
editModal.addEventListener("click", (e) => {
    if (e.target === editModal) editModal.classList.remove("active");
});

// ── Save changes ──
saveEditBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newFirstName = editFirstName.value.trim();
    const newLastName  = editLastName.value.trim();
    const newUsername  = editUsername.value.trim();

    if (!newFirstName) {
        modalMsg.style.color = "red";
        modalMsg.textContent = "❌ First name is required.";
        return;
    }

    if (!newUsername) {
        modalMsg.style.color = "red";
        modalMsg.textContent = "❌ Username is required.";
        return;
    }

    saveEditBtn.textContent = "Saving...";
    saveEditBtn.disabled = true;
    modalMsg.textContent = "";

    try {
        await updateDoc(doc(db, "users", user.uid), {
            firstName: newFirstName,
            lastName:  newLastName,
            username:  newUsername,
        });

        await updateProfile(user, { displayName: newUsername });

        const fullName = [newFirstName, newLastName].filter(Boolean).join(" ");
        heroName.textContent     = fullName;
        heroUsername.textContent = "@" + newUsername;
        infoFirstName.textContent   = newFirstName || "—";
        infoLastName.textContent    = newLastName  || "—";
        infoUsername.textContent    = newUsername;

        if (!user.photoURL) {
            avatarImg.src = getInitialsAvatar(fullName);
        }

        editModal.classList.remove("active");
        showToast("✅ Profile updated successfully!", "#6c63ff");

    } catch (err) {
        modalMsg.style.color = "red";
        modalMsg.textContent = "❌ " + err.message;
    } finally {
        saveEditBtn.textContent = "Save Changes";
        saveEditBtn.disabled = false;
    }
});

// ── Logout ──
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});