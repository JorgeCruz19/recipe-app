import { getMealRandom, getMealById, getMealBySearch } from './fetch.js'
const meals = document.querySelector('.meals')
const favContainer = document.querySelector('.fav-container ul')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('search')
const mealPopup = document.getElementById('meal-popup')
const mealInfoEl = document.querySelector('.meal-info')
getMealRandom().then((food) => {
	addMeal(food)
})
fetchFavMeals()
function addMeal(mealData) {
	const { idMeal, strMeal, strCategory, strMealThumb } = mealData
	const meal = document.createElement('div')
	meal.classList.add('meal')
	meal.innerHTML = `
					<div class="meal-header" height="254px">
						${strCategory ? `<span class="category">${strCategory}</span>` : `<span class="category"></span>`}
						<img src="${strMealThumb}" alt="${strMeal}" />
					</div>
					<div class="meal-body">
						<h4 class="name-recipe">${strMeal}</h4>
						<button>
							<svg width="20px" class="w-6 h-6" fill="none" stroke="red" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								></path>
							</svg>
						</button>
					</div>
	`
	const btn = meal.querySelector('.meal-body button')
	btn.addEventListener('click', () => {
		if (btn.classList.contains('active')) {
			removeMealFromLocalStorage(idMeal)
			btn.classList.remove('active')
		} else {
			addMealToLocalStorage(idMeal)
			btn.classList.add('active')
		}
		fetchFavMeals()
	})
	meal.addEventListener('click', (e) => {
		if (e.target.tagName === 'IMG') {
			showMealInfo(mealData)
		}
	})
	meals.appendChild(meal)
}
function addMealToLocalStorage(mealId) {
	const mealIds = getMealsFromLocalStorage()
	localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}
function removeMealFromLocalStorage(mealId) {
	const mealIds = getMealsFromLocalStorage()
	localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)))
}
function getMealsFromLocalStorage() {
	const mealIds = JSON.parse(localStorage.getItem('mealIds'))
	return mealIds === null ? [] : mealIds
}
async function fetchFavMeals() {
	//Clean
	favContainer.innerHTML = ''
	const mealIds = getMealsFromLocalStorage()
	if (mealIds.length > 0) {
		for (let i = 0; i < mealIds.length; i++) {
			const mealId = mealIds[i]
			let meal = await getMealById(mealId)
			addMealFavorite(meal)
		}
	} else {
		favContainer.innerHTML = `<p class="not-available">You haven't favorite recipes</p>`
	}
}
function addMealFavorite(meal) {
	const favMeal = document.createElement('li')
	const { idMeal, strMeal, strMealThumb } = meal
	favMeal.innerHTML = `
			<img src="${strMealThumb}" alt="${strMeal}" />
			<span>${strMeal}</span>
			<button class="clear">
				<svg height="20" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
			</button>
		`
	const btn = favMeal.querySelector('.clear')
	btn.addEventListener('click', () => {
		removeMealFromLocalStorage(idMeal)
		fetchFavMeals()
	})
	favMeal.addEventListener('click', (e) => {
		if (e.target.tagName === 'IMG') {
			showMealInfo(meal)
		}
	})
	favContainer.appendChild(favMeal)
}
function showMealInfo(mealData) {
	mealInfoEl.innerHTML = ''
	const meal = document.createElement('div')
	const { strMeal, strMealThumb, strInstructions } = mealData
	const ingredients = []
	for (let i = 1; i <= 20; i++) {
		if (mealData['strIngredient' + i]) {
			ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`)
		} else {
			break
		}
	}
	meal.innerHTML = `
		<div class='popup-header'>
		<h2>${strMeal}</h2>
		<button class="close-popup">
			<svg height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		</button>
		</div>
		<hr>
		<div class='grid-popup'>
			<img class='popup-image' src="${strMealThumb}" alt="${strMeal}" />
			<p class='popup-instructions'>${strInstructions}</p>
		</div>
		<h3 class='popup-subtitle'>Ingredients</h3>	
		<ul class='popup-ingredients'>
			${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
		</ul>
	`
	//Close popup
	const closeBtnPopup = meal.querySelector('.close-popup')
	closeBtnPopup.addEventListener('click', () => {
		mealPopup.classList.add('hidden')
	})
	mealPopup.classList.remove('hidden')
	mealInfoEl.appendChild(meal)
}
async function searchMeals() {
	meals.innerHTML = ''
	const loaderEl = document.createElement('div')
	loaderEl.classList.add('loader')
	meals.appendChild(loaderEl)
	loaderEl.style.display = 'block'
	const search = searchInput.value
	const mealsSearch = await getMealBySearch(search)
	if (mealsSearch) {
		mealsSearch.forEach((meal) => {
			addMeal(meal)
		})
		loaderEl.style.display = 'none'
		meals.removeChild(loaderEl)
	} else {
		meals.innerHTML = `<p class="not-available"><strong>${search}</strong> is not available</p>`
	}
}
//Events Searchs
searchBtn.addEventListener('click', searchMeals)
searchInput.addEventListener('keypress', (e) => {
	if (e.key == 'Enter') {
		searchMeals()
	}
})
