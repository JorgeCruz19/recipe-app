export const getMealRandom = async () => {
	const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
	const data = await resp.json()
	const mealData = data.meals[0]
	return mealData
}
export const getMealById = async (id) => {
	const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
	const data = await resp.json()
	const mealData = data.meals[0]
	return mealData
}
export const getMealBySearch = async (recipeName) => {
	const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
	const data = await resp.json()
	const mealData = data.meals
	return mealData
}
