document.addEventListener('DOMContentLoaded', () => {
    
    // Переменные окон авторизации и кнопок
    const openAuthBtn = document.getElementById('open-auth-btn');
    const authSection = document.getElementById('auth-section');
    const toggleLogin = document.getElementById('toggle-login');
    const toggleRegister = document.getElementById('toggle-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userProfileNav = document.getElementById('user-profile-nav');
    const navUsername = document.getElementById('nav-username');
    const logoutBtn = document.getElementById('logout-btn');

    // Кнопки и блоки Личного Кабинета
    const surveySection = document.getElementById('survey-section');
    const resultsSection = document.getElementById('results-section');
    const surveyForm = document.getElementById('survey-form');
    
    const weightStatus = document.getElementById('weight-status');
    const waterVal = document.getElementById('water-val');
    const kcalVal = document.getElementById('kcal-val');
    const bVal = document.getElementById('b-val');
    const jVal = document.getElementById('j-val');
    const uVal = document.getElementById('u-val');
    const aiUserPref = document.getElementById('ai-user-pref');
    const weeklyMenuContainer = document.getElementById('weekly-menu-container');

    const weightWidget = document.getElementById('weight-widget');
    const widgetsGrid = document.getElementById('dashboard-widgets-grid');

    // Текущий вошедший пользователь
    let currentUserEmail = localStorage.getItem('ecoNutri_current_user') || null;
    // БАЗА ПРОДУКТОВ НА ВСЮ НЕДЕЛЮ (Чистая, без скобок)
    const foodDatabase = {
        breakfast: [
            "Два вареных яйца, бутерброд с сыром",
            "Овсяная каша на воде с кусочками свежего яблока",
            "Яичница из 2 яиц с помидорами и кусочек ржаного хлеба",
            "Овсяная каша на коровьем молоке с медом",
            "Пачка творога 5% с ложкой натуральной сметаны",
            "Рисовая каша на воде со сливочным маслом и банан",
            "Гречневая каша на воде с кусочком твердого сыра",
            "Два цельнозерновых тоста с вареным куриным филе и свежий огурец",
            "Омлет из 2 яиц на воде с зеленью и укропом",
            "Бутерброды с домашним паштетом и свежий помидор"
        ],
        lunch: [
            "Куриный суп с лапшой + отварная гречка с куриной котлетой",
            "Запеченное филе курицы, макароны твердых сортов и свежий огурец",
            "Домашний борщ на говядине + картофельное пюре без молока с запеченным минтаем",
            "Тушеная свежая капуста с индейкой и одно вареное яйцо",
            "Полезный плов с курицей и легкий салат из капусты",
            "Суп с мясными фрикадельками + рис с тушеной куриной грудкой",
            "Гороховый суп + гречневая каша с домашним говяжьим гуляшом",
            "Запеченная горбуша с картофельным пюре и свежим томатом",
            "Овощной суп + отварные макароны с фаршем индейки",
            "Густой овощной рагу с кусочками нежирной говядины и зеленью"
        ],
        dinner: [
            "Салат из свежих огурцов и помидоров + запеченное филе трески",
            "Отварная гречка с нежной тушеной индейкой",
            "Омлет из 2 яиц с зеленью + стакан нежирного кефира",
            "Натуральный творог с ложкой йогурта и зеленое яблоко",
            "Тушеные кабачки с брокколи и запеченным куриным филе",
            "Запеченный минтай с гарниром из свежей капусты",
            "Салат с куриной грудкой, вареным яйцом и оливковым маслом",
            "Паровые котлеты из индейки с отварным брокколи",
            "Салат из пекинской капусты с тунцом в собственном соку",
            "Стакан натуральной ряженки без добавок"
        ]
    };
    const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

    // Логика умного поиска состава для фильтрации галочек
    function checkMealContains(meal, type) {
        const m = meal.toLowerCase();
        if (type === 'lactose') {
            return m.includes("сыр") || m.includes("молок") || m.includes("творог") || m.includes("сметан") || m.includes("кефир") || m.includes("йогурт") || m.includes("ряженк");
        }
        if (type === 'sugar') {
            return m.includes("мед"); 
        }
        if (type === 'fish') {
            return m.includes("рыб") || m.includes("минтай") || m.includes("горбуш") || m.includes("треск") || m.includes("тунц");
        }
        return false;
    }
    // Логика переключателей вкладок
    openAuthBtn.addEventListener('click', () => { authSection.classList.toggle('hidden'); });
    toggleLogin.addEventListener('click', () => {
        toggleLogin.classList.add('active'); toggleRegister.classList.remove('active');
        loginForm.classList.remove('hidden'); registerForm.classList.add('hidden');
    });
    toggleRegister.addEventListener('click', () => {
        toggleRegister.classList.add('active'); toggleLogin.classList.remove('active');
        registerForm.classList.remove('hidden'); loginForm.classList.add('hidden');
    });

    // Регистрация аккаунта
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        let users = JSON.parse(localStorage.getItem('ecoNutri_users_db')) || {};
        if (users[email]) { alert('Пользователь с таким Email уже существует!'); return; }

        users[email] = { name: name, password: password, dietData: null };
        localStorage.setItem('ecoNutri_users_db', JSON.stringify(users));
        alert('Регистрация успешна! Теперь воспользуйтесь формой Входа.');
        registerForm.reset(); toggleLogin.click();
    });

    // Вход в личный кабинет
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        let users = JSON.parse(localStorage.getItem('ecoNutri_users_db')) || {};
        if (users[email] && users[email].password === password) {
            currentUserEmail = email;
            localStorage.setItem('ecoNutri_current_user', email);
            alert("Вы успешно вошли!");
            loginForm.reset(); authSection.classList.add('hidden'); checkUserStatus();
        } else { alert('Неверный Email или пароль!'); }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('ecoNutri_current_user'); currentUserEmail = null; checkUserStatus();
    });

    function checkUserStatus() {
        if (currentUserEmail) {
            let users = JSON.parse(localStorage.getItem('ecoNutri_users_db')) || {};
            let user = users[currentUserEmail];
            if (user) {
                openAuthBtn.classList.add('hidden'); userProfileNav.classList.remove('hidden');
                navUsername.textContent = user.name;
                if (user.dietData) { showDashboard(user.dietData); } 
                else { surveySection.classList.remove('hidden'); resultsSection.classList.add('hidden'); }
            }
        } else {
            openAuthBtn.classList.remove('hidden'); userProfileNav.classList.add('hidden');
            surveySection.classList.remove('hidden'); resultsSection.classList.add('hidden');
        }
    }

    // Генерация отфильтрованных блюд с пометками только при активных галочках
    function getFilteredMeal(type, filters, usedMeals) {
        const rawMeals = foodDatabase[type];
        let safeMeals = rawMeals.filter(meal => {
            if (filters.noLactose && checkMealContains(meal, 'lactose')) return false;
            if (filters.noSugar && checkMealContains(meal, 'sugar')) return false;
            if (filters.noFish && checkMealContains(meal, 'fish')) return false;
            return true;
        });

        if (safeMeals.length === 0) {
            safeMeals = ["Отварное куриное филе со свежими листьями салата"];
        }

        let uniqueMeals = safeMeals.filter(meal => !usedMeals.includes(meal));
        if (uniqueMeals.length === 0) { uniqueMeals = safeMeals; }

        let selectedMeal = uniqueMeals[Math.floor(Math.random() * uniqueMeals.length)];
        usedMeals.push(selectedMeal); 

        let badges = [];
        if (filters.noLactose) badges.push("без лактозы");
        if (filters.noSugar) badges.push("без сахара");
        if (filters.noNuts) badges.push("без орехов");
        if (filters.noFish) badges.push("без рыбы");

        if (badges.length > 0) {
            return `${selectedMeal} <span style="color:#2ecc71; font-size:13px; font-weight:700;">(${badges.join(', ')})</span>`;
        }
        return selectedMeal;
    }
    // Расчет параметров анкеты
    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUserEmail) {
            alert("Пожалуйста, сначала войдите в систему (кнопка вверху справа)!");
            authSection.classList.remove('hidden');
            authSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        let goal = document.querySelector('input[name="goal"]:checked').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const targetWeight = parseFloat(document.getElementById('target-weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const age = parseInt(document.getElementById('age').value);

        const filters = {
            noLactose: document.getElementById('pref-no-lactose').checked,
            noSugar: document.getElementById('pref-no-sugar').checked,
            noNuts: document.getElementById('pref-no-nuts').checked,
            noFish: document.getElementById('pref-no-fish').checked
        };

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        let wasGoalChanged = false;

        // Если ИМТ показывает нормальный вес, а человек хочет худеть
        if (goal === 'lose' && bmi < 20) {
            alert("⚠️ Забота о здоровье: Ваш текущий вес уже находится в пределах нормы или ниже неё. Вам не нужно худеть! Мы переключили ваше меню на план «ПОДДЕРЖАНИЕ ТОНУСА» без опасного дефицита калорий.");
            goal = 'maintain';
            wasGoalChanged = true;
        }

        let bmr = (gender === 'male') ? (10 * weight + 6.25 * height - 5 * age + 5) : (10 * weight + 6.25 * height - 5 * age - 161);
        let calories = Math.round(bmr * 1.375);

        if (goal === 'lose') calories = Math.round(calories * 0.85);
        else if (goal === 'gain') calories = Math.round(calories * 1.15);

        let proteins = Math.round((calories * (goal === 'lose' ? 0.35 : 0.30)) / 4);
        let fats = Math.round((calories * (goal === 'lose' ? 0.30 : 0.25)) / 9);
        let carbs = Math.round((calories * (goal === 'lose' ? 0.35 : 0.45)) / 4);
        
        const waterLiters = (weight * (gender === 'male' ? 0.035 : 0.030)).toFixed(1);

        const userData = { goal, weight, targetWeight, height, age, calories, proteins, fats, carbs, waterLiters, filters, wasGoalChanged };
        
        let users = JSON.parse(localStorage.getItem('ecoNutri_users_db')) || {};
        if (users[currentUserEmail]) {
            users[currentUserEmail].dietData = userData;
            localStorage.setItem('ecoNutri_users_db', JSON.stringify(users));
        }
        showDashboard(userData);
    });

    // Отрисовка личного кабинета со скрытием таблички веса
    function showDashboard(data) {
        surveySection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

        const diff = data.weight - data.targetWeight;
        
        // Автоматическое скрытие виджета веса при тонусе
        if (data.goal === 'maintain' || data.wasGoalChanged) {
            weightWidget.classList.add('hidden');
            widgetsGrid.classList.add('two-cols');
            
            if (data.wasGoalChanged) {
                weightStatus.innerHTML = `⚠️ <strong>Вам не надо худеть!</strong> Составляем меню для поддержания тонуса (Текущий вес: ${data.weight} кг).`;
            } else {
                weightStatus.innerHTML = `Режим: <strong>Поддержание тонуса</strong>. Питаемся правильно (Текущий вес: ${data.weight} кг).`;
            }
        } else {
            weightWidget.classList.remove('hidden');
            widgetsGrid.classList.remove('two-cols');

            if (diff > 0) {
                weightStatus.innerHTML = `Текущий вес: <strong>${data.weight} кг</strong>. Осталось сбросить до цели: <strong style="color:#27ae60">${diff.toFixed(1)} кг</strong>.`;
            } else if (diff < 0) {
                weightStatus.innerHTML = `Текущий вес: <strong>${data.weight} кг</strong>. Осталось набрать до цели: <strong style="color:#27ae60">${Math.abs(diff).toFixed(1)} кг</strong>.`;
            } else {
                weightStatus.innerHTML = `Вы в своем идеальном целевом весе: <strong>${data.weight} кг</strong>! 🎉`;
            }
        }

        waterVal.textContent = data.waterLiters;
        kcalVal.textContent = `${data.calories} ккал / день`;
        bVal.textContent = data.proteins;
        jVal.textContent = data.fats;
        uVal.textContent = data.carbs;

        let activeLabels = [];
        if (data.filters.noLactose) activeLabels.push("Без лактозы");
        if (data.filters.noSugar) activeLabels.push("Без сахара");
        if (data.filters.noNuts) activeLabels.push("Без орехов");
        if (data.filters.noFish) activeLabels.push("Без рыбы");
        
        aiUserPref.textContent = activeLabels.length > 0 ? activeLabels.join(", ") : "Ограничений нет, стандартное эко-меню.";

        generateWeeklyMenu(data.filters);
    }

    // Показ карточек дней недели на экране
    function generateWeeklyMenu(filters) {
        weeklyMenuContainer.innerHTML = '';
        let usedBreakfasts = [];
        let usedLunches = [];
        let usedDinners = [];

        daysOfWeek.forEach((day) => {
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            dayCard.innerHTML = `
                <div class="day-title">
                    <span>${day}</span>
                    <button class="refresh-day-btn" title="Перемешать блюда">🔄</button>
                </div>
                <div class="meal-item meal-item--breakfast"><strong>Завтрак</strong>${getFilteredMeal('breakfast', filters, usedBreakfasts)}</div>
                <div class="meal-item meal-item--lunch"><strong>Обед</strong>${getFilteredMeal('lunch', filters, usedLunches)}</div>
                <div class="meal-item meal-item--dinner"><strong>Ужин</strong>${getFilteredMeal('dinner', filters, usedDinners)}</div>
            `;
            weeklyMenuContainer.appendChild(dayCard);
        });

        document.querySelectorAll('.refresh-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.day-card');
                card.querySelector('.meal-item--breakfast').innerHTML = `<strong>Завтрак</strong>${getFilteredMeal('breakfast', filters, usedBreakfasts)}`;
                card.querySelector('.meal-item--lunch').innerHTML = `<strong>Обед</strong>${getFilteredMeal('lunch', filters, usedLunches)}`;
                card.querySelector('.meal-item--dinner').innerHTML = `<strong>Ужин</strong>${getFilteredMeal('dinner', filters, usedDinners)}`;
            });
        });
    }

    // Запись веса каждую неделю
    document.getElementById('save-weight-btn').addEventListener('click', () => {
        const newWeightInput = document.getElementById('new-weight');
        const newWeight = parseFloat(newWeightInput.value);
        if (newWeight > 30 && newWeight < 200 && currentUserEmail) {
            let users = JSON.parse(localStorage.getItem('ecoNutri_users_db')) || {};
            if (users[currentUserEmail] && users[currentUserEmail].dietData) {
                users[currentUserEmail].dietData.weight = newWeight;
                localStorage.setItem('ecoNutri_users_db', JSON.stringify(users));
                showDashboard(users[currentUserEmail].dietData);
            }
            newWeightInput.value = '';
            alert("Ваш текущий вес успешно записан!");
        } else { alert("Введите корректное число."); }
    });

    // Сбросить текущее меню
    document.getElementById('reset-data').addEventListener('click', () => {
        if(currentUserEmail) {
            let users = JSON.parse(localStorage.getItem('ecoNutri_users_db')) || {};
            if (users[currentUserEmail]) {
                users[currentUserEmail].dietData = null;
                localStorage.setItem('ecoNutri_users_db', JSON.stringify(users));
            }
        }
        resultsSection.classList.add('hidden');
        surveySection.classList.remove('hidden');
    });

    checkUserStatus();
});
