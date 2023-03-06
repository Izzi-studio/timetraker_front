const convertTextFromBase64 = (str) => {
    return decodeURIComponent(escape(window.atob(str)))
}

export default convertTextFromBase64