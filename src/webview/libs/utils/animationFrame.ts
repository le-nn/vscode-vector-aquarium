
export const animationFrame = (callback: (deltaTime: number) => void) => {
    let time = Date.now();
    let id = 0;
    let loop = () => {
        // requestAnimationFrame is not executed when Window is minimized, 
        // so prevent deltaTime from becoming extremely large
        callback(Math.min(1, (Date.now() - time) * 0.001));
        id = requestAnimationFrame(loop);
        time = Date.now();
    };
    loop();
    return {
        end: () => cancelAnimationFrame(id)
    };
};
