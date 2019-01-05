class AddBio extends AddSpecialization {
    main() {
        return `
                            <form class="save-form">
                                <div class="inputs-container col-12">
                                    <input type="text" name="specialization" class="inputs" placeholder="Add specialization">
                                    <span class="helper specialization-helper"></span>
                                </div>
                            
                                <div class="save-cancel-div col-12">
                                    <button class="save-cancel-btn save">Save</button>
                            
                                    <button type="button" class="save-cancel-btn cancel">Cancel</button>
                                </div>
                            </form>
                        `
    }
}