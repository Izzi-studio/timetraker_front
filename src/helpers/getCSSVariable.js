const getCSSVariable = cssVar => {
    const value = window
        .getComputedStyle(document.querySelector(":root"))
        .getPropertyValue(cssVar)
        .trim()

    return value || undefined
}

export default getCSSVariable