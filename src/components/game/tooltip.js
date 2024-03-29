export function tooltip(element) {
    let div;
    let title;
    function mouseOver(event) {
        // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
        // remember to set it back on `mouseleave`
        title = element.getAttribute('title');
        element.removeAttribute('title');

        div = document.createElement('div');
        // div.textContent = title;
        div.innerHTML = title;
        div.style = `
			border: 1px solid #ddd;
			box-shadow: 1px 1px 1px #ddd;
			background: white;
			border-radius: 4px;
			padding: 4px;
			position: absolute;
			top: -50px;
			left: -50px;
            z-index: 100;
		`;
        // top: ${event.pageX + 5}px;
		// left: ${event.pageY + 5}px;
        document.body.appendChild(div);
    }
    function mouseMove(event) {
        if (div) {
            div.style.left = `${event.pageX + 5}px`;
            div.style.top = `${event.pageY + 5}px`;
        }
    }
    function mouseLeave() {
        if (div && document.body.contains(div)) {
            document.body.removeChild(div);
            // NOTE: restore the `title` attribute
            element.setAttribute('title', title);
        }
    }

    // if (element.getAttribute('title')) {
        element.addEventListener('mouseenter', mouseOver);
        // element.addEventListener('mouseover', mouseOver);
        element.addEventListener('mouseleave', mouseLeave);
        element.addEventListener('mousemove', mouseMove);
    // }
    
    return {
        destroy() {
            element.removeEventListener('mouseenter', mouseOver);
            // element.removeEventListener('mouseover', mouseOver);
            element.removeEventListener('mouseleave', mouseLeave);
            element.removeEventListener('mousemove', mouseMove);
            // Pour faire disparaitre le tooltip...
            if (div && document.body.contains(div)) {
                document.body.removeChild(div);
            }
        }
    }
}
