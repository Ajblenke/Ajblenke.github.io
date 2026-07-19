// Hero terminal typing effect and route map scroll reveal.
// Everything is fully visible without JS; this script hides pieces and
// replays them, so a script failure can never blank the page.
(function () {
    "use strict";

    // Typing pace, all in milliseconds. Raise numbers to slow it down.
    var SPEED = {
        startDelay: 600,   // wait before the first prompt line appears
        charBase: 85,      // minimum time per typed character
        charJitter: 45,    // extra random time per character, for a human feel
        afterCommand: 350, // pause after a command finishes typing
        lineDelay: 140,    // gap between output lines printing
        afterOutput: 600   // pause after an output block appears
    };

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
        // Output lines are hidden individually too, so they can print
        // one at a time.
        steps.forEach(function (el) {
            el.classList.add("term-hidden");
            Array.prototype.forEach.call(
                el.querySelectorAll("h1, p, li"),
                function (line) { line.classList.add("term-hidden"); }
            );
        });

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
                var typeChar = function () {
                    j += 1;
                    cmd.textContent = full.slice(0, j);
                    if (j < full.length) {
                        setTimeout(typeChar, SPEED.charBase + Math.random() * SPEED.charJitter);
                    } else {
                        setTimeout(function () {
                            cmd.classList.remove("typing");
                            next();
                        }, SPEED.afterCommand);
                    }
                };
                setTimeout(typeChar, SPEED.charBase);
            } else if (el.classList.contains("term-out")) {
                // Output lines print one after another, like real output
                // streaming in, then the usual pause before the next command.
                var lines = el.querySelectorAll("h1, p, li");
                var k = 0;
                var printLine = function () {
                    if (k < lines.length) {
                        lines[k].classList.remove("term-hidden");
                        k += 1;
                        setTimeout(printLine, SPEED.lineDelay);
                    } else {
                        setTimeout(next, SPEED.afterOutput);
                    }
                };
                printLine();
            } else {
                // The final prompt appears after a beat, like a command
                // finishing.
                setTimeout(next, SPEED.afterCommand);
            }
        };

        setTimeout(next, SPEED.startDelay);
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
