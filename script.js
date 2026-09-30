const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const nowPlaying = document.getElementById('nowPlaying');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let animationId;
let time = 0;
let musicPlaying = false;

// Colores para los carritos Hot Wheels
const carColors = [
    '#FF0000', // Rojo
    '#00FF00', // Verde
    '#0000FF', // Azul
    '#FFFF00', // Amarillo
    '#FF00FF', // Magenta
    '#00FFFF', // Cian
    '#FFA500', // Naranja
    '#FF1493'  // Rosa
];

// Colores para los planetas
const planetColors = [
    '#FF6347', // Rojo tomate
    '#4169E1', // Azul real
    '#FFD700', // Oro
    '#9370DB', // Púrpura
    '#20B2AA', // Verde azulado
    '#FF8C00'  // Naranja oscuro
];

// Crear estrellas
function createStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            opacity: Math.random() * 0.5 + 0.5,
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }
    return stars;
}

// Crear carritos
function createCars(count) {
    const cars = [];
    for (let i = 0; i < count; i++) {
        cars.push({
            angle: (i / count) * Math.PI * 2,
            radius: 150 + Math.random() * 100,
            speed: 0.002 + Math.random() * 0.001,
            color: carColors[i % carColors.length],
            size: 8 + Math.random() * 4
        });
    }
    return cars;
}

// Crear planetas
function createPlanets(count) {
    const planets = [];
    for (let i = 0; i < count; i++) {
        planets.push({
            angle: (i / count) * Math.PI * 2,
            radius: 200 + i * 50,
            speed: 0.0005 - i * 0.00005,
            color: planetColors[i % planetColors.length],
            size: 20 + i * 8
        });
    }
    return planets;
}

const stars = createStars(300);
const cars = createCars(8);
const planets = createPlanets(4);

// Controles de música
musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicToggle.textContent = '🔊 Música';
        musicToggle.classList.remove('playing');
        musicPlaying = false;
    } else {
        backgroundMusic.play().catch(err => {
            console.log('Error al reproducir música:', err);
            nowPlaying.textContent = 'Error al cargar la música';
        });
        musicToggle.textContent = '🔊 Música (Reproduciendo)';
        musicToggle.classList.add('playing');
        musicPlaying = true;
    }
});

// Auto-reproducir música cuando se cargue (con permiso del navegador)
window.addEventListener('load', () => {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(err => {
        console.log('Auto-play bloqueado. El usuario debe hacer clic en el botón');
        musicToggle.textContent = '🔊 Música (Haz clic para reproducir)';
    });
});

// Dibujar estrella
function drawStar(star) {
    star.opacity += Math.sin(time * star.twinkleSpeed) * 0.01;
    star.opacity = Math.max(0.2, Math.min(1, star.opacity));
    
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity * 0.5})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
}

// Dibujar carrito (representado por un rectángulo estilizado)
function drawCar(car, centerX, centerY) {
    const x = centerX + Math.cos(car.angle) * car.radius;
    const y = centerY + Math.sin(car.angle) * car.radius;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(car.angle + Math.PI / 2);
    
    // Cuerpo del carrito
    ctx.fillStyle = car.color;
    ctx.fillRect(-car.size / 2, -car.size / 2, car.size, car.size);
    
    // Detalles del carrito
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(-car.size / 3, -car.size / 3, car.size * 2/3, car.size * 0.4);
    
    ctx.restore();
    
    // Glow effect
    ctx.fillStyle = `rgba(${parseInt(car.color.slice(1,3),16)}, ${parseInt(car.color.slice(3,5),16)}, ${parseInt(car.color.slice(5,7),16)}, 0.3)`;
    ctx.beginPath();
    ctx.arc(x, y, car.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
}

// Dibujar planeta
function drawPlanet(planet, centerX, centerY) {
    const x = centerX + Math.cos(planet.angle) * planet.radius;
    const y = centerY + Math.sin(planet.angle) * planet.radius;
    
    // Planeta
    ctx.fillStyle = planet.color;
    ctx.beginPath();
    ctx.arc(x, y, planet.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Outer glow
    ctx.fillStyle = `rgba(${parseInt(planet.color.slice(1,3),16)}, ${parseInt(planet.color.slice(3,5),16)}, ${parseInt(planet.color.slice(5,7),16)}, 0.2)`;
    ctx.beginPath();
    ctx.arc(x, y, planet.size * 1.8, 0, Math.PI * 2);
    ctx.fill();
}

// Dibujar nombre en estrellas
function drawNameInStars(centerX, centerY) {
    const name = "ORLANDO";
    const radius = 280;
    const letterRadius = 40;
    
    for (let i = 0; i < name.length; i++) {
        const angle = (i / name.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Letra principal
        ctx.fillStyle = '#FFFF00';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillText(name[i], x, y);
        
        // Estrellas alrededor de la letra
        const starCount = 5;
        for (let j = 0; j < starCount; j++) {
            const starAngle = (j / starCount) * Math.PI * 2;
            const starX = x + Math.cos(starAngle) * letterRadius;
            const starY = y + Math.sin(starAngle) * letterRadius;
            
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(starX, starY, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}

// Animación principal
function animate() {
    // Fondo negro con efecto de movimiento
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Dibujar estrellas
    stars.forEach(star => drawStar(star));
    
    // Dibujar órbitas
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
    ctx.stroke();
    
    cars.forEach(car => {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, car.radius, 0, Math.PI * 2);
        ctx.stroke();
    });
    
    planets.forEach(planet => {
        ctx.strokeStyle = 'rgba(100, 149, 237, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.radius, 0, Math.PI * 2);
        ctx.stroke();
    });
    
    // Actualizar y dibujar carritos
    cars.forEach(car => {
        car.angle += car.speed;
        drawCar(car, centerX, centerY);
    });
    
    // Actualizar y dibujar planetas
    planets.forEach(planet => {
        planet.angle += planet.speed;
        drawPlanet(planet, centerX, centerY);
    });
    
    // Dibujar nombre en estrellas
    drawNameInStars(centerX, centerY);
    
    time++;
    animationId = requestAnimationFrame(animate);
}

// Manejar redimensionamiento
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Iniciar animación
animate();
