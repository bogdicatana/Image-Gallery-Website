const images = document.querySelectorAll(".image");

const slide = document.getElementById("imageSlide");

const title = document.getElementById("title");

const returnToSlide = document.getElementById("return");

let minSide;

if(window.innerHeight > window.innerWidth){
    minSide = window.innerWidth;
}else{
    minSide = window.innerHeight;
}

let currentCenter = findCurrentCenter();

// let titleUp = () => title.animate({
//     transform : `translateY(-10vh)`
// }, { duration: 100, easing:"ease-out", fill: "forwards" });
// let titleDown = () => title.animate({
//     transform : `translateY(0vh)`
// }, { duration: 100, fill: "forwards" });

currentCenter.classList.add('center');

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

    // titleUp().play();
    // titleUp().onfinish = () => {
    //     title.textContent = currentCenter.dataset.title;
    //     titleDown().play();
    // }
}



const handleOnDown = e => slide.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    slide.dataset.mouseDownAt = "0";  
    slide.dataset.prevPercentage = slide.dataset.percentage;
}

const handleOnMove = e => {
    if(slide.dataset.mouseDownAt === "0") return;

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

function enableEvents(){
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

    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('click', handleImageClick, { passive: true });
    }
}

function disableEvents() {
    window.onmousemove = null;
    window.onmousedown = null;
    window.onmouseup = null;
    for (let i = 0; i < images.length; i++) {
        images[i].removeEventListener('click', handleImageClick);
    }
}

function handleImageClick(e) {
    if (mouseMoved) return;
    const image = e.currentTarget;
    image.classList.add("expanded");
    returnToSlide.classList.add("expanded");
    slide.animate({
        gap: 0,
        top: 0,
        left: 0,
        transform: `translate(0%, 0%)`
    }, { duration: 1000, easing: "ease-out", fill: "forwards" });
    title.textContent = image.dataset.title;
    title.animate({
        transform: `translateY(40vh) scale(2)`
    }, { duration: 1000, easing: "ease-out", fill: "forwards" });
    for (let j = 0; j < images.length; j++) {
        if (image !== images[j]) images[j].classList.add('dead');
    }
    disableEvents();
}

function handleReturn(e){
    for(const image of images){
        if(image.classList.contains("expanded")) image.classList.remove("expanded");
        else if(image.classList.contains("dead")) image.classList.remove("dead");
    }
    returnToSlide.classList.remove("expanded");
    if(slide.dataset.prevPercentage === "undefined") slide.dataset.prevPercentage = 0;
    percent = slide.dataset.prevPercentage;
    slide.animate({
        gap: '1vmin',
        top: '50%',
        left: '50%',
        transform: `translate(${percent}%, -50%)`
    }, { duration: 1000, easing: "ease-in", fill: "forwards" });
    const animateTitle = title.animate({
        transform: `translateY(0vh) scale(1)`
    }, { duration: 1000, easing: "ease-in", fill: "forwards" });
    animateTitle.onfinish = () => changeCenter();
    enableEvents();
}

enableEvents();

returnToSlide.addEventListener('click', handleReturn);