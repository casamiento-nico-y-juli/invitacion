document.addEventListener("DOMContentLoaded", () => {

    const btnOpen = document.getElementById("btnOpen");
    const btnMusic = document.getElementById("music-toggle");
    const music = document.getElementById("bg-music");
    const hero = document.querySelector(".hero");
    const contenido = document.getElementById("contenido");
    const welcome = document.getElementById("welcome-card");
    const contador = document.getElementById("contador");

    const btnConfirmar = document.getElementById("btnConfirmar");
    const pantallaFinal = document.getElementById("pantalla-final");
    const btnVolver = document.getElementById("volverInicio");

    const container = document.getElementById("inputs-container");
    const btnAgregar = document.getElementById("agregarPersona");

    // =========================
    // 🔥 CONTROL BOTONES ELIMINAR
    // =========================
    function actualizarBotonesEliminar() {
        const grupos = document.querySelectorAll(".input-group");

        grupos.forEach((grupo, index) => {
            const btn = grupo.querySelector(".eliminar");

            if (!btn) return;

            // ocultar todos
            btn.style.display = "none";

            // mostrar solo el último (si hay más de uno)
            if (index === grupos.length - 1 && grupos.length > 1) {
                btn.style.display = "flex";
            }
        });
    }

    // =========================
    // ABRIR INVITACIÓN
    // =========================
    btnOpen.addEventListener("click", () => {
        music.play().catch(() => console.log("Autoplay bloqueado"));

        hero.classList.add("hide");

        setTimeout(() => {
            hero.style.display = "none";
            contenido.classList.add("visible");
            btnMusic.classList.add("visible");

            welcome.style.display = "block";
            setTimeout(() => {
                welcome.style.opacity = 1;
                welcome.style.transform = "translateY(0)";
            }, 50);

            setTimeout(() => {
                contador.style.display = "flex";
                setTimeout(() => {
                    contador.style.opacity = 1;
                    contador.style.transform = "translateY(0)";
                }, 50);
            }, 400);

            document.body.classList.remove("locked");
        }, 1000);
    });

    // =========================
    // BOTÓN MÚSICA
    // =========================
    btnMusic.classList.add(music.paused ? "paused" : "playing");

    btnMusic.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            btnMusic.classList.remove("paused");
            btnMusic.classList.add("playing");
        } else {
            music.pause();
            btnMusic.classList.remove("playing");
            btnMusic.classList.add("paused");
        }
    });

    // =========================
    // ANIMACIONES SCROLL
    // =========================
    const faders = document.querySelectorAll(".fade");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    faders.forEach(el => observer.observe(el));

    // =========================
    // AGREGAR PERSONAS
    // =========================
    btnAgregar.addEventListener("click", () => {
        const div = document.createElement("div");
        div.classList.add("input-group");

        div.innerHTML = `
            <input type="text" placeholder="Nombre del invitado">
            <button class="eliminar">×</button>
        `;

        container.appendChild(div);

        actualizarBotonesEliminar(); // 👈 clave
    });

    // =========================
    // ELIMINAR PERSONA
    // =========================
    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar")) {
            e.target.parentElement.remove();
            actualizarBotonesEliminar(); // 👈 clave
        }
    });

btnConfirmar.addEventListener("click", () => {

    const inputs = document.querySelectorAll("#inputs-container input");

    let nombres = [];

    inputs.forEach(input => {
        const valor = input.value.trim();
        if (valor !== "") {
            const nombreFormateado = valor.charAt(0).toUpperCase() + valor.slice(1);
            nombres.push(nombreFormateado);
        }
    });

    if (nombres.length === 0) {
        alert("Por favor ingresa al menos un nombre");
        return;
    }

    // =========================
    // 🔹 1. GUARDAR EN GOOGLE SHEETS
    // =========================
    const urlSheets = "https://script.google.com/macros/s/AKfycbwUlAt2cZtGiNbytW6nIChl3LIYX-ljsa7cXFzKPWXuQsPc1owm0_vy-6YT748Tn1pfDw/exec?nombres=" 
        + encodeURIComponent(nombres.join(","));

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = urlSheets;
    document.body.appendChild(iframe);

    // =========================
    // 🔹 2. ENVIAR POR WHATSAPP
    // =========================
const telefono = "5491168886947";

const mensaje = `Hola! Confirmo asistencia a la boda💍

👥 Invitados:
- ${nombres.join("\n- ")}

08/05/2026`;

const urlwhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

window.open(urlwhatsApp, "_blank");

    // =========================
    // 🔹 3. MOSTRAR PANTALLA FINAL
    // =========================
    pantallaFinal.classList.add("visible");

});
    // =========================
    // VOLVER AL INICIO
    // =========================
    btnVolver.addEventListener("click", () => {
        pantallaFinal.classList.remove("visible");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // =========================
    // CUENTA REGRESIVA
    // =========================
    const fechaBoda = new Date("May 8, 2026 09:30:00").getTime();

    setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = fechaBoda - ahora;

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferencia / (1000 * 60)) % 60);

        document.getElementById("dias").innerText = dias;
        document.getElementById("horas").innerText = horas;
        document.getElementById("minutos").innerText = minutos;
    }, 1000);

    // 👇 inicializar estado al cargar
    actualizarBotonesEliminar();
});
