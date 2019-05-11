yesno={
    // thanks to Neel Somani for the majority of this code find his writup athttps://www.apptic.me/blog/evaluating-mathematical-expression-javascript.php
    // and on linked in at https://www.linkedin.com/in/neelsomani/
    // replace all fx
    replaceAll: function(haystack, needle, replace) {
        return haystack.split(needle).join(replace);
    }, 

     // custom true/false contains
    strContain: function(haystack, needle) {
        return haystack.indexOf(needle) > -1;
    },

     // determine if char should be added to side
    isParseable: function(n) {
        return (!isNaN(n) || n == ".");
    },

    getSide: function(haystack, middle, direction) {
        var i = middle + direction;
        var term = "";
        var limit = (direction == -1) ? 0 : haystack.length; // set the stopping point, when you have gone too far
        while (i * direction <= limit) { // while the current position is >= 0, or <= upper limit
            if (this.isParseable(haystack[i])) {
                if (direction == 1) term = term + haystack[i];
                else term = haystack[i] + term;
                i += direction;
            } else { return term; }
        }
        return term;
    },

    // fx to generically map a symbol to a function for parsing
    allocFx: function(eq, symbol, alloc) {
        if (this.strContain(eq, symbol)) {
            var middleIndex = eq.indexOf(symbol);
            var left = this.getSide(eq, middleIndex, -1);
            var right = this.getSide(eq, middleIndex, 1);
            eq = this.replaceAll(eq, left+symbol+right, alloc(left, right));
        }
        return eq;
    }, 

    solveStr: function(eq) {
        firstNest:
        while (this.strContain(eq, "(")) { // while the string has any parentheses
            var first = eq.indexOf("("); // first get the earliest open parentheses
            var last = first + 1; // start searching at the character after
            var layer = 1; // we might run into more parentheses, so this integer will keep track
            var layermax=1
            while (layer != 0) { // loop this until we've found the close parenthesis
                if (eq[last] == ")") { // if we run into a close parenthesis, then subtract one from "layer"
                    layer--;
                    if (layer == 0) break; // if it is the corresponding closing parenthesis for our outermost open parenthesis, then we can deal with this expression
                }
                else if (eq[last] == "(") { // if we see an open parenthesis, add one to "layer"
                    layer++;
                    layermax=Math.max(layer,layermax)
                }
                last++; // increment the character we're looking at
                if (last > eq.length) break firstNest; // if the parentheses are incorrectly nested, don't bother with this string
            }
            
            var nested = eq.substr(first + 1, last - first - 1); // get the expression between the parentheses
            
            if (last + 1 <= eq.length) { // if there is exponentiation, change to a different symbol
                if (eq[last + 1] == "^") {
                    eq = eq.substr(0, last + 1) + "&" + eq.substr((last+1)+1);
                }
            }
            if(eq.substr(first-8,8)=='distance'){

                var solvedStr = this.solveStr(nested);
                solvedStr=this.distance(solvedStr)
                var preStr = "distance(" + nested + ")";
            }else{
                var solvedStr = this.solveStr(nested);
                var preStr = "(" + nested + ")";
            }
            eq = eq.replace(preStr, solvedStr); // replace parenthetical with value
        }
        //while (strContain(eq,"distance")) return(replaceAll(eq,'distance','')); 
        
        while (this.strContain(eq, "*") || strContain(eq, "/")) {
            var multiply = true;
            if (eq.indexOf("*") < eq.indexOf("/")) {
                multiply = (this.strContain(eq, "*"));
            } else {
                multiply = !(this.strContain(eq, "/"));
            }
            eq = (multiply) ? this.allocFx(eq, "*", function(l, r) { return parseFloat(l)*parseFloat(r); }) : this.allocFx(eq, "/", function(l, r) { return parseFloat(l)/parseFloat(r); });
        }
        while (this.strContain(eq, "+")) eq = this.allocFx(eq, "+", function(l, r) { return parseFloat(l)+parseFloat(r); });
        while (this.strContain(eq, "=")) eq = this.allocFx(eq, "=", function(l, r) { return parseFloat(l)==parseFloat(r)&1; });
        while (this.strContain(eq, ">")) eq = this.allocFx(eq, ">", function(l, r) { return parseFloat(l)>parseFloat(r)&1; });
        while (this.strContain(eq, "<")) eq = this.allocFx(eq, "<", function(l, r) { return parseFloat(l)<parseFloat(r)&1; });
        while (this.strContain(eq, "^")) eq = this.allocFx(eq, "^", function(l, r) { return parseFloat(l)^parseFloat(r); });
        while (this.strContain(eq, "&")) eq = this.allocFx(eq, "&", function(l, r) { return parseFloat(l)&&parseFloat(r); });
        while (this.strContain(eq, "|")) eq = this.allocFx(eq, "|", function(l, r) { return parseFloat(l)||parseFloat(r); });

         // account for things like (-3)^2
        return eq;
    }, // main recursive fx + PEMDAS
    var moose=''
    var moosecord=parsePath(moose)
    moosecord.y=moosecord.dy+4
    moosecord.x=moosecord.dx+4

    addcord:function (a,b,neg=1){
        let c={}
        let a1=[],b1=[]
        if(a==0){a1.x=0;a1.y=0}else{a1=a}
        if(b==0){b1.x=0;b1.y=0}else{b1=b}
        c.x=a1.x+neg*b1.x
        c.y=a1.y+neg*b1.y
        return c
    },
    
    parsePath:function(path){
        let dmax={
        dy:0,
        dx:0,
        miny:0,
        maxy:0,
        minx:0,
        maxx:0}
        
        for(let i = 0; i<path.length; i++){
            let c = path[i];
            switch(c){
                case 'U':
                    dmax.dy -= 1;
                    dmax.miny = Math.min(dmax.miny,dmax.dy);
                break;
                case 'R':
                    dmax.dx += 1; 
                    dmax.maxx = Math.max(dmax.maxx,dmax.dx);
                break;
                case 'D':
                    dmax.dy += 1; 
                    dmax.maxy = Math.max(dmax.maxy,dmax.dy);
                break;
                case 'L':
                    dmax.dx -= 1; 
                    dmax.minx = Math.min(dmax.minx,dmax.dx);
                break;
            }
        }

        return(dmax)
    },

    distance: function(text){
        let eq=text+''
        let obj=[]
        for (i=0;i<2;i++){
            if(this.strContain(eq,'moose')){obj[i]=moosecord;eq=eq.replace('moose','')}else
            if(this.strContain(eq,'me')){obj[i]=me;eq=eq.replace('me','')}else
            if(this.strContain(eq,'{')){
                let first=eq.indexOf('{')
                let last=eq.indexOf('}')+1
                if (last==-1) {console.log('error')};
                obj[i]=JSON.parse(eq.substr(first,last))
                eq=eq.replace(eq.substr(first,last))
            }else{return 'error'}
        }
        for(i=0;i<2;i++){
            if(obj[i].x==undefined){obj[i].x=obj[1-i].x};
            if(obj[i].y==undefined){obj[i].y=obj[1-i].y};
        }
        
        let vect=this.addcord(obj[0],obj[1],-1)
        if((isNaN(vect.x))^(isNaN(vect.y))){
            if(isNaN(vect.x)){return Math.abs(vect.y)};
            if(isNaN(vect.y)){return Math.abs(vect.x)};
        }else{return Math.abs(vect.x)+Math.abs(vect.y)}
    }
}
