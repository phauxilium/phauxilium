class AjaxAPI {
    constructor() {
        this.xhr = new XMLHttpRequest()
    }

    post(url, data) {
        this.xhr.open('POST', url, true)
        this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        this.xhr.send(data)
    }
}