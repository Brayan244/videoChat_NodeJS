
//checkbox

function validate(){

var check = document.getElementById('fondoswitch');
var body = document.getElementById('body');
var letra = document.getElementById('inicio');
var letra1 = document.getElementById('usuario');
var letra2 = document.getElementById('contraseña');
var cont = document.getElementById('contenedor');
check.addEventListener('change',function(e){

console.log(e);
if (e.target.checked == false){ 
    body.style.backgroundImage = "url(http://www.gilliangarcia.com/tbm/wp-content/uploads/2013/06/watercolor-circles-2277.jpg)";
    letra.style.color = "black";
    letra1.style.color = "black";
    letra2.style.color = "black";
    cont.style.boxShadow = "0px 0px 80px #071910";
}
else if (e.target.checked == true) { 
    body.style.backgroundImage = "url(https://i.pinimg.com/originals/fd/81/23/fd8123197c1f43fcea2c135534e55563.jpg)";
    letra.style.color = "white";
    letra1.style.color = "white";
    letra2.style.color = "white";
    cont.style.boxShadow = "0px 0px 80px #fff";

    
    
}
});

}

