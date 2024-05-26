(function() {
    "use strict";

    const items = [
        "🍓",
        "🍋",
        "🍒",
        "🍇",
        "🍌",
        "🍑",
        "💲"
    ];

    document.querySelector('.info').textContent = items.join(" ");

    const doors = document.querySelectorAll(".door");
    const currentPotElement = document.getElementById('currentPot');
    const currentBetElement = document.getElementById('currentBet');
    let currentPot = 0;
    let currentBet = 0;

    document.querySelector("#spinner").addEventListener("click", () => {
        if (currentBet > 0) { // Check if the current bet is greater than 0
            spin();
        } else {
            Swal.fire("Oops!", "Please place a bet before spinning.", "error");
        }
    });
    
    document.querySelector("#reseter").addEventListener("click", () => init(true, 1, 0));

    document.querySelector("#addMoney").addEventListener("click", () => {
        const potMoneyInput = document.getElementById('potMoney');
        let amount = parseInt(potMoneyInput.value);
        if (!isNaN(amount)) {
            if (currentPot + amount > 100000) {
                amount = 100000 - currentPot;
            }
            currentPot += amount;
            currentPotElement.textContent = currentPot;
            potMoneyInput.value = '';
        }
    });

    document.querySelector("#allIn").addEventListener("click", () => {
        currentBet = currentPot;
        currentPot = 0;
        updatePotAndBet();
    });

    document.querySelector("#minBet").addEventListener("click", () => {
        if (currentPot >= 500) {
            currentBet = 500;
            currentPot -= 500;
            updatePotAndBet();
        } else {
            Swal.fire("Oops!", "Not enough money in the pot for the minimum bet!", "error");
        }
    });

    document.querySelector("#placeCustomBet").addEventListener("click", () => {
        const customBetInput = document.getElementById('customBet');
        let customBet = parseInt(customBetInput.value);
        if (!isNaN(customBet) && customBet >= 500) {
            if (customBet > currentPot) {
                Swal.fire("Oops!", "Not enough money in the pot for this bet!", "error");
            } else {
                currentBet = customBet;
                currentPot -= customBet;
                updatePotAndBet();
                customBetInput.value = '';
            }
        } else {
            Swal.fire("Oops!", "Custom bet must be at least 500!", "error");
        }
    });

    async function spin() {
        await init(false, 1, 2);
        for (const door of doors) {
            const boxes = door.querySelector(".boxes");
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = "translateY(0)";
            await new Promise((resolve) => setTimeout(resolve, duration * 1000));
        }
        checkWinOrLose();
    }

    async function init(firstInit = true, groups = 1, duration = 1) {
        for (const door of doors) {
            if (firstInit) {
                door.dataset.spinned = "0";
            }

            const boxes = door.querySelector(".boxes");
            const boxesClone = boxes.cloneNode(false);

            const pool = firstInit ? ["❔"] : shuffle(Array(groups).fill(items).flat());

            for (let i = pool.length - 1; i >= 0; i--) {
                const box = document.createElement("div");
                box.classList.add("box");
                box.style.width = door.clientWidth + "px";
                box.style.height = door.clientHeight + "px";
                box.textContent = pool[i];
                boxesClone.appendChild(box);
            }

            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;

            if (!firstInit) {
                boxesClone.addEventListener("transitionstart", function() {
                    door.dataset.spinned = "1";
                    this.querySelectorAll(".box").forEach((box) => {
                        box.style.filter = "blur(1px)";
                    });
                }, { once: true });

                boxesClone.addEventListener("transitionend", function() {
                    this.querySelectorAll(".box").forEach((box, index) => {
                        box.style.filter = "blur(0)";
                        if (index > 0) this.removeChild(box);
                    });
                }, { once: true });
            }

            door.replaceChild(boxesClone, boxes);
        }
    }

    function checkWinOrLose() {
        const results = [];
        for (const door of doors) {
            const box = door.querySelector(".box");
            results.push(box.textContent);
        }

        const allEqual = results.every(result => result === results[0]);
        if (currentBet === 1029) {
            // Force win if bet is 1029
            forceWin();
        } else if (allEqual) {
            Swal.fire("Congratulations!", "You win!", "success");
            currentPot += currentBet * 2;
        } else {
            Swal.fire("Sorry!", "You lose!", "error");
        }
        currentBet = 0;
        updatePotAndBet();
    }
    //Secret Bet Hihihi
    function forceWin() {
        for (const door of doors) {
            const box = door.querySelector(".box");
        }
        Swal.fire("JACKPOT!", "In 4 minutes and 11 seconds Hakari is immortal\nNah, I'd win 😏", "success");
        currentPot += currentBet * 2;
    }

    function updatePotAndBet() {
        currentPotElement.textContent = currentPot;
        currentBetElement.textContent = currentBet;
    }

    function shuffle(arr) {
        if (currentBet === 1029) {
            return items.flatMap(item => Array(arr.length / items.length).fill(item));
        } else {
            let m = arr.length;
            while (m) {
                const i = Math.floor(Math.random() * m--);
                [arr[m], arr[i]] = [arr[i], arr[m]];
            }
            return arr;
        }
    }

    init();
})();
