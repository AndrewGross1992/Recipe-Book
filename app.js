function smartImport() {
    const rawText = document.getElementById('rawRecipe').value;
    if (!rawText) return;

    // Split by lines and filter for lines starting with a number (common ingredient pattern)
    const lines = rawText.split('\n');
    const title = lines[0]; // Assume the first line is the title
    const ingredients = lines.filter(line => /^\d/.test(line.trim())); 
    
    saveRecipe(title, ingredients);
    document.getElementById('rawRecipe').value = '';
}

function saveRecipe(title, ingredients) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push({ title, ingredients });
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
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
            <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            <button onclick="alert('Scaling coming next!')">1/2</button>
            <button onclick="alert('Scaling coming next!')">x2</button>
            <button style="color: red; margin-left: 10px;" onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}

displayRecipes();