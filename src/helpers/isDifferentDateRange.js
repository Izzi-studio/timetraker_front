const isDifferentDateRange = (dateRangeFirst, dateRangeSecond) => {
    if (
        dateRangeFirst[0].getYear() === dateRangeSecond[0].getYear() &&
        dateRangeFirst[0].getMonth() === dateRangeSecond[0].getMonth() &&
        dateRangeFirst[0].getDate() === dateRangeSecond[0].getDate() &&
        dateRangeFirst[0].getHours() === dateRangeSecond[0].getHours() &&
        dateRangeFirst[0].getMinutes() === dateRangeSecond[0].getMinutes() &&

        dateRangeFirst[1].getYear() === dateRangeSecond[1].getYear() &&
        dateRangeFirst[1].getMonth() === dateRangeSecond[1].getMonth() &&
        dateRangeFirst[1].getDate() === dateRangeSecond[1].getDate() &&
        dateRangeFirst[1].getHours() === dateRangeSecond[1].getHours() &&
        dateRangeFirst[1].getMinutes() === dateRangeSecond[1].getMinutes()
    ) {
        return false
    } else {
        return true
    }
}

export default isDifferentDateRange