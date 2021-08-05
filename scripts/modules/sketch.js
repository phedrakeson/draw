import Drawing from "./drawing.js";

export default class Sketch extends Drawing {
  constructor(canvas) {
    super(canvas);
    this.pressed = false;
    this.x = undefined;
    this.y = undefined;
    this.lineWidthLimit = 76;
    this.ongoingTouches = new Array;
    this.paths = new Array;
    this.states = new Array;
    this.color = "#000000"
    this.value = 2
    this.user_sketches = localStorage.getItem("user_sketches") != null ? JSON.parse(localStorage.getItem("user_sketches")) : []
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
    if (this.user_sketches.length > 0) 
      this.user_sketches.map(sketch => modalSaves.innerHTML += `<div class="save-box"><h3 key="${sketch.title}" class="save">${sketch.title.length > 7 ? sketch.title.slice(0, 7).trim() + "..." : sketch.title}</h3><button key="${sketch.title}" class="delete">X</button></div>`);
    else 
      modalSaves.innerHTML = `<h2 style="margin: 10px;">You have no saves !</h2>`;
    document.querySelectorAll('.save').forEach(save => save.addEventListener('click', event => this.Save_Handle(event)));
    document.querySelectorAll('.delete').forEach(deleteBtn => deleteBtn.addEventListener('click', event => this.DeleteSave_Handle(event)));
  }

  UpdateWidthValueOnScreen() {
    document.getElementById('widthValue').innerText = this.value;
  }
  //#endregion

  //#region Screen recognitions
  MouseRecognitions() {
    this.canvas.addEventListener('mousedown', event => {
      if (document.getElementById('text').classList.contains("selected")) this.CreateTextModal(event.offsetX, event.offsetY);
      else if (document.querySelector(".polygon.selected")) {
        const id = document.querySelector(".polygon.selected").id;
        this.paths.push({ states: {id, x: event.offsetX, y: event.offsetY, size: this.value}, type: "polygon", colorStyle: this.color});
        this.DrawPolygon(id, event.offsetX, event.offsetY, this.color, this.value);
      }
      else {
        this.pressed = true;
        this.x = event.offsetX;
        this.y = event.offsetY;
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      if (this.states.length > 0) {
        this.paths.push({ states: new Array(...this.states), type: "sketch", colorStyle: this.color});
        this.states = [];
      }
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
          this.states.push({x: x2, y: y2, prevX: this.x, prevY: this.y, size: this.value});
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
    this.paths.forEach((path, index) => {
      if (index < this.paths.length - 1) 
        this.ReDraw(path);
      else 
        this.paths.pop();
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

  DeleteSave_Handle(e) {
    this.user_sketches = this.user_sketches.filter(save => save.title != e.target.getAttribute("key"));
    localStorage.setItem("user_sketches", JSON.stringify(this.user_sketches))
    this.UpdateSavesModal();
  }

  Save_Handle(e) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const selectedSketch = this.user_sketches.find(save => save.title === e.target.getAttribute("key"));
    this.paths = selectedSketch.paths;
    this.canvas.style.backgroundColor = selectedSketch.backgroundColor;
    selectedSketch.paths.map(path => this.ReDraw(path));
  }

  FormSave_Handle(e) {
    e.preventDefault();
    const title = e.target[0].value.trim();
    if (this.user_sketches.some(sketch => sketch.title == title)) {
      if (confirm(`This title is already been used by another sketch, do you want to update the sketch with the same name ?`))
        this.user_sketches = this.user_sketches.filter(sketch => sketch.title != title);
      else return;
    }
    this.user_sketches.push({paths: this.paths, backgroundColor: this.canvas.style.backgroundColor, title})
    localStorage.setItem("user_sketches", JSON.stringify(this.user_sketches))
    e.target.reset();
    document.getElementById('modalSave').classList.toggle("desappear")
    this.UpdateSavesModal();
  }

  CanvasClear_Handle() {
    this.states = [];
    this.paths = [];
    this.canvas.style.backgroundColor = "#EEEE";
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  FormText_Handle(e, x, y) {
    e.preventDefault();
    const posY = y + this.value / 2;
    const posX = x - (this.value / 2) * e.target[0].value.length; // Returns the centered value based on each character of the text
    this.DrawText(e.target[0].value, posX, posY, this.color, this.value);
    this.paths.push({states: { text: e.target[0].value, x: posX, y: posY, size: this.value}, type: "text", colorStyle: this.color});
    e.target.remove();
  }

  TextPreview_Handle(event, element) {
    element.setAttribute("style", `background-color: ${this.canvas.style.backgroundColor}; font-size: ${this.value * 2}px; color: ${this.color}`)
    element.innerText = event.target.value;
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

  Setup() {
    this.AddEventListeners();
    this.MouseRecognitions();
    this.touchRecognitions();
  }

  AddEventListeners() {
    document.getElementById('canvas-color').addEventListener('input', event => this.canvas.style.backgroundColor = event.target.value);
    document.getElementById('color').addEventListener('input', event => this.color = event.target.value);
    document.getElementById('decrease').addEventListener('click', () => this.DecreaseBtn_Handle());
    document.getElementById('increase').addEventListener('click', () => this.IncreaseBtn_Handle());
    document.getElementById('trash').addEventListener('click', () => this.CanvasClear_Handle());
    document.getElementById('undo').addEventListener('click', () => this.Undo_Handle());
    document.getElementById('formSave').addEventListener('submit', event => this.FormSave_Handle(event));
    document.getElementById("save").addEventListener('click', () => document.getElementById('modalSave').classList.toggle("desappear"));
    document.getElementById("load").addEventListener('click', () => document.getElementById('modalSaves').classList.toggle("desappear"));
    document.getElementById("info").addEventListener('click', () => document.getElementById('modalInfo').classList.toggle("desappear"));
    window.addEventListener('resize', () => this.UpdateCanvasSize());
    document.querySelectorAll('.icon.selectable').forEach(icon => icon.addEventListener('click', event => this.ToggleTools(event)));
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
  
  ToggleTools(e) {
    document.querySelector(".icon.selected").classList.remove("selected");
    e.target.classList.add("selected");
  }

  CreateTextModal(x, y) {
    this.pressed = false;
    const txtModal = document.createElement('form')
    txtModal.innerHTML = `<p>The preview goes here !</p><div><input type="text" placeholder="Insert the text here"/><input type="button" value="X"></input></div>`;
    document.body.appendChild(txtModal);
    txtModal.children[1].children[1].addEventListener('click', () => txtModal.remove());
    txtModal.children[1].children[0].addEventListener('input', e => this.TextPreview_Handle(e, txtModal.children[0]));
    txtModal.addEventListener('submit', event => this.FormText_Handle(event, x, y));
    txtModal.setAttribute('class', "textModal");
    txtModal.setAttribute('style', `top: ${y - txtModal.clientHeight / 2}px; left: ${x - txtModal.clientWidth / 2}px`);
  }
}