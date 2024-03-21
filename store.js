const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const imageInput = document.getElementById("image-input");

let currentTask = {};
const taskData = [];

const getToken = () => {
  return localStorage.getItem("token");
};
const addOrUpdateTask = async () => {
  try {
    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("author", dateInput.value);
    formData.append("description", descriptionInput.value);
    formData.append("image", imageInput.files[0]);

    let apiUrl = "http://localhost:5000/api/blog";
    let method = "POST";

    if (currentTask._id) {
      apiUrl += `/${currentTask._id}`;
      method = "PUT";
    }

    const response = await fetch(apiUrl, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    console.log("Response status:", response.status);
    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error("Failed to add or update blog post");
    }

    reset();
    updateTaskContainer();
  } catch (error) {
    console.error(error);
    // Handle error (e.g., show an error message to the user)
  }
};

const updateTaskContainer = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/admin/blogs", {
      headers: {
        Authorization: `Bearer ${getToken()}`, // Send JWT token with the request
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const blogData = await response.json();
    tasksContainer.innerHTML = ""; // Clear existing tasks

    blogData.forEach(({ _id, title, author, description, image }) => {
      tasksContainer.innerHTML += `
        <div class="task" id="${_id}">
          <img src="${image}" alt="Task Image" /> <!-- Use Cloudinary image URL here -->
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Author:</strong> ${author}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button onclick="editTask('${_id}')" type="button" class="btn">Edit</button>
          <button onclick="deleteTask('${_id}')" type="button" class="btn">Delete</button>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);
    // Handle error
  }
};

const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/blog/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`, // Send JWT token with the request
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete blog post");
    }

    updateTaskContainer(); // Update the UI after deleting a blog post
  } catch (error) {
    console.error(error);
    // Handle error
  }
};
const editTask = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/blog/${taskId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blog post for editing");
    }

    const taskData = await response.json();
    currentTask = taskData;
    console.log(`${currentTask._id}`);

    titleInput.value = currentTask.title;
    dateInput.value = currentTask.author;
    descriptionInput.value = currentTask.description;

    // Update the button text
    const addOrUpdateTaskBtn = document.getElementById(
      "add-or-update-task-btn"
    );
    addOrUpdateTaskBtn.innerText = "Update Blog";

    taskForm.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    // Handle error (e.g., show an error message to the user)
  }
};

const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  imageInput.value = ""; // Clear input file value
  taskForm.classList.add("hidden");
  currentTask = {};
};

// Event listeners
window.addEventListener("DOMContentLoaded", updateTaskContainer);
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask();
});

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues =
    titleInput.value ||
    dateInput.value ||
    descriptionInput.value ||
    imageInput.value;
  const formInputValuesUpdated =
    titleInput.value !== currentTask.title ||
    dateInput.value !== currentTask.author ||
    descriptionInput.value !== currentTask.description ||
    (imageInput.files.length > 0 &&
      imageInput.files[0].name !== currentTask.image);

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

imageInput.addEventListener("change", (e) => {
  const imagePreview = document.getElementById("image-preview");
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
  }
});

// adding chart

var chart = new ej.charts.Chart({
  tooltip: { enable: true },
  background: " #ada4a4",

  //Initializing Primary X Axis
  primaryXAxis: {
    valueType: "Category",
  },
  //Initializing Primary Y Axis
  primaryYAxis: {
    title: "In number",
  },
  //Initializing Chart Series
  series: [
    {
      type: "Column",
      dataSource: [
        { country: "Blogs", medal: 50 },
        { country: "Messages", medal: 40 },
        { country: "Users", medal: 70 },
        { country: "Subscribers", medal: 60 },
        { country: "Likes", medal: 30 },
      ],
      xName: "country",
      yName: "medal",
      fill: "#4a4943",
    },
  ],
});
chart.appendTo("#center-left");
