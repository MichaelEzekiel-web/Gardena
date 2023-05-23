const timeCoverter = {
    toMS(originalDuration) {
    if (typeof originalDuration !== 'string') return 0
    const duration = originalDuration.replace(/[A-Za-z]/g, "")
    if(originalDuration.includes("ms")) return parseInt(duration)
    if(originalDuration.includes("s")) return parseInt(parseFloat(duration) * 1000)
    return 0
    } }

const isDesktop = () => window.innerWidth > 992

class Slider {
constructor(element, config = {}) {
if(element instanceof Element) this._element = element
else if(typeof element === 'string') this._element = document.querySelector(element) 
else throw new Error('Slider constructor requires an element or selector')

this._config = typeof config === 'object' ? config : {}
this._init()
}

_init() {
this._getContainer()
this._getListItem()
if(this._totalItem === 0) return
this._setupItem()
this._getTransitionItem()
if(this._config.autoplay) this._startAutoplay()
}

_getContainer() {
this._container = this._element.querySelector(".slider-list")
this._containerGap = getComputedStyle(this._container).gap
if(this._config.reverse) this._container.style.justifyContent = "end"
}

_getListItem() {
this._sliderItems = this._container.querySelectorAll('.slider-item')
this._totalItem = this._sliderItems.length
}

_setupItem() {
if(this._totalItem === 1) {
  this._container.style.gridAutoColumns = "100%"
  this._container.appendChild(this._sliderItems[0].cloneNode(true))
  this._sliderItems = this._element.querySelectorAll('.slider-item')
  this._totalItem = this._sliderItems.length
}
if(this._totalItem === 2) this._container.style.gridAutoColumns = "100%"
if(!isDesktop()) return
if(this._totalItem === 3) this._container.style.gridAutoColumns = "50%"
if(this._totalItem === 4) this._container.style.gridAutoColumns = "33.33333333%"
if(this._totalItem >= 5) this._container.style.gridAutoColumns = "25%"
}

_getTransitionItem() {
this._originalTransitionDuration = getComputedStyle(this._container).transitionDuration
this._transitionDuration = timeCoverter.toMS(this._originalTransitionDuration) ?? 0
}

update() {
this._getListItem()
this._setupItem()
}

_startAutoplay() {
const repeat = (direction = null) => {
  this._move().then(() => {
    repeat()
  })
}
repeat()
}

_move(direction = null) {
const resetTime = 20
setTimeout(() => {
  this._container.style.transitionDuration = this._originalTransitionDuration
  if(this._config.reverse || direction === 'prev') {
    this._container.style.transform = `translateX(calc(${this._sliderItems[0]?.offsetWidth}px + ${this._containerGap}))`
  } else {
    this._container.style.transform = `translateX(calc(-${this._sliderItems[0]?.offsetWidth}px - ${this._containerGap}))`
  }
}, resetTime)
return new Promise(resolve => {
  this._swap(direction)
  setTimeout(() => {
    this._container.style.transitionDuration = "0s"
    this._container.style.transform = `translateX(0px)`
    this._pause = false
    resolve(true)
  }, this._transitionDuration)
})
}

_swap(direction = null) {
if(this._config.reverse || direction === 'prev') {
  const firstChild = this._sliderItems[0]
  const lastChild = this._sliderItems[this._totalItem - 1]
  this._container.insertBefore(lastChild, firstChild)
  this.update()
} else {
  this.update()
  const firstChild = this._sliderItems[0]
  this._container.removeChild(firstChild)
  this._container.appendChild(firstChild)
}
}
}

const slider = new Slider('.slider', {
autoplay: true,
reverse: true
})

document.addEventListener("click", function(e) {
if(!e.target.matches('[data-toggle="slider-action"]')) return
if(!e.target.matches('[data-direction]')) return
const direction = e.target.dataset.direction
// if(direction === "next") slider.next()
// if(direction === "prev") slider.prev()
})


// HEADER ***

const menuOpen = document.querySelector('.menuOpen');
const menuIcon = document.querySelector('.menu');
const dropdownMenu = document.querySelector('.dropdownMenu');

menuOpen.onclick = function () {
  dropdownMenu.classList.toggle('open')
  const isOpen = dropdownMenu.classList.contains('open')

  menuIcon.classList = isOpen ? '.menuClose img' : '.menuOpen img'
}


