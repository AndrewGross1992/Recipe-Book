window.onload = function() {
    // 1. Look for recipe data in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeData = urlParams.get('recipe');
    
    if (recipeData) {
        try {
            const recipe = JSON.parse(decodeURIComponent(recipeData));
            saveRecipe(recipe.title, recipe.ingredients);
            // Clean the URL so the recipe isn't re-saved on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) { console.error("Error saving recipe:", e); }
    }
    
    displayRecipes();
};

function saveRecipe(title, ingredients) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push({ title, ingredients });
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
}

function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    
    if (recipes.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>No recipes saved yet. Open a recipe in Safari, tap your 'Save Recipe' bookmarklet, and it will appear here!</p>";
        return;
    }

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