window.onload = function () {
    drawGrid();

    document.getElementById('bt2').onclick = function() {
        dashedLine(5, 10, 40, 10);
        dashDotLine(5, 20, 40, 20);
        dash2DotLine(5, 30, 40, 30);
        drawArrow(5, 40, 40, 40);
        drawRectangle(300, 300, 100, 200);
    }
    document.getElementById('bt3').onclick = function() {
        dashCircle(50,50,25);
    }
    document.getElementById('bt4').onclick = function() {
        drawEllipse(canvas.width/2, canvas.height/2, 200, 150);
    }
}
