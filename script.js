const STORAGE_KEY = "shortlyLinks";
const baseURL = "https://shortly-api-liif.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("shortenForm");
  const linkInput = document.getElementById("linkInput");
  const errorMessage = document.getElementById("errorMessage"); // still in DOM, but we use toasts for updates
  const linksContainer = document.getElementById("linksContainer");
  const submitButton = document.getElementById("submitButton");

  // Load persisted links on page load
  let storedLinks = loadStoredLinks();
  storedLinks.forEach(linkObj => {
    renderLinkCard(linkObj.original, linkObj.shortened);
  });

  // Toast notification function
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;
    document.body.appendChild(toast);
    // Trigger animation
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();

    submitButton.innerText = "Shortening...";
    submitButton.disabled = true;

    const url = linkInput.value.trim();

    if (!url) {
      submitButton.innerText = "Shorten It!";
      submitButton.disabled = false;
      showToast("Please enter a URL to shorten.", "error");
      return;
    }

    // Clear any previous error text if needed
    errorMessage.textContent = "";

    try {
      const response = await fetch(`${baseURL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long_url: url }),
      });

      const result = (await response.json())?.payload;

      if (response.ok) {
        const original_link = url;
        const shortLink = result.link;

        renderLinkCard(original_link, shortLink);
        storedLinks.push({ original: original_link, shortened: shortLink });
        updateStoredLinks(storedLinks);

        linkInput.value = "";
        showToast("Link shortened successfully!");
      } else {
        showToast(result.message || "Unable to shorten URL.", "error");
      }
    } catch (err) {
      showToast(`An error occurred - ${err?.message || ""}`, "error");
    } finally {
      submitButton.innerText = "Shorten It!";
      submitButton.disabled = false;
    }
  });

  function renderLinkCard(original, shortened) {
    const card = document.createElement("div");
    card.classList.add("link-card", "fade-in");

    const originalText = document.createElement("span");
    originalText.textContent = original;

    const shortenedText = document.createElement("span");
    shortenedText.textContent = shortened;

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");

    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.classList.add("copy-btn");
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(shortened).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
      });
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      if (window.confirm("Are you sure you want to delete this link?")) {
        deleteLink(shortened, card, deleteBtn);
      }
    });

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(deleteBtn);

    card.appendChild(originalText);
    card.appendChild(shortenedText);
    card.appendChild(actionsDiv);

    linksContainer.prepend(card);
  }

  async function deleteLink(shortened, cardElement, deleteBtn) {
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";
    // Bitly API expects the bitlink without protocol (e.g., "bit.ly/abc123")
    const bitlinkId = shortened.replace(/^https?:\/\//, "");
    try {
      const response = await fetch(
        `${baseURL}/delete/${encodeURIComponent(bitlinkId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove from DOM
        cardElement.remove();
        // Update local storage
        storedLinks = storedLinks.filter(link => link.shortened !== shortened);
        updateStoredLinks(storedLinks);
        showToast("Link deleted successfully!");
      } else {
        const errorRes = await response.json();
        showToast(errorRes.message || "Failed to delete the link.", "error");
        deleteBtn.disabled = false;
        deleteBtn.textContent = "Delete";
      }
    } catch (err) {
      showToast("An error occurred while deleting the link.", "error");
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete";
    }
  }

  function loadStoredLinks() {
    const links = localStorage.getItem(STORAGE_KEY);
    return links ? JSON.parse(links) : [];
  }

  function updateStoredLinks(links = []) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }
});
