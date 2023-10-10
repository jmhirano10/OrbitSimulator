/*Canvas Variables*/
var canvas          = document.getElementById('sim')
var ctx             = canvas.getContext('2d')
var width           = window.innerWidth
var height          = window.innerHeight
canvas.width        = width
canvas.height       = height

/*Simulation Variable*/
var gravConst       = 1
var dampConst       = 0.99
var timeStep        = 0.2
var velScale        = 8
var sunMass         = 500000
var newMass         = 100
var newRadius       = 20
var newPlanet       = null
var planets         = []

/*Visual Variable*/
var sunClr          = '#e31762'
var planetClrs      = ['#e97dff','#11e2f5','#adff7d','#ffadcb','#ffac59']
var curPlanetClr    = 0
var lineStr         = [0,0]
var lineEnd         = [0,0]
var lineClr         = '#e0e0e0'

/*Event Listeners*/
canvas.addEventListener('mousedown',onDownHandler,false)
canvas.addEventListener('mousemove',onMoveHandler,false)
canvas.addEventListener('mouseup',onUpHandler,false)
window.addEventListener('resize',onResizeHandler,false)

/*Event Handler Functions*/
function onDownHandler(e){
    lineStr         = [e.clientX,e.clientY]
    lineEnd         = [e.clientX,e.clientY]
    let x           = e.clientX - width/2
    let y           = -(e.clientY - height/2)
    newPlanet       = new Planet([x,y],[0,0],newMass,newRadius,planetClrs[curPlanetClr])
    if (curPlanetClr == planetClrs.length-1){
        curPlanetClr = 0
    }
    else {
        curPlanetClr++
    }
}

function onMoveHandler(e){
    lineEnd         = [e.clientX,e.clientY]
}

function onUpHandler(e){
    let x           = e.clientX - width/2
    let y           = -(e.clientY - height/2)
    newPlanet.vel   = [(newPlanet.pos[0]-x)/velScale,(newPlanet.pos[1]-y)/velScale]
    planets.push(newPlanet)
    newPlanet       = null
}

function onResizeHandler(e){
    width           = window.innerWidth
    height          = window.innerHeight
    canvas.width    = width
    canvas.height   = height
}

/*Update Planets*/
function calcGravF(p1,p2){
    let force       = gravConst*(p1.mass*p2.mass)/(vec2.dis(vec2.sub(p1.pos,p2.pos))**2)
    let dir         = vec2.dir(p1.pos,p2.pos)
    p1.force        = vec2.add(p1.force,vec2.multSca(dir,-force))
    p2.force        = vec2.add(p2.force,vec2.multSca(dir,force))
}

function collisions(p1,p2){
    let dis = vec2.dis([p1.pos[0]-p2.pos[0],p1.pos[1]-p2.pos[1]])
}

function updatePlanets(){
    let length      = planets.length
    for (let i=0; i<length-1; i++){
        for (let j=i+1; j<length; j++){
            calcGravF(planets[i],planets[j])
        }
    }
    for (let p of planets){
        p.draw(ctx,width,height)
        p.updateVel(timeStep)
        p.updatePos(timeStep)
        
    }
}

/*Star Configuration*/
function singleStar(){
    let sun = new Planet([0,0],[0,0],sunMass,50,sunClr)
    planets.push(sun)
}

function dualStar(){
    let sun1 = new Planet([0,200],[20,0],sunMass,50,sunClr)
    let sun2 = new Planet([0,-200],[-20,0],sunMass,50,sunClr)
    planets.push(sun1)
    planets.push(sun2)
}

function draw(){
    ctx.beginPath()
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0,0,width,height)
    ctx.closePath()
}

function update(){
    draw()
    updatePlanets()
    if (newPlanet != null){
        ctx.beginPath()
        ctx.strokeStyle = lineClr
        ctx.lineWidth = 5
        ctx.setLineDash([15, 10])
        ctx.moveTo(lineStr[0],lineStr[1])
        ctx.lineTo(lineEnd[0],lineEnd[1])
        ctx.stroke()
        newPlanet.draw(ctx,width,height)
    }
    animationID = requestAnimationFrame(update)
}

singleStar()
update()