document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.getElementById("projects-container");
  const seeMoreBtn = document.getElementById("see-more-btn");
  const filterButtons = document.querySelectorAll(".filter-button");
  let currentIndex = 0;
  const projectsPerPage = 6;
  let currentFilter = "All Project";
  let allProjects = [];

  const loadProjects = (projects, start, end) => {
    const fragment = document.createDocumentFragment();
    projects.slice(start, end).forEach((project) => {
      const card = document.createElement("div");
      card.className =
        "project-card border border-gray-800 rounded-lg overflow-hidden shadow-lg";
      card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold">${project.title}</h3>
                    <p class="text-sm">${project.description}</p>
                </div>
            `;
      fragment.appendChild(card);
    });
    projectsContainer.appendChild(fragment);
  };

  const fetchProjects = () => {
    fetch("images.json")
      .then((response) => response.json())
      .then((data) => {
        allProjects = data.projects;
        filterProjects();
      })
      .catch((error) => console.error("Error loading projects:", error));
  };

  const filterProjects = () => {
    let filteredProjects = allProjects;
    if (currentFilter !== "All Project") {
      filteredProjects = allProjects.filter((project) =>
        project.description.includes(currentFilter)
      );
    }
    currentIndex = 0;
    projectsContainer.innerHTML = "";
    loadProjects(filteredProjects, currentIndex, projectsPerPage);
    if (filteredProjects.length <= projectsPerPage) {
      seeMoreBtn.style.display = "none";
    } else {
      seeMoreBtn.style.display = "block";
    }
  };

  const handleSeeMore = () => {
    currentIndex += projectsPerPage;
    const filteredProjects = allProjects.filter(
      (project) =>
        currentFilter === "All Project" ||
        project.description.includes(currentFilter)
    );
    loadProjects(
      filteredProjects,
      currentIndex,
      currentIndex + projectsPerPage
    );
    if (currentIndex + projectsPerPage >= filteredProjects.length) {
      seeMoreBtn.style.display = "none";
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      currentFilter = e.target.dataset.filter;
      filterProjects();
    });
  });

  seeMoreBtn.addEventListener("click", handleSeeMore);

  // Initial load
  fetchProjects();
});
