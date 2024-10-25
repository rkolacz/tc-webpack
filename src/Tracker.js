import Storage from './Storage';

class CalorieTracker {
	constructor() {
		this._calorieLimit = Storage.getCalorieLimit();
		this._totalCalories = Storage.getTotalCalories();
		this._meals = Storage.getMeals();
		this._workouts = Storage.getWorkouts();

		this._dislpayCaloriesLimit();
		this._dislpayCaloriesTotal();
		this._dislpayCaloriesConsumed();
		this._dislpayCaloriesBurned();
		this._displayCaloriesReamining();
		this._dislpayCaloriesProgress();

		document.getElementById('limit').value = this._calorieLimit;
	}
	// public methods/API
	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveMeal(meal);
		this._displayNewMeal(meal);
		this._render();
	}

	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveWorkouts(workout);
		this._displayNewWorkout(workout);
		this._render();
	}

	removeMeal(id) {
		const index = this._meals.findIndex((meal) => meal.id === id);

		if (index !== -1) {
			const meal = this._meals[index];
			this._totalCalories -= meal.calories;
			Storage.updateTotalCalories(this._totalCalories);
			this._meals.splice(index, 1);
			Storage.removeMeal(id);
			this._render();
		}
	}

	removeWorkout(id) {
		const index = this._workouts.findIndex((workout) => workout.id === id);

		if (index !== -1) {
			const workout = this._workouts[index];
			this._totalCalories += workout.calories;
			Storage.updateTotalCalories(this._totalCalories);
			this._workouts.splice(index, 1);
			Storage.removeWorkout(id);
			this._render();
		}
	}

	reset() {
		this._totalCalories = 0;
		this._meals - [];
		this._workouts = [];
		Storage.clearAll();
		this._render();
	}

	setLimit(calorieLimit) {
		this._calorieLimit = calorieLimit;
		Storage.setCalorieLimit(calorieLimit);
		this._dislpayCaloriesLimit();
		this._render;
	}

	loadItems() {
		this._meals.forEach((meal) => this._displayNewMeal(meal));
		this._workouts.forEach((workout) => this._displayNewWorkout(workout));
	}

	// private methods

	_dislpayCaloriesTotal() {
		const totalCaloriesElement = document.getElementById('calories-total');
		totalCaloriesElement.innerHTML = this._totalCalories;
	}

	_dislpayCaloriesLimit() {
		const limitCaloriesElement = document.getElementById('calories-limit');
		limitCaloriesElement.innerHTML = this._calorieLimit;
	}

	_dislpayCaloriesConsumed() {
		const caloriesConsumedElement =
			document.getElementById('calories-consumed');

		const consumed = this._meals.reduce(
			(total, meal) => total + meal.calories,
			0
		);

		caloriesConsumedElement.innerHTML = consumed;
	}

	_dislpayCaloriesBurned() {
		const caloriesBurnedElement = document.getElementById('calories-burned');

		const burned = this._workouts.reduce(
			(total, workout) => total + workout.calories,
			0
		);

		caloriesBurnedElement.innerHTML = burned;
	}

	_displayCaloriesReamining() {
		const caloriesReaminingElement =
			document.getElementById('calories-remaining');
		const progressElement = document.getElementById('calorie-progress');

		const remaining = this._calorieLimit - this._totalCalories;

		caloriesReaminingElement.innerHTML = remaining;

		if (remaining <= 0) {
			caloriesReaminingElement.parentElement.parentElement.classList.remove(
				'bg-light'
			);
			caloriesReaminingElement.parentElement.parentElement.classList.add(
				'bg-danger'
			);
			progressElement.classList.remove('bg-success');
			progressElement.classList.add('bg-danger');
		} else {
			caloriesReaminingElement.parentElement.parentElement.classList.remove(
				'bg-danger'
			);
			caloriesReaminingElement.parentElement.parentElement.classList.add(
				'bg-light'
			);
			progressElement.classList.remove('bg-danger');
			progressElement.classList.add('bg-success');
		}
	}

	_dislpayCaloriesProgress() {
		const progressElement = document.getElementById('calorie-progress');
		const percentage = (this._totalCalories / this._calorieLimit) * 100;
		const width = Math.min(percentage, 100);
		progressElement.style.width = `${width}%`;
	}

	_displayNewMeal(meal) {
		const mealsElements = document.getElementById('meal-items');
		const oneMealElement = document.createElement('div');
		oneMealElement.classList.add('card', 'my-2');
		oneMealElement.setAttribute('data-id', meal.id);
		oneMealElement.innerHTML = `
		<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
			  `;

		mealsElements.appendChild(oneMealElement);
	}

	_displayNewWorkout(workout) {
		const workoutsElements = document.getElementById('workout-items');
		const oneWorkoutElement = document.createElement('div');
		oneWorkoutElement.classList.add('card', 'my-2');
		oneWorkoutElement.setAttribute('data-id', workout.id);
		oneWorkoutElement.innerHTML = `
		<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
			  `;

		workoutsElements.appendChild(oneWorkoutElement);
	}

	_render() {
		this._dislpayCaloriesTotal();
		this._dislpayCaloriesConsumed();
		this._dislpayCaloriesBurned();
		this._displayCaloriesReamining();
		this._dislpayCaloriesProgress();
	}
}

export default CalorieTracker;
