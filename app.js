// Function to handle the manual URL input
async function fetchRecipe() {
    const urlInput = document.getElementById('recipeUrl').value;
    
    // Simple check to make sure the user actually pasted something
    if (!urlInput || !urlInput.startsWith('http')) {
        alert("Please paste a valid recipe URL (starting with http...)");
        return;
    }

    console.log("Fetching recipe from:", urlInput);
    
    // For now, we will just alert the URL to prove the button is "hearing" you.
    // We will add the actual "fetching" logic in the next step.
    alert("System received URL: " + urlInput);
}
