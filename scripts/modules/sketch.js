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
    this.UpdateWidthValueOnScreen();
    this.user_draws = localStorage.getItem("user_draws") != null ? JSON.parse(localStorage.getItem("user_draws")) : []
    
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.ongoingTouchIndexById = this.ongoingTouchIndexById.bind(this);
    this.copyTouch = this.copyTouch.bind(this);
    
    this.UpdateSavesModal();
    this.UpdateCanvasSize();
  }

  //#region Updates functions
  UpdateSavesModal() {
    document.getElementById('modalSaves').innerHTML = "";
    if (this.user_draws.length > 0) this.user_draws.map(draw => document.getElementById('modalSaves').innerHTML += `<div key="${draw.title}" class="save-box"><h3 class="save">${draw.title}</h3><button class="delete">X</button></div>`);
    this.UpdateSaveListener();
    this.UpdateDeleteListener();
  }

  UpdateSaveListener() {
    for (const save of document.querySelectorAll('.save'))
      save.addEventListener('click', event => this.Save_Handle(event));
  }

  UpdateDeleteListener() {
    for (const deleteBtn of document.querySelectorAll('.delete'))
      deleteBtn.addEventListener('click', event => this.Delete_Handle(event));
  }

  UpdateWidthValueOnScreen() {
    document.getElementById('widthValue').innerText = this.value;
  }

  UpdateCanvasSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  //#endregion

  //#region Screen recognitions
  mouseRecognitions() {
    this.canvas.addEventListener('mousedown', event => {
      this.pressed = true;
      this.x = event.offsetX;
      this.y = event.offsetY;
      if (document.getElementById('text').classList.contains("selected")) this.CreateTextModal();
    })
    
    this.canvas.addEventListener('mouseup', () => {
      this.pressed = false;
      this.x = undefined;
      this.y = undefined;
    })
    
    this.canvas.addEventListener('mousemove', event => {
      if(this.pressed && !document.getElementById('text').classList.contains("selected")) {
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
  //#endregion
  
  //#region Click/Key handlers
  Undo_Handle() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.states.forEach((draw, index) => {
      if (index < this.states.length - 1) {
        this.drawCircle(draw.x, draw.y, draw.size, draw.colorStyle)
        this.drawLine(draw.x, draw.y, draw.prevX, draw.prevY, draw.size, draw.colorStyle);
      } else this.states.pop();
    })
  }

  DecreaseBtn_Handle() {
    this.value -= 2;
    if(this.value <= 0) this.value = 2;
    this.UpdateWidthValueOnScreen();
  }

  IncreaseBtn_Handle() {
    this.value += 2;
    if(this.value >= this.lineWidthLimit) this.value = this.lineWidthLimit;
    this.UpdateWidthValueOnScreen();
  }

  Delete_Handle(e) {
    this.user_draws = this.user_draws.filter(save => save.title != e.path[1].getAttribute("key"));
    localStorage.setItem("user_draws", JSON.stringify(this.user_draws))
    this.UpdateSavesModal();
  }

  Save_Handle(e) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const selectedDraw = this.user_draws.find(save => save.title === e.target.innerHTML);
    this.states = selectedDraw.draw;
    this.canvas.style.backgroundColor = selectedDraw.backgroundColor;

    selectedDraw.draw.map(draw => {
      this.drawCircle(draw.x, draw.y, draw.size, draw.colorStyle)
      this.drawLine(draw.x, draw.y, draw.prevX, draw.prevY, draw.size, draw.colorStyle);
    })
  }

  FormSave_Handle(e) {
    e.preventDefault();
    if (this.user_draws.some(draw => draw.title == e.target[0].value)) {
      alert(`this title is already being used !`);
      return;
    }
    
    this.user_draws.push({draw: this.states, backgroundColor: this.canvas.style.backgroundColor, title: e.target[0].value})
    localStorage.setItem("user_draws", JSON.stringify(this.user_draws))
    document.getElementById('modalSave').classList.toggle("desappear")
    this.UpdateSavesModal();
  }

  CanvasClear_Handle() {
    this.canvas.style.backgroundColor = "#EEEE";
    this.states = [];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  FormText_Handle(e) {
    e.preventDefault();
    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.font = `${this.value * 2}px serif`;
    this.context.fillText(e.target[0].value, this.x, this.y);
    document.querySelectorAll("form.textModal").forEach(form => form.remove());
  }

  //#endregion

  // #region Mobile drawing handlers
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
        this.drawCircle(this.x, this.y, this.value, this.color)
        this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));
      } else console.error("Can't figure out which touch to continue.");
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
  
      if (id == idToFind) return i;
    }
    return -1;
  }
  //#endregion

  setup() {
    this.addEventListeners();
    this.mouseRecognitions();
    this.touchRecognitions();
  }

  addEventListeners() {
    document.getElementById('canvas-color').addEventListener('input', event => this.canvas.style.backgroundColor = event.target.value);
    document.getElementById('color').addEventListener('change', event => this.color = event.target.value);
    document.getElementById('decrease').addEventListener('click', () => this.DecreaseBtn_Handle());
    document.getElementById('increase').addEventListener('click', () => this.IncreaseBtn_Handle());
    document.getElementById('trash').addEventListener('click', () => this.CanvasClear_Handle());
    document.getElementById('undo').addEventListener('click', () => this.Undo_Handle());
    document.getElementById('eraser').addEventListener('click', event => this.toggleTools(event));
    document.getElementById('pencil').addEventListener('click', event => this.toggleTools(event));
    document.getElementById('text').addEventListener('click', event => this.toggleTools(event));
    document.getElementById('formSave').addEventListener('submit', event => this.FormSave_Handle(event));
    window.addEventListener('resize', () => this.UpdateCanvasSize());

    window.addEventListener('keydown', e => {
      switch (e.code) {
        case "Numpad1":
          document.getElementById('modalInfo').classList.toggle("desappear");
          break;

        case "Numpad2":
          this.CanvasClear_Handle()
          break;

        case "Numpad3":
          this.DecreaseBtn_Handle();
          break;

        case "Numpad4":
          this.IncreaseBtn_Handle();
          break;

        case "Numpad5":
          this.Undo_Handle();
          break;

        case "Numpad6":
          if (this.user_draws.length > 0) {
            this.UpdateSavesModal();
            document.getElementById('modalSaves').classList.toggle("desappear");
          }
          break;

        case "Numpad7":
          document.getElementById('modalSave').classList.toggle("desappear")
          break;
        
        default:
          break;
      }
    })
  }
  
  toggleTools(e) {
    const pencil = document.getElementById('pencil');
    const eraser = document.getElementById('eraser');
    const text = document.getElementById('text');
    text.classList.remove("selected");
    pencil.classList.remove("selected");
    eraser.classList.remove("selected");
    switch (e.target.id) {
      case "text":
        text.classList.add("selected");
        break;

      case "pencil":
        pencil.classList.add("selected");
        break;
        
      case "eraser":
        eraser.classList.add("selected");
        break;
    }
  }

  CreateTextModal() {
    this.pressed = false;
    const txtModal = document.createElement('form')
    txtModal.innerHTML = `<input placeholder="Insert the text here" />`;
    txtModal.setAttribute('class', "textModal");
    document.body.appendChild(txtModal);
    txtModal.addEventListener('submit', event => this.FormText_Handle(event));
    txtModal.setAttribute('style', `position: absolute; z-index: 99; top: ${this.y - txtModal.clientHeight / 2}px; left: ${this.x}px`);
  }

  //#region Drawing methods
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
  //#endregion
}