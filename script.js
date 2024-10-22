const images = document.querySelectorAll(".image");

const slide = document.getElementById("imageSlide");

const title = document.getElementById("title")

let minSide;

if(window.innerHeight > window.innerWidth){
    minSide = window.innerWidth
}else{
    minSide = window.innerHeight
}

let currentCenter = findCurrentCenter()

currentCenter.classList.add('center') // first image x + 0.4 *minSide* i = width/2

function findCurrentCenter(){
    if(window.innerHeight > window.innerWidth){
        minSide = window.innerWidth;
    }else{
        minSide = window.innerHeight;
    }
    let i = Math.floor((window.innerWidth/2 - images.item(0).getBoundingClientRect().x) / (0.4*minSide));
    if (i < 0) i = 0;
    else if (i >= images.length) i = images.length -1;
    return images.item(i);
}

function changeCenter(){
    currentCenter.classList.remove('center');

    currentCenter = findCurrentCenter();

    currentCenter.classList.add('center');

    title.textContent = currentCenter.dataset.title;
}



const handleOnDown = e => slide.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    slide.dataset.mouseDownAt = "0";  
    slide.dataset.prevPercentage = slide.dataset.percentage;
}

const handleOnMove = e => {
    if(slide.dataset.mouseDownAt === "0") return;

    changeCenter()

    const mouseDelta = parseFloat(slide.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(slide.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    slide.dataset.percentage = nextPercentage;

    const animation = slide.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    setTimeout(changeCenter, 1000)
    animation.onfinish = () => changeCenter();
}

// images.item(0).addEventListener('click', function(e){
//     console.log(e.clientX);
// });

window.onmousedown = e => handleOnDown(e);

window.onmouseup = e => handleOnUp(e);

window.onmousemove = e => handleOnMove(e);