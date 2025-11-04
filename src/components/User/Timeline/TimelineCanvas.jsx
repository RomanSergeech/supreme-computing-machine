'use client';

import { useRef, useEffect } from 'react';
import styles from './TimelineCanvas.module.css';

const COLOR_MAP = {
    productive: '#2ecc71',
    neutral: '#bdc3c7',
    distracting: '#e74c3c',
};

function formatTimeLabel(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getTimeGrid(from, to, stepMinutes) {
    const grid = [];
    const current = new Date(from.getTime());
    while (current <= to) {
        grid.push(new Date(current.getTime()));
        current.setMinutes(current.getMinutes() + stepMinutes);
    }
    return grid;
}

export default function TimelineCanvas({ data = [], from, to, stepMinutes = 60 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!from || !to || !canvasRef.current) return;

        const canvas = canvasRef.current;

        const labelWidth = 120;       // отступ слева под названия устройств
        const width = 1200;
        const rowHeight = 40;
        const rowGap = 10;
        const topOffset = 30;
        const totalHeight = data.length * (rowHeight + rowGap) + topOffset;

        canvas.width = width;
        canvas.height = totalHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, totalHeight);

        const totalMs = new Date(to) - new Date(from);

        // Сетка времени
        const timeGrid = getTimeGrid(from, to, stepMinutes);
        ctx.strokeStyle = '#ddd';
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';

        timeGrid.forEach((time) => {
            const x = labelWidth + ((time - from) / totalMs) * (width - labelWidth);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, totalHeight);
            ctx.stroke();
            ctx.fillText(formatTimeLabel(time), x, 20);
        });

        // Рендер данных устройств
        data.forEach((deviceBlock, deviceIdx) => {
            const { device, sessions } = deviceBlock;

            const baseY = topOffset + deviceIdx * (rowHeight + rowGap);

            // Название устройства
            ctx.fillStyle = '#000';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(device, 6, baseY + rowHeight / 2);

            // Сессии приложений
            sessions.forEach((item) => {
                const start = new Date(item.start);
                const end = new Date(item.end);

                const xStart = labelWidth + ((start - from) / totalMs) * (width - labelWidth);
                const xEnd = labelWidth + ((end - from) / totalMs) * (width - labelWidth);

                ctx.fillStyle = COLOR_MAP[item.type] || '#999';
                ctx.fillRect(xStart, baseY, xEnd - xStart, rowHeight);

                // Название приложения
                ctx.fillStyle = '#000';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(item.app, xStart + 6, baseY + 24);
            });
        });
    }, [data, from, to, stepMinutes]);


    return (
        <div className={styles.canvasWrapper}>
            <canvas
                ref={canvasRef}

                className={styles.canvas}
            />
        </div>
    );
}
