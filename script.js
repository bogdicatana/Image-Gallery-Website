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

for(const image of images){
    image.classList.add("default");
}


let mouseMoved = false;

window.onmousemove = e => {
    handleOnMove(e);
    mouseMoved = true;
};

window.onmousedown = e => {
    handleOnDown(e);
    mouseMoved = false;
};

window.onmouseup = e => {
    handleOnUp(e);
    if (!mouseMoved) {
        const target = e.target.closest('.image');
        if (target) {
            target.click();
        }
    }
};

for(let i = 0; i < images.length; i++){
    images[i].addEventListener('click', function(){
        if (mouseMoved) return;
        images[i].classList.add("expanded");
        slide.classList.add("expanded");
        images[i].animate({
            width: '100vw',
            height: '100vh',
            transform: `translateY(0vmin)`
        }, {duration: 1000, easing: "ease-out", fill: "forwards"});
        slide.animate({
            gap: 0,
            top: 0,
            left: 0,
            transform: `translate(0%, 0%)`
        }, {duration: 1000, easing: "ease-out", fill: "forwards"});
        title.style.zIndex = 1000;
        title.animate({
            top: '50%',
            left: '50%',
            position: 'absolute',
            transform: `translate(-50%, -50%) scale(2)`,
            opacity: 1
        }, {duration: 1000, easing: "ease-out", fill: "forwards"});
        for(let j = 0; j < images.length; j++){
            if(i !== j) images[j].classList.add("dead");
        }
    });
}