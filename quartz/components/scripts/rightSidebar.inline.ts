
const toggleSidebar = (viewName: string) => {
  const sidebar = document.querySelector(".right.sidebar") as HTMLElement
  if (!sidebar) return

  const allViews = sidebar.querySelectorAll(".sidebar-content > div")
  const allIcons = sidebar.querySelectorAll(".sidebar-icons button")

  // Toggle logic
  const contentContainer = sidebar.querySelector(".sidebar-content") as HTMLElement
  const isExpanded = sidebar.classList.contains("expanded")
  const activeView = sidebar.querySelector(`.sidebar-content > .${viewName}`)
  
  // If clicking the already active view and we are in overlay mode (width < 1200), collapse it
  // Or if we are just toggling visibility. 
  // Wait, requirement: "If the screen is small... open the view. If large... render icons and open right pane"
  
  // Reset all
  allViews.forEach((view) => view.classList.remove("active"))
  allIcons.forEach((icon) => icon.classList.remove("active"))

  // If we are clicking a new view or the sidebar was collapsed
  if (!isExpanded || !activeView?.classList.contains("active")) {
      sidebar.classList.add("expanded")
      const newView = sidebar.querySelector(`.sidebar-content > .${viewName}`)
      const newIcon = sidebar.querySelector(`.sidebar-icons button[data-view="${viewName}"]`)
      if (newView) newView.classList.add("active")
      if (newIcon) newIcon.classList.add("active")
      
      // Force re-render of components (like Graph) that need layout recalculation
      // Dispatch themechange to trigger graph re-render
      // Dispatch resize to trigger general responsive listeners
      setTimeout(() => {
          const currentTheme = (document.documentElement.getAttribute("saved-theme") ?? "light") as "light" | "dark"
          document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: currentTheme } }))
          window.dispatchEvent(new UIEvent("resize"))
      }, 350)
  } else {
      // If clicking the same icon again, collapse the sidebar (optional but good UX for overlay mode)
      // Check window width to decide if we should allow full collapse
      if (window.innerWidth < 1200) {
          sidebar.classList.remove("expanded")
      }
  }
}

const setupSidebar = () => {
  const sidebar = document.querySelector(".right.sidebar")
  if (!sidebar) return

  // Create icon container
  const iconContainer = document.createElement("div")
  iconContainer.classList.add("sidebar-icons")
  
  // Wrap existing content
  const contentContainer = document.createElement("div")
  contentContainer.classList.add("sidebar-content")
  
  // Move children
  const children = Array.from(sidebar.children)
  children.forEach(child => {
      // Check if it's one of our known components
      if (child.classList.contains("graph") || 
          child.classList.contains("toc") || 
          child.classList.contains("backlinks")) {
          contentContainer.appendChild(child)
      } else {
          // Keep other things (like generic divs?) directly or maybe append them too?
          // Let's assume everything goes into content for now to be safe with tabs
           contentContainer.appendChild(child)
      }
  })

  sidebar.appendChild(iconContainer)
  sidebar.appendChild(contentContainer)
  
  // Wrap h3 and add close button for each view
  Array.from(contentContainer.children).forEach((view) => {
      const headerContainer = document.createElement("div")
      headerContainer.classList.add("sidebar-view-header")
      
      // Check for TOC header button first (contains h3 and fold icon)
      const tocHeader = view.querySelector(".toc-header")
      const existingH3 = view.querySelector("h3")

      if (tocHeader) {
          headerContainer.appendChild(tocHeader)
      } else if (existingH3) {
          headerContainer.appendChild(existingH3)
      } else {
        // If no header found
      }

      // Create close button for this view
      const closeButton = document.createElement("button")
      closeButton.classList.add("sidebar-close")
      closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      closeButton.addEventListener("click", () => {
          sidebar.classList.remove("expanded")
          // Clear active states
          const allViews = sidebar.querySelectorAll(".sidebar-content > div")
          const allIcons = sidebar.querySelectorAll(".sidebar-icons button")
          allViews.forEach((v) => v.classList.remove("active"))
          allIcons.forEach((i) => i.classList.remove("active"))
      })
      
      headerContainer.appendChild(closeButton)
      view.prepend(headerContainer)
  })

  // Generate Icons based on content
  const views = contentContainer.children
  let hasActive = false

  Array.from(views).forEach((view) => {
     let icon: HTMLElement | null = null
     let viewName = ""
     
     if (view.classList.contains("graph")) {
         viewName = "graph"
         icon = document.createElement("button")
         icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`
         icon.setAttribute("aria-label", "Graph View")
     } else if (view.classList.contains("toc")) {
         viewName = "toc"
         icon = document.createElement("button")
         icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
         icon.setAttribute("aria-label", "Table of Contents")
     } else if (view.classList.contains("backlinks")) {
         viewName = "backlinks"
         icon = document.createElement("button")
         icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
         icon.setAttribute("aria-label", "Backlinks")
     }

     if (icon && viewName) {
         icon.setAttribute("data-view", viewName)
         icon.addEventListener("click", () => toggleSidebar(viewName))
         iconContainer.appendChild(icon)

         // Set initial active state (default to Graph if available, else TOC)
         if (!hasActive && (window.innerWidth < 800 || window.innerWidth > 1200)) {
             view.classList.add("active")
             icon.classList.add("active")
             hasActive = true
         }
     }
  })

  // Initial State Logic
  if (window.innerWidth < 800 || window.innerWidth > 1200) {
      sidebar.classList.add("expanded")
  }
}

window.addEventListener("resize", () => {
    const sidebar = document.querySelector(".right.sidebar")
    if (!sidebar) return
    
    if (window.innerWidth > 1200) {
        if (!sidebar.classList.contains("expanded")) {
            sidebar.classList.add("expanded")
        }
    } else {
        // Did user intentionally close it? maybe. 
        // For now, let's keep it simple: strict resize rules might be annoying if they override user choice constantly.
        // But the prompt says "If screen is large... render open".
    }
})

document.addEventListener("nav", setupSidebar)
