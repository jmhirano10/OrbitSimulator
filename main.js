/*Canvas Variables*/
var canvas          = document.getElementById('sim')
var ctx             = canvas.getContext('2d')
var width           = window.innerWidth
var height          = window.innerHeight
canvas.width        = width
canvas.height       = height

/*Simulation Variables*/
var gravConst       = 1
var timeStep        = 0.2
var velScale        = 8
var maxVel          = 300
var sunMass         = 50000
var sunRadius       = 15
var blkMass         = 500000
var blkRadius       = 30
var newMass         = 10
var newRadius       = 7
var newPlanet       = null
var planets         = []

/*Visual Variables*/
var blkClr          = '#000000'
var sunClr          = '#e31762'
var planetClrs      = ['#e97dff','#11e2f5','#adff7d','#ffadcb','#ffac59']
var curPlanetClr    = 0
var lineStr         = [0,0]
var lineEnd         = [0,0]
var lineClr         = '#e0e0e0'

/*Menu Variables*/
var ss              = document.getElementById('ss')
var ds              = document.getElementById('ds')
var sbss            = document.getElementById('sbss')
var sbds            = document.getElementById('sbds')

/*Input Variables*/
var mousePressed    = false

/*Event Listeners*/
canvas.addEventListener('mousedown',onDownHandler,false)
canvas.addEventListener('mousemove',onMoveHandler,false)
canvas.addEventListener('mouseup',onUpHandler,false)
canvas.addEventListener('wheel',onWheelHandler,false)
window.addEventListener('resize',onResizeHandler,false)

/*Event Handler Functions*/
function onDownHandler(e){
    let x           = e.clientX - width/2
    let y           = height/2 - e.clientY
    lineStr         = [e.clientX,e.clientY]
    lineEnd         = [e.clientX,e.clientY]
    mousePressed    = true
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
    mousePressed    = false
    newPlanet.vel   = [(newPlanet.pos[0]-x)/velScale,(newPlanet.pos[1]-y)/velScale]
    planets.push(newPlanet)
    newPlanet       = null
}

function onWheelHandler(e){
    newPlanet.mass  += e.deltaY
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
    let length = planets.length
    for (let i=0; i<length-1; i++){
        for (let j=i+1; j<length; j++){
            calcGravF(planets[i],planets[j])
        }
    }
    for (let i=length-1; i>=0; i--){
        planets[i].draw(ctx,width,height)
        if (planets[i].moves){
            planets[i].updateVel(timeStep,maxVel)
            planets[i].updatePos(timeStep)
        }
    }
}

/*Star Configuration*/
function singleStar(){
    let sun = new Planet([0,0],[0,0],sunMass,sunRadius,sunClr)
    planets = []
    planets.push(sun)
}

function dualStar(){
    let sun1 = new Planet([0,145],[9,0],sunMass,sunRadius,sunClr)
    let sun2 = new Planet([0,-145],[-9,0],sunMass,sunRadius,sunClr)
    planets = []
    planets.push(sun1)
    planets.push(sun2)
}

function singleBlkSingleStar(){
    let sun = new Planet([0,150],[60,0],sunMass,sunRadius,sunClr)
    let blk = new Planet([0,0],[0,0],blkMass,blkRadius,blkClr)
    blk.moves = false
    planets = []
    planets.push(sun)
    planets.push(blk)
}

function singleBlkDualStar(){
    let sun1 = new Planet([0,200],[50,0],sunMass,sunRadius,sunClr)
    let sun2 = new Planet([0,-200],[-50,0],sunMass,sunRadius,sunClr)
    let blk = new Planet([0,0],[0,0],blkMass,blkRadius,blkClr)
    blk.moves = false
    planets = []
    planets.push(sun1)
    planets.push(sun2)
    planets.push(blk)
}

/*Drawing Function*/
function draw(){
    ctx.beginPath()
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0,0,width,height)
    ctx.closePath()
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
}

/*Animation Update Loop*/
function update(){
    draw()
    updatePlanets()
    animationID = requestAnimationFrame(update)
}

ss.onclick = function(){singleStar()}
ds.onclick = function(){dualStar()}
sbss.onclick = function(){singleBlkSingleStar()}
sbds.onclick = function(){singleBlkDualStar()}

singleStar()
update()
