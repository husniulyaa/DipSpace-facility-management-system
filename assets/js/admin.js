function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.navigation-item').forEach(nav => {
        nav.classList.remove('active');
    });
    
    const navId = tabId.replace('tab-', 'nav-btn-');
    const activeNav = document.getElementById(navId);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

function toggleFacilityStatus(rowId, facilityName) {
    const row = document.getElementById(rowId);
    if (!row) return;

    const badge = row.querySelector('.badge');
    const actionBtn = row.querySelectorAll('.action-buttons button')[1];

    if (badge.innerText.includes('Aktif')) {
        if (confirm(`Nonaktifkan "${facilityName}"?\nFasilitas ini tidak akan tampil di katalog peminjaman publik.`)) {
            badge.className = 'badge neutral';
            badge.innerText = 'Nonaktif';
            
            actionBtn.className = 'button button-primary button-fixed';
            actionBtn.innerText = 'Aktifkan';
            alert(`Fasilitas "${facilityName}" telah DINONAKTIFKAN.`);
        }
    } else {
        badge.className = 'badge success';
        badge.innerText = 'Aktif';
        
        actionBtn.className = 'button button-danger button-fixed';
        actionBtn.innerText = 'Nonaktifkan';
        alert(`Fasilitas "${facilityName}" telah DIAKTIFKAN KEMBALI.`);
    }
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.classList.toggle('hidden');
}

window.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown-wrapper')) {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(menu => {
            if (!menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
            }
        });
    }
});

let currentEditingRowId = '';
let currentEditingImage = '';

function openEditModal(rowId, name, category, location, capacity, address = '', imageFile = '') {
    currentEditingRowId = rowId;
    currentEditingImage = imageFile;
    
    document.getElementById('edit-facility-name').value = name;
    document.getElementById('edit-facility-category').value = category;
    document.getElementById('edit-facility-location').value = location;
    document.getElementById('edit-facility-capacity').value = capacity;
    document.getElementById('edit-facility-address').value = address;
    
    const imgPreview = document.getElementById('edit-facility-image-preview');
    const noImgText = document.getElementById('edit-facility-no-image');

    if (imageFile && imageFile.trim() !== '') {
        imgPreview.src = 'assets/images/' + imageFile;
        imgPreview.classList.remove('hidden');
        noImgText.classList.add('hidden');
    } else {
        imgPreview.src = '';
        imgPreview.classList.add('hidden');
        noImgText.classList.remove('hidden');
    }
    
    openModal('modal-edit-facility');
}

function submitEditFacility() {
    const name = document.getElementById('edit-facility-name').value;
    const category = document.getElementById('edit-facility-category').value;
    const location = document.getElementById('edit-facility-location').value;
    const capacity = document.getElementById('edit-facility-capacity').value;
    const address = document.getElementById('edit-facility-address').value;

    if (!name.trim() || !capacity) {
        alert('Nama fasilitas dan kapasitas wajib diisi!');
        return;
    }

    const row = document.getElementById(currentEditingRowId);
    if (row) {
        row.cells[0].querySelector('.font-bold').innerText = name;
        row.cells[1].innerText = category;
        row.cells[2].innerText = location;
        row.cells[3].innerText = `${capacity} Orang`;

        const editBtn = row.querySelectorAll('.action-buttons button')[0];
        
        editBtn.setAttribute('onclick', `openEditModal('${currentEditingRowId}', '${name.replace(/'/g, "\\'")}', '${category}', '${location}', ${capacity}, '${address.replace(/'/g, "\\'")}', '${currentEditingImage}')`);
    }

    alert(`Data fasilitas "${name}" berhasil diperbarui!`);
    closeModal('modal-edit-facility');
}

function detectRole() {
    const email = document.getElementById('user-email').value.toLowerCase();
    const roleBox = document.getElementById('detected-role');
    
    if (email.includes('@students.undip.ac.id')) {
        roleBox.innerText = 'Mahasiswa';
        roleBox.style.color = 'var(--primary)';
    } else if (email.includes('@lectures.undip.ac.id')) {
        roleBox.innerText = 'Dosen';
        roleBox.style.color = 'var(--succes)';
    } else if (email.includes('@staff.undip.ac.id')) {
        roleBox.innerText = 'Staf Akademik';
        roleBox.style.color = 'var(--warning)';
    } else if (email.includes('@facillity.undip.ac.id')) {
        roleBox.innerText = 'Petugas';
        roleBox.style.color = 'var(--danger)';
    } else if (email.includes('@admin.undip.ac.id')) {
        roleBox.innerText = 'Administrator';
        roleBox.style.color = 'var(--danger)';
    } else if (email.length > 5) {
        roleBox.innerText = 'Domain tidak dikenali';
        roleBox.style.color = 'var(--text-primary)';
    } else {
        roleBox.innerText = 'Menunggu input email...';
        roleBox.style.color = 'var(--text-muted)';
    }
}

function submitAddUser() {
    const name = document.getElementById('user-name').value;
    const nim = document.getElementById('user-nim').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('detected-role').innerText;

    if (!name.trim() || !nim.trim() || !email.trim()) {
        alert('Nama, NIM/NIP, dan Email wajib diisi!');
        return;
    }
    
    if (role.includes('Menunggu')) {
        alert('Format email belum lengkap atau tidak valid.');
        return;
    }

    if (role.includes('Menunggu') || role.includes('tidak dikenali')) {
        alert('Pendaftaran ditolak! Harap gunakan email resmi institusi yang valid.');
        return;
    }

    alert(`Akun berhasil didaftarkan!\n\nNama: ${name}\nIdentitas: ${nim}\nEmail: ${email}\nRole: ${role}`);
    closeModal('modal-add-user');

    document.getElementById('user-name').value = '';
    document.getElementById('user-nim').value = '';
    document.getElementById('user-email').value = '';
    
    const roleBox = document.getElementById('detected-role');
    roleBox.innerText = 'Menunggu input email...';
    roleBox.style.color = 'var(--text-muted)';
}

function verifyAccount(rowId, userName) {
    alert(`Akun pengguna ${userName} berhasil diverifikasi dan aktif.`);
    const row = document.getElementById(rowId);
    if (row) row.remove();
    
    const badge = document.getElementById('badge-pending-accounts');
    if (badge) {
        let count = parseInt(badge.innerText);
        if (count > 0) badge.innerText = count - 1;
    }
}

function rejectAccount(rowId) {
    const reason = prompt('Masukkan alasan penolakan pendaftaran akun:');
    if (reason !== null && reason.trim() !== '') {
        alert('Pendaftaran akun ditolak dan dihapus dari antrean.');
        const row = document.getElementById(rowId);
        if (row) row.remove();
        
        const badge = document.getElementById('badge-pending-accounts');
        if (badge) {
            let count = parseInt(badge.innerText);
            if (count > 0) badge.innerText = count - 1;
        }
    }
}

function exportData(format) {
    alert(`Mempersiapkan data rekapitulasi fasilitas...\nBerkas laporan dengan format [.${format}] akan mulai diunduh.`);
}