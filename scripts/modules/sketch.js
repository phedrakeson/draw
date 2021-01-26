export default class Sketch {
  constructor(canvas) {
    this.canvas = document.getElementById(canvas)
    this.context = this.canvas.getContext('2d')
    this.pressed = false;
    
    this.x = undefined;
    this.y = undefined;
  }

  mouseRecognitions() {
    this.canvas.addEventListener('mousedown', (event) => {
      this.pressed = true;
      console.log('oi')

      this.x = event.offsetX;
      this.y = event.offsetY;
    })

    this.canvas.addEventListener('mouseup', (event) => {
      console.log(event)
      this.pressed = false;

      this.x = undefined;
      this.y = undefined;
    })

    this.canvas.addEventListener('mousemove', (event) => {
      if(this.pressed) {
        const x2 = event.offsetX;
        const y2 = event.offsetY;

        this.drawLine(this.x, this.y, x2, y2)
        this.x = x2;
        this.y = y2;
      }
    })
  }

  setup() {
    this.mouseRecognitions();
  }

  drawLine(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2,y2);
    this.context.stroke()
  }
  
}