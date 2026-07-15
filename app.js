window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const urlFromShortcut = params.get('url');
    
    if (urlFromShortcut) {
        // If we found a URL, put it in the input and trigger the fetch
        const urlInput = document.getElementById('recipeUrl');
        if (urlInput) {
            urlInput.value = urlFromShortcut;
            fetchRecipe();
        }
    } else {
        displayRecipes();
    }
});

async function fetchRecipe() {
    const urlInput = document.getElementById('recipeUrl');
    const url = urlInput.value;
    
    if (!url) {
        alert("No URL found in the box!");
        return;
    }

    // Try fetching
    try {
        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const script = doc.querySelector('script[type="application/ld+json"]');
        
        if (!script) {
            alert("Could not find recipe data on this page. (No JSON-LD found)");
            return;
        }

        const json = JSON.parse(script.innerText);
        const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
        
        if (recipe) {
            saveRecipe(recipe.name, recipe.recipeIngredient || []);
            urlInput.value = '';
        } else {
            alert("Found JSON, but it doesn't look like a recipe.");
        }
    } catch (error) {
        alert("Fetch error: " + error.message);
    }
}

function saveRecipe(title, ingredients) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push({ title, ingredients });
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

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

function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.splice(index, 1);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}