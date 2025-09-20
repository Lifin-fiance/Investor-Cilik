document.addEventListener('DOMContentLoaded', () => {
    // Tab Elements
    const lessonsTab = document.getElementById('lessons-tab');
    const glossaryTab = document.getElementById('glossary-tab');

    // Panel Elements
    const lessonsPanel = document.getElementById('lessons-panel');
    const glossaryPanel = document.getElementById('glossary-panel');
    
    // Content Containers
    const lessonsContainer = document.getElementById('lessons-container');
    const glossaryContainer = document.getElementById('glossary-container');

    // Function to switch tabs
    const switchTab = (activeTab, activePanel) => {
        // Deactivate all tabs and hide all panels
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active-tab'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.style.display = 'none');
        
        // Activate the selected tab and show the corresponding panel
        activeTab.classList.add('active-tab');
        activePanel.style.display = 'block';
    };

    // Event Listeners for Tabs
    lessonsTab.addEventListener('click', () => switchTab(lessonsTab, lessonsPanel));
    glossaryTab.addEventListener('click', () => switchTab(glossaryTab, glossaryPanel));

    /**
     * Fetches the learning lessons from the JSON file and displays them.
     */
    async function loadLessons() {
        try {
            const response = await fetch('data/learning_center.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            lessonsContainer.innerHTML = ''; // Clear loading message
            data.lessons.forEach(lesson => {
                const lessonElement = document.createElement('div');
                // Use Tailwind classes to style the card.
                lessonElement.className = 'bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1';
                
                const contentParagraphs = lesson.content.map(p => `<p class="text-gray-600 mb-2">${p}</p>`).join('');
                const externalLink = lesson.external_links.length > 0 
                    ? `<a href="${lesson.external_links[0].url}" target="_blank" rel="noopener noreferrer" class="link-primary">Learn More: ${lesson.external_links[0].name}</a>`
                    : '';

                // If a lesson has an image, create an img tag for it, wrapped for centering.
                const imageHtml = lesson.image 
                    ? `<div class="my-4 flex justify-center">
                           <img src="${lesson.image}" alt="${lesson.title}" class="rounded-lg shadow-md max-w-sm w-full h-auto object-cover">
                       </div>`
                    : '';

                // The card's content (text) is now wrapped in a div with padding.
                // The image is placed after the title. The title is centered.
                lessonElement.innerHTML = `
                    <div class="p-6">
                        <h3 class="text-2xl font-bold text-gray-800 mb-2 text-center">${lesson.title}</h3>
                        ${imageHtml}
                        ${contentParagraphs}
                        <div class="interactive-example mt-4">
                            <h4 class="font-bold">${lesson.interactive_example.title}</h4>
                            <p>${lesson.interactive_example.scenario}</p>
                        </div>
                        <div class="mt-4">${externalLink}</div>
                    </div>`;
                lessonsContainer.appendChild(lessonElement);
            });
        } catch (error) {
            console.error("Could not load lessons:", error);
            lessonsContainer.innerHTML = '<p class="text-red-500 text-center">Could not load the learning materials. Please try again later.</p>';
        }
    }

    /**
     * Fetches the glossary terms from the JSON file and displays them.
     */
    async function loadGlossary() {
        try {
            const response = await fetch('data/glossary.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            glossaryContainer.innerHTML = ''; // Clear loading message
            for (const term in data.glossary) {
                const termElement = document.createElement('div');
                termElement.className = 'bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300';
                termElement.innerHTML = `
                    <h4 class="text-xl font-bold text-gray-800">${term}</h4>
                    <p class="text-gray-600 mt-1">${data.glossary[term]}</p>`;
                glossaryContainer.appendChild(termElement);
            }
        } catch (error) {
            console.error("Could not load glossary:", error);
            glossaryContainer.innerHTML = '<p class="text-red-500 text-center col-span-full">Could not load the glossary. Please try again later.</p>';
        }
    }

    // Load content and set the initial view
    loadLessons();
    loadGlossary();
});
