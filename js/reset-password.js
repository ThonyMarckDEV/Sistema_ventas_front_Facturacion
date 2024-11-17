import API_BASE_URL from './urlHelper.js';

export function openResetPasswordModal() {
    document.getElementById("resetPasswordModal").classList.remove("hidden");
}

export async function sendVerificationCode() {
    const email = document.getElementById("resetEmail").value;
    document.getElementById("loadingScreen").classList.remove("hidden");
    try {
        const response = await fetch(`${API_BASE_URL}/api/send-verification-codeUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            document.getElementById("loadingScreen").classList.add("hidden");
            alert("Código de verificación enviado. Revisa tu correo.");
            document.getElementById("resetPasswordModal").classList.add("hidden");
            document.getElementById("verifyCodeModal").classList.remove("hidden");
        } else {
            document.getElementById("loadingScreen").classList.add("hidden");
            alert("No se pudo enviar el código. Verifica el correo ingresado.");
        }
    } catch (error) {
        document.getElementById("loadingScreen").classList.add("hidden");
        console.error("Error:", error);
    }
}

export async function verifyCode() {
    const email = document.getElementById("resetEmail").value;
    const code = document.getElementById("verificationCode").value;
    document.getElementById("loadingScreen").classList.remove("hidden");
    try {
        const response = await fetch(`${API_BASE_URL}/api/verify-codeUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code })
        });

        if (response.ok) {
            document.getElementById("loadingScreen").classList.add("hidden");
            alert("Código verificado. Cambia tu contraseña.");
            document.getElementById("verifyCodeModal").classList.add("hidden");
            document.getElementById("changePasswordModal").classList.remove("hidden");
        } else {
            document.getElementById("loadingScreen").classList.add("hidden");
            alert("Código incorrecto. Inténtalo de nuevo.");
        }
    } catch (error) {
        document.getElementById("loadingScreen").classList.add("hidden");
        console.error("Error:", error);
    }
}

export async function changePassword() {
    const email = document.getElementById("resetEmail").value;
    const newPassword = document.getElementById("newPassword").value;
    document.getElementById("loadingScreen").classList.remove("hidden");
    try {
        const response = await fetch(`${API_BASE_URL}/api/change-passwordUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword })
        });

        if (response.ok) {
            document.getElementById("loadingScreen").classList.add("hidden");
            alert("Contraseña cambiada con éxito. Revisa tu correo.");
            document.getElementById("changePasswordModal").classList.add("hidden");
        } else {
            document.getElementById("loadingScreen").classList.add("hidden");
            alert("No se pudo cambiar la contraseña. Inténtalo de nuevo.");
        }
    } catch (error) {
        document.getElementById("loadingScreen").classList.add("hidden");
        console.error("Error:", error);
    }
}
