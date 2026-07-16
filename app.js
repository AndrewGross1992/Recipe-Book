async function fetchRecipe() {
    const urlInput = document.getElementById('recipeUrl');
    const url = urlInput.value;
    
    if (!url) return;

    // Use a different proxy service or a more direct fetch
    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Proxy server error: " + response.status);
        
        const data = await response.json();
        
        // This log helps us see what the proxy actually returned in the browser console
        console.log("Proxy Data:", data);
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const script = doc.querySelector('script[type="application/ld+json"]');
        
        if (!script) {
            alert("Success! But no recipe data found on this specific page.");
            return;
        }

        const json = JSON.parse(script.innerText);
        const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
        
        if (recipe) {
            saveRecipe(recipe.name, recipe.recipeIngredient || []);
            urlInput.value = '';
        } else {
            alert("Found JSON, but it's not a recipe.");
        }
    } catch (error) {
        // This will tell us if it's a network issue
        alert("Fetch failed. Error details: " + error.message);
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
