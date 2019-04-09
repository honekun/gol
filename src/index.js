import glife from './js/glife';
import './scss/stats.scss';
import './scss/controls.scss';

//TODO: zoom, mejorar calidad animación, stats on/off

var canvas = document.getElementById('canvas');
var start_btn = document.getElementById('start');
var go1_btn = document.getElementById('go1');
var reset_btn = document.getElementById('reset');
var $gpersecond = document.getElementById('gpersecond');
var $resolution = document.getElementById('resolution');

glife.setup(canvas);
glife.reset(getConfig());

start_btn.innerHTML = "&#9658;  Iniciar";
start_btn.addEventListener('click', () => {
    if(glife.running()){
        glife.stop();
        start_btn.innerHTML = "&#9658; Iniciar";
    }
    else{
        glife.start();
        start_btn.innerHTML = "Detener";
    }
});

go1_btn.innerHTML = "Avanzar";
go1_btn.addEventListener('click', () => {
    glife.nextGen();    
});

reset_btn.innerHTML = "Reset";
reset_btn.addEventListener('click', () => {
    glife.reset(getConfig());
    start_btn.innerHTML = "Iniciar";
});

function getConfig() {
    let gseg = ($gpersecond ? parseInt($gpersecond.value) || 10 : 10);
    let res  = ($resolution ? parseInt($resolution.value) || 20 : 20);
    let config = {
        gpersecond: gseg,
        resolution: res
    };

    return config;
}
