import React, { useRef } from "react";
import "./CreeperExplosion.css";

const CreeperExplosion = () => {
    const containerRef = useRef(null);

    const handleClick = () => {
        const svg = containerRef.current.querySelector("svg");
        const rects = svg.querySelectorAll("rect");
        const fragment = document.createDocumentFragment();

        rects.forEach((rect) => {
            const div = document.createElement("div");
            div.className = "pixel";
            div.style.backgroundColor = rect.getAttribute("fill");
            div.style.left = rect.getAttribute("x") + "px";
            div.style.top = rect.getAttribute("y") + "px";
            div.style.width = rect.getAttribute("width") + "px";
            div.style.height = rect.getAttribute("height") + "px";
            fragment.appendChild(div);
        });

        svg.remove();
        containerRef.current.appendChild(fragment);

        // 👉 Тряска body
        document.body.classList.add("shake");

        requestAnimationFrame(() => {
            containerRef.current.querySelectorAll(".pixel").forEach((pixel) => {
                const angle = Math.random() * 2 * Math.PI;
                const distance = Math.random() * 200 + 100;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                pixel.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 720 - 360}deg)`;
                pixel.style.opacity = 0;
            });
        });

        setTimeout(() => {
            document.body.classList.remove("shake");
            location.reload();
        }, 500);
    };


    return (
        <div className="creeper-container" ref={containerRef} onClick={handleClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                version="1.1"
                viewBox="0 0 64 64"
                shapeRendering="crispEdges"
            >
                <rect x="0" y="0" width="8" height="8" fill="#008000" />
                <rect x="8" y="0" width="8" height="8" fill="#008000" />
                <rect x="16" y="0" width="8" height="8" fill="#008000" />
                <rect x="24" y="0" width="8" height="8" fill="#008000" />
                <rect x="32" y="0" width="8" height="8" fill="#008000" />
                <rect x="40" y="0" width="8" height="8" fill="#008000" />
                <rect x="48" y="0" width="8" height="8" fill="#008000" />
                <rect x="56" y="0" width="8" height="8" fill="#008000" />
                <rect x="0" y="8" width="8" height="8" fill="#008000" />
                <rect x="8" y="8" width="8" height="8" fill="#000000" />
                <rect x="16" y="8" width="8" height="8" fill="#000000" />
                <rect x="24" y="8" width="8" height="8" fill="#008000" />
                <rect x="32" y="8" width="8" height="8" fill="#008000" />
                <rect x="40" y="8" width="8" height="8" fill="#000000" />
                <rect x="48" y="8" width="8" height="8" fill="#000000" />
                <rect x="56" y="8" width="8" height="8" fill="#008000" />
                <rect x="0" y="16" width="8" height="8" fill="#008000" />
                <rect x="8" y="16" width="8" height="8" fill="#000000" />
                <rect x="16" y="16" width="8" height="8" fill="#000000" />
                <rect x="24" y="16" width="8" height="8" fill="#008000" />
                <rect x="32" y="16" width="8" height="8" fill="#008000" />
                <rect x="40" y="16" width="8" height="8" fill="#000000" />
                <rect x="48" y="16" width="8" height="8" fill="#000000" />
                <rect x="56" y="16" width="8" height="8" fill="#008000" />
                <rect x="0" y="24" width="8" height="8" fill="#008000" />
                <rect x="8" y="24" width="8" height="8" fill="#008000" />
                <rect x="16" y="24" width="8" height="8" fill="#008000" />
                <rect x="24" y="24" width="8" height="8" fill="#000000" />
                <rect x="32" y="24" width="8" height="8" fill="#000000" />
                <rect x="40" y="24" width="8" height="8" fill="#008000" />
                <rect x="48" y="24" width="8" height="8" fill="#008000" />
                <rect x="56" y="24" width="8" height="8" fill="#008000" />
                <rect x="0" y="32" width="8" height="8" fill="#008000" />
                <rect x="8" y="32" width="8" height="8" fill="#008000" />
                <rect x="16" y="32" width="8" height="8" fill="#000000" />
                <rect x="24" y="32" width="8" height="8" fill="#000000" />
                <rect x="32" y="32" width="8" height="8" fill="#000000" />
                <rect x="40" y="32" width="8" height="8" fill="#000000" />
                <rect x="48" y="32" width="8" height="8" fill="#008000" />
                <rect x="56" y="32" width="8" height="8" fill="#008000" />
                <rect x="0" y="40" width="8" height="8" fill="#008000" />
                <rect x="8" y="40" width="8" height="8" fill="#008000" />
                <rect x="16" y="40" width="8" height="8" fill="#000000" />
                <rect x="24" y="40" width="8" height="8" fill="#000000" />
                <rect x="32" y="40" width="8" height="8" fill="#000000" />
                <rect x="40" y="40" width="8" height="8" fill="#000000" />
                <rect x="48" y="40" width="8" height="8" fill="#008000" />
                <rect x="56" y="40" width="8" height="8" fill="#008000" />
                <rect x="0" y="48" width="8" height="8" fill="#008000" />
                <rect x="8" y="48" width="8" height="8" fill="#008000" />
                <rect x="16" y="48" width="8" height="8" fill="#000000" />
                <rect x="24" y="48" width="8" height="8" fill="#008000" />
                <rect x="32" y="48" width="8" height="8" fill="#008000" />
                <rect x="40" y="48" width="8" height="8" fill="#000000" />
                <rect x="48" y="48" width="8" height="8" fill="#008000" />
                <rect x="56" y="48" width="8" height="8" fill="#008000" />
                <rect x="0" y="56" width="8" height="8" fill="#008000" />
                <rect x="8" y="56" width="8" height="8" fill="#008000" />
                <rect x="16" y="56" width="8" height="8" fill="#008000" />
                <rect x="24" y="56" width="8" height="8" fill="#008000" />
                <rect x="32" y="56" width="8" height="8" fill="#008000" />
                <rect x="40" y="56" width="8" height="8" fill="#008000" />
                <rect x="48" y="56" width="8" height="8" fill="#008000" />
                <rect x="56" y="56" width="8" height="8" fill="#008000" />
            </svg>
        </div>
    );
};

export default CreeperExplosion;