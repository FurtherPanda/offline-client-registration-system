console.log("✅ app.js está corriendo");


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("✅ Service Worker registrado:", reg.scope))
      .catch((err) => console.log("❌ Error registrando SW:", err));
  });
}


const DB_NAME = "registroEventoDB";
const DB_VERSION = 1;
let db;
let states = [];
let cities = [];


function obtenerUTMs() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm") || null,
    utmValue: params.get("utm_value") || null,
  };
}
const { utmSource, utmValue } = obtenerUTMs();


function obtenerEventoDesdeURL() {
  const path = window.location.pathname; // Ejemplo: "/jdlink-boost/sync.html"
  const partes = path.split("/").filter(Boolean); // ["jdlink-boost", "sync.html"]

  // Si no hay partes → usamos el evento por defecto
  if (partes.length === 0) {
    return "offline-expo-agroalimentaria-2025";
  }

  // Si el primer segmento NO es un archivo .html, se asume que es un evento
  const primerSegmento = partes[0];
  if (!primerSegmento.includes(".html")) {
    return primerSegmento;
  }

  // Si el primer segmento es un archivo (ej: sync.html), usamos el evento por defecto
  return "offline-expo-agroalimentaria-2025";
}

// Construye endpoint dinámico según el evento
const EVENTO = obtenerEventoDesdeURL();
const ENDPOINT_API = `https://registro.init.mx/api/${EVENTO}/registrations`;
console.log("📡 Endpoint configurado:", ENDPOINT_API);


async function cargarDatosDesdeJSON() {
  try {
    const statesResponse = await fetch("data/states.json");
    states = await statesResponse.json();

    const citiesResponse = await fetch("data/cities.json");
    cities = await citiesResponse.json();

    inicializarSelects();
  } catch (err) {
    console.error("❌ Error cargando JSON:", err);
  }
}

function inicializarSelects() {
  const estadoSelect = document.getElementById("estado");
  const municipioSelect = document.getElementById("municipio");

  if (!estadoSelect || !municipioSelect) return;

  estadoSelect.innerHTML = '<option value="">Estado*</option>';
  municipioSelect.innerHTML = '<option value="">Municipio*</option>';

  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.id;
    option.textContent = state.name;
    estadoSelect.appendChild(option);
  });

  estadoSelect.addEventListener("change", function () {
    const estadoId = parseInt(this.value);
    municipioSelect.innerHTML = '<option value="">Municipio*</option>';

    const filteredCities = cities.filter((c) => c.state_id === estadoId);
    filteredCities.forEach((city) => {
      const option = document.createElement("option");
      option.value = city.id;
      option.textContent = city.name;
      municipioSelect.appendChild(option);
    });
  });
}


async function initApp() {
  await cargarDatosDesdeJSON();

  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("registros")) {
      db.createObjectStore("registros", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    mostrarRegistros();
  };
}

initApp();


const registroForm = document.getElementById("registroForm");
if (registroForm) {
  registroForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = (e.target.nombre?.value || e.target.name?.value || "").trim();
    const correo = (e.target.correo?.value || e.target.email?.value || "").trim();
    const telefono = (e.target.telefono?.value || e.target.phone?.value || "").trim();
    const stateId = parseInt(e.target.estado?.value || e.target.state?.value || 0);
    const cityId = parseInt(e.target.municipio?.value || e.target.city?.value || 0);

    const transaction = db.transaction(["registros"], "readwrite");
    const store = transaction.objectStore("registros");

    const folio = `folio-${randomString(16)}`;

    const nuevoRegistro = {
      name: nombre,
      email: correo,
      phone: telefono,
      folio,
      rfc: null,
      stateId,
      cityId,
      utmSource,
      utmValue,
      sincronizado: false,
      timestamp: Date.now()
    };

    store.add(nuevoRegistro);

    console.log("📥 Registro guardado:", nuevoRegistro);

    e.target.reset();
    $("#registroSuccess").show();
  });
}


function mostrarRegistros() {
  const lista = document.getElementById("listaRegistros");
  if (!lista || !db) return;

  lista.innerHTML = "";

  const transaction = db.transaction(["registros"], "readonly");
  const store = transaction.objectStore("registros");

  store.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const r = cursor.value;
      const estadoNombre = states.find(s => s.id === r.stateId)?.name || "N/A";
      const municipioNombre = cities.find(c => c.id === r.cityId)?.name || "N/A";
      const status = r.sincronizado ? "✓" : "⏳";

      lista.innerHTML += `<li>${r.name} - ${r.email} - ${r.phone} - ${estadoNombre} / ${municipioNombre} [${status}]</li>`;
      cursor.continue();
    }
  };
}


