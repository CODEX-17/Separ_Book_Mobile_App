export const shortenText = (text, limit) => {
    if (!text && !limit) {
        console.log('invalid Text or limit!.')
        return null
    }

    if (text.length < limit) return text

    if (text.length >= limit) return text.substring(0, limit) + '...'

}
