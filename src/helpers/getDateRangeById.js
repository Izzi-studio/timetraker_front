const getDateRangeById = (id) => {
    const dateMax = new Date()
    const dateMin = new Date()

    dateMax.setHours(23, 59, 59, 999)

    dateMin.setDate(dateMin.getDate() + 1)
    dateMin.setHours(0, 0, 0, 0)

    if (id === 1) {
        dateMin.setDate(dateMin.getDate() - 2)
        dateMax.setDate(dateMax.getDate() - 1)
    } else if (id === 0) {
        dateMin.setDate(dateMin.getDate() - 1)
    } else if (id === 7) {
        dateMin.setDate(dateMin.getDate() - 7)
    } else if (id === 14) {
        dateMin.setDate(dateMin.getDate() - 14)
    } else if (id === 30) {
        dateMin.setDate(dateMin.getDate() - 30)
    } else {
        dateMin.setDate(dateMin.getDate() - 3)
    }

    return [dateMin, dateMax]
}

export default getDateRangeById