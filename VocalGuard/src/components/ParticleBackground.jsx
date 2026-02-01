import { useRef, useEffect } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: null, y: null, click: false });
  const hue = useRef(0);

  const PARTICLE_COUNT = 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const handleMouseClick = (e) => {
      mouse.current.click = true;
      for (let i = 0; i < 10; i++) {
        particles.current.push(
          new Particle(e.clientX, e.clientY, true)
        );
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleMouseClick);

    class Particle {
      constructor(x = Math.random() * canvas.width, y = Math.random() * canvas.height, burst = false) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.hue = hue.current;
        this.burst = burst;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        const dx = this.x - mouse.current.x;
        const dy = this.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 100;

        if (dist < radius) {
          const angle = Math.atan2(dy, dx);
          const force = (radius - dist) / radius;
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
        }
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.fill();
      }
    }

    // Initialize particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    const drawLines = () => {
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${(particles.current[i].hue + particles.current[j].hue) / 2}, 100%, 50%, ${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      hue.current = (hue.current + 1) % 360;

      for (let p of particles.current) {
        p.update();
        p.draw(ctx);
      }

      drawLines();

      // Trim excess particles (from burst)
      if (particles.current.length > 300) {
        particles.current.splice(0, particles.current.length - 300);
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleMouseClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}
