window = window.top;

window.rotate = 0;
window.cardPool = {digits: [], signs: [], specials: []};

// 打乱数组顺序的函数
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sample(array, count) {
    return shuffle(array).slice(0, count);
}

function getUniqueRandomNumbers(count, min, max) {
    // 创建一个包含从min到max的数组
    let numbers = Array.from({length: max - min + 1}, (v, k) => k + min);

    // 打乱数组顺序
    numbers = shuffle(numbers);

    // 选择前count个数
    return numbers.slice(0, count);
}

function getRandomNumbers(count, min, max) {
    let randomNumbers = [];

    for (let i = 0; i < count; i++) {
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        randomNumbers.push(randomNumber);
    }

    return randomNumbers;
}

function getRandomElementsFromList(list, count) {
    let randomElements = [];
    let listLength = list.length;

    for (let i = 0; i < count; i++) {
        let randomIndex = Math.floor(Math.random() * listLength);
        randomElements.push(list[randomIndex]);
    }

    return randomElements;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(list) {
    if (list.length === 0) {
        throw new Error("The list is empty.");
    }
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

function genCards() {
    // 从1到10中选择5个不重复的数
    return [...getUniqueRandomNumbers(5, 1, 10),
        ...getRandomElementsFromList(["+", "-"], 5)];
}

function updateUI() {
    let index = 0;
    $("#cards").empty().append(cards.你.map(item => `<div class="card" data-index="${index++}" data-value="${item}">${item}</div>`).join(''));
    $("#currentFigures [data-ref=value]").text(currentFigure);
    $("#order [data-ref=value]").text({"clockwise": "顺时针", "anticlockwise": "逆时针"}[order]);
    window.selectedSign = undefined;
    window.selectedDigit = undefined;
    window.selectedSpecial = undefined;
    if (currentPlayer !== "你") {
        $("#cards").addClass("disabled");
    } else {
        $("#cards").removeClass("disabled");
    }
    updateDiscardButton();
}

function initUI() {
    if (window.arrowAnimTimeout) clearTimeout(arrowAnimTimeout);
    $("#arrow").attr("data-value", currentPlayer);
    let newAngle = {你: 3690, p1: 3780, p2: 3870, p3: 3600}[currentPlayer];
    if (order === "anticlockwise") {
        newAngle -= 7200;
    }
    rotateArrow(newAngle, 3000);
    setTimeout(function () {
        makeDecision();

    }, 3000);
}

function rotateArrow(angle, time) {
    window.rotate += angle;

    $("#arrow").css({"transition": `${time}ms`});
    setTimeout(function () {
        $("#arrow").css({"transform": `rotate(${rotate}deg)`});
        window.arrowAnimTimeout = setTimeout(function () {
            $("#arrow").css({"transition": `0ms`});
        }, time);
    });

}

function genRandomSpecialCards() {
    const specialCards = getRandomElementsFromList(["逆转", "跳过"], 2);
    specialCards.push(...["逆转", "逆转", "跳过", "跳过"]);
    cards.你.push(specialCards.shift());
    cards.p1.push(specialCards.shift());
    cards.p2.push(specialCards.shift());
    cards.p3.push(specialCards.shift());
    for (const specialCard of specialCards) {
        cards[randomChoice(["你", "p1", "p2", "p3"])].push(specialCard);
    }
}

function startGame() {
    $("#content").show();
    $("#cover").hide();
    cards.你 = genCards();
    cards.p1 = genCards();
    cards.p2 = genCards();
    cards.p3 = genCards();
    genRandomSpecialCards();
    window.selectedSign = undefined;
    window.selectedDigit = undefined;
    window.selectedSpecial = undefined;
    window.currentFigure = randInt(70, 100);
    window.order = randomChoice(["clockwise", "anticlockwise"]);
    window.currentPlayer = randomChoice(['你', 'p1', 'p2', 'p3']);
    updateUI();
    initUI();
}

function discardNumber(player, signIndex, digitalIndex) {
    const sign = cards[player].splice(signIndex, 1)[0];
    window.cardPool.signs.push(sign);
    const digital = cards[player].splice(digitalIndex, 1)[0];
    window.cardPool.digits.push(digital);
    const number = Number(sign + digital);
    alert(`${player}出了数字：${number}`);
    window.currentFigure += number;
    afterDiscard(player);
    updateUI();
}

function discardSpecial(player, specialIndex) {
    const special = cards[player].splice(specialIndex, 1)[0];
    window.cardPool.specials.push(special);
    alert(`${player}出了特殊牌：${special}`);
    if (special === "逆转") {
        window.order = {clockwise: "anticlockwise", anticlockwise: "clockwise"}[order];
    }
    afterDiscard(player);
    updateUI();
}

function afterDiscard(player) {
    if (currentFigure === 0) {
        alert(`${player}获胜！`);
        win();
        return;
    }
    if (cards[player].length === 0) {
        reDealCards(player);
    }
    nextPlayer();
}

function getPreviousAndNext(arr, currentItem) {
    let index = arr.indexOf(currentItem);

    if (index === -1) {
        throw new Error("Item not found in the array.");
    }

    let prevIndex = (index - 1 + arr.length) % arr.length;
    let nextIndex = (index + 1) % arr.length;

    return {
        previous: arr[prevIndex],
        next: arr[nextIndex]
    };
}

function nextPlayer() {
    const previousAndNext = getPreviousAndNext(["你", "p1", "p2", "p3"], currentPlayer);
    window.currentPlayer = previousAndNext[{clockwise: "next", anticlockwise: "previous"}[order]];
    rotateArrow({clockwise: 90, anticlockwise: -90}[order], 500);
    makeDecision();
    updateUI();
}

function makeDecision() {
    updateUI();
    if (currentPlayer !== "你") {
        setTimeout(function () {
            const divided = divideArray(cards[currentPlayer]);
            if (divided.digits.length > 0 && divided.specials.length > 0) {
                if (randInt(0, 2) === 0) {
                    discardSpecial(currentPlayer, randomChoice(divided.specials));
                } else {
                    discardNumber(currentPlayer, randomChoice(divided.signs), randomChoice(divided.digits));
                }
            } else if (divided.specials.length > 0) {
                discardSpecial(currentPlayer, randomChoice(divided.specials));
            } else {
                discardNumber(currentPlayer, randomChoice(divided.signs), randomChoice(divided.digits));
            }
        }, 1000);
    }
}

function divideArray(arr) {
    let specials = [];
    let signs = [];
    let digits = [];

    for (const index in arr) {
        const value = arr[index];
        if (value === '跳过' || value === '逆转') {
            specials.push(index);
        } else if (value === '+' || value === '-') {
            signs.push(index);
        } else {
            digits.push(index);
        }
    }

    return {specials, signs, digits};
}

function reDealCards(player) {
    const newDigits = sample(cardPool.digits, 5);
    cardPool.digits = removeItemsFromArray(cardPool.digits, newDigits);
    const newSigns = sample(cardPool.signs, 5);
    cardPool.signs = removeItemsFromArray(cardPool.signs, newSigns);
    cards[player] = [...newDigits, ...newSigns];
}

function removeItemsFromArray(sourceArray, itemsToRemove) {
    // 创建一个副本，以免直接修改原数组
    let newArray = [...sourceArray];

    // 遍历 itemsToRemove 数组
    itemsToRemove.forEach(item => {
        // 找到该值在新数组中的索引
        const index = newArray.indexOf(item);

        // 如果找到了该值，使用splice方法删除该项
        if (index !== -1) {
            newArray.splice(index, 1);
        }
    });

    return newArray;
}

function win() {
    $("#cards").hide();
    $("#win").show();
}

function updateDiscardButton() {
    if (selectedSpecial || (selectedDigit && selectedSign)) {
        $("#discard").removeClass("disabled");
    } else {
        $("#discard").addClass("disabled");
    }
}

// 示例使用
const inputList = [1, 2, 3, 4, 5];
const result = getRandomElementsFromList(inputList, 10);
console.log(result);
window.cards = {};
window.currentFigure = null;
$(function () {
    $("#start").click(function () {
        startGame();
    });

    $("#cards").click(function (event) {
        if (currentPlayer !== "你") {
            alert("还没轮到你！");
            return;
        }
        const $target = $(event.target);
        if ($target.hasClass("card")) {
            const cardValue = $target.attr("data-value");
            if ($target.hasClass("selected")) {
                switch (cardValue) {
                    case "跳过":
                    case "逆转":
                        $target.removeClass("selected");
                        window.selectedSpecial = undefined;
                        break;
                    case "+":
                    case "-":
                        $target.removeClass("selected");
                        window.selectedSign = undefined;
                        break;
                    default:
                        $target.removeClass("selected");
                        window.selectedDigit = undefined;
                }
            } else {
                switch (cardValue) {
                    case "跳过":
                    case "逆转":
                        window.selectedSpecial?.removeClass("selected");
                        window.selectedSign?.removeClass("selected");
                        window.selectedDigit?.removeClass("selected");
                        $target.addClass("selected");
                        window.selectedSpecial = $target;
                        window.selectedSign = undefined;
                        window.selectedDigit = undefined;
                        break;
                    case "+":
                    case "-":
                        window.selectedSpecial?.removeClass("selected");
                        window.selectedSign?.removeClass("selected");
                        $target.addClass("selected");
                        window.selectedSpecial = undefined;
                        window.selectedSign = $target;
                        break;
                    default:
                        window.selectedSpecial?.removeClass("selected");
                        window.selectedDigit?.removeClass("selected");
                        $target.addClass("selected");
                        window.selectedSpecial = undefined;
                        window.selectedDigit = $target;
                }
            }
            updateDiscardButton();
        }
    });

    $("#discard").click(function () {
        if (window.currentPlayer !== "你") {
            alert("还没轮到你！");
            return;
        }
        if (selectedSpecial) {
            discardSpecial("你", selectedSpecial.attr("data-index"));
        } else if (selectedDigit && selectedSign) {
            discardNumber("你", selectedSign.attr("data-index"), selectedDigit.attr("data-index"));
        } else {
            alert("出牌方式不对！");
        }
    });
});