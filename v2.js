const vec2 = {
    add:function(v1,v2){
        let x = v1[0] + v2[0]
        let y = v1[1] + v2[1]
        return [x,y]
    },
    sub:function(v1,v2){
        let x = v1[0] - v2[0]
        let y = v1[1] - v2[1]
        return [x,y]
    },
    multSca:function(v,s){
        let x = v[0]*s
        let y = v[1]*s
        return [x,y]
    },
    divSca:function(v,s){
        let x = v[0]/s
        let y = v[1]/s
        return [x,y]
    },
    dis:function(v){
        return Math.sqrt(v[0]**2 + v[1]**2)
    },
    norm:function(v){
        return vec2.divSca(v,vec2.dis(v))
    },
    dir:function(v1,v2){
        return vec2.norm(vec2.sub(v1,v2))
    }
}