class Notification {
    viewNotif(param) {
        let notifID = param.getAttribute('data-notif-id')
        let notifType = param.getAttribute('data-notif-type')
        if (notifType === 'message') {
            document.querySelector('.outer-modal-bg').style.display = "block"
            const Ajax = new AjaxAPI()
            Ajax.post('/u/view/notif', `notifID=${notifID}`)
        }
    } 
}