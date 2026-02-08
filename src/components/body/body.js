const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>{
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

/** Calculate how long I've been working at my current job */
// Get the current date
const currentDate = new Date();

// Set the date you started working at the job
const startDate = new Date("January 6, 2020");

// Calculate the difference between the current date and the start date
const diff = currentDate.getTime() - startDate.getTime();

// Convert the difference to a number of years and months
const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
const months = Math.floor((diff / (1000 * 60 * 60 * 24)) % 365 / 30);

// Update the contents of an HTML element with the calculated amount of time
const timeWorkedElement = document.getElementById("time-worked");
if (timeWorkedElement) {
  timeWorkedElement.innerHTML = `@Lenovo ${years} yrs and ${months} mos`;
}

// Mobile Work Experience Overlay On Touch Event

// Select all elements with the class '.my-div'
const myDivs = document.querySelectorAll('.my-div');

// Loop through all the elements with the class '.my-div'
for (let i = 0; i < myDivs.length; i++) {
  myDivs[i].addEventListener('click', function() {
    const overlay = this.querySelector('.overlay');
    overlay.classList.toggle('overlay-active');
  });

  // Add a tap event listener to each element
  myDivs[i].addEventListener('touchstart', function() {
    // Select the '.overlay' element for the element that was tapped
    const overlay = this.querySelector('.overlay');

    // Add the 'overlay-active' class to the '.overlay' element when the element is tapped
    overlay.classList.add('overlay-active');
  });

  // Add a touchend event listener to each element
  myDivs[i].addEventListener('touchend', function() {
    // Select the '.overlay' element for the element that was tapped
    const overlay = this.querySelector('.overlay');

    // Remove the 'overlay-active' class from the '.overlay' element when the element is no longer being tapped
    overlay.classList.remove('overlay-active');
  });

  myDivs[i].addEventListener('keydown', function(event) {
    const overlay = this.querySelector('.overlay');
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      overlay.classList.toggle('overlay-active');
    }

    if (event.key === 'Escape') {
      overlay.classList.remove('overlay-active');
    }
  });
}
