// Function to add a new recipe
function addRecipe() {
    const titleInput = document.getElementById('recipeTitle');
    if (titleInput.value.trim() === "") return; // Don't add empty recipes

    const newRecipe = { 
        title: titleInput.value,
        multiplier: 1 // Starts at normal size
    };
    
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push(newRecipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    
    titleInput.value = ''; // Clear the input box
    displayRecipes();
}

// Function to delete a recipe
function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.splice(index, 1);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

// Function to handle scaling math
function scaleRecipe(index, factor) {
    // Note: This is the logic hook for your scaling.
    // For now, it just shows an alert to confirm the button works.
    alert("You want to scale recipe #" + (index + 1) + " by " + factor + "x!");
}

// Function to display recipes on the screen
function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    
    if (recipes.length === 0) {
        container.innerHTML = "<p>No recipes added yet.</p>";
        return;
    }
    
    container.innerHTML = recipes.map((recipe, index) => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-top: 15px; border-radius: 8px;">
            <h3 style="margin-top: 0;">${recipe.title}</h3>
            <button onclick="scaleRecipe(${index}, 0.5)">1/2</button>
            <button onclick="scaleRecipe(${index}, 2)">x2</button>
            <button onclick="scaleRecipe(${index}, 4)">x4</button>
            <button style="color: red; margin-left: 10px;" onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}

// Initial display on load
displayRecipes();