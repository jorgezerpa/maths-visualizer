import "./style.css"

//Globals
let prevMouseX = window.scrollX
let prevMouseY = window.scrollY
let prevMouseDirectionX=0
let prevMouseDirectionY=0
let scaleFactor = 1


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
    this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
    this.handleMouseDown()
    this.handleMouseUp()
    this.handleMouseWheel()

    this.ctx.scale(1,-1);
    
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    window.scrollTo(centerX-window.innerWidth/2, centerY-window.innerHeight/2);
  }

  draw() {
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 1;
    
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, 200);
    this.ctx.stroke();

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
        let mouseDirecction = getMouseDirection(e)
        
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

  handleMouseWheel(){
    this.canvas.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const wheelDirection = getMouseWheelDirection(e)
      this.ctx.save(); // guardar contexto antes de escalar
       
      this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height)
      scaleFactor = wheelDirection === -1 ? scaleFactor/1.1 : scaleFactor*1.1
      this.ctx.scale(scaleFactor,-scaleFactor); // Scale coordinates system

      this.draw()
      this.ctx.restore(); // Restaura el contexto al estado anterior
    });
  }


}


const sketch = new Canvas()




// UTILS 
function getMouseDirection(e: MouseEvent):{x:number, y:number}{
  let currentMouseX = e.clientX
  let currentMouseY = e.clientY
  let xDirection = 0
  let yDirection = 0
  if(currentMouseX>prevMouseX) {
    xDirection = 1
  } 
  if(currentMouseX<prevMouseX) {
    xDirection = -1
  } 
  if(currentMouseY>prevMouseY) {
    yDirection = -1
  } 
  if(currentMouseY<prevMouseY) {
    yDirection = 1
  } 
  prevMouseX = currentMouseX
  prevMouseY = currentMouseY
  return {x:xDirection, y:yDirection}
 
}

function getMouseWheelDirection(e:WheelEvent) {
  let delta = Math.max(-1, Math.min(1, (-e.deltaY || -e.detail)));
  return delta > 0 ? 1 : -1;
}

function drawLine(ctx:CanvasRenderingContext2D, ypos:number) {
  // Definimos el punto de inicio y fin de la línea
  const startX = 0;
  const startY = 0;
  const endX = 200;
  const endY = ypos;

  // Configuramos el estilo de la línea
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;

  // Dibujamos la línea
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}





    
