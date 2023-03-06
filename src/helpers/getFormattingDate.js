const getFormattingDate = (date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000
    const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -5)

    return localISOTime
}

export default getFormattingDate