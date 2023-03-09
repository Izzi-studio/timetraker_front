const getFormattingTime = (hours = 0, minutes = 0) => {
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
}

export default getFormattingTime