interface CreateRendererOptions {
  canvas: HTMLCanvasElement;
}

export interface BlackHoleRenderer {
  ready: Promise<void>;
  dispose: () => void;
}

export function createRenderer({ canvas }: CreateRendererOptions): BlackHoleRenderer {
  let animationFrameId: number;
  let isDisposed = false;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      ready: Promise.resolve(),
      dispose: () => {},
    };
  }

  let width = 0;
  let height = 0;

  const handleResize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement?.clientWidth || window.innerWidth;
    height = canvas.parentElement?.clientHeight || window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.scale(dpr, dpr);
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  // Generate accretion disk particles
  const numParticles = 400;
  const particles = Array.from({ length: numParticles }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 320;
    return {
      angle,
      distance,
      baseSpeed: (0.01 + (350 - distance) * 0.0001) * (0.8 + Math.random() * 0.5),
      size: Math.random() * 2.5 + 0.8,
      hue: Math.random() > 0.4 ? Math.floor(25 + Math.random() * 30) : Math.floor(190 + Math.random() * 50),
      brightness: 50 + Math.random() * 40,
      alpha: 0.3 + Math.random() * 0.7,
      trail: [] as { x: number; y: number }[],
    };
  });

  // Background stars
  const numStars = 150;
  const stars = Array.from({ length: numStars }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.8 + 0.2,
    blinkSpeed: 0.01 + Math.random() * 0.03,
  }));

  let tick = 0;

  const render = () => {
    if (isDisposed) return;

    if (width === 0 || height === 0) {
      handleResize();
    }

    const currentW = width || window.innerWidth;
    const currentH = height || window.innerHeight;
    const centerX = currentW / 2;
    const centerY = currentH / 2;
    const holeRadius = Math.max(35, Math.min(currentW, currentH) * 0.09);

    // Deep space backdrop with slight trail
    ctx.fillStyle = "rgba(4, 5, 12, 0.35)";
    ctx.fillRect(0, 0, currentW, currentH);

    // Draw background stars with twinkling
    stars.forEach((star) => {
      const starX = star.x * currentW;
      const starY = star.y * currentH;
      const distFromCenter = Math.hypot(starX - centerX, starY - centerY);
      
      // Gravitational deflection of background stars near center
      let renderX = starX;
      let renderY = starY;
      if (distFromCenter < holeRadius * 4 && distFromCenter > holeRadius) {
        const factor = (holeRadius * holeRadius) / (distFromCenter * distFromCenter);
        renderX += (starX - centerX) * factor * 0.5;
        renderY += (starY - centerY) * factor * 0.5;
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * (0.6 + 0.4 * Math.sin(tick * star.blinkSpeed))})`;
      ctx.beginPath();
      ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Gravitational Lensing Halo Glow (Multi-layered radial glow)
    const outerGlow = ctx.createRadialGradient(
      centerX,
      centerY,
      holeRadius * 0.9,
      centerX,
      centerY,
      holeRadius * 4.5
    );
    outerGlow.addColorStop(0, "rgba(255, 120, 20, 0.45)");
    outerGlow.addColorStop(0.25, "rgba(249, 115, 22, 0.25)");
    outerGlow.addColorStop(0.55, "rgba(99, 102, 241, 0.12)");
    outerGlow.addColorStop(0.85, "rgba(56, 189, 248, 0.04)");
    outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, holeRadius * 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Top & Bottom Relativistic Lensing Arcs
    ctx.save();
    ctx.strokeStyle = "rgba(255, 180, 80, 0.4)";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ff7700";
    ctx.shadowBlur = 24;

    // Top arc
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - holeRadius * 0.2, holeRadius * 2.2, holeRadius * 1.1, 0, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    // Bottom arc
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + holeRadius * 0.2, holeRadius * 2.2, holeRadius * 1.1, 0, Math.PI * 0.05, Math.PI * 0.95);
    ctx.stroke();
    ctx.restore();

    // Accretion Disk Particles
    particles.forEach((p) => {
      p.angle += p.baseSpeed;
      p.distance -= 0.2; // Slowly spiral in

      // Respawn if swallowed by black hole
      if (p.distance < holeRadius * 1.1) {
        p.distance = holeRadius * 2.8 + Math.random() * (Math.min(currentW, currentH) * 0.35);
        p.angle = Math.random() * Math.PI * 2;
      }

      // 3D-projected flattened accretion disk plane (inclined perspective)
      const tilt = 0.38; // disk tilt angle
      const rotationAngle = -0.15; // slight clockwise tilt
      const rawX = Math.cos(p.angle) * p.distance;
      const rawY = Math.sin(p.angle) * (p.distance * tilt);

      const x = centerX + rawX * Math.cos(rotationAngle) - rawY * Math.sin(rotationAngle);
      const y = centerY + rawX * Math.sin(rotationAngle) + rawY * Math.cos(rotationAngle);

      // Relativistic Doppler beaming: approaching side is brighter/bluer
      const dopplerShift = Math.cos(p.angle);
      const isBlueShifted = dopplerShift < 0;
      const dynamicAlpha = Math.min(1, Math.max(0.1, p.alpha * (1.2 + dopplerShift * 0.5)));
      const particleColor = isBlueShifted
        ? `hsla(200, 95%, 65%, ${dynamicAlpha})`
        : `hsla(${p.hue}, 95%, ${p.brightness}%, ${dynamicAlpha})`;

      ctx.save();
      ctx.fillStyle = particleColor;
      ctx.shadowColor = isBlueShifted ? "#38bdf8" : "#ff7700";
      ctx.shadowBlur = p.size * 3;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Intense Photon Ring (at the boundary of Event Horizon)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 240, 200, 0.95)";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#ffaa00";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(centerX, centerY, holeRadius * 1.03, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Event Horizon (Pitch Black Singularity)
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    tick++;
    animationFrameId = requestAnimationFrame(render);
  };

  const readyPromise = Promise.resolve().then(() => {
    animationFrameId = requestAnimationFrame(render);
  });

  return {
    ready: readyPromise,
    dispose: () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    },
  };
}
