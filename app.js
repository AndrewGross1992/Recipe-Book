window.onload = function() {
    // 1. Check if a recipe is being passed via the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeData = urlParams.get('recipe');
    
    if (recipeData) {
        const recipe = JSON.parse(decodeURIComponent(recipeData));
        saveRecipe(recipe.title, recipe.ingredients);
        // Clean up the URL so it doesn't re-save if you refresh
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // 2. Display existing recipes
    displayRecipes();
};

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
