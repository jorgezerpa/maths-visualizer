type CanvasConstructorParams = {
  containerElementSelector:string
}


class Canvas {
    containerElement:HTMLDivElement
    containerDimentions:DOMRect
    canvas:HTMLCanvasElement
    ctx:CanvasRenderingContext2D

    startDragCoords:{x:number|null, y:number|null} = {x:null, y:null}
    startDragScroll:{x:number|null, y:number|null} = { x:null, y:null }
    width=10000;
    height=10000;
    background = "#000000";
    prevPanDirectionX=0
    prevPanDirectionY=0
    scaleFactor = 1
    prevMouseX = 0
    prevMouseY = 0
    isDragging = false

    constructor({containerElementSelector}:CanvasConstructorParams){
      this.containerElement = document.querySelector(containerElementSelector) as HTMLDivElement
      this.containerDimentions = this.containerElement.getBoundingClientRect()
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
      this.initialize()
      this.draw()
    }
    
    initialize(){
      if(!this.containerElement){
        console.log("not valid container")
        return
      }
      this,this.containerElement.appendChild(this.canvas)
      this.canvas.width = this.width
      this.canvas.height = this.height
      this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
      this.handleMouseDown()
      this.handleMouseUp()
      this.handleMouseWheel()
  
      this.ctx.scale(1,-1);
      
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      this.containerElement.scrollTo(centerX-this.containerDimentions.width/2, centerY-this.containerDimentions.height/2);
      this.startDragScroll = { x:this.containerElement.scrollLeft,  y:this.containerElement.scrollTop }
    }
  
    draw() {
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 1;
    
      // Draw red line
      this.ctx.beginPath();
      this.ctx.moveTo(0, -100);
      this.ctx.lineTo(0, 100);
      this.ctx.stroke();
    }
  
    handleMouseDown(){
      this.containerElement.addEventListener('mousedown',(e)=>{
        this.startDragCoords = {x:e.clientX, y:e.clientY}
        this.startDragScroll = { x:this.containerElement.scrollLeft,  y:this.containerElement.scrollTop }
        this.isDragging = true
        this.containerElement.addEventListener("mousemove", this.handlePan.bind(this))
      })
    }
    
    handleMouseUp(){
      this.containerElement.addEventListener('mouseup',()=>{
        this.startDragCoords = {x:null, y:null}
        this.isDragging = false
        this.containerElement.removeEventListener("mousemove", this.handlePan.bind(this))
      })
    }
  
    handlePan(e:MouseEvent){
        if(this.isDragging && this.startDragCoords.x && this.startDragCoords.y){
          let mouseDirecction = this.getMouseDirection(e)
          
          const deltaMouse = { x: Math.abs(this.startDragCoords.x-e.clientX), y:Math.abs(this.startDragCoords.y - e.clientY) }
          // if change direction reset startDragCoords
          if(this.prevPanDirectionX!==mouseDirecction.x ) {
            this.startDragCoords.x = e.clientX
            this.startDragScroll.x = this.containerElement.scrollLeft
          }
          if(this.prevPanDirectionY!==mouseDirecction.y ) {
            this.startDragCoords.y = e.clientY
            this.startDragScroll.y = this.containerElement.scrollTop
          }
          // update mouse direction each time
          this.prevPanDirectionX = mouseDirecction.x
          this.prevPanDirectionY = mouseDirecction.y
  
          // evaluate === null. because if its value is 0, it will be true-> beacause 0 is considerated like false--> JAVACRIPT MAGIC :V 
          if(this.startDragScroll.x===null) return 
          if(this.startDragScroll.y===null) return 
  
          if(mouseDirecction.x===-1) {
            this.containerElement.scrollTo(this.startDragScroll.x + deltaMouse.x, this.containerElement.scrollTop);
          }
          if(mouseDirecction.x===1) {
            this.containerElement.scrollTo(this.startDragScroll.x - deltaMouse.x, this.containerElement.scrollTop);
          }
          if(mouseDirecction.y===-1) {
            this.containerElement.scrollTo(this.containerElement.scrollLeft, this.startDragScroll.y - deltaMouse.y);
          }
          if(mouseDirecction.y===1) {
            this.containerElement.scrollTo(this.containerElement.scrollLeft, this.startDragScroll.y + deltaMouse.y);
          }
        }
    }
  
    handleMouseWheel(){
      this.canvas.addEventListener('wheel', (e: WheelEvent) => {
        console.log("wheel")
        e.preventDefault();
        const wheelDirection = this.getMouseWheelDirection(e)
        this.ctx.save(); // guardar contexto antes de escalar
         
        this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height)
        this.scaleFactor = wheelDirection === -1 ? this.scaleFactor/1.1 : this.scaleFactor*1.1
        this.ctx.scale(this.scaleFactor,-this.scaleFactor); // Scale coordinates system
  
        this.draw()
        this.ctx.restore(); // Restaura el contexto al estado anterior
      });
    }
  
    //utils
    getMouseDirection(e: MouseEvent):{x:number, y:number}{
      let currentMouseX = e.clientX
      let currentMouseY = e.clientY
      let xDirection = 0
      let yDirection = 0
      if(currentMouseX>this.prevMouseX) {
        xDirection = 1
      } 
      if(currentMouseX<this.prevMouseX) {
        xDirection = -1
      } 
      if(currentMouseY>this.prevMouseY) {
        yDirection = -1
      } 
      if(currentMouseY<this.prevMouseY) {
        yDirection = 1
      } 
      this.prevMouseX = currentMouseX
      this.prevMouseY = currentMouseY
      return {x:xDirection, y:yDirection}
    }
  
    getMouseWheelDirection(e:WheelEvent) {
      let delta = Math.max(-1, Math.min(1, (-e.deltaY || -e.detail)));
      return delta > 0 ? 1 : -1;
    }
  }

  export { Canvas }