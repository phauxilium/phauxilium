class Profile {
    constructor(datas, renderDiv) {
        this.datas = datas
        this.renderDiv = renderDiv
        this.centerDiv = document.querySelector('.center-div')
    }
    profile() {
        let datas = this.datas
        let name = `${datas.basicInfo.fname} ${datas.basicInfo.mname} ${datas.basicInfo.lname}`
        let specialty = ''

        if(datas.uType === 'doctor') {
            name = `Dr. ${name}`

            specialty = `
                        <div class="specialty-content">
                        </div>

                        <div class="add-specialty-div">
                            <button class="add-specialty-btn">
                                <i class="material-icons add-icon">add</i>
                                <span class="add-specialty-text">Add specialization</span>
                            </button>
                        </div>`

        }
        
        this.renderDiv.innerHTML = `
            <div class="inner-profile-div">
                <div class="image-div">
                    <center>
                        <div class="img-content-div">
                            <div class="upload-container">
                                <label for="upload-btn" class="material-icons camera-icon" title="Change profile picture">
                                    camera_alt
                                </label>
                            </div>

                            <img src="https://res.cloudinary.com/dreyan/image/upload/v1538466628/ax-images/${datas.uType}/${datas.basicInfo.profile}" class="image">
                        </div>
                    </center>

                    <form class="upload-form" method="POST" enctype="multipart/form-data">
                        <input type="file" id="upload-btn">
                    </form>

                    <div class="details-div">
                        <div class="name">
                            ${name}
                        </div>

                        <div class="specialty">
                            ${specialty}
                        </div>

                        <div class="add-bio-div">

                            <!-- <button class="add-bio-btn">
                                <i class="material-icons add-icon">add</i>
                                <span class="add-bio-text">Add bio</span>
                            </button> -->
                        </div>
                    </div>
                </div>
            </div>`

        if(datas.uType === 'doctor') {
            let specialtyDiv = document.querySelector('.specialty-content')
            let objLen = Object.keys(datas.specialty).length
            let count = 0

            for (data in datas.specialty) {
                count++
                if (datas.specialty[data] !== 0 ) {
                    specialtyDiv.append(datas.specialty[data].specialization)
                    if (count !== objLen) specialtyDiv.append(' / ')
                }
            }
        }

        this.centerDiv.innerHTML = `
        `
    }
}