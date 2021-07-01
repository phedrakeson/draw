export default class Drawing {
    constructor(canvas) {
        this.canvas = document.getElementById(canvas)
        this.context = this.canvas.getContext('2d')
    }

    UpdateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    DrawLine(initialX, initialY, x, y, size, color) {
        this.context.lineWidth = size * 2;
        this.context.beginPath();
        this.context.moveTo(initialX, initialY);
        this.context.lineTo(x, y);
        this.context.strokeStyle = color
        this.context.stroke()
    }
      
    DrawCircle(x, y, size, color) {
        this.context.beginPath()
        this.context.arc(x, y, size, 0, Math.PI * 2);
        this.context.fillStyle = color;
        this.context.fill()
    }
    
    DrawText(text, x, y, color, size, font = "serif") {
        this.context.beginPath();
        this.context.font = `${size * 2}px ${font}`;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }
    
    DrawTriangle(x, y, color, size) {
        this.context.lineWidth = size;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x - size, y + size);
        this.context.lineTo(x + size, y + size);
        this.context.closePath();
        this.context.strokeStyle = color;
        this.context.stroke()
    }
    
    DrawRect(x, y, size, color) {
        const _size = size * 2;
        this.context.fillStyle = color;
        this.context.fillRect(x - _size / 2, y  - _size / 2, _size, _size);
    }
    
    DrawPolygon(type, x, y, color, size) {
        switch (type) {
            case "square":
            this.DrawRect(x, y, size, color);
            break;
            
            case "triangle":
            this.DrawTriangle(x, y, color, size);
            break;
                
            case "circle":
            this.DrawCircle(x, y, size, color)
            break;
        }
    }

    ReDraw(draw) {
        switch (draw.type) {
            case "Draw":
            this.DrawCircle(draw.x, draw.y, draw.size, draw.colorStyle)
            this.DrawLine(draw.x, draw.y, draw.prevX, draw.prevY, draw.size, draw.colorStyle);
            break;

            case "polygon":
            this.DrawPolygon(draw.id, draw.x, draw.y, draw.colorStyle, draw.size);
            break;

            case "text":
            this.DrawText(draw.text, draw.x, draw.y, draw.colorStyle, draw.size);
            break;
        }
    }
}