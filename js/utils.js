function debounce(func, wait,immediate) {
    let timerout;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timerout)
        if (immediate){
            let callNow = !timerout;
            timerout = setTimeout(() => {
                timerout = null;
            }, wait);
            if (callNow) func.apply(context, args);
        } else{
            timerout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        }
    }
}

var toLocal = function(date) {
    date = new Date(date);
    var local = date.toLocaleString('en-US', {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return local;
};