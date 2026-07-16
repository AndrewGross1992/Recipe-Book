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
        } catch (e) { console.error("Error parsing data:", e); }
    }
    displayRecipes();
};

function revealPending() {
    const pending = JSON.parse(localStorage.getItem('pendingRecipe'));
    if (pending) {
        saveRecipe(pending.title, pending.ingredients);
        localStorage.removeItem('pendingRecipe');
        displayRecipes();
    }
}

function saveRecipe(title, ingredients) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push({ title, ingredients });
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
}

function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    const pending = JSON.parse(localStorage.getItem('pendingRecipe'));

    container.innerHTML = "";

    if (pending) {
        container.innerHTML += `<div class="pending-link"><a href="#" onclick="revealPending(); return false;">Click here to add: ${pending.title}</a></div>`;
    }

    container.innerHTML += recipes.map((recipe, index) => `
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