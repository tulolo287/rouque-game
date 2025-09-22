export function getRandom(from, to) {
    const random =
        from < 0
            ? Math.floor(Math.random() * (to + 1 + -from) - -from)
            : Math.floor(Math.random() * (to + 1 - from) + from)
    return random
}


export function loadImage(item) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({name: item.name, img});
        img.onerror = () => reject(new Error(`Failed to load image: ${item}`));
        img.src = item.src;
    });
}