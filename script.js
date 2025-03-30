document.addEventListener('DOMContentLoaded', function () {
    // Title typing effect
    const title = document.querySelector('#main-title');
    let titleText = 'Mathematical Resources Sharing';
    let titleIndex = 0;

    function typeTitle() {
        if (titleIndex < titleText.length) {
            title.innerHTML += titleText.charAt(titleIndex);
            titleIndex++;
            setTimeout(typeTitle, 100); // Typing speed control
        }
    }

    // Trigger title typing effect on load
    typeTitle();

    // Ensure that the background fills the whole page
    const body = document.querySelector('body');
    const html = document.querySelector('html');
    
    // Set the background color to a gradient that fills the entire page
    body.style.height = "100%";
    html.style.height = "100%";
    body.style.background = "linear-gradient(135deg, #FFB6C1, #FFC0CB, #DDA0DD)"; // Soft pink gradient background
    
    // Make sure the body has no margin
    body.style.margin = "0";
});
