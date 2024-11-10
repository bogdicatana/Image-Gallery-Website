let images;

const slide = document.getElementById("imageSlide");

const title = document.getElementById("title");

const returnToSlide = document.getElementById("return");

const imageList = document.querySelector('.image-list');

let isTransitioning = false;

let minSide;
let expanded = false;

if(window.innerHeight > window.innerWidth){
    minSide = window.innerWidth;
}else{
    minSide = window.innerHeight;
}

let currentCenter;

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

function changeCenter(check = 0){
    temp = findCurrentCenter();
    if(currentCenter === temp && check === 0) return;
    if(expanded) return;

    if(currentCenter.classList.contains('center')) currentCenter.classList.remove('center');

    currentCenter = temp;

    currentCenter.classList.add('center');

    title.textContent = currentCenter.dataset.title;
}

function loadImagesGrid(){
    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            imageList.style.display = 'grid';
            const key = title.textContent.replace(/ /g, '_');
            for(const i in data[key]){
                const img = document.createElement('img');
                img.src = "resources/" + key + "/" + data[key][i];
                img.draggable = false;
                imageList.appendChild(img);
            }
        })
        .catch(error => console.error('Error loading images:', error));
}



const handleOnDown = e => slide.dataset.mouseDownAt = e.clientX;

const handleOnDownExpanded = e => slide.dataset.mouseDownAt = e.clientY;

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

const handleOnMoveExpanded = e => {
    if(slide.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(slide.dataset.mouseDownAt) - e.clientY,
        maxDelta = window.innerHeight;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(slide.dataset.prevPercentage) + percentage,
        nextPercentage = Math.min(nextPercentageUnconstrained, 0);

    slide.animate({
        transform: `translate(0%, ${nextPercentage}%)`
    }, { duration: 1200, fill: "forwards" });

    const movement = Math.max(nextPercentage/100 * maxDelta, -imageList.offsetHeight);
    
    if(movement !== -imageList.offsetHeight) slide.dataset.percentage = nextPercentage;

    imageList.animate({
        transform: `translateY(${movement}px)`
    }, { duration: 1200, fill: "forwards" });

    title.animate({
        transform: `translateY(${nextPercentage/100 * maxDelta + 0.4*maxDelta}px) scale(2)`
    }, { duration: 1200, fill: "forwards" });
}

const handleWheel = e => {
    if(slide.dataset.mouseDownAt === "0") return;

    const mouseDelta = e.deltaY,
        maxDelta = window.innerWidth;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(slide.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    slide.dataset.percentage = nextPercentage;

    const animation = slide.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    setTimeout(changeCenter, 1100)
    animation.onfinish = () => changeCenter();
}

const handleWheelExpanded = e => {
    if(slide.dataset.mouseDownAt === "0") return;

    const mouseDelta = e.deltaY,
        maxDelta = window.innerHeight;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(slide.dataset.prevPercentage) + percentage,
        nextPercentage = Math.min(nextPercentageUnconstrained, 0);

    slide.animate({
        transform: `translate(0%, ${nextPercentage}%)`
    }, { duration: 1200, fill: "forwards" });

    const movement = Math.max(nextPercentage/100 * maxDelta, -imageList.offsetHeight);
    
    if(movement !== -imageList.offsetHeight) slide.dataset.percentage = nextPercentage;

    imageList.animate({
        transform: `translateY(${movement}px)`
    }, { duration: 1200, fill: "forwards" });

    title.animate({
        transform: `translateY(${nextPercentage/100 * maxDelta + 0.4*maxDelta}px) scale(2)`
    }, { duration: 1200, fill: "forwards" });
}

let mouseMoved = false;

function enableEvents(){
    expanded = false;
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

    window.onwheel = e => {
        slide.dataset.mouseDownAt = e.clientX;
        handleWheel(e);
        slide.dataset.mouseDownAt = "0";  
        slide.dataset.prevPercentage = slide.dataset.percentage;
    };

    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('click', handleImageClick, { passive: true });
    }
}

function disableEvents() {
    slide.dataset.prevPercentage = 0;
    expanded = true;
    window.onmousemove = e =>{
        handleOnMoveExpanded(e);
        mouseMoved= true;
    };
    window.onwheel = e =>{
        slide.dataset.mouseDownAt = e.clientY;
        handleWheelExpanded(e);
        slide.dataset.mouseDownAt = "0";  
        slide.dataset.prevPercentage = slide.dataset.percentage;
    };
    window.onmousedown = e => {
        handleOnDownExpanded(e);
        mouseMoved = false;
    };
    for (let i = 0; i < images.length; i++) {
        images[i].removeEventListener('click', handleImageClick);
    }
    loadImagesGrid();
}

function handleImageClick(e) {
    if (mouseMoved) return;
    slide.dataset.prevPercentageUnexpanded = slide.dataset.prevPercentage;
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
    imageList.animate({
        transform: `translateY(100%)`
    }, { duration: 1000, fill: "forwards" }).onfinish = () => {
        imageList.style.display = 'none';
        while (imageList.firstChild) {
            imageList.removeChild(imageList.firstChild);
        }
    };
    currentCenter.classList.remove('center');
    for(const image of images){
        if(image.classList.contains("expanded")) image.classList.remove("expanded");
        else if(image.classList.contains("dead")) image.classList.remove("dead");
    }
    returnToSlide.classList.remove("expanded");

    if(slide.dataset.prevPercentageUnexpanded === "undefined") slide.dataset.prevPercentageUnexpanded = 0;
    slide.dataset.prevPercentage = slide.dataset.prevPercentageUnexpanded;
    slide.dataset.percentage = slide.dataset.prevPercentageUnexpanded;
    percent = slide.dataset.prevPercentageUnexpanded;

    slide.animate({
        gap: '1vmin',
        top: '50%',
        left: '50%',
        transform: `translate(${percent}%, -50%)`
    }, { duration: 1000, easing: "ease-in", fill: "forwards" });

    const animateTitle = title.animate({
        transform: `translateY(0vh) scale(1)`
    }, { duration: 1000, easing: "ease-in", fill: "forwards" });
    animateTitle.onfinish = () => {
        enableEvents();
        changeCenter(1);
    };
}

function initialize(){
    images = document.querySelectorAll(".image");

    currentCenter = findCurrentCenter();
    currentCenter.classList.add('center');
    title.textContent = currentCenter.dataset.title;
    enableEvents();
    returnToSlide.addEventListener('click', handleReturn);
}

function loadImages(){
    fetch('images.json')
        .then(response => response.json())
        .then(data => {
            for(const key in data){
                const img = document.createElement('img');
                img.src = "resources/" + key + "/" + data[key][0];
                img.dataset.title = key.replace(/_/g, ' ');
                img.classList.add('image');
                img.draggable = false;
                slide.appendChild(img);
            }
            initialize();
        })
        .catch(error => console.error('Error loading images:', error));
}

loadImages();