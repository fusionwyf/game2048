/**
 * ParticleBackground Component
 *
 * Creates an ambient particle effect using canvas.
 * Particles slowly drift and pulse, creating a deep-space/ocean atmosphere.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import styles from './ParticleBackground.module.css';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulsePhase: number;
}

interface ParticleBackgroundProps {
  theme: number;
}

const PARTICLE_COUNT = 50;
const COLORS = [
  ['#ff6b9d', '#c44eff', '#00d4ff'], // Deep sea
  ['#ff9a56', '#ff6b6b', '#c44eff'], // Sunset
  ['#00ff88', '#00d4ff', '#c44eff'], // Aurora
  ['#4a90d9', '#667eea', '#764ba2'], // Midnight
];

export const ParticleBackground: React.FC<ParticleBackgroundProps> = React.memo(({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const colorSet = COLORS[theme % COLORS.length];

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulse effect
        const pulse = Math.sin(time * 0.02 + particle.pulsePhase) * 0.3 + 0.7;
        const currentOpacity = particle.opacity * pulse;

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );

        const colorIndex = Math.floor(Math.random() * colorSet.length);
        const color = colorSet[colorIndex];
        gradient.addColorStop(0, `${color}${Math.round(currentOpacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, colorSet]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
});

ParticleBackground.displayName = 'ParticleBackground';