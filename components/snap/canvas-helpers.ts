export const drawRectangle = (ctx: CanvasRenderingContext2D, actualStartX: number, actualStartY, width: number, height: number) => {
    ctx.beginPath();
    ctx.moveTo(
        actualStartX + 6,
        actualStartY
    );
    ctx.lineTo(
        actualStartX + width - 6,
        actualStartY
    );
    ctx.quadraticCurveTo(
        actualStartX + width,
        actualStartY,
        actualStartX + width,
        actualStartY + 6
    );
    ctx.lineTo(
        actualStartX + width,
        actualStartY + height - 6
    );
    ctx.quadraticCurveTo(
        actualStartX + width,
        actualStartY + height,
        actualStartX + width - 6,
        actualStartY + height
    );
    ctx.lineTo(
        actualStartX + 6,
        actualStartY + height
    );
    ctx.quadraticCurveTo(
        actualStartX,
        actualStartY + height,
        actualStartX,
        actualStartY + height - 6
    );
    ctx.lineTo(
        actualStartX,
        actualStartY + 6
    );
    ctx.quadraticCurveTo(
        actualStartX,
        actualStartY,
        actualStartX + 6,
        actualStartY
    );
    ctx.closePath();
    ctx.stroke();
}

export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}