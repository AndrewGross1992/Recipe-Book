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
    const url = document.getElementById('recipeUrl').value;
    if (!url) return;

    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const script = doc.querySelector('script[type="application/ld+json"]');
        if (script) {
            const json = JSON.parse(script.innerText);
            const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
            if (recipe) {
                saveRecipe(recipe.name, recipe.recipeIngredient || []);
                document.getElementById('recipeUrl').value = '';
            }
        }
    } catch (error) {
        alert("Import failed. Please check the URL or try another site.");
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