const syncBtn = document.getElementById("syncBtn");
if (syncBtn) {
  syncBtn.addEventListener("click", async () => {
    console.log("🟢 Botón de sincronización presionado");

    if (!navigator.onLine) {
      console.warn("⚠️ No hay conexión a internet");
      alert("No hay conexión a internet");
      return;
    }

    syncBtn.disabled = true;
    const originalText = syncBtn.textContent;
    syncBtn.textContent = "Sincronizando...";

    try {
      const transaction = db.transaction(["registros"], "readonly");
      const store = transaction.objectStore("registros");
      const registrosParaEnviar = [];

      store.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const r = cursor.value;
          if (!r.sincronizado) registrosParaEnviar.push(r);
          cursor.continue();
        } else {
          sincronizarRegistros(registrosParaEnviar);
        }
      };
    } catch (error) {
      console.error("❌ Error iniciando sincronización:", error);
      syncBtn.disabled = false;
      syncBtn.textContent = originalText;
    }

    async function sincronizarRegistros(registros) {
      if (registros.length === 0) {
        alert("No hay registros pendientes.");
        syncBtn.disabled = false;
        syncBtn.textContent = originalText;
        return;
      }

      const payload = { registrations: registros };
      console.log("📦 Enviando payload:", payload);

      try {
        const response = await fetch(ENDPOINT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const tx = db.transaction(["registros"], "readwrite");
        const st = tx.objectStore("registros");

        registros.forEach((r) => {
          r.sincronizado = true;
          st.put(r);
        });

        alert("✅ Registros sincronizados correctamente.");
        mostrarRegistros();
      } catch (err) {
        console.error("❌ Error al sincronizar:", err);
        alert("Error al sincronizar registros.");
      } finally {
        syncBtn.disabled = false;
        syncBtn.textContent = originalText;
      }
    }
  });
}



function configurarImagenFondo() {
  const path = window.location.pathname;
  const partes = path.split("/").filter(Boolean);
  const contenedor = document.querySelector(".form-container-register");

  if (!contenedor) return;

  let evento;
  if (partes.length === 0 || partes[0].includes(".html")) {
    evento = "expoagro/expo"; 
  } else {
    evento = `expoagro/${partes[0]}-expo-bg`;
  }

  // ⏰ Parámetro único para evitar cache
  const timestamp = Date.now();

  const imagenDesktop = `img/${evento}.png?v=${timestamp}`;
  const imagenMobile = `img/${evento}-375x988.png?v=${timestamp}`;

  console.log("🖼️ Imagen de fondo (desktop):", imagenDesktop);
  console.log("📱 Imagen de fondo (mobile):", imagenMobile);

  const estiloPrevio = document.getElementById("bg-dinamico");
  if (estiloPrevio) estiloPrevio.remove();

  const style = document.createElement("style");
  style.id = "bg-dinamico";
  style.textContent = `
    .form-container-register {
      background-image: url("${imagenDesktop}");
      background-size: cover;
      background-position: center;
    }
    @media (max-width: 767px) {
      .form-container-register {
        background-image: url("${imagenMobile}");
      }
    }
  `;
  document.head.appendChild(style);
}

configurarImagenFondo();


function configurarBannerEvento() {
  const path = window.location.pathname; // ej: /jdlink-boost/ o /sync.html
  const partes = path.split("/").filter(Boolean);
  const baseURL = window.location.origin;
  const bannerImg = document.querySelector(".img-fluid.mb-5.mb-md-0.banner-text"); // el <img> del banner

  if (!bannerImg) return;

  // Determinar carpeta del evento
  let eventoCarpeta;
  if (partes.length === 0 || partes[0].includes(".html")) {
    eventoCarpeta = "expoagro"; // 👈 default
  } else {
    eventoCarpeta = partes[0]; // ej: jdlink-boost
  }

  // Construir ruta dinámica
  const bannerSrc = `${baseURL}/img/${eventoCarpeta}/banner-text.png?v=${Date.now()}`;

  // Aplicar al elemento
  bannerImg.src = bannerSrc;
  bannerImg.alt = `${eventoCarpeta} banner`;

  console.log("🖼️ Imagen del banner:", bannerSrc);
}

// Llamar después de cargar el DOM
configurarBannerEvento();
