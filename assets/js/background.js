function getDomain(url) {
    return url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
}

let targetDomain = getDomain('https://www.binance.com/zh-TW');

chrome.webNavigation.onCompleted.addListener(
    (tab) => {
        if (targetDomain !== getDomain(tab.url) ) {
            return;
        }

        chrome.scripting.executeScript({
            target: { tabId: tab.tabId },
            func: () => {
                function createDraggableATR() {
                    let display = document.createElement('div');
                    display.width = '50px';
                    display.height = '50px';
                    display.id = 'chrome-extension-trading-tool-foreground-display';
                    display.style.zIndex  = 999999999999999;

                    setInterval(() => {
                        display.innerHTML = '<span style="pointer-events: none; user-select: none;">current second: ' + (new Date()).getSeconds() + '</span>';
                    }, 1000);

                    draggable(display, 90, 20);
                    document.querySelector('body').appendChild(display);
                }

                function draggable(element, topPercentage, leftPercentage) {
                    let originTop = window.innerHeight * topPercentage / 100;
                    let originLeft = window.innerHeight * leftPercentage / 100;
                    let isMouseDown = false;

                    element.style.position = 'fixed';
                    element.style.top = originTop + 'px';
                    element.style.left = originLeft + 'px';
                    element.style.padding = '20px';
                    element.style.backgroundColor = 'white';

                    var mouseX;
                    var mouseY;
                    var elementX = originLeft;
                    var elementY = originTop;

                    element.addEventListener('mousedown', onMouseDown);
                    function onMouseDown(event) {
                        mouseX = event.clientX;
                        mouseY = event.clientY;
                        isMouseDown = true;
                    }

                    element.addEventListener('mouseup', onMouseUp);

                    function onMouseUp(event) {
                        isMouseDown = false;
                        elementX = parseInt(element.style.left) || 0;
                        elementY = parseInt(element.style.top) || 0;
                    }

                    document.addEventListener('mousemove', onMouseMove);

                    function onMouseMove(event) {
                        if (!isMouseDown) return;
                        var deltaX = event.clientX - mouseX;
                        var deltaY = event.clientY - mouseY;
                        element.style.left = elementX + deltaX + 'px';
                        element.style.top = elementY + deltaY + 'px';
                    }
                }

                function getTradingView() {
                    let iframe  = document.querySelectorAll('[id^=tradingview]')[0];
                    // console.log(iframe.contentWindow.document.querySelectorAll('canvas'));
                    if (!iframe) {
                        return false;
                    }

                    tradingView = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;

                    return true;
                }

                function getATRPercentage(atr, price) {
                    if (!atr || !price) {
                        return '-';
                    }

                    if (typeof atr === 'string') {
                        atr = atr.replace(',', '');
                    }

                    if (typeof price === 'string') {
                        price = price.replace(',', '');
                    }

                    atr = parseFloat(atr);
                    price = parseFloat(price);

                    return (atr / price * 100).toFixed(2) + ' %';
                }

                function createATR() {
                    setTimeout(() => {
                        let display = document.createElement('div');
                        display.width = '50px';
                        display.height = '50px';
                        display.id = 'chrome-extension-trading-tool-foreground-display-atr';
                        display.style.zIndex  = 999999999999999;
                        let divs = tradingView.querySelectorAll('div[data-name="legend-source-title"]');
                        let contractPrice = document.getElementsByClassName('contractPrice')[0];
                        let targetDiv;
                        divs.forEach(div => {
                            if (div.innerText === 'ATR') {
                                targetDiv = div.parentNode.parentNode.parentNode.querySelectorAll('div[class^="valueValue"]')[0];
                            }
                        });

                        display.innerHTML = '<span style="pointer-events: none; user-select: none;">' +
                            'current atr / price : ' + getATRPercentage(targetDiv.innerText, contractPrice.innerText) +
                        '</span>';

                        setInterval(() => {
                            display.innerHTML = '<span style="pointer-events: none; user-select: none;">' +
                                'current atr / price : ' + getATRPercentage(targetDiv.innerText, contractPrice.innerText) +
                            '</span>';
                        }, 5000);

                        draggable(display, 90, 40);
                        document.querySelector('body').appendChild(display);
                    }, 2000);
                }

                function createPriceSync() {
                    tradingView.onkeydown = (event) => {
                        switch (event.key) {
                            case 'a':
                                syncCurrentBarToTradeInput('high');
                                break;
                            case 's':
                                syncCurrentBarToTradeInput('low');
                                break;
                        }
                    }
                }

                function syncCurrentBarToTradeInput(type) {
                    let searchText;
                    switch (type) {
                        case 'high':
                            searchText = '高=';
                            break;
                        case 'low':
                            searchText = '低=';
                            break;
                        default:
                            return;
                    }

                    let divs = tradingView.querySelectorAll('div[class^="valueTitle"]');
                    let targetDiv;
                    divs.forEach(div => {
                        if (div.innerText === searchText) {
                            targetDiv = div.parentNode.querySelectorAll('div[class^="valueValue"]')[0];
                        }
                    });

                    let input = document.querySelectorAll('input[id^="limitPrice"]')[0];
                    if (input) {
                        input.value = targetDiv.innerText;
                    }
                }

                function alertUser(message = 'system error') {
                    alert(message);
                }

                let tradingView;
                let checkElement = document.getElementById('chrome-extension-trading-tool-foreground-display');
                if (!checkElement) {
                    createDraggableATR();
                }

                if (getTradingView()) {
                    let checkElement = document.getElementById('chrome-extension-trading-tool-foreground-display-atr');
                    if (!checkElement) {
                        createATR();
                    }

                    if(!document.getElementById('chrome-extension-trading-tool-foreground-display-price-sync')) {
                        createPriceSync();
                    }
                }
            },
        }, (results) => {
        });
    }
);