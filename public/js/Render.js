class Render {
    constructor(jsx, renderHere) {
        this.jsx = jsx
        this.renderHere = renderHere
    }

    render() {
        this.renderHere.innerHTML = this.jsx
    }
}