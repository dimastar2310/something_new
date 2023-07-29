let selectedCanvas = null;
const canvas_hight = 100;
const canvas_width = 100;
const imagesDiv = document.getElementById('imagesContainer');

// Function to be called once OpenCV.js is ready
function onOpenCvReady() {
    document.getElementById('status').innerText = 'OpenCV.js is ready.';
}

function addImage(url) {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = canvas_hight;
    canvasElement.height = canvas_width;
    canvasElement.style.margin = '5px';
    canvasElement.style.cursor = 'pointer';
    
    // Set up the click event listener to handle image selection inside the canvas
    canvasElement.addEventListener('click', function(event) {
        console.log('Canvas clicked:', canvasElement.alt);
       
            selectedCanvas = canvasElement; // Set the selected canvas
        
    });

    const image = document.createElement('img'); //handle img
    image.onload = function () {
        const ctx = canvasElement.getContext('2d'); //drawing img on current canvas
        ctx.drawImage(image, 0, 0, canvas_hight, canvas_width);
    };
    image.src = url; //ones triggered we going to onload method

    // Generate random position coordinates within the "imagesContainer" div
    const maxX = imagesDiv.clientWidth - canvas_hight;
    const maxY = imagesDiv.clientHeight - canvas_width;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Set the random position as CSS styles
    canvasElement.style.position = 'absolute';
    canvasElement.style.left = randomX + 'px';
    canvasElement.style.top = randomY + 'px';

    // Append the canvas to the "imagesContainer" div
    imagesDiv.appendChild(canvasElement);
}

function rotateImage(direction) {
    const angleInput = document.getElementById('angleInput');
    const userInputValue = angleInput.value.trim();

    let rotationAngle;

    if (userInputValue !== "") {
        rotationAngle = parseFloat(userInputValue);
        if (isNaN(rotationAngle)) {
            alert("Please enter a valid number for the angle.");
            return;
        }
    } else {
        alert("Please enter the angle value.");
        return;
    }

    if (selectedCanvas) {
        const src = cv.imread(selectedCanvas);
        const dst = new cv.Mat();
        const dsize = new cv.Size(src.cols, src.rows);
        const center = new cv.Point(src.cols / 2, src.rows / 2);
        const M = cv.getRotationMatrix2D(center, direction === 'LEFT' ? -rotationAngle : rotationAngle, 1);
        cv.warpAffine(src, dst, M, dsize, cv.INTER_LANCZOS4, cv.BORDER_CONSTANT, new cv.Scalar());

        cv.imshow(selectedCanvas, dst); //replacing the current canvas with selected canvas//we have reference to the canvas
        
        src.delete();
        dst.delete();
        M.delete();
    }
}

// Add the event listener for the image input
document.getElementById('imageInput').addEventListener('change', function(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = URL.createObjectURL(file);
            addImage(url);
        }
    }
});
