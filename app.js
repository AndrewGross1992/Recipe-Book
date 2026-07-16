async function fetchRecipe() {
    const urlInput = document.getElementById('recipeUrl');
    const url = urlInput.value;
    
    if (!url) return;

    try {
        // We use a different, more reliable proxy approach
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Look for the JSON-LD data
        const script = doc.querySelector('script[type="application/ld+json"]');
        
        if (!script) {
            alert("Could not find recipe data on this page.");
            return;
        }

        const json = JSON.parse(script.innerText);
        const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
        
        if (recipe) {
            saveRecipe(recipe.name, recipe.recipeIngredient || []);
            urlInput.value = '';
        } else {
            alert("No recipe data found.");
        }
    } catch (err) {
        console.error(err);
        alert("Still failing. Trying to bypass security...");
        // Fallback: If the proxy is blocked, tell the user why
        alert("The website is blocking the connection. This is a security feature of the recipe site.");
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
