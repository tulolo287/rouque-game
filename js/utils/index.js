function getRandom(from, to) {
    const random =
        from < 0
            ? Math.floor(Math.random() * (to + 1 + -from) - -from)
            : Math.floor(Math.random() * (to + 1 - from) + from)
    return random
}

function loadImage(item) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ name: item.name, img });
        img.onerror = () => reject(new Error(`Failed to load image: ${item}`));
        img.src = item.src;
    });
}

function isCollidedWith(obj1, distance, obj2) {
    if (obj1.x + distance === obj2.x && obj1.y === obj2.y) {
        return 'right'
    }
    if (obj1.x - distance === obj2.x && obj1.y === obj2.y) {
        return 'left'
    }
    if (obj1.y + distance === obj2.y && obj1.x === obj2.x) {
        return 'down'
    }
    if (obj1.y - distance === obj2.y && obj1.x === obj2.x) {
        return 'up'
    }
    return false
}

function isPositionEqual(obj1, obj2) {
    return obj1.x === obj2.x && obj1.y === obj2.y
}

function getDistance(obj1, obj2) {
    const disX = obj1.x - obj2.x
    const disY = obj1.y - obj2.y
    const distance = Math.sqrt(disX ** 2 + disY ** 2)

    return { disX, disY, distance }
}