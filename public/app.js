// Browser shows a file picker
// When the user choose a photo.jpg, the browser gives you a file object
// For example: {name: "photo.jpg", size: 123456}

document.getElementById("image-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById("preview");
  preview.src = URL.createObjectURL(file); // generates a temporary URL
  preview.style.display = "block"; // show the image
});

// By default, submitting a <form> reloads the page
// e.preventDefault() stops that and control what happens

document.getElementById("upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("image-input");
  if (!fileInput.files.length) {
    alert("Please select an image first.");
    return;
  }

  // FormData is an object designed for uploading files/form fields
  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  // Send request with fetch, browser sends a HTTP POST request to the backend server at /analyse
  // Includes the form data with the file inside
  const res = await fetch("/analyse", {
    method: "POST",
    body: formData,
  });

  // Frontend displays result
  const data = await res.json();
  document.getElementById("message").textContent = data.result || "No response.";
});

