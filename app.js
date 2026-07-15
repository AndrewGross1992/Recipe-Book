window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const urlFromShortcut = params.get('url');
    
    // This will tell us if it sees the URL or if it's "null"
    alert("URL found: " + urlFromShortcut); 
    
    if (urlFromShortcut) {
        const urlInput = document.getElementById('recipeUrl');
        if (urlInput) {
            urlInput.value = urlFromShortcut;
            fetchRecipe();
        }
    }
    displayRecipes();
});

// 1. When the page loads, look for a "?url=" in the address bar
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const urlFromShortcut = params.get('url');
    
    if (urlFromShortcut) {
        // We found a URL! Put it in the box and fetch it automatically
        const urlInput = document.getElementById('recipeUrl');
        if (urlInput) {
            urlInput.value = urlFromShortcut;
            fetchRecipe();
        }
    }
    displayRecipes();
});

// 2. This function does the actual work of getting the recipe info
async function fetchRecipe() {
    const url = document.getElementById('recipeUrl').value;
    if (!url) return;

    // This fetches the website content through a proxy
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
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
        
        saveRecipe(recipeData.title, recipeData.ingredients);
        document.getElementById('recipeUrl').value = '';
    } catch (error) {
        alert("Could not import automatically.");
    }
}

// 3. Save to phone storage
function saveRecipe(title, ingredients) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push({ title, ingredients });
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

// 4. Update the screen
function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    container.innerHTML = recipes.map((recipe, index) => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-top: 15px; border-radius: 8px;">
            <h3>${recipe.title}</h3>
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <button onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}