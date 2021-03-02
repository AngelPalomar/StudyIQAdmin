export function getPaises() {

    return fetch('https://restcountries.eu/rest/v2/all').then(response => {
        return response.json()
    }).then(result => {
        return result
    }, (err) => {
        return err.message
    })
}

export function getPaisByNombre(pais) {
    const url = `https://restcountries.eu/rest/v2/name/${pais}?fullText=true`
    console.log(url)

    return fetch(url).then(response => {
        return response.json()
    }).then(result => {
        return result
    }, (err) => {
        return err.message
    })
}