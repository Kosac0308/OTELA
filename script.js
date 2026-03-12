document.addEventListener('DOMContentLoaded', () => {
    // 1) Прикажи тековна година во футер
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2) Open/Closed статус
    const openBadge = document.getElementById('openStatus');
    function checkOpenStatus(now = new Date()){

        const h = now.getHours();
        const m = now.getMinutes();
        const totalMinutes = h*60 + m;

        const open1Start = 8*60;
        const open1End = 24*60;

        const isOpen = totalMinutes >= open1Start && totalMinutes <= open1End
        openBadge.textContent = isOpen ? 'Отворено' : 'Затворено';
        openBadge.classList.toggle('bg-success', isOpen);
        openBadge.classList.toggle('bg-danger', !isOpen);
    }
    checkOpenStatus();
    // освежувај секоја минута
    setInterval(() => checkOpenStatus(new Date()), 60 * 1000);

    // 3) Meni филтрирање
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        filterMenu(filter);
    }));

    function filterMenu(type){
        const items = document.querySelectorAll('.menu-item');
        items.forEach(it => {
            if(type === 'all' || it.dataset.type === type){
                it.style.display = '';
                it.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                it.style.display ='none';
            }
        });
    }

    filterMenu('all');

    // 4) Ingredients modal
    const ingredientsModal = new bootstrap.Modal(document.getElementById('ingredientsModal'));
    document.querySelectorAll('.view-ingredient').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = btn.dataset.name;
            const desc = btn.dataset.desc;
            document.getElementById('ingredientTitle').textContent = name;
            document.getElementById('ingredientBody').textContent = desc;
            ingredientsModal.show();
        });
    });

    // 5) Gallery lightbox
    const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            const full = img.dataset.full || img.src;
            document.getElementById('lightboxImg').src = full;
            lightboxModal.show();
        });
    });

    // 6) Reservation form handling + localStorage
    const reservationForm = document.getElementById('reservationForm');
    const resMsg = document.getElementById('resMsg');

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('resName').value.trim();
        const phone = document.getElementById('resPhone').value.trim();
        const datetime = document.getElementById('resDatetime').value;
        const guests = document.getElementById('resGuests').value;

        if(!name || !phone || !datetime) {
            alert('Внеси валидни податоци во сите полиња.');
            return;
        }

        const reservation = { name, phone, datetime, guests, created: new Date().toISOString() };

        const existing = JSON.parse(localStorage.getItem('reservations') || '[]');
        existing.push(reservation);
        localStorage.setItem('reservations', JSON.stringify(existing));

        resMsg.classList.remove('visually-hidden');
        resMsg.textContent = 'Резервацијата е зачувана. Ви благодариме!';
        reservationForm.reset();


        setTimeout(() => { resMsg.classList.add('visually-hidden'); }, 5000);
    });

    // 7) Top reserve buttons отвараат/скролираат до форма
    document.getElementById('reserveBtnTop').addEventListener('click', () => {
        document.getElementById('resName').focus();
        document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('heroReserve').addEventListener('click', () => {
        document.getElementById('resName').focus();
        document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('heroReserve').addEventListener('keydown', (e) => { if(e.key === 'Enter') e.target.click(); });
    document.getElementById('reserveBtnTop').addEventListener('keydown', (e) => { if(e.key === 'Enter') e.target.click(); });

    // 8) Next event time
    const nextEventTime = document.getElementById('nextEventTime');
    function updateNextEvent(){

        const now = new Date();
        const targetWeekday = 5;
        const daysUntil = (targetWeekday + 7 - now.getDay()) % 7 || 7;
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntil, 22, 0, 0);
        nextEventTime.textContent = `Следен настан: Live DJ Night — ${next.toLocaleDateString()} во ${next.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
    }
    updateNextEvent();

    // 9) Smooth-scrolling for anchor
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const targetId = a.getAttribute('href').slice(1);
            if (!targetId) return;
            const el = document.getElementById(targetId);
            if (el){
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    document.getElementById('lightboxModal').addEventListener('shown.bs.modal', () => {
        document.getElementById('lightboxImg').focus();
    });

});