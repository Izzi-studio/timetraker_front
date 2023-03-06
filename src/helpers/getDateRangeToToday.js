const getDateRangeToToday = (range) => {
    const defaultRange = 3

    const dateMax = new Date()
    const dateMin = new Date()

    dateMax.setHours(23, 59, 59, 999)

    dateMin.setDate(dateMin.getDate() + 1)
    dateMin.setHours(0, 0, 0, 0)

    if (Number.isInteger(range) && range >= 1) {
        dateMin.setDate(dateMin.getDate() - range)
    } else {
        dateMin.setDate(dateMin.getDate() - defaultRange)
    }

    return [dateMin, dateMax]
}

export default getDateRangeToToday