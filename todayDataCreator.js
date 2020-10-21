
function todayTimeStamp(count, isShowing) {
    var now = new Date();
    now = dateAdd(now, 'minute', (-30*count))
    
    // now.setDate(now.getMinutes() );

    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = now.getFullYear();
    var hh = now.getHours();
    var min = String(now.getMinutes()).padStart(2, '0');
    if (isShowing) {
        return yyyy + '-' + mm + '-' + dd + " " + hh + ":" + min;
    } else {
        return yyyy + '/' + mm + '/' + dd;
    }
}
function calculateCountFromNow() {
    var now = new Date();
    var hh = now.getHours();
    return hh*2 + 2
}
function getStatus() {
    if (Math.random() > 0.1) {
        return "Run"
    } else {
        return "Idle"
    }
}
function createTotalCount() { 
    return calculateCountFromNow()*180
}

function createbadCount() {
    return (Math.random()* ( 0.1 - 0.08 ) + 0.08) * createTotalCount() 
}

module.exports = {
    createTotalCount: function() {
        return createTotalCount()
    },
    createbadCount: function() {
        return createbadCount()
    },
    calculateCountFromNow: function() {
        return calculateCountFromNow()
    },
    todayData: function(count) {
        var histData = [];
        histData.push(todayTimeStamp(count, true));
        histData.push("J9L11731");
        histData.push(getStatus());
        return histData
    }
}

/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 * 
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
function dateAdd(date, interval, units) {
    if(!(date instanceof Date))
      return undefined;
    var ret = new Date(date); //don't change original date
    var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
    switch(String(interval).toLowerCase()) {
      case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
      case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
      case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
      case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
      case 'day'    :  ret.setDate(ret.getDate() + units);  break;
      case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
      case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
      case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
      default       :  ret = undefined;  break;
    }
    return ret;
  }