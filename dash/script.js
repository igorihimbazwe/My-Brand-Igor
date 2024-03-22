// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve token from local storage
  const token = localStorage.getItem("token");

  // Get the container where messages will be displayed
  const messagesContainer = document.getElementById("messages-container");
  const messagesContainer1 = document.getElementById("center-right");

  // Function to retrieve messages from the backend
  async function getMessages() {
    try {
      const response = await fetch(
        "https://my-brand-api-6my7.onrender.com/api/message",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const messages = await response.json();
        displayMessages(messages);
      } else {
        console.error("Failed to retrieve messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  // Function to display messages
  function displayMessages(messages) {
    messagesContainer.innerHTML = "";

    if (messages.length > 0) {
      messages.forEach((message) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("person");
        messageDiv.innerHTML = `
                  <div class="sender-message1">
                      <ion-icon name="person"></ion-icon>
                      <p class="title"><b>${message.fullName}</b></p> <br> <br>
                      
                      <details>
                        
                        <summary><ion-icon name="eye"></ion-icon></summary>
                            <pre>${message.message}</pre> 
                           </details></div>
                           <div class="pbtn">
                      <p><a href="mailto:${message.email}" target="_blank"><ion-icon name="arrow-undo"></ion-icon></a></p>
                     <p> <button class="delete-btn" data-id="${message._id}"><ion-icon name="trash"></ion-icon></button></p></div>

                  </div>
                  
              `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer1.innerHTML += `
                            
                            <div class="message">
                              <div class="sender-message">
                                <ion-icon name="person"></ion-icon>
                                <p><b>${message.fullName}</b><br>
                                  ${message.message}</p>
                              </div>
                            </div> 
                                         
                                
                                `;
      });

      // Attach event listener to delete buttons
      const deleteButtons = document.querySelectorAll(".delete-btn");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", async function () {
          const messageId = this.dataset.id;
          await deleteMessage(messageId);
          await getMessages(); // Refresh messages after deletion
        });
      });
    } else {
      messagesContainer.innerHTML = "<p>No messages found</p>";
    }
  }

  // Function to delete a message
  async function deleteMessage(messageId) {
    try {
      const response = await fetch(
        `https://my-brand-api-6my7.onrender.com/api/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete message:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  // Call the getMessages function to fetch and display messages when the page loads
  getMessages();
});
