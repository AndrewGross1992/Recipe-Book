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
        const title = doc.querySelector('h1') ? doc.querySelector('h1').innerText : "Unknown Recipe";
        
        saveToStorage({ title: title });
        document.getElementById('recipeUrl').value = '';
        displayRecipes();
    } catch (error) {
        alert("Couldn't grab the recipe automatically. Try manual entry!");
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
            <button onclick="alert('Scaling math coming next!')">1/2</button>
            <button onclick="alert('Scaling math coming next!')">x2</button>
            <button style="color: red; margin-left: 10px;" onclick="deleteRecipe(${index})">Delete</button>
        </div>
    `).join('');
}

displayRecipes();