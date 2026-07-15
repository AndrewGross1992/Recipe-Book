function saveManualRecipe() {
    const titleInput = document.getElementById('recipeTitle');
    const ingredientsInput = document.getElementById('recipeIngredients');
    
    if (titleInput.value.trim() === "") return;

    const newRecipe = { 
        title: titleInput.value,
        ingredients: ingredientsInput.value.split('\n')
    };
    
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push(newRecipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    
    titleInput.value = '';
    ingredientsInput.value = '';
    displayRecipes();
}

function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.splice(index, 1);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    
    container.innerHTML = recipes.map((recipe, index) => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-top: 15px; border-radius: 8px;">
            <h3>${recipe.title}</h3>
            <ul>
                ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
            </ul>
            <button onclick="alert('Scaling math coming next!')">1/2</button>
            <button onclick="alert('Scaling math coming next!')">x2</button>
            <button style="color: red; margin-left: 10px;" onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}

displayRecipes();