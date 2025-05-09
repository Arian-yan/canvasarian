const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let circles = [];
let selectedCircleIndex = null;
let isDragging = false;
let offsetX, offsetY;

function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach((circle, index) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = index === selectedCircleIndex ? "red" : "blue";
    ctx.fill();
    ctx.closePath();
  });
}

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  selectedCircleIndex = null;
  for (let i = 0; i < circles.length; i++) {
    const c = circles[i];
    const distance = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2);
    if (distance <= c.radius) {
      selectedCircleIndex = i;
      drawCircles();
      return;
    }
  }

  // If click is on blank space
  circles.push({ x, y, radius: 20 });
  drawCircles();
});

canvas.addEventListener("mousedown", function (e) {
  if (selectedCircleIndex !== null) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const circle = circles[selectedCircleIndex];

    const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);
    if (distance <= circle.radius) {
      isDragging = true;
      offsetX = x - circle.x;
      offsetY = y - circle.y;
    }
  }
});

canvas.addEventListener("mousemove", function (e) {
  if (isDragging && selectedCircleIndex !== null) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    circles[selectedCircleIndex].x = x - offsetX;
    circles[selectedCircleIndex].y = y - offsetY;
    drawCircles();
  }
});

canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Delete" && selectedCircleIndex !== null) {
    circles.splice(selectedCircleIndex, 1);
    selectedCircleIndex = null;
    drawCircles();
  }
});

canvas.addEventListener("wheel", function (e) {
  if (selectedCircleIndex !== null) {
    e.preventDefault();
    const circle = circles[selectedCircleIndex];
    if (e.deltaY < 0) {
      circle.radius += 2;
    } else {
      circle.radius = Math.max(5, circle.radius - 2);
    }
    drawCircles();
  }
});
