// --- 1. Manual Add ---
function addRecipe() {
    const titleInput = document.getElementById('recipeTitle');
    if (titleInput.value.trim() === "") return;
    
    saveToStorage({ title: titleInput.value });
    titleInput.value = '';
    displayRecipes();
}

// --- 2. Web Fetcher ---
async function fetchRecipe() {
    const url = document.getElementById('recipeUrl').value;
    if (!url) return;

    const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    
    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Look for the hidden JSON-LD recipe data
        const script = doc.querySelector('script[type="application/ld+json"]');
        let recipeData = { title: "Unknown Recipe" };
        
        if (script) {
            const json = JSON.parse(script.innerText);
            // Handle different types of JSON-LD structures
            const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
            if (recipe) {
                recipeData = {
                    title: recipe.name,
                    ingredients: recipe.recipeIngredient // This is the list!
                };
            }
        }
        
        saveToStorage(recipeData);
        document.getElementById('recipeUrl').value = '';
        displayRecipes();
    } catch (error) {
        alert("This site's format is too complex to grab automatically.");
    }
}

// --- 3. Storage Helpers ---
function saveToStorage(recipe) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.push(recipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
}

function deleteRecipe(index) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    recipes.splice(index, 1);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

// --- 4. Display Logic ---
function displayRecipes() {
    const container = document.getElementById('recipe-container');
    const recipes = JSON.parse(localStorage.getItem('myRecipes') || '[]');
    
    container.innerHTML = recipes.map((recipe, index) => `
        <div style="border: 1px solid #ddd; padding: 15px; margin-top: 15px; border-radius: 8px;">
            <h3>${recipe.title}</h3>
            <ul>${recipe.ingredients ? recipe.ingredients.map(i => `<li>${i}</li>`).join('') : 'No ingredients found.'}</ul>
            <button onclick="alert('Scaling logic next!')">1/2</button>
            <button onclick="alert('Scaling logic next!')">x2</button>
            <button style="color: red; margin-left: 10px;" onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}

displayRecipes();