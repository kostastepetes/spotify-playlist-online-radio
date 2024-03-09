gsap.registerPlugin(ScrollTrigger);
window.addEventListener("load", function () {
    const slides = gsap.utils.toArray(".slide");
    const activeSlideImages = gsap.utils.toArray(".active-slide img");

    function getInitialTranslateZ(slide) {
        const style = window.getComputedStyle(slide);
        const matrix = style.transform.match(/^matrix3d\((.+)\)/);
        if (matrix) {
            const values = matrix[1].split(", ");
            return parseFloat(values[14] || 0);
        }
        return 0;
    }

    function mapRange(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    slides.forEach((slide, index) => {
        const initialZ = getInitialTranslateZ(slide);

        ScrollTrigger.create({
            trigger: ".container",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const zIncrement = progress * 22500;
                const currentZ = initialZ + zIncrement;
                
                let opacity;

                if (currentZ > -2500) {
                    opacity = mapRange(currentZ, -2500, 0, 0.5, 1);
                } else {
                    opacity = mapRange(currentZ, -5000, -2500, 0, 0.5);
                }

                slide.style.opacity = opacity;

                slide.style.transform = `translateX(-50%) translateY(-50%) translateZ(${currentZ}px)`;

                if (currentZ < 100){
                    gsap.to(activeSlideImages[index], 1.5, {
                        opacity: 1,
                        ease: "power3.out"
                    });
                } else {
                    gsap.to(activeSlideImages[index], 1.5, {
                        opacity: 0,
                        ease: "power3.out"
                    });
                }
            }
        });
    });
});