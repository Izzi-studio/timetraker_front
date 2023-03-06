const convertTextToBase64 = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)))
}

export default convertTextToBase64