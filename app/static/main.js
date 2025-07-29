
document.addEventListener("DOMContentLoaded", function () {
    // Calendar stuff
    if (typeof FullCalendar != 'undefined') {
        const calendarEl = document.getElementById('calendar');

        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
            },
            events: [
                {
                    title: 'Meeting',
                    start: '2025-07-22T10:30:00',
                    end: '2025-07-22T12:30:00'
                }
            ],
            selectable: true,
            select: function(info) {
                const title = prompt('Enter event title:');
                if (title) {
                    calendar.addEvent({
                        title: title,
                        start: info.startStr,
                        end: info.endStr,
                        allDay: info.allDay
                    });
                    
                    // TODO: This will be used for Flask later..
                    // fetch('/add-event', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({
                    //         title: title,
                    //         start: info.startStr,
                    //         end: info.endStr
                    //     })
                    // });
                }
            },
            eventClick: function(info) {
                const confirmed = confirm(`Delete event "${info.event.title}"?`);
                if (confirmed) {
                    info.event.remove();
                    
                    // TODO: This will be used for Flask later
                    // fetch('/delete-event', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({
                    //         id: info.event.id 
                    //     })
                    // });
                }
            }
        });

        calendar.render();
    }   

    // Popup stuff
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target !== overlay) return;

            overlay.classList.remove('show');
        });
    });

    function openPopup(id) {
        const overlay = document.getElementById(id);
        overlay.classList.add('show');
    }

    function closePopup(id) {
        const overlay = document.getElementById(id);
        if (!overlay) return;

        overlay.classList.remove('show');
    }

    document.querySelectorAll('.add-user-btn').forEach(btn => {

        btn.addEventListener('click', () => {

            const type = btn.getAttribute('data-type');

            if (type === 'users') {
                openPopup('user-add-popup');
            } else if (type === 'role') {
                openPopup('role-add-popup');
            }
        });
    });


    document.querySelectorAll('#view-user').forEach(btn => {
        btn.addEventListener('click', () => {
            openPopup('profile-details-popup');
        }); 
    });

    document.querySelectorAll('#edit-user').forEach(btn => {
        btn.addEventListener('click', () => {
            openPopup('user-edit-popup');
        });
    });

    document.querySelectorAll('#delete-role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openPopup('role-removal-popup');
        });
    });

    document.querySelectorAll('.details').forEach(btn => {
        btn.addEventListener('click', () => {
            openPopup('invoice-details-popup');
        });
    });

    document.querySelectorAll('#invoice-set-note').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            closePopup('invoice-details-popup')

            openPopup('invoice-set-note-popup');
        });
    });

    document.querySelectorAll('#note-back').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            closePopup('invoice-set-note-popup')

            openPopup('invoice-details-popup');
        });
    });

    document.querySelectorAll('#upload-invoice').forEach(btn => {
        btn.addEventListener('click', () => {
            openPopup('invoice-upload-popup');
        });
    });

    document.querySelectorAll('#invoice-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            closePopup('invoice-upload-popup');
        });
    });

    document.querySelectorAll('[data-popup-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const popupId = btn.getAttribute('data-popup-close');
            const popup = document.getElementById(popupId);
            if (popup) closePopup(popupId);
        });
    }); 

    document.querySelector('#todo-create')?.addEventListener('click', () => {
        openPopup('todo-create-popup');
    });

    document.querySelector('#todo-close')?.addEventListener('click', () => {
        closePopup('todo-edit-popup');
    });

    document.querySelectorAll('#todo-view-details').forEach(btn => {
        btn.addEventListener('click', () => {
            openPopup('todo-edit-popup');
        });
    });

    document.querySelector('.logout-button')?.addEventListener('click', () => {
        openPopup('profile-logout');
    });

    const burger = document.querySelector('.burger');
    const sidebarButtons = document.querySelector('.sidebar-wrapper');

    burger.addEventListener('click', () => {
        sidebarButtons.classList.toggle('active');
    });

    document.querySelector('.item-inputs')?.addEventListener('click', function(e) {
        if (e.target.closest('button')) {
            e.preventDefault();

            const itemToDelete = e.target.closest('.item-input');
            if (itemToDelete) {
                itemToDelete.remove();
            }
        }
    });
    
    document.getElementById('add-item')?.addEventListener('click', (e) => {
        e.preventDefault();
        
        const container = document.querySelector('.item-inputs');
        const deleteIcon = container.getAttribute('data-delete-icon');

        const newItem = document.createElement('div');
        newItem.classList.add('item-input');
        newItem.innerHTML = `
            <input type="text" class="item-input-name" name="item_name[]" placeholder="Item name" required>
            <input type="number" class="item-input-price" min="1" name="item_price[]" placeholder="Amount" style="width: 100px;" required>
            <input type="number" class="item-input-qty" min="1" max="99" name="item_qty[]" placeholder="Quantity" style="width: 100px; margin-right: 50px" required>
            <button type="button"><img src="${deleteIcon}"></button>
        `;

        container.appendChild(newItem);
    });

    const tabs = {
        users: document.getElementById('user-tab'),
        roles: document.getElementById('role-tab'),
        invoices: document.getElementById('invoices-tab'),
        statistics: document.getElementById('stat-tab')
    };

    const buttons = {
        users: document.querySelector('.panel-admin-users-btn'),
        roles: document.querySelector('.panel-admin-roles-btn'),
        invoices: document.querySelector('.panel-admin-invoices-btn'),
        statistics: document.querySelector('.panel-admin-stat-btn')
    };

    const addEntityBtn = document.getElementById('add-entity-btn');

    function showTab(tabName) {
        Object.entries(tabs).forEach(([name, el]) => {
        el.style.display = name === tabName ? 'block' : 'none';
        });

        Object.entries(buttons).forEach(([name, btn]) => {
        btn.classList.toggle('active', name === tabName);
        });

        if (tabName === 'users') {
            addEntityBtn.textContent = 'Add user';
            addEntityBtn.style.display = 'inline-block';
            addEntityBtn.setAttribute("data-type", "users");
        
        } else if (tabName === 'roles') {
            addEntityBtn.textContent = 'Add role';
            addEntityBtn.style.display = 'inline-block';
            addEntityBtn.setAttribute("data-type", "role");

        } else {
            addEntityBtn.removeAttribute("data-type");
            addEntityBtn.style.display = 'none'; 
        }
    }

    document.querySelector('.panel-admin-users-btn')?.addEventListener('click', () => showTab('users'));
    document.querySelector('.panel-admin-roles-btn')?.addEventListener('click', () => showTab('roles'));
    document.querySelector('.panel-admin-invoices-btn')?.addEventListener('click', () => showTab('invoices'));
    document.querySelector('.panel-admin-stat-btn')?.addEventListener('click', () => showTab('statistics'));

    // listeners for the statistic tab
    document.querySelector('#stat-team')?.addEventListener('click', () => showTab('users'));
    document.querySelector('#stat-invoices')?.addEventListener('click', () => showTab('invoices'));
    document.querySelector('#stat-roles')?.addEventListener('click', () => showTab('roles'));

    showTab('users');
});

document.addEventListener('mousemove', (e) => {
    const layers = document.querySelectorAll('.parallax');
    const x = (e.clientX - window.innerWidth / 2) / 100;
    const y = (e.clientY - window.innerHeight / 2) / 175;

    layers.forEach((layer, index) => {
        const depth = (index + 1) * 1.01;
        layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
});