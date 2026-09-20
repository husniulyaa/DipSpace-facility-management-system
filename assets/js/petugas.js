const dummyDataReservasi = {
	'row-queue-1': {
		name: 'Husni Ulyaa Khanifah',
		nim: '24060124120021',
		role: 'Mahasiswa',
		phone: '0812-3456-7890',
		email: 'husni@students.undip.ac.id',
		facility: 'Laboratorium Komputer Terintegrasi - Gedung Acintya Prasada',
		dates: '25 Okt 2026 - 26 Okt 2026',
		times: '08:00 WIB - 11:30 WIB',
		purpose: 'Pelatihan UI/UX Design Himpunan Mahasiswa Informatika',
		filename: 'Proposal_Pelatihan_UIUX.pdf'
	},
	'row-queue-2': {
		name: 'Lintang Aulia Nuraini',
		nim: '24060124120017',
		role: 'Mahasiswa',
		phone: '0821-9876-5432',
		email: 'lintang@students.undip.ac.id',
		facility: 'Muladi Dome',
		dates: '28 Okt 2026 - 28 Okt 2026',
		times: '13:00 WIB - 16:00 WIB',
		purpose: 'Seminar Generative AI untuk Mahasiswa Informatika',
		filename: 'Izin_Acara_Seminar_AI.pdf'
	},
	'row-queue-3': {
		name: "Hana Nafi'atul Haq",
		nim: '24060124130081',
		role: 'Mahasiswa',
		phone: '0857-1234-5678',
		email: 'hana@students.undip.ac.id',
		facility: 'Gedung Auditorium Prof. Soedarto, S.H.',
		dates: '30 Okt 2026 - 30 Okt 2026',
		times: '09:00 WIB - 12:00 WIB',
		purpose: 'Gathering Mahasiswa Baru Informatika',
		filename: 'Proposal_Makrab_Informatika.pdf'
	},
	'row-queue-4': {
		name: 'Birela Miadeta Purita',
		nim: '24060124120002',
		role: 'Mahasiswa',
		phone: '0838-8765-4321',
		email: 'birela@students.undip.ac.id',
		facility: 'Polytron Stadium',
		dates: '02 Nov 2026 - 02 Nov 2026',
		times: '10:00 WIB - 14:00 WIB',
		purpose: 'Pertandingan Badminton Tingkat Fakultas',
		filename: 'Jadwal_Tanding_BEM.pdf'
	}
};


const dummyDataKerusakan = {
	'row-damage-1': {
		name: 'Husni Ulyaa Khanifah',
		category: 'KELISTRIKAN',
		facility: 'Laboratorium Sentral FK',
		location: 'Ruang 203, Lantai 2 (Area Praktikum)',
		description: 'Terjadi konsleting pada stop kontak meja nomor 3 dan 4. Mengeluarkan bau hangus.',
		photo: 'IMG_Konslet_Lab.jpg',
		resolution: '',
		rejectReason: ''
	},
	'row-damage-2': {
		name: 'Lintang Aulia Nuraini',
		category: 'INFRASTRUKTUR BANGUNAN',
		facility: 'Gedung Auditorium Prof. Soedarto, S.H.',
		location: 'Atap sayap kiri auditorium',
		description: 'Ditemukan kebocoran cukup parah pada atap saat hujan deras kemarin.',
		photo: 'IMG_Bocor_Atap.jpg',
		resolution: '',
		rejectReason: ''
	},
	'row-damage-3': {
		name: "Hana Nafi'atul Haq",
		category: 'INVENTARIS RUANGAN',
		facility: 'Laboratorium Komputer Terintegrasi - Gedung Acintya Prasada',
		location: 'Lab Komputer A, Baris ke-2',
		description: 'Terdapat 3 kursi yang rodanya patah dan 1 meja yang kakinya goyang.',
		photo: 'IMG_Kursi_Patah.jpg',
		resolution: 'Telah dilakukan penggantian 3 unit kursi baru dan perbaikan baut pada kaki meja.',
		rejectReason: ''
	},
	'row-damage-4': {
		name: "Birela Miadeta Purita",
		category: 'INFRASTRUKTUR BANGUNAN',
		facility: 'Polytron Stadium',
		location: 'Tribun Penonton VIP',
		description: 'Lampu sorot lapangan mati satu di bagian sudut kanan.',
		photo: 'IMG_Lampu_Mati.jpg',
		resolution: '',
		rejectReason: 'Laporan duplikat. Kerusakan sudah dilaporkan sebelumnya dan sedang menunggu suku cadang.'
	}
};


