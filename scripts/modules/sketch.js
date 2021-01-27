export default class Sketch {
  constructor(canvas) {
    this.canvas = document.getElementById(canvas)
    this.context = this.canvas.getContext('2d')
    this.pressed = false;
    
    this.x = undefined;
    this.y = undefined;
    this.ongoingTouches = new Array;

    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.ongoingTouchIndexById = this.ongoingTouchIndexById.bind(this);
    this.copyTouch = this.copyTouch.bind(this);

  }

  mouseRecognitions() {
    this.canvas.addEventListener('mousedown', (event) => {
      this.pressed = true;

      this.x = event.offsetX;
      this.y = event.offsetY;
    })

    this.canvas.addEventListener('mouseup', () => {
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

  touchRecognitions() {
    this.canvas.addEventListener('touchstart', this.handleStart, false);
    this.canvas.addEventListener('touchend', this.handleEnd, false);
    this.canvas.addEventListener('touchmove', this.handleMove, false);
    this.canvas.addEventListener('touchcancel', this.handleCancel, false);
    this.canvas.addEventListener('touchleave', this.handleEnd, false)
  }

  // Mobile drawing handlers

  handleStart(event) {
    const touches = event.changedTouches;
    event.preventDefault();

    for(let i = 0; i < touches.length; i++) {
      this.ongoingTouches.push(this.copyTouch(touches[i]));
    }
  }

  handleMove(event) {
    event.preventDefault();

    const touches = event.changedTouches;

    for(let i = 0; i < touches.length; i++) {
      const idx = this.ongoingTouchIndexById(touches[i].identifier);
      this.x = this.ongoingTouches[idx].clientX;
      this.y = this.ongoingTouches[idx].clientY;

      const x2 = touches[i].clientX;
      const y2 = touches[i].clientY;
      if(idx >= 0) {
        this.drawLine(this.x, this.y, x2, y2)
        this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));
      } else {
        console.error("Can't figure out which touch to continue.")
      }
    }
  }

  handleEnd(event) {
    event.preventDefault();
    const touches = event.changedTouches;

    for(let i = 0; i < touches.length; i++) {
      const idx = this.ongoingTouchIndexById(touches[i].identifier);
      if(idx >= 0) {
        this.context.beginPath();
        this.ongoingTouches.splice(idx, 1);
      } else {
        console.error("Can't figure out which touch to end.")
      }
    }
  }

  handleCancel(event) {
    event.preventDefault();

    const touches = event.changedTouches;

    for(let i = 0; i < touches.length; i++) 
      this.ongoingTouches.splice(i, 1);
  }

  copyTouch(touch) {
    return { identifier: touch.identifier, clientX: touch.clientX, clientY: touch.clientY };
  }

  ongoingTouchIndexById(idToFind) {
    for (var i=0; i < this.ongoingTouches.length; i++) {
      var id = this.ongoingTouches[i].identifier;
  
      if (id == idToFind) {
        return i;
      }
    }
    return -1;
  }


  // -----------------

  setup() {
    this.mouseRecognitions();
    this.touchRecognitions();
  }

  drawLine(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2,y2);
    this.context.stroke()
  }
  
}