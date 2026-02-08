const themeSwitch = document.querySelector('.theme-switch');
const portrait = document.getElementById('portrait');
const lightPortrait = '/static/portrait-light-xxxxs.jpg';
const darkPortrait = '/static/portrait-dark-xxxxs.jpg';

const applyThemeAssets = (isDarkTheme) => {
    if (portrait) {
        portrait.setAttribute('src', isDarkTheme ? darkPortrait : lightPortrait);
    }
};

if (themeSwitch) {
    const savedTheme = localStorage.getItem('switchedTheme') === 'true';
    themeSwitch.checked = savedTheme;
    applyThemeAssets(savedTheme);

    themeSwitch.addEventListener('change', (e) => {
        const isDarkTheme = e.currentTarget.checked;

        if (isDarkTheme) {
            localStorage.setItem('switchedTheme', 'true');
        } else {
            localStorage.removeItem('switchedTheme');
        }

        applyThemeAssets(isDarkTheme);
    });
}
