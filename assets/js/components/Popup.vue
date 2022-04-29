<template>
    <div>
        <el-form>
            <el-form-item :label="'Second: ' + currentSecond">
                <el-button type="Success" @click="currentTabShowSecond">To current tab</el-button>
            </el-form-item>
            <el-form-item label="ATRs">
                <el-button type="primary" @click="ATRs.push(ATRData())">Add</el-button>
            </el-form-item>
            <template v-for="(atr, index) in ATRs">
                <el-form-item :label="getATRPercentage(atr.mixed)">
                    <br>
                    <el-form-item label="Name">
                        <el-input v-model="atr.name">Name</el-input>
                    </el-form-item>
                    <el-form-item label="ATR/currentPrize">
                        <el-input v-model="atr.mixed">ATR/currentPrize</el-input>
                    </el-form-item>
                </el-form-item>
            </template>
        </el-form>
    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data() {
            return {
                ATRs: [this.ATRData()],
                currentSecond: '',
            }
        },
        methods: {
            ATRData() {
                return {
                    name: null,
                    mixed: '',
                };
            },
            getATRPercentage(mixed) {
                let match = mixed.match(/(.+)(\/)(.+)/);
                if (!match) {
                    return '-';
                }

                let atr   = match[1];
                let price = match[3];

                return (atr / price * 100).toFixed(2) + ' %';
            },
            syncSecond() {
                setInterval(() => {
                    this.currentSecond = moment().format("ss");
                }, 1000);
            },
            currentTabShowSecond() {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: () => {
                            let display = document.createElement('div');
                            display.width = '50px';
                            display.height = '50px';
                            display.id = 'chrome-extension-trading-tool-foreground-display';
                            display.style.zIndex  = 999999999999999;

                            setInterval(() => {
                                display.innerText = 'current second: ' + (new Date()).getSeconds();
                            }, 1000);

                            draggable(display, 10, 0);
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

                            document.querySelector('body').appendChild(display);
                        },
                    }, (results) => {});
                })

            },
        },
        created() {
            this.syncSecond();
        }
    }
</script>
