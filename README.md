## todo SPEC

* Auto record profit / loss
    * Store online
        * perhaps google drive api
        * Self maintain server to store in database
            * Laravel
            * Gin
                * Gin perhaps
    * Calculate by free margin change
    * Calculate when doing trade operate
        * Delete dom value change due to trade operate is not immediately.
    * Recording
        * current time
        * balance
        * profit percentage
            * since last
            * since today
            * since this month
        * trading coin
    * prevent duplicate record becuz multiple window
        * Add switch to determine if recording
        * Regard current page coin as trading coin for the recording
* Fast assign cursor price to input
    * Can't get the content of canvas
    * Possible solutions
        * Wait for trading view to implement
        * Find and modify canvas script
        * Using deep learning convert price image base on cursor position to fetch image from js
            * Possible but too slow

## Features

### Timer

Auto create a timer that show current seconds in a draggable tab.

### ATR / price percentage

Calculate current ATR / percentage in a draggable tab every 5 seconds, have to use ATR indicator to make this works, if put the cursor to past ATR plot, it will calculate the past ATR percentage but not including past price.

### Paste Bar High / Low

Paste current or history high / low price to limit input, move cursor to bar if want to paste from history bar.

* Paste High - Press 「a」
* Paste Low  - Press 「s」