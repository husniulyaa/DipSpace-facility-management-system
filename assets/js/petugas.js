function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    
    const navId = tabId.replace('tab-', 'nav-btn-');
    const activeNav = document.getElementById(navId);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

function updateQueueCount() {
    const badge = document.getElementById('badge-queue-count');
    const stat = document.getElementById('stat-pending');
    if (!badge || !stat) return;
    
    let count = parseInt(stat.innerText);
    if (count > 0) {
        count--;
        badge.innerText = count;
        stat.innerText = count;
    }
}

function approveQueue(rowId) {
    alert('Pengajuan berhasil DISETUJUI. Jadwal telah dikunci di kalender.');
    const row = document.getElementById(rowId);
    if (row) row.remove();
    updateQueueCount();
}

function rejectQueue(rowId) {
    const reason = prompt('Masukkan alasan penolakan (misal: Berkas surat pengantar tidak lengkap)');
    if (reason !== null && reason.trim() !== '') {
        alert('Pengajuan berhasil DITOLAK dengan alasan: ' + reason);
        const row = document.getElementById(rowId);
        if (row) row.remove();
        updateQueueCount();
    } else if (reason !== null) {
        alert('Alasan penolakan wajib diisi.');
    }
}

let currentEmergencyRow = '';
function openEmergencyModal(rowId) {
    currentEmergencyRow = rowId;
    const modal = document.getElementById('modal-emergency');
    if (modal) modal.classList.remove('hidden');
}

function confirmEmergency() {
    const reasonInput = document.getElementById('emergency-reason');
    if (!reasonInput) return;
    
    const reason = reasonInput.value;
    if (reason.trim() === '') {
        alert('Alasan pembatalan darurat wajib diisi!');
        return;
    }
    alert('Reservasi berhasil dibatalkan secara paksa. Notifikasi telah dikirim ke pemohon. Alasan: ' + reason);
    
    if (currentEmergencyRow) {
        const row = document.getElementById(currentEmergencyRow);
        if (row) row.remove();
    }
    closeModal('modal-emergency');
    reasonInput.value = '';
}

let currentResolutionRow = '';
function openResolutionModal(rowId) {
    currentResolutionRow = rowId;
    const modal = document.getElementById('modal-resolution');
    if (modal) modal.classList.remove('hidden');
}

function confirmResolution() {
    const noteInput = document.getElementById('resolution-note');
    if (!noteInput) return;

    const note = noteInput.value;
    if (note.trim() === '') {
        alert('Catatan resolusi teknis wajib diisi sebelum menutup laporan!');
        return;
    }
    alert('Laporan Kerusakan berhasil ditutup dengan status SELESAI.');
    
    if (currentResolutionRow) {
        const row = document.getElementById(currentResolutionRow);
        if (row) row.remove();
    }
    closeModal('modal-resolution');
    noteInput.value = '';
}

function toggleMaintenance(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;

    const badge = row.querySelector('.badge');
    const btn = row.querySelector('button');

    if (badge.innerText.includes('Aktif')) {
        badge.className = 'badge danger';
        badge.innerText = 'Dalam Perbaikan';
        btn.className = 'btn btn-primary';
        btn.innerText = 'Aktifkan Kembali';
        alert('Status diubah ke DALAM PERBAIKAN. Seluruh slot kalender publik pada fasilitas ini otomatis terkunci.');
    } else {
        badge.className = 'badge success';
        badge.innerText = 'Aktif Normal';
        btn.className = 'btn btn-outline';
        btn.innerText = 'Set "Perbaikan"';
        alert('Fasilitas telah DIAKTIFKAN KEMBALI. Peminjaman publik dapat diajukan kembali.');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}