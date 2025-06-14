,document.addEventListener('DOMContentLoaded', () => {
    const guestForm = document.getElementById('guest-form');
    const guestNameInput = document.getElementById('guest-name');
    const guestCategorySelect = document.getElementById('guest-category');
    const guestList = document.getElementById('guest-list');
    const guestCount = document.getElementById('guest-count');
    
    let guests = [];
    const MAX_GUESTS = 10;
    
    // Load guests from localStorage if available
    if (localStorage.getItem('guests')) {
        guests = JSON.parse(localStorage.getItem('guests'));
        renderGuestList();
    }
    
    guestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = guestNameInput.value.trim();
        const category = guestCategorySelect.value;
        
        if (!name) {
            alert('Please enter a guest name');
            return;
        }
        
        if (guests.length >= MAX_GUESTS) {
            alert(`Guest list is full (maximum ${MAX_GUESTS} guests)`);
            return;
        }
        
        const newGuest = {
            id: Date.now(),
            name,
            category,
            attending: true,
            timestamp: new Date().toLocaleString()
        };
        
        guests.push(newGuest);
        saveGuests();
        renderGuestList();
        
        // Reset form
        guestNameInput.value = '';
        guestNameInput.focus();
    });
    
    function renderGuestList() {
        guestList.innerHTML = '';
        guestCount.textContent = guests.length;
        
        if (guests.length === 0) {
            guestList.innerHTML = '<li class="empty-message">No guests added yet</li>';
            return;
        }
        
        guests.forEach(guest => {
            const guestItem = document.createElement('li');
            guestItem.className = `guest-item ${guest.category}`;
            
            guestItem.innerHTML = `
                <div class="guest-info">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-meta">
                        <span class="guest-category">${guest.category}</span>
                        <span class="guest-time">Added: ${guest.timestamp}</span>
                    </div>
                </div>
                <div class="guest-actions">
                    <button class="rsvp-btn ${guest.attending ? '' : 'not-attending'}" 
                            data-id="${guest.id}">
                        ${guest.attending ? 'Attending' : 'Not Attending'}
                    </button>
                    <button class="edit-btn" data-id="${guest.id}">Edit</button>
                    <button class="delete-btn" data-id="${guest.id}">Remove</button>
                </div>
            `;
            
            guestList.appendChild(guestItem);
        });
        
        // Add event listeners for all action buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
        
        document.querySelectorAll('.rsvp-btn').forEach(btn => {
            btn.addEventListener('click', handleRSVPToggle);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
    }
    
    function handleDelete(e) {
        const guestId = parseInt(e.target.dataset.id);
        guests = guests.filter(guest => guest.id !== guestId);
        saveGuests();
        renderGuestList();
    }
    
    function handleRSVPToggle(e) {
        const guestId = parseInt(e.target.dataset.id);
        const guestIndex = guests.findIndex(guest => guest.id === guestId);
        
        if (guestIndex !== -1) {
            guests[guestIndex].attending = !guests[guestIndex].attending;
            saveGuests();
            renderGuestList();
        }
    }
    
    function handleEdit(e) {
        const guestId = parseInt(e.target.dataset.id);
        const guest = guests.find(guest => guest.id === guestId);
        
        if (guest) {
            const newName = prompt('Edit guest name:', guest.name);
            if (newName && newName.trim() !== '') {
                guest.name = newName.trim();
                saveGuests();
                renderGuestList();
            }
        }
    }
    
    function saveGuests() {
        localStorage.setItem('guests', JSON.stringify(guests));
    }
});