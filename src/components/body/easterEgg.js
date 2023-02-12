const easterEggs = [
    `"Clean code always looks like it was written by someone who cares."\n - Robert C. Martin`,
    `"Testing leads to failure, and failure leads to understanding."\n - Burt Rutan`,
    `"You're code shall not pass."\n - The Lord of the Review`,
    `"I'll be back."\n - The Errorminator`,
    `"Coder, I AM your father."\n - The Bug Strikes Back`,
    `"This looks like an easter egg"\n - 🥚`,
    `"Take your stinking paws off me, you damned dirty Error!"\n - Planet of the Unhandled Exceptions`,
    `"This was fun! Let's do it again"\n - The Author`
];
const easterEgg = document.getElementById('easter-egg');
let easterBasket = 0;

// Set the first easter egg when tha page is opened
easterEgg.textContent = easterEggs[easterBasket];
easterBasket++;

easterEgg.addEventListener('click', function handleClick() {
    easterEgg.textContent = easterEggs[easterBasket];
    easterBasket++;
    if (easterBasket === easterEggs.length) {
        easterBasket = 0;
    }
});