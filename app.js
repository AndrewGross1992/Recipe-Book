async function fetchRecipe() {
    const url = document.getElementById('recipeUrl').value;
    if (!url) return;

    // Use a proxy to fetch the content since browsers block direct access
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Most recipe sites use JSON-LD for data
        const script = doc.querySelector('script[type="application/ld+json"]');
        if (script) {
            const json = JSON.parse(script.innerText);
            // Handle cases where JSON-LD is an array or a single object
            const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
            
            if (recipe) {
                saveRecipe(recipe.name, recipe.recipeIngredient || []);
                document.getElementById('recipeUrl').value = ''; // Clear the input
            } else {
                alert("Could not find recipe data on this page.");
            }
        }
    } catch (error) {
        alert("Fetch error: " + error.message);
    }
}

function saveRecipe(title, ingredients) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push({ title, ingredients });
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes(); // Refresh the list
}

function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    container.innerHTML = recipes.map((recipe, index) => `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <button onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}

function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.splice(index, 1);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

// Ensure recipes display when the page loads
window.onload = displayRecipes;
