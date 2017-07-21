import moment from 'moment'
function hoursUntil9AM(now) {
    let nextDay = moment(now);
    if (now.hours() > 9) {
        nextDay = nextDay
            .days(nextDay.days() + 1)
            .hours(9)
            .minutes(0)
            .seconds(0)

    } else {
        nextDay = nextDay.hours(9)
            .minutes(0)
            .seconds(0)
    }
    return Math.ceil(nextDay.diff(now, 'minutes') / 60)
}

export default {
    hoursUntil9AM: hoursUntil9AM
}