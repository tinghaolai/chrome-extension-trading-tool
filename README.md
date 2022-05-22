## todo SPEC

* Auto record profit / loss
    * Store online
        * perhaps google drive api
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


## Features

### Timer

Auto create a timer that show current seconds in a draggable tab.

### ATR / price percentage

Calculate current ATR / percentage in a draggable tab every 5 seconds, have to use ATR indicator to make this works, if put the cursor to past ATR plot, it will calculate the past ATR percentage but not including past price.