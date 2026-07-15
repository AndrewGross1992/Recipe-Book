// This function will eventually save the recipe to the phone's memory
function saveRecipe(recipeData) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push(recipeData);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    alert('Recipe saved!');
    displayRecipes();
}

// This function will list the saved recipes on the main screen
function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    
    container.innerHTML = recipes.map((recipe, index) => `
        <div class="recipe-card">
            <h3>${recipe.title}</h3>
            <button onclick="scaleRecipe(${index}, 0.5)">1/2</button>
            <button onclick="scaleRecipe(${index}, 2)">x2</button>
        </div>
    `).join('');
}

// This is where we will add the math logic later
function scaleRecipe(index, multiplier) {
    console.log("Scaling recipe " + index + " by " + multiplier);
    // We will build the math logic here next!
}

// Initial display on load
displayRecipes();