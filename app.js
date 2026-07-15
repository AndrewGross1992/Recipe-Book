// --- 1. Auto-Import on Load ---
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const urlFromShortcut = params.get('url');
    
    if (urlFromShortcut) {
        console.log("Shortcut URL detected:", urlFromShortcut);
        
        const urlInput = document.getElementById('recipeUrl');
        if (urlInput) {
            urlInput.value = urlFromShortcut;
            fetchRecipe();
        }
    }
    displayRecipes();
});

// --- 2. Manual & Web Fetcher ---
async function fetchRecipe() {
    // Get the URL from the input box
    const url = document.getElementById('recipeUrl').value;
    if (!url) return;

    // Use a proxy to fetch the HTML content from the website
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Look for the JSON data in the HTML
        const script = doc.querySelector('script[type="application/ld+json"]');
        let recipeData = { title: "Unknown Recipe", ingredients: ["No ingredients found automatically."] };
        
        if (script) {
            const json = JSON.parse(script.innerText);
            const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
            if (recipe) {
                recipeData = {
                    title: recipe.name,
                    ingredients: recipe.recipeIngredient || []
                };
            }
        }
        
        // Save the recipe and clear the input
        saveRecipe(recipeData.title, recipeData.ingredients);
        document.getElementById('recipeUrl').value = '';
    } catch (error) {
        alert("Could not import automatically. Paste ingredients manually.");
    }
}

// --- 3. Storage & Display Helpers ---
function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.splice(index, 1);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    
    container.innerHTML = recipes.map((recipe, index) => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-top: 15px; border-radius: 8px;">
            <h3>${recipe.title}</h3>
            <ul>
                ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
            </ul>
            <button onclick="alert('Scaling math coming next!')">1/2</button>
            <button onclick="alert('Scaling math coming next!')">x2</button>
            <button style="color: red; margin-left: 10px;" onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}