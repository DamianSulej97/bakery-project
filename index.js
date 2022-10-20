const progressBar = document.querySelector("#my-progress");
const doughmakerButton = document.querySelector("#dough-button");
const velocity = 0.3;
const doughCounter = document.querySelector("#dough-counter");
const flourCounter = document.querySelector("#flour-counter");
const noFlour = document.querySelector("#low-flour");
const doughList = document.querySelector(".dough-list");
const cookieCounter = document.querySelector("#cookie-counter");
const cookieButton = document.querySelector("#cookie-button");
const ovenCounter = document.querySelector("#oven-counter");
const oven = document.querySelector("#oven");
const readyCookieCounter = document.querySelector("#ready-cookie");
const plnCounter = document.querySelector('#pln');

// Preparing application state
let isForming = false;
let formingProgress = 0;
let lastUpdateTime = Date.now();
let numberOfDough = 0;
let numberOfFlour = 100;
let flourInHand = false;
let numberOfCookies = 0;
let cookiesInOven = 0;
let readyCookies = 0;
let plnAmount = 0;

// Update screen
function update() {
  const now = Date.now();
  const elapsedTime = now - lastUpdateTime;
  lastUpdateTime = now;

  if (!flourInHand && numberOfFlour >= 10 && isForming) {
    numberOfFlour -= 10;
    flourInHand = true;
    flourCounter.textContent = numberOfFlour + 'kg';
  }
  
  if (isForming === true && flourInHand) {
    // Update distance only if acceleration is on
    formingProgress += velocity * elapsedTime;
    progressBar.style.width = formingProgress + "%";
    doughmakerButton.textContent = "Zatrzymaj lepienie";
  } else {
    doughmakerButton.textContent = "Ulep ciacho";
  }

  if (formingProgress >= 100) {
    numberOfDough++;
    const doughBall = document.createElement("li");
    doughList.append(doughBall);
    let doughWidth = 50
    let doughHeight = 50
    doughBall.addEventListener("click", () => {

      function makeCookie() {
        numberOfCookies++;
        let x = doughWidth -= 5
        let y = doughHeight -=5
        doughBall.style.width = x + "px";
        doughBall.style.height = y + "px";
        cookieCounter.textContent = numberOfCookies;
        if (x === 0 && y === 0) {
          numberOfDough--;
          doughList.removeChild(doughBall);
          doughCounter.textContent = numberOfDough;
        }
      }
      
      makeCookie();

    });
    doughBall.classList.add("dough-ball");
    doughCounter.textContent = numberOfDough;
    formingProgress = 0;
    flourInHand = false;
  }
  
  if (numberOfFlour <= 9 && flourInHand === false) {
    noFlour.textContent = "Za mało mąki!";
  }

  // Automatically schedule next update call when the browser
  // is ready to update the screen (every ~16ms = 60FPS (Frames Per Second))
  requestAnimationFrame(update);
}

cookieButton.addEventListener("click", () => {
	if (numberOfCookies > 0 && cookiesInOven < 9 && cookiesInOven >= 0) { 
	  numberOfCookies--;
	  cookieCounter.textContent = numberOfCookies;
	  cookiesInOven++;
	  ovenCounter.textContent = cookiesInOven;
    const cookie = document.createElement("div");
    oven.append(cookie);
    cookie.classList.add("cookie-icon");
    
    function changeCookieColor(color) {
      cookie.style.backgroundColor = color;
    };

    function removeCookie() {
      cookie.remove();
      cookiesInOven--;
      ovenCounter.textContent = cookiesInOven;
    };

    const timeouts = [setTimeout(changeCookieColor, 3000, "orange"),
                      setTimeout(changeCookieColor, 6000, "brown"),
                      setTimeout(changeCookieColor, 9000, "black"),
                      setTimeout(removeCookie, 12000)]

    cookie.addEventListener("click", () => {
      if (cookie.style.backgroundColor === "brown") {
        readyCookies++; 
        readyCookieCounter.textContent = readyCookies;
        removeCookie()
      } else if (cookie.style.backgroundColor !== "brown") {
        removeCookie()
      }
      timeouts.forEach((id) => clearTimeout(id));
    });

	} else if (cookiesInOven === 9) {
    window.alert("Piec jest pełen.");
	} else if (numberOfCookies === 0 && cookiesInOven != 9) {
	  window.alert("Robiliśmy co w naszej mocy, ale mamy za mało ciastek.");
  };
});

// Starting sceen updates
update();

// Adding event listeners
doughmakerButton.addEventListener("click", () => {  
  isForming = !isForming;
});

const fireRandomTimeout = () => {
  // plnCounter.textContent = plnAmount
  const delay = Math.floor((Math.random() * 3000) + 3000);

  setTimeout(() => {
    const min = 1
    const max = 10;
    let plnArray = [];
    let x = readyCookies * 5;
    
    const random = Math.floor(Math.random() * (max - min)) + min;
    readyCookies = Math.max(readyCookies - random, 0);  
     if (readyCookies > 0) {
      plnCounter.textContent = x;
    }
    readyCookieCounter.textContent = readyCookies;
    // if (readyCookies > 0) {
    //   plnCounter.textContent = readyCookies * 5;
    // }
    fireRandomTimeout();
  }, delay);
}

fireRandomTimeout();
