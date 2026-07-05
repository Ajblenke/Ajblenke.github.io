// Light/dark toggle. The inline script in the layout applies the saved theme
// before first paint; this only handles the button.
(function () {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
        var root = document.documentElement;
        var dark = root.dataset.theme === "dark";
        if (dark) {
            delete root.dataset.theme;
        } else {
            root.dataset.theme = "dark";
        }
        localStorage.setItem("theme", dark ? "light" : "dark");
    });
})();
