const vh = () => {
    document
        .documentElement
        .style
        .setProperty('--vh', `${window.innerHeight * 0.01}px`)
}

export default vh