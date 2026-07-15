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
        
        // Let's check if the proxy actually got the website data
        if (!data.contents) {
            alert("Proxy error: Could not reach the website.");
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        const script = doc.querySelector('script[type="application/ld+json"]');
        if (!script) {
            alert("No recipe data found on this page. The site might not use standard formatting.");
            return;
        }

        const json = JSON.parse(script.innerText);
        const recipe = Array.isArray(json) ? json.find(i => i['@type'] === 'Recipe') : json;
        
        if (recipe) {
            saveToStorage({ 
                title: recipe.name, 
                ingredients: recipe.recipeIngredient 
            });
            displayRecipes();
        } else {
            alert("Found a script, but it didn't look like a recipe.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
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