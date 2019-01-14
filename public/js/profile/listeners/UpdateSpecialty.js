socket.on('specialty updates', datas => {
    try {
        let specialtyDiv = document.querySelector('.specialty-content')
        let objLen = Object.keys(datas).length
        let count = 0
        specialtyDiv.innerHTML = ''

        for (data in datas) {
            count++
            if (datas[data] !== 0) {
                specialtyDiv.append(datas[data].specialization)
                if (count !== objLen) specialtyDiv.append(' / ')
            }
        }
    } catch {
        console.log('')
    }
})