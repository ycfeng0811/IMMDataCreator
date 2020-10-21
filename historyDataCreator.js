function createAlarmsData() {
    return (Math.random() * (10 - 0)).toFixed(0)
}
function createBadCountData(count) {
    return (Math.random() * ((900 + count*50) - 800) + 800).toFixed(0)
}
function createTotalCountData() {
    return (Math.random() * (8640 - 8000) + 8000).toFixed(0)
}
function oeeData() {
    return (Math.random()* (95 - 80) + 80 ).toFixed(2)
}

function createDateFromToday(count, isShowing) {
    var hopeDay = new Date();
    hopeDay.setDate(hopeDay.getDate() - count);

    var dd = String(hopeDay.getDate()).padStart(2, '0');
    var mm = String(hopeDay.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = hopeDay.getFullYear();
    var hh = hopeDay.getHours();
    var min = String(hopeDay.getMinutes()).padStart(2, '0');
    if (isShowing) {
        return yyyy + '-' + mm + '-' + dd + " " + hh + ":" + min;
    } else {
        return yyyy + '/' + mm + '/' + dd;
    }
}

module.exports = {
    dateFromToday: function(count, isShowing) {
        return createDateFromToday(count, isShowing)
    },
    history: function(count) {
        var histData = [];
        var bad = createBadCountData(count);
        var total = createTotalCountData();
        var yeild = ((total - bad) / total).toFixed(2) * 100 ;
        histData.push(createDateFromToday(count, false));
        histData.push("J9L11731");
        histData.push(oeeData());
        histData.push(total);
        histData.push(bad);
        histData.push(createAlarmsData());
        histData.push(yeild)
        return histData
    }
}
