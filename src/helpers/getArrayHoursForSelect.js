const getArrayHoursForSelect = () => {
    const arr = []

    for (let i = 0; i <= 23; i++) {
        arr.push({
            id: i,
            name: i < 10 ? `0${i}:00` : `${i}:00` 
        })
    }

    return arr
}

export default getArrayHoursForSelect