/**
 * Lucky Ashok Kadam (Lucky Kadam) - Creative 3D Portfolio Engine
 * Features:
 * - 16:9 Noomo Labs 3D Physics Spheres with Skills & App Logos
 * - Real-Time 3D Eye & Avatar Head Tracking
 * - Trailing Physics Cursor & Tactile Particle Burst
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initParticleBurst();
  initInteractiveAvatar();
  initMagneticElements();
  initNavbar();
  initContactForm();
  initNoomoPhysicsLab();
});

/* --------------------------------------------------------------------------
   1. CUSTOM DUAL ANIMATED CURSOR
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const targets = document.querySelectorAll('a, button, input, .gradient-pill-btn, .bento-card, .stacked-card-frame, .geo-shape, .control-btn');
  targets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('active');
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.4)`;
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('active');
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
    });
  });
}

/* --------------------------------------------------------------------------
   2. HERO 3D AVATAR EYE & HEAD TRACKING
   -------------------------------------------------------------------------- */
function initInteractiveAvatar() {
  const avatarContainer = document.getElementById('avatar-container');
  const avatarHead = document.getElementById('avatar-head');
  const pupilLeft = document.getElementById('pupil-left');
  const pupilRight = document.getElementById('pupil-right');
  const browLeft = document.getElementById('brow-left');
  const browRight = document.getElementById('brow-right');

  if (!avatarContainer || !pupilLeft || !pupilRight) return;

  let currentHeadRotX = 0;
  let currentHeadRotY = 0;
  let targetHeadRotX = 0;
  let targetHeadRotY = 0;

  let currentPupilX = 0;
  let currentPupilY = 0;
  let targetPupilX = 0;
  let targetPupilY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = avatarContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    const angle = Math.atan2(deltaY, deltaX);
    const maxPupilDist = 13;
    const pupilDist = Math.min(dist / 30, maxPupilDist);

    targetPupilX = Math.cos(angle) * pupilDist;
    targetPupilY = Math.sin(angle) * pupilDist;

    const maxRot = 16;
    targetHeadRotY = Math.max(-maxRot, Math.min(maxRot, (deltaX / window.innerWidth) * 35));
    targetHeadRotX = Math.max(-maxRot, Math.min(maxRot, -(deltaY / window.innerHeight) * 35));

    if (browLeft && browRight) {
      if (deltaY < -100) {
        browLeft.style.transform = 'translateY(-3px) rotate(8deg)';
        browRight.style.transform = 'translateY(-3px) rotate(-8deg)';
      } else {
        browLeft.style.transform = 'rotate(6deg)';
        browRight.style.transform = 'rotate(-6deg)';
      }
    }
  });

  function animateAvatar() {
    currentHeadRotX += (targetHeadRotX - currentHeadRotX) * 0.1;
    currentHeadRotY += (targetHeadRotY - currentHeadRotY) * 0.1;

    currentPupilX += (targetPupilX - currentPupilX) * 0.15;
    currentPupilY += (targetPupilY - currentPupilY) * 0.15;

    if (avatarHead) {
      avatarHead.style.transform = `rotateX(${currentHeadRotX.toFixed(2)}deg) rotateY(${currentHeadRotY.toFixed(2)}deg)`;
    }

    pupilLeft.style.transform = `translate(${currentPupilX.toFixed(2)}px, ${currentPupilY.toFixed(2)}px)`;
    pupilRight.style.transform = `translate(${currentPupilX.toFixed(2)}px, ${currentPupilY.toFixed(2)}px)`;

    requestAnimationFrame(animateAvatar);
  }
  requestAnimationFrame(animateAvatar);

  function naturalBlink() {
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
      eye.style.transform = 'scaleY(0.08)';
    });
    setTimeout(() => {
      eyes.forEach(eye => {
        eye.style.transform = 'scaleY(1)';
      });
    }, 140);

    const nextBlink = Math.random() * 3500 + 2500;
    setTimeout(naturalBlink, nextBlink);
  }
  setTimeout(naturalBlink, 3000);
}

