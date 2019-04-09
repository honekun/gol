
export default (function () {
    let fpsInterval, lastDrawTime, frameCount, lastSampleTime;
    let intervalID, requestID;
    let draw;

    return {
        startAnimating,
        fpsStats,
        random,
        make2DArray
    };

    function startAnimating(drawFunction, fps, sampleFreq) {
        if(drawFunction !== undefined && isFunction(drawFunction)) 
        {
            draw = drawFunction;
        }
        else{
            throw new Error("no es funcion");
        }
        fpsInterval = 1000 / fps;
        lastDrawTime = performance.now();
        lastSampleTime = lastDrawTime;
        frameCount = 0;
        
        animate();
        
        intervalID = setInterval(sampleFps, sampleFreq);
    }

    function animate(now) {
        requestID = requestAnimationFrame(animate);
        
        var elapsed = now - lastDrawTime;
        
        if (elapsed > fpsInterval) {
            lastDrawTime = now - (elapsed % fpsInterval);
            drawNextFrame(now);
            
            frameCount++;
        }
    }

    function drawNextFrame(now) {
        if(isFunction(draw)) draw(now);
    }

    function fpsStats(){
        
        return {
            frameCount: frameCount,
            lastSampleTime: lastSampleTime,
            fpsInterval: fpsInterval,

        };
    }

    function sampleFps() {
        var now = performance.now();
        if (frameCount > 0) {
            var currentFps =
                (frameCount / (now - lastSampleTime) * 1000).toFixed(2);            
            frameCount = 0;
            
            // Save the FPS sample for graphing
            //samples.push(currentFps);
            //console.log(maxSamples);
            //if (samples.length > maxSamples + 1) {
                //  samples.splice(1, samples.length - (maxSamples + 1));
            //}
            //graph.load({columns: [samples]});
        }
        lastSampleTime = now;
    }

    function random(min,max) {
        min = min || 0;
        max = max || 1;
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;  
    }

    function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
    }

    function isFunction(x) {
        return Object.prototype.toString.call(x) == '[object Function]';
    }

})();
