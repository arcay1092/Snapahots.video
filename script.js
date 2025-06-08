const videoInput = document.getElementById('videoInput');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const extraerBtn = document.getElementById('extraerBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const contenedor = document.getElementById('imagenes');
const mensajeToque = document.getElementById('mensajeToque');

const modal = document.getElementById('modal');
const imagenModal = document.getElementById('imagenModal');
const cerrarModal = document.getElementById('cerrarModal');
const volverBtn = document.getElementById('volverBtn');
const descargarBtn = document.getElementById('descargarBtn');

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
    };
  }
});

extraerBtn.addEventListener('click', async function () {
  if (!archivoVideo || !duracion) {
    alert("Primero selecciona un video y espera que cargue.");
    return;
  }

  contenedor.innerHTML = '';
  mensajeToque.style.display = 'none';

  const tiempos = [];
  for (let i = 1; i <= 20; i++) {
    tiempos.push((duracion * i) / 21);
  }

  for (const t of tiempos) {
    await capturarFrame(t);
  }

  mensajeToque.style.display = 'block';
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

  img.addEventListener('click', () => {
    imagenModal.src = url;
    descargarBtn.href = url;
    modal.style.display = 'block';
  });

  contenedorImg.appendChild(img);
  contenedor.appendChild(contenedorImg);
}

cerrarModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

volverBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

limpiarBtn.addEventListener('click', () => {
  contenedor.innerHTML = '';
  video.src = '';
  videoInput.value = '';
  archivoVideo = null;
  duracion = 0;
  mensajeToque.style.display = 'none';
  alert("Todo fue limpiado. Puedes subir un nuevo video.");
});

window.addEventListener('click', function (e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
