var canvas = document.getElementById('canvas'),
    pSize = 5, // pixel size
    ctx = canvas.getContext('2d'),
    imgd, defaultCanvas,
    isDrawing,
    position;

function drawGrid() {
    // vẽ lưới tọa độ
    ctx.fillStyle = '#bebebe';
    for (let i = 0; i < canvas.height; i += pSize) {
        for (let j = 0; j < canvas.width; j++) {
            ctx.fillRect(j, i, 1, 1);
        }
    }
    for (let i = 0; i < canvas.width; i += pSize) {
        for (let j = 0; j < canvas.height; j++) {
            ctx.fillRect(i, j, 1, 1);
        }
    }
    // vẽ hệ tọa độ
    ctx.fillStyle = '#000000';
    let x = canvas.width / 2,
        y = canvas.height / 2;

    for (let i = 0; i < canvas.height; i++) {
        ctx.fillRect(x, i, 1, 1);
    }
    for (let i = 0; i < canvas.width; i++) {
        ctx.fillRect(i, y, 1, 1);
    }
    defaultCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getPixelPos(x, y) {
    return {
        x: (Math.ceil(x / pSize) - 1) * pSize + 1,
        y: (Math.ceil(y / pSize) - 1) * pSize + 1
    }
}

function fillPixel(x, y) {
    x = (Math.ceil(x / pSize) - 1) * pSize + 1;
    y = (Math.ceil(y / pSize) - 1) * pSize + 1;
    ctx.fillRect(x, y, pSize - 1, pSize - 1);
}

function putPixel(x, y) {
    ctx.fillRect((x - 1) * pSize + 1, (y - 1) * pSize + 1, pSize - 1, pSize - 1);
}

function drawLine(x0, y0, x1, y1) {
    // DDA algorithm
    const dx = x1 - x0,
        dy = y1 - y0,
        s = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy),
        xi = dx * 1.0 / s,
        yi = dy * 1.0 / s;
    var x = x0,
        y = y0;

    fillPixel(x0, y0);
    for (let i = 0; i < s; i++) {
        x += xi;
        y += yi;
        fillPixel(x, y);
    }
}

