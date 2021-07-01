import Drawing from "./drawing.js";

export default class Sketch extends Drawing {
  constructor(canvas) {
    super(canvas);
    this.pressed = false;
    this.x = undefined;
    this.y = undefined;
    this.lineWidthLimit = 76;
    this.ongoingTouches = new Array;
    this.states = []
    this.color = "#000000"
    this.value = 2
    this.user_draws = localStorage.getItem("user_draws") != null ? JSON.parse(localStorage.getItem("user_draws")) : []
    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.ongoingTouchIndexById = this.ongoingTouchIndexById.bind(this);
    this.copyTouch = this.copyTouch.bind(this);
    this.UpdateWidthValueOnScreen();
    this.UpdateSavesModal();
    this.UpdateCanvasSize();
  }

  //#region Updates functions
  UpdateSavesModal() {
    const modalSaves = document.getElementById('modalSaves');
    modalSaves.innerHTML = "";
    if (this.user_draws.length > 0) 
      this.user_draws.map(draw => modalSaves.innerHTML += `<div key="${draw.title}" class="save-box"><h3 class="save">${draw.title}</h3><button class="delete">X</button></div>`);
    else modalSaves.innerHTML = `<h2 style="margin: 10px;">You have no saves !</h2>`;
    document.querySelectorAll('.save').forEach(save => save.addEventListener('click', event => this.Save_Handle(event)));
    document.querySelectorAll('.delete').forEach(deleteBtn => deleteBtn.addEventListener('click', event => this.Delete_Handle(event)));
  }

  UpdateWidthValueOnScreen() {
    document.getElementById('widthValue').innerText = this.value;
  }
  //#endregion

  //#region Screen recognitions
  mouseRecognitions() {
    this.canvas.addEventListener('mousedown', event => {
      if (document.getElementById('text').classList.contains("selected")) this.CreateTextModal(event.offsetX, event.offsetY);
      else if (document.querySelector(".polygon.selected")) {
        const id = document.querySelector(".polygon.selected").id;
        this.states.push({type: "polygon", id, x: event.offsetX, y: event.offsetY, size: this.value, colorStyle: this.color});
        this.DrawPolygon(id, event.offsetX, event.offsetY, this.color, this.value);
      }
      else {
        this.pressed = true;
        this.x = event.offsetX;
        this.y = event.offsetY;
      }
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
          const size = this.value * 4;
          this.context.clearRect(x2 - size / 2, y2 - size / 2, size, size);
        } else {
          this.DrawCircle(x2, y2, this.value, this.color)
          this.DrawLine(this.x, this.y, x2, y2, this.value, this.color);
          this.states.push({type: "Draw", x: x2, y: y2, prevX: this.x, prevY: this.y, size: this.value, colorStyle: this.color});
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
      if (index < this.states.length - 1) this.ReDraw(draw);
      else this.states.pop();
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
    selectedDraw.draw.map(draw => this.ReDraw(draw));
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

  FormText_Handle(e, x, y) {
    e.preventDefault();
    this.DrawText(e.target[0].value, x, y, this.color, this.value);
    this.states.push({type: "text", text: e.target[0].value, x, y, size: this.value, colorStyle: this.color});
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
        this.DrawLine(this.x, this.y, x2, y2, this.value, this.color)
        this.DrawCircle(this.x, this.y, this.value, this.color)
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
    document.getElementById('formSave').addEventListener('submit', event => this.FormSave_Handle(event));
    window.addEventListener('resize', () => this.UpdateCanvasSize());
    document.querySelectorAll('.icon.selectable').forEach(icon => icon.addEventListener('click', event => this.toggleTools(event)));
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
          this.UpdateSavesModal();
          document.getElementById('modalSaves').classList.toggle("desappear");
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
    document.querySelectorAll(".selected").forEach(element => element.classList.remove("selected"))
    document.querySelectorAll('.icon').forEach(icon => {
      if (icon.id == e.target.id) icon.classList.add("selected");
    })
  }

  CreateTextModal(x, y) {
    this.pressed = false;
    const txtModal = document.createElement('form')
    txtModal.innerHTML = `<input type="text" placeholder="Insert the text here"/>`;
    txtModal.setAttribute('class', "textModal");
    document.body.appendChild(txtModal);
    txtModal.addEventListener('submit', event => this.FormText_Handle(event, x, y));
    txtModal.setAttribute('style', `position: absolute; z-index: 99; top: ${y - txtModal.clientHeight / 2}px; left: ${x}px`);
  }
}