// Tabs Box ***

const catergoriesBox = document.querySelector(".catergoriesList"),
allTags = catergoriesBox.querySelectorAll(".tag"),
arrowIcons = document.querySelectorAll(".icon img");

let isDragging = false;

const handleIcons = (scrollVal) => {
  let maxScrollableWidth = catergoriesBox.scrollWidth - catergoriesBox.clientWidth;
  arrowIcons[0].parentElement.style.display = scrollVal <= 0 ? "none" : "flex";
  arrowIcons[1].parentElement.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex";
};

arrowIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // if clicked icon is left, reduce 350 from catergoriesBox scrollLeft else add
    let scrollWidth = (catergoriesBox.scrollLeft += icon.id === "left" ? -340 : 340);
    handleIcons(scrollWidth);
  });
});

allTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    catergoriesBox.querySelector(".active").classList.remove("active");
    tag.classList.add("active");
  });
});

const dragging = (e) => {
  if (!isDragging) return;
  catergoriesBox.classList.add("dragging");
  catergoriesBox.scrollLeft -= e.movementX;
  handleIcons(catergoriesBox.scrollLeft);
};

const dragStop = () => {
  isDragging = false;
  catergoriesBox.classList.remove("dragging");
};

catergoriesBox.addEventListener("mousedown", () => (isDragging = true));
catergoriesBox.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

/* ------------------------ Watermark (Please Ignore) ----------------------- */
const createSVG = (width, height, className, childType, childAttributes) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const child = document.createElementNS(
    "http://www.w3.org/2000/svg",
    childType
  );

  for (const attr in childAttributes) {
    child.setAttribute(attr, childAttributes[attr]);
  }

  svg.appendChild(child);

  return { svg, child };
};

document.querySelectorAll(".generate-button").forEach((button) => {
  const width = button.offsetWidth;
  const height = button.offsetHeight;

  const style = getComputedStyle(button);

  const strokeGroup = document.createElement("div");
  strokeGroup.classList.add("stroke");

  const { svg: stroke } = createSVG(width, height, "stroke-line", "rect", {
    x: "0",
    y: "0",
    width: "100%",
    height: "100%",
    rx: parseInt(style.borderRadius, 10),
    ry: parseInt(style.borderRadius, 10),
    pathLength: "30"
  });

  strokeGroup.appendChild(stroke);
  button.appendChild(strokeGroup);

  const stars = gsap.to(button, {
    repeat: -1,
    repeatDelay: 0.5,
    paused: true,
    keyframes: [
      {
        "--generate-button-star-2-scale": ".5",
        "--generate-button-star-2-opacity": ".25",
        "--generate-button-star-3-scale": "1.25",
        "--generate-button-star-3-opacity": "1",
        duration: 0.3
      },
      {
        "--generate-button-star-1-scale": "1.5",
        "--generate-button-star-1-opacity": ".5",
        "--generate-button-star-2-scale": ".5",
        "--generate-button-star-3-scale": "1",
        "--generate-button-star-3-opacity": ".5",
        duration: 0.3
      },
      {
        "--generate-button-star-1-scale": "1",
        "--generate-button-star-1-opacity": ".25",
        "--generate-button-star-2-scale": "1.15",
        "--generate-button-star-2-opacity": "1",
        duration: 0.3
      },
      {
        "--generate-button-star-2-scale": "1",
        duration: 0.35
      }
    ]
  });

  button.addEventListener("pointerenter", () => {
    gsap.to(button, {
      "--generate-button-dots-opacity": "1",
      duration: 0.5,
      onStart: () => {
        setTimeout(() => stars.restart().play(), 500);
      }
    });
  });

  button.addEventListener("pointerleave", () => {
    gsap.to(button, {
      "--generate-button-dots-opacity": "0",
      "--generate-button-star-1-opacity": ".25",
      "--generate-button-star-1-scale": "1",
      "--generate-button-star-2-opacity": "1",
      "--generate-button-star-2-scale": "1",
      "--generate-button-star-3-opacity": ".5",
      "--generate-button-star-3-scale": "1",
      duration: 0.15,
      onComplete: () => {
        stars.pause();
      }
    });
  });
});