function switchTab(tabId) {
	document.querySelectorAll('.tab-content').forEach(tab => {
		tab.classList.add('hidden');
	});

	const selectedTab = document.getElementById(tabId);
	if (selectedTab) {
		selectedTab.classList.remove('hidden');
	}

	document.querySelectorAll('.navigation-item').forEach(nav => {
		nav.classList.remove('active');
	});

	const navId = tabId.replace('tab-', 'nav-btn-');
	const activeNav = document.getElementById(navId);
	if (activeNav) {
		activeNav.classList.add('active');
	}
}


function closeModal(modalId) {
	const modal = document.getElementById(modalId);
	if (modal) {
		modal.classList.add('hidden');
	}
}

function resetFormInputs() {
	document.querySelectorAll('.modal-form textarea').forEach(textarea => {
		textarea.value = '';
	});
}


function openReservationDetail(rowId, status, reasonText = "") {
	const modal = document.getElementById('modal-reservation-detail');
	const data = dummyDataReservasi[rowId];

	if (!data || !modal) return;

	document.getElementById('detail-user-name').textContent = data.name;
	document.getElementById('detail-user-id').textContent = data.nim;
	document.getElementById('detail-user-role').textContent = data.role;
	document.getElementById('detail-user-phone').textContent = data.phone;
	document.getElementById('detail-user-email').textContent = data.email;
	document.getElementById('detail-facility').textContent = data.facility;
	document.getElementById('detail-dates').textContent = data.dates;
	document.getElementById('detail-times').textContent = data.times;
	document.getElementById('detail-purpose').textContent = data.purpose;
	document.getElementById('detail-filename').textContent = data.filename;

	const reasonBox = document.getElementById('detail-reason-box');
	const reasonMsg = document.getElementById('detail-reason-text');
	const actionReject = document.getElementById('btn-modal-reject');
	const actionApprove = document.getElementById('btn-modal-approve');
	const actionCancel = document.getElementById('btn-modal-cancel');

	reasonBox.classList.add('hidden');
	actionReject.classList.add('hidden');
	actionApprove.classList.add('hidden');
	actionCancel.classList.add('hidden');

	if (status === 'Menunggu') {
		actionReject.classList.remove('hidden');
		actionApprove.classList.remove('hidden');
	} else if (status === 'Disetujui') {
		actionCancel.classList.remove('hidden');
	} else if (status === 'Ditolak' || status === 'Dibatalkan') {
		reasonBox.classList.remove('hidden');
		reasonMsg.textContent = reasonText || "Tidak ada alasan yang dicantumkan.";
	}

	modal.classList.remove('hidden');
}

function approveFromModal() {
	alert("Pengajuan reservasi berhasil disetujui!");
	closeModal('modal-reservation-detail');
}

function rejectFromModal() {
	closeModal('modal-reservation-detail');
	document.getElementById('modal-reject').classList.remove('hidden');
}

function confirmReject() {
	const reasonInput = document.getElementById('reject-reason');
	if (reasonInput.value.trim() === '') {
		alert('Alasan penolakan wajib diisi!');
		return;
	}
	alert(`Pengajuan berhasil ditolak.\nAlasan: ${reasonInput.value}`);
	closeModal('modal-reject');
	resetFormInputs();
}

function openEmergencyFromDetail() {
	closeModal('modal-reservation-detail');
	document.getElementById('modal-emergency').classList.remove('hidden');
}

function confirmEmergency() {
	const reasonInput = document.getElementById('emergency-reason');
	if (reasonInput.value.trim() === '') {
		alert('Alasan pembatalan darurat wajib diisi!');
		return;
	}
	alert(`Pembatalan darurat berhasil dikirim.\nAlasan: ${reasonInput.value}`);
	closeModal('modal-emergency');
	resetFormInputs();
}


