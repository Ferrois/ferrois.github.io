const navButton = document.querySelector(".navigation-button");
const navSlider = document.querySelector(".navigation-slider");
const bodyVar = document.querySelector("body");

document.querySelectorAll(".about-text").forEach(elem => elem.setAttribute('id','hidden'));

setTimeout(function(){
	document.querySelectorAll(".about-text").forEach(elem => elem.setAttribute('id','loaded'))
},500);


isActive=false;
navButton.addEventListener("click",function(){
	if (isActive==false){
		isActive=true;
		navSlider.classList.add("isCurrentlyActive");
		bodyVar.style.cssText += 'overflow-y:hidden;';
		}
	else {
		isActive=false;
		navSlider.classList.remove("isCurrentlyActive");
		bodyVar.style.cssText -= 'overflow-y:hidden;';
	}
	})