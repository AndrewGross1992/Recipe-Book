window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeData = urlParams.get('recipe');
    
    if (recipeData) {
        try {
            const recipe = JSON.parse(decodeURIComponent(recipeData));
            if (recipe.title && recipe.title !== "undefined") {
                localStorage.setItem('pendingRecipe', JSON.stringify(recipe));
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) { console.error("Error:", e); }
    }
    displayRecipes();
};

function revealPending() {
    const pending = JSON.parse(localStorage.getItem('pendingRecipe'));
    if (pending) {
        let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
        recipes.push(pending);
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        localStorage.removeItem('pendingRecipe');
        displayRecipes(); // Refresh the display
    }
}

function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    const pending = JSON.parse(localStorage.getItem('pendingRecipe'));

    container.innerHTML = ""; // Clear current view

    // Show pending link
    if (pending) {
        container.innerHTML += `
            <div class="pending-link" style="border: 2px dashed blue; padding: 10px; margin-bottom: 20px;">
                <a href="#" onclick="revealPending(); return false;">Click here to add: ${pending.title}</a>
            </div>`;
    }

    // Show saved cards
    if (recipes.length > 0) {
        container.innerHTML += recipes.map((recipe, index) => `
            <div class="recipe-card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px;">
                <h3>${recipe.title}</h3>
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <button onclick="deleteRecipe(${index})">Delete</button>
            </div>
        `).join('');
    }
}

function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.splice(index, 1);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}