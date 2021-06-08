export default class Sketch {
  constructor(canvas) {
    this.canvas = document.getElementById(canvas)
    this.context = this.canvas.getContext('2d')
    this.pressed = false;
    this.x = undefined;
    this.y = undefined;
    this.lineWidthLimit = 26;
    this.ongoingTouches = new Array;
    this.states = []
    this.color = "#000000"
    this.value = 2
    this.updateWidthValueOnScreen();
    this.user_draws = localStorage.getItem("user_draws") != null ? JSON.parse(localStorage.getItem("user_draws")) : []
    
    this.updateSaves = this.updateSaves.bind(this);
    this.undo_handle = this.undo_handle.bind(this);
    this.decreaseBtn_handle = this.decreaseBtn_handle.bind(this);
    this.increaseBtn_handle = this.increaseBtn_handle.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.ongoingTouchIndexById = this.ongoingTouchIndexById.bind(this);
    this.copyTouch = this.copyTouch.bind(this);
    
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.updateSaves();
  }
  
  updateSaves() {
    document.getElementById('modalSaves').innerHTML = "";
    if (this.user_draws.length > 0) document.getElementById('modalSaves').innerHTML += this.user_draws.map(draw => `<h3 class="save">${draw.title}</h3>`);

    for (const save of document.querySelectorAll('.save')) {
      save.addEventListener('click', e => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const selectedDraw = this.user_draws.find(save => save.title === e.target.innerHTML);
        this.states = selectedDraw.draw;
        selectedDraw.draw.map(draw => {
          this.drawCircle(draw.x, draw.y, draw.size, draw.colorStyle)
          this.drawLine(draw.x, draw.y, draw.prevX, draw.prevY, draw.size, draw.colorStyle);
        })
      })
    }
  }

  mouseRecognitions() {
    this.canvas.addEventListener('mousedown', event => {
      this.pressed = true;
      this.x = event.offsetX;
      this.y = event.offsetY;
    })
    
    this.canvas.addEventListener('mouseup', () => {
      this.pressed = false;
      this.x = undefined;
      this.y = undefined;
    })
    
    this.canvas.addEventListener('mousemove', event => {
      if(this.pressed) {
        const x2 = event.offsetX;
        const y2 = event.offsetY;
        if (document.getElementById('eraser').classList.contains("selected")) {
          const sizeFactor = 4;
          const size = this.value * sizeFactor;
          const centralize = pos => pos - size / 2; // Returns center position value based on eraser size
          this.context.clearRect(centralize(x2),  centralize(y2), size, size);
        } else {
          this.drawCircle(x2, y2, this.value, this.color)
          this.drawLine(this.x, this.y, x2, y2, this.value, this.color);
          this.states.push({x: x2, y: y2, prevX: this.x, prevY: this.y, size: this.value, colorStyle: this.color});
          this.x = x2;
          this.y = y2;
        }
      }
    })
  }
  
  touchRecognitions() {
    this.canvas.addEventListener('touchstart', this.handleStart, true);
    this.canvas.addEventListener('touchend', this.handleEnd, true);
    this.canvas.addEventListener('touchmove', this.handleMove, false);
    this.canvas.addEventListener('touchcancel', this.handleCancel, false);
    this.canvas.addEventListener('touchleave', this.handleEnd, false)
  }
  
  // Click/Key handlers

  undo_handle() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.states.map((draw, index) => {
      if (index < this.states.length - 1) {
        this.drawCircle(draw.x, draw.y, draw.size, draw.colorStyle)
        this.drawLine(draw.x, draw.y, draw.prevX, draw.prevY, draw.size, draw.colorStyle);
      } else this.states.pop();
    })
  }

  decreaseBtn_handle() {
    this.value -= 2;
    if(this.value <= 0) this.value = 2;
    this.updateWidthValueOnScreen();
  }

  increaseBtn_handle() {
    this.value += 2;
    if(this.value >= this.lineWidthLimit) this.value = this.lineWidthLimit;
    this.updateWidthValueOnScreen();
  }

  // -----------------

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
        this.drawLine(this.x, this.y, x2, y2, this.value, this.color)
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
    this.addEventListeners();
    this.mouseRecognitions();
    this.touchRecognitions();
  }

  // configurations

  updateWidthValueOnScreen() {
    document.getElementById('widthValue').innerText = this.value;
  }

  addEventListeners() {
    document.getElementById('canvas-color').addEventListener('input', event => this.canvas.style.backgroundColor = event.target.value);
    document.getElementById('color').addEventListener('change', event => this.color = event.target.value);
    document.getElementById('decrease').addEventListener('click', this.decreaseBtn_handle);
    document.getElementById('increase').addEventListener('click', this.increaseBtn_handle)
    document.getElementById('trash').addEventListener('click', () => this.context.clearRect(0, 0, this.canvas.width, this.canvas.height));
    document.getElementById('undo').addEventListener('click', this.undo_handle)
    document.getElementById('eraser').addEventListener('click', this.toggleTools)
    document.getElementById('pencil').addEventListener('click', this.toggleTools)
    document.getElementById('formSave').addEventListener('submit', e => {
      e.preventDefault();
      this.user_draws.push({draw: [...this.states], title: e.target[0].value})
      localStorage.setItem("user_draws", JSON.stringify(this.user_draws))
      document.getElementById('modalSave').classList.toggle("desappear")
    })

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case "1":
          document.getElementById('modalInfo').classList.toggle("desappear");
          break;

        case "2":
          this.toggleTools();
          break;

        case "3":
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          break;

        case "4":
          this.decreaseBtn_handle();
          break;

        case "5":
          this.increaseBtn_handle();
          break;

        case "6":
          this.undo_handle();
          break;

        case "7":
          this.updateSaves();
          document.getElementById('modalSaves').classList.toggle("desappear");
          break;
        
        case "8":
          document.getElementById('modalSave').classList.toggle("desappear")
          break;
        
        default:
          break;
      }
    })
  }
  
  toggleTools() {
    document.getElementById('eraser').classList.toggle("selected");
    document.getElementById('pencil').classList.toggle("selected");
  }

  // Drawing methods

  drawLine(initialX, initialY, x, y, size, color) {
    this.context.lineWidth = size * 2;
    this.context.beginPath();
    this.context.moveTo(initialX, initialY);
    this.context.lineTo(x, y);
    this.context.strokeStyle = color
    this.context.stroke()
  }

  drawCircle(x, y, size, color) {
    this.context.beginPath()
    this.context.arc(x, y, size, 0, Math.PI * 2);
    this.context.fillStyle = color;
    this.context.fill()
  }
}