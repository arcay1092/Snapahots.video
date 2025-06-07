const videoInput = document.getElementById('videoInput');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const extraerBtn = document.getElementById('extraerBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const contenedor = document.getElementById('imagenes');

let duracion = 0;
let archivoVideo = null;

videoInput.addEventListener('change', function () {
  archivoVideo = this.files[0];
  if (archivoVideo) {
    const url = URL.createObjectURL(archivoVideo);
    video.src = url;
    video.load();
    video.onloadedmetadata = () => {
      duracion = video.duration;
      console.log("Duración del video: " + duracion + " segundos");
    };
  }
});

extraerBtn.addEventListener('click', async function () {
  if (!archivoVideo || !duracion) {
    alert("Primero selecciona un video y espera que cargue.");
    return;
  }

  contenedor.innerHTML = ''; // limpiar imágenes anteriores

  const tiempos = [];
  for (let i = 1; i <= 20; i++) {
    tiempos.push((duracion * i) / 21);
  }

  for (const t of tiempos) {
    await capturarFrame(t);
  }

  alert("¡Listo! Se capturaron 20 imágenes.");
});

function capturarFrame(tiempo) {
  return new Promise(resolve => {
    video.currentTime = tiempo;

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        mostrarImagen(url);
        resolve();
      }, 'image/jpeg', 1.0);
    };
  });
}

function mostrarImagen(url) {
  const contenedorImg = document.createElement('div');
  contenedorImg.className = 'img-container';

  const img = document.createElement('img');
  img.src = url;

  const botonAbrir = document.createElement('button');
  botonAbrir.textContent = 'Abrir';

  // ✔️ Esto abrirá la imagen en una nueva pestaña, compatible con Chrome móvil
  botonAbrir.addEventListener('click', () => {
    const nuevaVentana = window.open(url, '_blank');
    if (!nuevaVentana) {
      alert("El navegador bloqueó la ventana emergente. Activa las ventanas emergentes para esta página.");
    } else {
      nuevaVentana.focus();
    }
  });

  contenedorImg.appendChild(img);
  contenedorImg.appendChild(botonAbrir);
  contenedor.appendChild(contenedorImg);
}

limpiarBtn.addEventListener('click', function () {
  contenedor.innerHTML = '';
  video.src = '';
  videoInput.value = '';
  archivoVideo = null;
  duracion = 0;
  alert("Todo fue limpiado. Puedes subir un nuevo video.");
});
