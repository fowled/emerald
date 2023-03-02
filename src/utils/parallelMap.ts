export async function parallelMap(array: any[], callback: (el: typeof array[number]) => void) {
    return await Promise.all(array.map((el) => callback(el)));
}
