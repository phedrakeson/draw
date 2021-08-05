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
    
    DrawText(text, x, y, color, size, font = "sans-serif") {
        this.context.beginPath();
        this.context.font = `${size * 2}px ${font}`;
        this.context.fillStyle = color;
        this.context.fillText(text, x, y);
    }
    
    DrawTriangle(x, y, color, size) {
        this.context.beginPath();
        this.context.moveTo(x, y - size);
        this.context.lineTo(x - size, y + size);
        this.context.lineTo(x + size, y + size);
        this.context.closePath();
        this.context.fillStyle = color;
        this.context.fill()
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

    ReDraw({states, type, colorStyle}) {
        switch (type) {
            case "sketch":
            states.forEach(state => {
                this.DrawCircle(state.x, state.y, state.size, colorStyle)
                this.DrawLine(state.x, state.y, state.prevX, state.prevY, state.size, colorStyle);
            });
            break;

            case "polygon":
            this.DrawPolygon(states.id, states.x, states.y, colorStyle, states.size)
            break;

            case "text":
            this.DrawText(states.text, states.x, states.y, colorStyle, states.size)
            break;
        }
    }
}