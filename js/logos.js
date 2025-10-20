document.addEventListener('DOMContentLoaded', function(){
        const logo = document.getElementById('logo');
        if (!logo) return;

        const idx = Math.floor(Math.random() * 26); // 0..25
        const filename = `img/logo/logo_${idx}.svg`;
        // avoid setting same src (logo.src becomes absolute URL)
        if (logo.getAttribute('src') === filename) return;
        logo.setAttribute('src', filename);

        logo.addEventListener('mouseleave', function(){
            const idx = Math.floor(Math.random() * 26); // 0..25
            const filename = `img/logo/logo_${idx}.svg`;
            // avoid setting same src (logo.src becomes absolute URL)
            if (logo.getAttribute('src') === filename) return;
            logo.setAttribute('src', filename);
        });

        logo.addEventListener('mouseenter', function(){
            const idx = Math.floor(Math.random() * 26); // 0..25
            const filename = `img/logo/logo_${idx}.svg`;
            // avoid setting same src (logo.src becomes absolute URL)
            if (logo.getAttribute('src') === filename) return;
            logo.setAttribute('src', filename);
        });
    });
