// Debouncing an input:
//  debouncing circuit removes the resulting ripple signal, and provides a clean transition at 
//  its output.
//  in practice, we wait for some time to pass after the last event to actually do something.

const debounce = (fn, delay=1000) => {
    let timeoutID;
    return function (...args) {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};
