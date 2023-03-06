const getDateRangeFromStartToEndLastMonth = (range) => {
    const dateMin = new Date()
    
    dateMin.setDate(1)
    dateMin.setMonth(new Date().getMonth() - 1)
    dateMin.setHours(0, 0, 0, 0)

    const dateMax = new Date()

    dateMax.setDate(0)
    dateMax.setHours(23, 59, 59, 999)

    return [dateMin, dateMax]
}

export default getDateRangeFromStartToEndLastMonth