// Hero terminal typing effect and route map scroll reveal.
// Everything is fully visible without JS; this script hides pieces and
// replays them, so a script failure can never blank the page.
(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- terminal typing ----------
    var term = document.getElementById("hero-terminal");
    var alreadyPlayed = false;
    try {
        alreadyPlayed = sessionStorage.getItem("hero-typed") === "1";
    } catch (e) {
        // Storage can be unavailable in private browsing; just replay.
    }

    if (term && !reduceMotion && !alreadyPlayed) {
        var body = term.querySelector(".term-body");
        var steps = Array.prototype.slice.call(body.children);

        // visibility (not display) keeps the terminal's height stable.
        steps.forEach(function (el) { el.classList.add("term-hidden"); });

        var i = 0;

        var next = function () {
            if (i >= steps.length) {
                try { sessionStorage.setItem("hero-typed", "1"); } catch (e) {}
                return;
            }
            var el = steps[i++];
            el.classList.remove("term-hidden");

            var cmd = el.querySelector ? el.querySelector(".term-cmd") : null;
            if (cmd) {
                var full = cmd.textContent;
                cmd.textContent = "";
                cmd.classList.add("typing");
                var j = 0;
                var ticker = setInterval(function () {
                    j += 1;
                    cmd.textContent = full.slice(0, j);
                    if (j >= full.length) {
                        clearInterval(ticker);
                        setTimeout(function () {
                            cmd.classList.remove("typing");
                            next();
                        }, 200);
                    }
                }, 45);
            } else {
                // Output blocks and the final prompt appear after a short beat,
                // like a command finishing.
                setTimeout(next, el.classList.contains("term-out") ? 340 : 220);
            }
        };

        setTimeout(next, 350);
    }

    // ---------- route map reveal ----------
    var map = document.querySelector(".route-map");
    if (map && !reduceMotion && "IntersectionObserver" in window) {
        document.documentElement.classList.add("js-anim");
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    map.classList.add("map-in");
                    io.disconnect();
                }
            });
        }, { threshold: 0.25 });
        io.observe(map);
    }
})();
