document.addEventListener('DOMContentLoaded', function() {
    const hamBurger = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector("#sidebar");
    
    function adjustTable() {
        if (window.materialsTable && 
            typeof window.materialsTable.columns?.adjust === 'function') {
            setTimeout(() => {
                window.materialsTable.columns.adjust();
                if (window.materialsTable.responsive) {
                    window.materialsTable.responsive.recalc();
                }
            }, 300);
        }
    }

    hamBurger.addEventListener("click", function() {
        sidebar.classList.toggle("expand");
        adjustTable();
    });

    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("expand");
        } else {
            if (!sidebar.classList.contains("expand")) {
                sidebar.classList.add("expand");
            }
        }
        adjustTable();
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});