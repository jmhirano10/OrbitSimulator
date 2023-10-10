class Planet{
    constructor(p,v,m,r,c){
        this.pos    = p
        this.vel    = v
        this.mass   = m
        this.radius = r
        this.force  = [0,0]
        this.color  = c
    }

    updateVel(timeStep){
        let a = vec2.divSca(this.force,this.mass)
        this.vel = vec2.add(this.vel,vec2.multSca(a,timeStep))
        this.force = [0,0]
    }

    updatePos(timeStep){
        this.pos = vec2.add(this.pos,vec2.multSca(this.vel,timeStep))
    }

    draw(ctx,w,h){
        ctx.beginPath();
        ctx.arc(this.pos[0]+w/2,h/2-this.pos[1], this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}