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
  }

  setup() {
    this.mouseRecognitions();
    this.drawTesting();
  }

  drawLine() {

  }

  drawTesting() {
    // this.context.fillStyle = "rgb(200,0,0)"
    // this.context.fillRect (10, 10, 55, 50);

    // this.context.fillStyle = "rgba(0, 0, 200, 0.5)";
    // this.context.fillRect (30, 30, 55, 50);

    // this.context.fillRect(25, 25, 100, 100)
    // this.context.clearRect(45, 45, 60, 60)
    // this.context.strokeRect(50, 50, 50, 50)


    this.context.beginPath()
    this.context.moveTo(200, 300)
    this.context.lineTo(220, 325)
    this.context.lineTo(220, 275)
    this.context.fill()


    this.context.beginPath();
    this.context.arc(75, 75, 50, 0, Math.PI * 2, true); // Círculo exterior
    this.context.moveTo(110, 75);
    this.context.arc(75, 75, 35, 0, Math.PI, false);  // Boca (sentido horário)
    this.context.moveTo(65, 65);
    this.context.arc(60, 65, 5, 0, Math.PI * 2, true);  // Olho esquerdo
    this.context.moveTo(95, 65);
    this.context.arc(90, 65, 5, 0, Math.PI * 2, true);  // Olho direito
    this.context.stroke();

     // Stroked triangle
     this.context.beginPath();
     this.context.moveTo(125,125);
     this.context.lineTo(125,45);
     this.context.lineTo(45,125);
     this.context.closePath();
     this.context.stroke();

     this.context.beginPath()
     this.context.moveTo(200,200)
     this.context.lineTo(200, 300)
     this.context.lineTo(200, 400)
     this.context.stroke()
  }
  
}