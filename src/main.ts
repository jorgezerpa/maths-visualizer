import "./style.css"

//Globals
let prevMouseX = window.scrollX
let prevMouseY = window.scrollY
let prevMouseDirectionX=0
let prevMouseDirectionY=0


class Canvas {
  canvas:HTMLCanvasElement;
  width:number;
  height:number;
  background:string;
  ctx:CanvasRenderingContext2D
  isDragging:boolean
  startDragCoords:{x:number|null, y:number|null}
  startDragScroll:{x:number|null, y:number|null}

  constructor(){
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    this.width = 10000 // initial
    this.height = 10000 // initial
    this.isDragging = false
    this.background = "#000000"
    this.startDragCoords = {x:null, y:null}
    this.startDragScroll = { x:window.scrollX, y:window.scrollY }
    this.handlePan = this.handlePan.bind(this) // on listenner, this->target, with bind, this -> class

    this.initialize()
    this.draw()
  }

  initialize(){
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.handleMouseDown()
    this.handleMouseUp()
  }

  draw(){
    var gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0.0, "red");
    gradient.addColorStop(0.1, "green");
    gradient.addColorStop(0.2, "blue");
    gradient.addColorStop(0.3, "red");
    gradient.addColorStop(0.4, "green");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(0.6, "red");
    gradient.addColorStop(0.7, "green");
    gradient.addColorStop(0.8, "blue");
    gradient.addColorStop(0.9, "red");
    gradient.addColorStop(1, "purple");
  
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  handleMouseDown(){
    window.addEventListener('mousedown',(e)=>{
      this.startDragCoords = {x:e.clientX, y:e.clientY}
      this.startDragScroll = {x:window.scrollX, y:window.scrollY}
      this.isDragging = true
      document.addEventListener("mousemove", this.handlePan)
    })
  }
  
  handleMouseUp(){
    window.addEventListener('mouseup',()=>{
      this.startDragCoords = {x:null, y:null}
      this.isDragging = false
      document.removeEventListener("mousemove", this.handlePan)
    })
  }

  handlePan(e:MouseEvent){
      if(this.isDragging && this.startDragCoords.x && this.startDragCoords.y){
        let mouseDirecction = {x:getMouseMoveXDirection(e), y:getMouseMoveYDirection(e)}
        
        const deltaMouse = { x: Math.abs(this.startDragCoords.x-e.clientX), y:Math.abs(this.startDragCoords.y - e.clientY) }
        // if change direction reset startDragCoords
        if(prevMouseDirectionX!==mouseDirecction.x ) {
          this.startDragCoords.x = e.clientX
          this.startDragScroll.x = window.scrollX
        }
        if(prevMouseDirectionY!==mouseDirecction.y ) {
          this.startDragCoords.y = e.clientY
          this.startDragScroll.y = window.scrollY
        }
        // update mouse direction each time
        prevMouseDirectionX = mouseDirecction.x
        prevMouseDirectionY = mouseDirecction.y
        // console.log(deltaMouse)

        // evaluate === null. because if its value is 0, it will be true--> JAVACRIPT MAGIC :V
        if(this.startDragScroll.x===null) return 
        if(this.startDragScroll.y===null) return 

        if(mouseDirecction.x===-1) {
          window.scrollTo(this.startDragScroll.x + deltaMouse.x, window.scrollY);
        }
        if(mouseDirecction.x===1) {
          window.scrollTo(this.startDragScroll.x - deltaMouse.x, window.scrollY);
        }
        if(mouseDirecction.y===-1) {
          window.scrollTo(window.scrollX, this.startDragScroll.y - deltaMouse.y);
        }
        if(mouseDirecction.y===1) {
          window.scrollTo(window.scrollX, this.startDragScroll.y + deltaMouse.y);
        }
      }
  }



}


const sketch = new Canvas()
drawCircles(sketch.ctx)


function drawCircles(ctx: CanvasRenderingContext2D) {
  // Definir el radio del círculo
  const radius = 200;

  // Definir los colores para los círculos
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

  // Dibujar los círculos en la cuadrícula
  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < 30; j++) {
      // Calcular la posición del centro del círculo
      const x = i * (radius * 2 + 10) + radius + 5;
      const y = j * (radius * 2 + 10) + radius + 5;

      // Seleccionar un color aleatorio de la lista de colores
      const color = colors[Math.floor(Math.random() * colors.length)];

      // Dibujar el círculo
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }
  }
}




// UTILS 


function getMouseMoveXDirection(e: MouseEvent): number {
  let currentMouseX = e.clientX
  if(currentMouseX>prevMouseX) {
    prevMouseX = currentMouseX
    return 1
  } 
  if(currentMouseX<prevMouseX) {
    prevMouseX = currentMouseX
    return -1
  } 
  return 0
}

function getMouseMoveYDirection(e: MouseEvent): number {
  let currentMouseY = e.clientY
  if(currentMouseY>prevMouseY) {
    prevMouseY = currentMouseY
    return -1
  } 
  if(currentMouseY<prevMouseY) {
    prevMouseY = currentMouseY
    return 1
  } 
  return 0
}




