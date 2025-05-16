// Function to load HTML components
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath, {
      headers: {
        Accept: "text/html",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    // Remove any script tags that might be injected
    const cleanHtml = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );
    document.getElementById(elementId).innerHTML = cleanHtml;

    // Initialize navbar functionality after loading
    if (elementId === "navbar-container") {
      // Initialize Bootstrap dropdowns
      const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
      const dropdownList = [...dropdownElementList].map((dropdownToggleEl) => {
        return new bootstrap.Dropdown(dropdownToggleEl, {
          offset: [0, 10],
          boundary: "viewport",
        });
      });

      // Initialize navbar collapse
      const navbarToggler = document.querySelector(".navbar-toggler");
      if (navbarToggler) {
        navbarToggler.addEventListener("click", function () {
          const navbarCollapse = document.querySelector(".navbar-collapse");
          navbarCollapse.classList.toggle("show");
        });
      }

      // Add hover functionality
      const dropdowns = document.querySelectorAll(".dropdown");
      dropdowns.forEach((dropdown) => {
        const dropdownToggle = dropdown.querySelector(".dropdown-toggle");
        if (dropdownToggle) {
          dropdown.addEventListener("mouseover", function () {
            if (window.innerWidth >= 992) {
              dropdown.classList.add("open");
            }
          });

          dropdown.addEventListener("mouseout", function () {
            if (window.innerWidth >= 992) {
              dropdown.classList.remove("open");
            }
          });
        }
      });
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error);
  }
}

// Load components when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Load navbar
  loadComponent("navbar-container", "components/navbar.html");

  // Load footer
  loadComponent("footer-container", "components/footer.html");
});