function bresenhamLine(x1, y1, x2, y2) {
    var x, y, dx, dy, p, const1, const2;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    for (x = x1; x <= x2; x++) {
        putPixel(x, y);
        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function dashedLine(x1, y1, x2, y2) {
    var x, y, dx, dy, p, const1, const2, dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    dem = 0;
    chieuDaiMoiDoan = 6;
    khoangCachMoiDoan = 2;
    for (x = x1; x <= x2; x++) {
        dem++;
        if (dem <= chieuDaiMoiDoan) putPixel(x, y);
        else {
            if (dem > chieuDaiMoiDoan + khoangCachMoiDoan) {
                //reset bien dem
                dem = 1;
                putPixel(x, y);
            }
        }

        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function dashDotLine(x1, y1, x2, y2) {
    // DDA algorithm
    var x, y, dx, dy, p, const1, const2, dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    dem = 0;
    chieuDaiMoiDoan = 6;
    khoangCachMoiDoan = 2

    for (x = x1; x <= x2; x++) {
        dem++;
        if (dem <= chieuDaiMoiDoan) putPixel(x, y);
        else {
            if ((dem > chieuDaiMoiDoan && dem <= chieuDaiMoiDoan + khoangCachMoiDoan) || (dem > chieuDaiMoiDoan + khoangCachMoiDoan + 1 && dem <= chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 1)) //vẽ 2 khoảng trăng 2 bên chấm
            {
                //không putPixel để vẽ khoảng trắng
            }
            else {
                if (dem == chieuDaiMoiDoan + khoangCachMoiDoan + 1) {
                    putPixel(x, y); //vẽ chấm
                }
                else {
                    dem = 1;
                    putPixel(x, y);
                }
            }
        }

        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function dash2DotLine(x1, y1, x2, y2) {
    // DDA algorithm
    var x, y, dx, dy, p, const1, const2, dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    dem = 0;
    chieuDaiMoiDoan = 6;
    khoangCachMoiDoan = 2

    for (x = x1; x <= x2; x++) {
        dem++;
        if (dem <= chieuDaiMoiDoan) putPixel(x, y);
        else {
            if ((dem > chieuDaiMoiDoan && dem <= chieuDaiMoiDoan + khoangCachMoiDoan)
                || (dem > chieuDaiMoiDoan + khoangCachMoiDoan + 1 && dem <= chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 1)
                || (dem > chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 2 && dem <= chieuDaiMoiDoan + 3 * khoangCachMoiDoan + 2)) //vẽ 2 khoảng trăng 2 bên chấm
            {
                //không putPixel để vẽ khoảng trắng
            }
            else {
                if ((dem == chieuDaiMoiDoan + khoangCachMoiDoan + 1) || (dem == chieuDaiMoiDoan + 2 * khoangCachMoiDoan + 2)) {
                    putPixel(x, y); //vẽ chấm
                }
                else {
                    dem = 1;
                    putPixel(x, y);
                }
            }
        }

        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
}

function drawArrow(x1, y1, x2, y2) {
    var x, y, dx, dy, p, const1, const2;
    y = y1;
    dx = x2 - x1;
    dy = y2 - y1;
    p = 2 * dy - dx;
    const1 = 2 * dy;
    const2 = 2 * (dy - dx);
    for (x = x1; x <= x2; x++) {
        putPixel(x, y);
        if (p < 0)
            p += const1; // p=p + 2dy
        else {
            p += const2; //p=p+2dy-2dx
            y++;
        }
    }
    putPixel(x2 - 1, y2 - 1);
    putPixel(x2 - 1, y2 + 1);
}

function drawRectangle(x, y, w, h) {
    let x1 = x + w,
        y1 = y + h;
    drawLine(x, y, x1, y);
    drawLine(x1, y, x1, y1);
    drawLine(x1, y1, x, y1);
    drawLine(x, y1, x, y);
}

function drawCircle(x0, y0, radius) {
    // mid-point algorithm
    var x = radius,
        y = 0,
        radiusError = 1 - x;

    while (x >= y) {
        fillPixel(x + x0, y + y0);
        fillPixel(y + x0, x + y0);
        fillPixel(-x + x0, y + y0);
        fillPixel(-y + x0, x + y0);
        fillPixel(-x + x0, -y + y0);
        fillPixel(-y + x0, -x + y0);
        fillPixel(x + x0, -y + y0);
        fillPixel(y + x0, -x + y0);
        y++;

        if (radiusError < 0) {
            radiusError += 2 * y + 1;
        }
        else {
            x--;
            radiusError += 2 * (y - x + 1);
        }
    }
}

function dashCircle(xc, yc, Radius) {
    var x, y, p, dem, chieuDaiMoiDoan, khoangCachMoiDoan;
    x = 0;
    y = Radius;
    p = 3 - 2 * Radius;
    dem = 0;
    chieuDaiMoiDoan = 3;
    khoangCachMoiDoan = 1;
    // putPixel(xc + Radius, yc + 0);
    // putPixel(xc - Radius, yc - 0);
    // putPixel(xc -0, yc +Radius);
    // putPixel(xc +0, yc -Radius);
    while (x < y) {
        if (p < 0)
            p += 4 * x + 6;
        else {
            p += 4 * (x - y) + 10;
            y--;
        }
        x++;
        dem++;
        if (dem >= 1 && dem <= chieuDaiMoiDoan) {
            putPixel(xc + x, yc + y);
            putPixel(xc - x, yc - y);
            putPixel(xc - y, yc + x);
            putPixel(xc + y, yc - x);
            putPixel(xc + y, yc + x);
            putPixel(xc - y, yc - x);
            putPixel(xc - x, yc + y);
            putPixel(xc + x, yc - y);
        }
        else {
            if (dem > chieuDaiMoiDoan && dem <= khoangCachMoiDoan) {
                //không putPixel
            }
            else {
                dem = 0;
            }
        }
    }
    putPixel(xc + y, yc + y);
    putPixel(xc - y, yc - y);
    putPixel(xc - y, yc + y);
    putPixel(xc + y, yc - y);
}

function bresenhamCircle(xc, yc, Radius) {
    var x, y, p;
    x = 0;
    y = Radius;
    p = 3 - 2 * Radius;
    putPixel(xc + Radius, yc + 0);
    putPixel(xc - Radius, yc - 0);
    putPixel(xc - 0, yc + Radius);
    putPixel(xc + 0, yc - Radius);
    while (x < y) {
        if (p < 0)
            p += 4 * x + 6;
        else {
            p += 4 * (x - y) + 10;
            y--;
        }
        x++;
        putPixel(xc + x, yc + y);
        putPixel(xc - x, yc - y);
        putPixel(xc - y, yc + x);
        putPixel(xc + y, yc - x);
        putPixel(xc + y, yc + x);
        putPixel(xc - y, yc - x);
        putPixel(xc - x, yc + y);
        putPixel(xc + x, yc - y);
    }
    putPixel(xc + y, yc + y);
    putPixel(xc - y, yc - y);
    putPixel(xc - y, yc + y);
    putPixel(xc + y, yc - y);
}

//  midpoint algorithm
function drawEllipse(xc, yc, rx, ry) {
    let x = 0, y = ry;
	let p1, p2;

	// for region 1
	p1 = (ry * ry) - (rx * rx * ry)+ (0.25 * rx * rx)
	while ((2 * ry * ry * x) <= (2 * rx * rx * y)) {
		if (p1 < 0) {
			x = x + 1
			p1 = p1 + (2 * ry * ry * x) + (ry * ry) 
		} else {
			x = x + 1;
			y = y - 1;
			p1 = p1 + (2 * ry * ry * x) - (2 * rx * rx * y) + (ry * ry);
		}
        
        // nửa trên
        if (true) {
            ctx.fillStyle="red"
            fillPixel(x + xc, -y + yc)
		    fillPixel(-x + xc, -y + yc)
            ctx.fillStyle="black"
        }

         // nửa dưới
        fillPixel(x + xc, y + yc)
        fillPixel(-x + xc, y + yc)
	}

	// for region 2
	p2 = ((x + 0.5) * (x + 0.5) * ry * ry) + ((y - 1) * (y - 1) * rx * rx) - (rx * rx * ry * ry)
	while (y != 0) {
		if (p2 > 0) {
			y = y - 1
			p2 = p2 - (2 * y * rx * rx) + (rx * rx) 
		} else {
			x = x + 1
			y = y - 1
			p2 = p2 - (2 * y * rx * rx) + (2 * x * ry * ry) + (rx * rx)  
		}

		// nửa trên
        if (true) {
            ctx.fillStyle="blue"
            fillPixel(x + xc, -y + yc)
		    fillPixel(-x + xc, -y + yc)
            ctx.fillStyle="black"
        }

         // nửa dưới
        fillPixel(x + xc, y + yc)
        fillPixel(-x + xc, y + yc)
	}
}

// listeners
canvas.addEventListener('click', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    position = getPixelPos(mousePos.x, mousePos.y);
    console.log(position);
});

canvas.addEventListener('mousedown', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    position = getPixelPos(mousePos.x, mousePos.y);
    isDrawing = true;
});

canvas.addEventListener('mousemove', function (evt) {
    if (isDrawing === true) {
        fillPixel(position.x, position.y);
        realPos = getMousePos(canvas, evt);
        position = getPixelPos(realPos.x, realPos.y);
    }
});

window.addEventListener('mouseup', function (evt) {
    if (isDrawing === true) {
        fillPixel(position.x, position.y);
        position = { x: 0, y: 0 };
        isDrawing = false;
    }
});

document.getElementById('testBtn').addEventListener('click', function (evt) {
    ctx.fillStyle = '#' + Math.random().toString(16).slice(-6);
});

document.getElementById('clearBtn').addEventListener('click', function (evt) {
    if (imgd != null) {
        ctx.putImageData(imgd, 0, 0);
    } else {
        ctx.putImageData(defaultCanvas, 0, 0);
    }
});

document.getElementById('saveBtn').addEventListener('click', function (evt) {
    imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

document.getElementById('resetBtn').addEventListener('click', function (evt) {
    ctx.putImageData(defaultCanvas, 0, 0);
});