/* --------------------------------------------------------------------------
   3. NOOMO LABS 16:9 THREE.JS 3D PHYSICS SPHERES PLAYGROUND
   With App & Skill Logos (Python, C++, AI, Data, GitHub, DU, etc.)
   -------------------------------------------------------------------------- */
function initNoomoPhysicsLab() {
  const canvas = document.getElementById('three-physics-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const stage = canvas.parentElement;
  let width = stage.clientWidth;
  let height = stage.clientHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 28;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Lighting (Glossy specular shine matching Noomo Labs video)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
  mainLight.position.set(15, 20, 25);
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0xff0080, 0.85);
  rimLight.position.set(-20, -15, -10);
  scene.add(rimLight);

  const blueLight = new THREE.PointLight(0x00f2fe, 1.2, 50);
  blueLight.position.set(0, 10, 15);
  scene.add(blueLight);

  // Skill & App Data with Logos
  const skillsData = [
    { title: 'OpenAI AI Foundation', icon: '🤖', desc: 'AI Foundation Course • OpenAI Learning', color: '#10a37f', text: 'OpenAI' },
    { title: 'HP LIFE Certificate', icon: '🏆', desc: 'Social Media Marketing • Digital Marketing & Branding', color: '#0096d6', text: 'HP LIFE' },
    { title: 'Python', icon: '🐍', desc: 'Beginner • Core logic & data analysis', color: '#3776ab', text: 'Python' },
    { title: 'C++', icon: '💻', desc: 'Beginner • Memory & algorithmic basics', color: '#00599c', text: 'C++' },
    { title: 'Data Analytics', icon: '📊', desc: 'Concepts • Numerical patterns & statistics', color: '#00b4d8', text: 'Data' },
    { title: 'Artificial Intelligence', icon: '⚡', desc: 'Exploration • Neural models & tools', color: '#9d4edd', text: 'AI' },
    { title: 'Digital Marketing', icon: '📈', desc: 'Online Branding & Audience Engagement', color: '#00d2ff', text: 'Marketing' },
    { title: 'Economics', icon: '📉', desc: 'Coursework • Market curves & elasticity', color: '#f77f00', text: 'Econ' },
    { title: 'Dyal Singh College', icon: '🎓', desc: 'University of Delhi • Undergraduate Student', color: '#d62828', text: 'DU' },
    { title: 'GitHub', icon: '🐙', desc: 'Repositories • Version control & practice', color: '#24292e', text: 'Git' },
    { title: 'VS Code', icon: '💻', desc: 'Code Editor • Daily development setup', color: '#007acc', text: 'Code' },
    { title: 'Three.js / WebGL', icon: '🔮', desc: '3D Graphics • Physics experiments', color: '#e0aaff', text: '3D' },
    { title: 'HTML5 & CSS3', icon: '🌐', desc: 'Frontend • Responsive modern grid design', color: '#e34f26', text: 'Web' },
    { title: 'LinkedIn', icon: '💼', desc: 'Professional • Networking with peers', color: '#0077b5', text: 'LinkedIn' },
    { title: 'Instagram', icon: '📱', desc: 'Social • Creative exploration', color: '#e1306c', text: 'Insta' }
  ];

  // Helper to create high-resolution dynamic canvas texture with logos
  function createSphereTexture(skill, isPearl) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Sphere background
    if (isPearl) {
      const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.7, '#e8ecf2');
      grad.addColorStop(1, '#c5cbd6');
      ctx.fillStyle = grad;
    } else {
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
      grad.addColorStop(0, skill.color);
      grad.addColorStop(1, '#08090e');
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, 512, 512);

    // Center circular badge for logo
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 120, 0, Math.PI * 2);
    ctx.fillStyle = isPearl ? skill.color : 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.restore();

    // Icon & Text inside badge
    ctx.font = 'bold 90px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isPearl ? '#ffffff' : '#0c0d12';
    ctx.fillText(skill.icon, 256, 230);

    ctx.font = 'bold 38px "JetBrains Mono", monospace';
    ctx.fillStyle = isPearl ? '#ffffff' : '#0c0d12';
    ctx.fillText(skill.text, 256, 310);

    return new THREE.CanvasTexture(c);
  }

  // Generate Spheres
  const spheres = [];
  const sphereCount = 28;
  let isPearlTheme = true;
  let gravityEnabled = true;

  const sphereGeo = new THREE.SphereGeometry(1, 32, 32);

  for (let i = 0; i < sphereCount; i++) {
    const skill = skillsData[i % skillsData.length];
    const radius = 1.3 + Math.random() * 0.7;

    const texture = createSphereTexture(skill, isPearlTheme);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.18,
      metalness: 0.12,
    });

    const mesh = new THREE.Mesh(sphereGeo, material);
    mesh.scale.setScalar(radius);

    // Initial random position in cluster
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 7 + 1;
    mesh.position.set(
      Math.cos(angle) * r,
      Math.sin(angle) * r,
      (Math.random() - 0.5) * 5
    );

    mesh.userData = {
      radius: radius,
      skill: skill,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      vz: (Math.random() - 0.5) * 0.1,
      baseRadius: radius
    };

    scene.add(mesh);
    spheres.push(mesh);
  }

  // Mouse Raycasting & Force Tracking
  const mouse = new THREE.Vector2(-9999, -9999);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouse3D = new THREE.Vector3(0, 0, 0);

  const toast = document.getElementById('sphere-info-toast');
  const sitIcon = document.getElementById('sit-icon');
  const sitTitle = document.getElementById('sit-title');
  const sitDesc = document.getElementById('sit-desc');

  function updateMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, mouse3D);
  }

  canvas.addEventListener('mousemove', (e) => {
    updateMousePosition(e);

    // Hover tooltip detection
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spheres);
    if (intersects.length > 0 && toast) {
      const s = intersects[0].object.userData.skill;
      if (s) {
        sitIcon.innerText = s.icon;
        sitTitle.innerText = s.title;
        sitDesc.innerText = s.desc;
        toast.classList.add('show');
      }
    } else if (toast) {
      toast.classList.remove('show');
    }
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.set(-9999, -9999);
    mouse3D.set(9999, 9999, 0);
    if (toast) toast.classList.remove('show');
  });

  // Click / Drag Impulse Scatter
  function applyImpulse(strength = 0.8) {
    spheres.forEach(mesh => {
      const dx = mesh.position.x - mouse3D.x;
      const dy = mesh.position.y - mouse3D.y;
      const dist = Math.hypot(dx, dy) || 1;
      const force = (strength / (dist * 0.5 + 1));
      mesh.userData.vx += (dx / dist) * force;
      mesh.userData.vy += (dy / dist) * force;
      mesh.userData.vz += (Math.random() - 0.5) * force;
    });
  }

  canvas.addEventListener('pointerdown', (e) => {
    updateMousePosition(e);
    applyImpulse(1.4);
  });

  // Controls Handlers
  const btnScatter = document.getElementById('btn-scatter-spheres');
  const btnColor = document.getElementById('btn-color-spheres');
  const btnGravity = document.getElementById('btn-gravity-toggle');
  const gravityText = document.getElementById('gravity-status-text');

  if (btnScatter) {
    btnScatter.addEventListener('click', () => {
      mouse3D.set(0, 0, 0);
      applyImpulse(2.2);
    });
  }

  if (btnColor) {
    btnColor.addEventListener('click', () => {
      isPearlTheme = !isPearlTheme;
      spheres.forEach(mesh => {
        mesh.material.map = createSphereTexture(mesh.userData.skill, isPearlTheme);
        mesh.material.needsUpdate = true;
      });
    });
  }

  if (btnGravity) {
    btnGravity.addEventListener('click', () => {
      gravityEnabled = !gravityEnabled;
      btnGravity.classList.toggle('active', gravityEnabled);
      if (gravityText) {
        gravityText.innerText = gravityEnabled ? 'GRAVITY: ON' : 'GRAVITY: ZERO';
      }
    });
  }

  // Physics Simulation Loop
  function animate() {
    requestAnimationFrame(animate);

    const centerAttraction = gravityEnabled ? 0.0035 : 0.0003;
    const damping = 0.94;
    const repulsionRadius = 6.0;

    for (let i = 0; i < spheres.length; i++) {
      const s1 = spheres[i];
      const u1 = s1.userData;

      // 1. Center attraction (gravity)
      u1.vx -= s1.position.x * centerAttraction;
      u1.vy -= s1.position.y * centerAttraction;
      u1.vz -= s1.position.z * centerAttraction;

      // 2. Mouse force field repulsion
      const mdx = s1.position.x - mouse3D.x;
      const mdy = s1.position.y - mouse3D.y;
      const mDist = Math.hypot(mdx, mdy);
      if (mDist < repulsionRadius) {
        const mForce = (1 - mDist / repulsionRadius) * 0.08;
        u1.vx += (mdx / mDist) * mForce;
        u1.vy += (mdy / mDist) * mForce;
      }

      // 3. Sphere-to-sphere collision & repulsion
      for (let j = i + 1; j < spheres.length; j++) {
        const s2 = spheres[j];
        const u2 = s2.userData;

        const dx = s2.position.x - s1.position.x;
        const dy = s2.position.y - s1.position.y;
        const dz = s2.position.z - s1.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
        const minDist = u1.radius + u2.radius + 0.3;

        if (dist < minDist) {
          const overlap = (minDist - dist) * 0.035;
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;

          u1.vx -= nx * overlap;
          u1.vy -= ny * overlap;
          u1.vz -= nz * overlap;

          u2.vx += nx * overlap;
          u2.vy += ny * overlap;
          u2.vz += nz * overlap;
        }
      }

      // Damping & Position Update
      u1.vx *= damping;
      u1.vy *= damping;
      u1.vz *= damping;

      s1.position.x += u1.vx;
      s1.position.y += u1.vy;
      s1.position.z += u1.vz;

      // Gentle continuous rotation
      s1.rotation.y += 0.005;
      s1.rotation.x += 0.003;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* --------------------------------------------------------------------------
   4. TACTILE CLICK PARTICLE BURST
   -------------------------------------------------------------------------- */
function initParticleBurst() {
  const canvas = document.getElementById('particle-burst-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const colors = ['#ff0080', '#7928ca', '#ff4d4d', '#ffffff', '#a3e635'];

  class Spark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.radius = Math.random() * 2.8 + 1.2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.035 + 0.02;
      this.gravity = 0.12;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#ff0080';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnBurst(x, y) {
    for (let i = 0; i < 16; i++) {
      particles.push(new Spark(x, y));
    }
  }

  window.addEventListener('pointerdown', (e) => {
    spawnBurst(e.clientX, e.clientY);
  });

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);
}

/* --------------------------------------------------------------------------
   5. MAGNETIC BUTTONS & TARGETS
   -------------------------------------------------------------------------- */
function initMagneticElements() {
  const magnetics = document.querySelectorAll('.magnetic-btn, .magnetic-target');
  if (window.matchMedia('(hover: none)').matches) return;

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

/* --------------------------------------------------------------------------
   6. NAVBAR SCROLL
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('quick-contact-form');
  const feedback = document.getElementById('quick-feedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('quick-email').value.trim();

    if (!email) {
      showToast('Please enter your email.');
      return;
    }

    const mailto = `mailto:luckykadam330@gmail.com?subject=Connecting%20with%20Lucky%20Ashok%20Kadam&body=Hello%20Lucky,%0D%0A%0D%0AMy%20email%20is:%20${encodeURIComponent(email)}%0D%0A%0D%0AI%20would%20like%20to%20connect%20with%20you%20regarding...`;
    
    feedback.style.display = 'block';
    feedback.innerText = '✓ Opening email client to connect with Lucky...';

    showToast('Opening email client...');

    setTimeout(() => {
      window.location.href = mailto;
    }, 700);

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   8. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
