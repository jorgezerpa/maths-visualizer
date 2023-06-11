import "./style.css"

class Canvas {
  canvas:HTMLCanvasElement;
  width:number;
  heigth:number;
  background:string;
  ctx:CanvasRenderingContext2D

  constructor(){
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
    this.width = window.innerWidth
    this.heigth = window.innerHeight
    this.background = "#000000"
    this.draw()
    this.handleResize()
  }

  draw(){
    this.ctx.fillStyle = "red"
    this.ctx.arc(100,100,30,0,2*Math.PI)
    this.ctx.fill()
  }

  handleResize(){
    window.addEventListener("resize", ()=>{
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.draw()
    })
  }
}


const sketch = new Canvas()
sketch.draw()





