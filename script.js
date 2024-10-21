const images = document.querySelectorAll(".image");

const slide = document.getElementById("imageSlide");

const title = document.getElementById("title")

const handleOnDown = e => slide.dataset.mouseDownAt = e.clientX;

let minSide;

if(window.innerHeight > window.innerWidth){
    minSide = window.innerWidth
}else{
    minSide = window.innerHeight
}

let currentCenter = findCurrentCenter()

currentCenter.classList.add('center')

const handleOnUp = () => {
    slide.dataset.mouseDownAt = "0";  
    slide.dataset.prevPercentage = slide.dataset.percentage;
}

function findCurrentCenter(){
    if(window.innerHeight > window.innerWidth){
        minSide = window.innerWidth
    }else{
        minSide = window.innerHeight
    }

    for(const image of images){
        if(image.getBoundingClientRect().x <= (window.innerWidth/2 + 0.4 * minSide) && image.getBoundingClientRect().x >= (window.innerWidth/2 - 0.4 * minSide))
            return image
    }
    return images.item(0)
}

function changeCenter(){
    currentCenter.classList.remove('center')

    currentCenter = findCurrentCenter();

    currentCenter.classList.add('center')

    title.textContent = currentCenter.dataset.title
}

const handleOnMove = e => {
    if(slide.dataset.mouseDownAt === "0") return;

    changeCenter()

    const mouseDelta = parseFloat(slide.dataset.mouseDownAt) - e.clientX,
        maxDelta = images.length * (0.39 * minSide);

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(slide.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    slide.dataset.percentage = nextPercentage;

    const animation = slide.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    animation.onfinish = () => changeCenter();
}

window.onmousedown = e => handleOnDown(e);

window.onmouseup = e => handleOnUp(e);

window.onmousemove = e => handleOnMove(e);