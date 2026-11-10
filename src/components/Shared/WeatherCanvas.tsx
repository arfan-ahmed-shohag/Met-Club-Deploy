import { useEffect, useRef } from "react";

type Particle = {
    x: number;
    y: number;
    radius: number;
    speed: number;
    drift: number;
    phase: number;
};

export default function WeatherCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        const parent = canvas?.parentElement;
        if (!canvas || !context || !parent) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let frameId = 0;
        let width = 0;
        let height = 0;
        let particles: Particle[] = [];

        const resize = () => {
            const bounds = parent.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            width = bounds.width;
            height = bounds.height;
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            const count = Math.min(90, Math.max(34, Math.round((width * height) / 15000)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 0.7 + Math.random() * 1.5,
                speed: 0.12 + Math.random() * 0.34,
                drift: -0.12 + Math.random() * 0.24,
                phase: Math.random() * Math.PI * 2,
            }));
        };

        const draw = (time: number) => {
            context.clearRect(0, 0, width, height);
            particles.forEach((particle, index) => {
                if (!reducedMotion) {
                    particle.y -= particle.speed;
                    particle.x += particle.drift + Math.sin(time * 0.00045 + particle.phase) * 0.18;
                    if (particle.y < -4) particle.y = height + 4;
                    if (particle.x < -4) particle.x = width + 4;
                    if (particle.x > width + 4) particle.x = -4;
                }

                const glow = 0.22 + (Math.sin(time * 0.001 + particle.phase) + 1) * 0.16;
                context.beginPath();
                context.fillStyle = index % 5 === 0
                    ? `rgba(254, 202, 202, ${glow})`
                    : `rgba(255, 255, 255, ${glow})`;
                context.shadowBlur = 12;
                context.shadowColor = "rgba(252, 165, 165, 0.8)";
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                context.fill();
            });
            context.shadowBlur = 0;

            if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
        };

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(parent);
        if (reducedMotion) draw(0);
        else frameId = window.requestAnimationFrame(draw);

        return () => {
            window.cancelAnimationFrame(frameId);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="pointer-events-none absolute inset-0 z-[11]" aria-hidden="true">
            <canvas ref={canvasRef} className="block h-full w-full bg-transparent" />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(0,0,0,0.38)_0%,transparent_80%)]" />
        </div>
    );
}
