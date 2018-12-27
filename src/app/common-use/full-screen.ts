export class FullScreen {
    // 全屏
    public static launchFullscreen(element): void {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // 退出 fullscreen
    public static exitFullscreen(): void {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        // tslint:disable-next-line:no-unused-expression
        document['msRequestFullscreen'];
        // tslint:disable-next-line:no-unused-expression
        document['mozRequestFullscreen'];
        // document.webkitExitFullscreen();
        // document['webkitExitFullscreen'];
    }

}