let currentDamageRowId = '';

function openDamageDetail(rowId, status) {
	const modal = document.getElementById('modal-damage-detail');
	const data = dummyDataKerusakan[rowId];

	if (!data || !modal) return;
	currentDamageRowId = rowId;

	document.getElementById('dmg-user-name').textContent = data.name;
	document.getElementById('dmg-category').textContent = data.category;
	document.getElementById('dmg-facility').textContent = data.facility;
	document.getElementById('dmg-location').textContent = data.location;
	document.getElementById('dmg-description').textContent = data.description;
	document.getElementById('dmg-photo').textContent = data.photo;

	const resBox = document.getElementById('dmg-resolution-box');
	const resMsg = document.getElementById('dmg-resolution-text');
	const rejBox = document.getElementById('dmg-reject-box');
	const rejMsg = document.getElementById('dmg-reject-text');

	const actionProcess = document.getElementById('btn-dmg-process');
	const actionResolve = document.getElementById('btn-dmg-resolve');
	const actionReject = document.getElementById('btn-dmg-reject');

	resBox.classList.add('hidden');
	rejBox.classList.add('hidden');
	actionProcess?.classList.add('hidden');
	actionResolve?.classList.add('hidden');
	actionReject?.classList.add('hidden');

	if (status === 'Baru') {
		actionProcess?.classList.remove('hidden');
		actionReject?.classList.remove('hidden');
	} else if (status === 'Diproses') {
		actionResolve?.classList.remove('hidden');
	} else if (status === 'Selesai') {
		resBox.classList.remove('hidden');
		resMsg.textContent = data.resolution;
	} else if (status === 'Ditolak') {
		rejBox.classList.remove('hidden');
		rejMsg.textContent = data.rejectReason;
	}

	modal.classList.remove('hidden');
}

function processDamageFromModal() {
	alert("Status laporan diubah menjadi SEDANG DIPROSES. Tim teknisi telah dikerahkan.");
	closeModal('modal-damage-detail');
}

function openResolutionFromDetail() {
	closeModal('modal-damage-detail');
	document.getElementById('modal-resolution').classList.remove('hidden');
}

function confirmResolution() {
	const noteInput = document.getElementById('resolution-note');
	if (noteInput.value.trim() === '') {
		alert('Catatan resolusi teknis wajib diisi sebelum menutup laporan!');
		return;
	}

	alert('Laporan Kerusakan berhasil ditutup dengan status SELESAI.');
	closeModal('modal-resolution');
	resetFormInputs();
}

function rejectDamageFromModal() {
	closeModal('modal-damage-detail');
	document.getElementById('modal-damage-reject').classList.remove('hidden');
}

function confirmDamageReject() {
	const reasonInput = document.getElementById('damage-reject-reason');
	if (reasonInput.value.trim() === '') {
		alert('Alasan penolakan laporan wajib diisi!');
		return;
	}

	alert(`Laporan berhasil ditolak.\nAlasan: ${reasonInput.value}`);
	closeModal('modal-damage-reject');
	resetFormInputs();
}


function toggleMaintenance(rowId) {
	const row = document.getElementById(rowId);
	if (!row) return;

	const badge = row.querySelector('.badge');
	const actionButton = row.querySelector('button');

	if (badge.innerText.includes('Aktif')) {
		badge.className = 'badge danger';
		badge.innerText = 'Dalam Perbaikan';

		actionButton.className = 'button button-primary button-small';
		actionButton.innerText = 'Aktifkan Kembali';

		alert('Status diubah ke DALAM PERBAIKAN.\nSeluruh slot kalender publik pada fasilitas ini otomatis terkunci.');
	} else {
		badge.className = 'badge success';
		badge.innerText = 'Aktif Normal';

		actionButton.className = 'button button-outline button-small';
		actionButton.innerText = 'Set "Perbaikan"';

		alert('Fasilitas telah DIAKTIFKAN KEMBALI.\nPeminjaman publik dapat diajukan kembali.');
	}
}