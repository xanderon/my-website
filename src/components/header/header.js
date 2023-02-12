// This code is only used to remember theme selection between page loads
const themeSwitch = document.querySelector('.theme-switch');
themeSwitch.checked = localStorage.getItem('switchedTheme') === 'true';

themeSwitch.addEventListener('change', function (e) {
    console.log(`clicked`);
    if (e.currentTarget.checked === true) {
        // Save current theme state to the localStorage
        localStorage.setItem('switchedTheme', 'true');
    } else {
        // Remove theme state from localStorage if theme state is switched back to normal
        localStorage.removeItem('switchedTheme');
    }
});