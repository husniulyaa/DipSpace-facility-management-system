package config

import (
	"fmt"
	"log"
	"time"

	"siaga-dips/model"
)

func SeedDatabase() {
	
	fmt.Println("Memulai proses seeding data sinkronisasi HTML...")

	users := []model.User{
		{Name: "Ira Kusumadewi", IdentityNumber: "198001012005012001", Email: "ira.admin@admin.undip.ac.id", Password: "password123", Role: "Admin", Status: "Aktif"},
		{Name: "Arif Pratama", IdentityNumber: "198803112014021004", Email: "arifpratama35@facility.undip.ac.id", Password: "password123", Role: "Petugas", Status: "Aktif"},
		{Name: "Nabila Kayla Rafa", IdentityNumber: "24060124120022", Email: "nabilakay@students.undip.ac.id", Password: "password123", Role: "Pengguna", Status: "Menunggu Verifikasi"},
		{Name: "Husni Ulyaa Khanifah", IdentityNumber: "24060124120021", Email: "husni@students.undip.ac.id", Password: "password123", Role: "Pengguna", Status: "Aktif"},
		{Name: "Lintang Aulia Nuraini", IdentityNumber: "24060124120017", Email: "lintang@students.undip.ac.id", Password: "password123", Role: "Pengguna", Status: "Aktif"},
		{Name: "Hana Nafi'atul Haq", IdentityNumber: "24060124130081", Email: "hana@students.undip.ac.id", Password: "password123", Role: "Pengguna", Status: "Aktif"},
		{Name: "Birela Miadeta Purita", IdentityNumber: "24060124120002", Email: "birela@students.undip.ac.id", Password: "password123", Role: "Pengguna", Status: "Aktif"},
	}

	if err := DB.Create(&users).Error; err != nil {
		log.Fatal("Gagal seeding data User:", err)
	}

	facilities := []model.Facility{
		{Name: "Muladi Dome", Type: "Gedung/Aula", Location: "Lainnya", Capacity: 5000, Description: "Gedung serbaguna kapasitas besar untuk kegiatan kampus.", Address: "Jl. Prof. Soedarto No.50239, Tembalang", Image: "assets/images/muladi-dome.png", Status: "Aktif"},
		{Name: "Polytron Stadium", Type: "Stadion", Location: "Lainnya", Capacity: 300, Description: "Fasilitas olahraga indoor untuk berbagai cabang olahraga.", Address: "Jl. Prof. Soedarto SH, Tembalang", Image: "assets/images/polytron-stadium.png", Status: "Aktif"},
		{Name: "Gedung Auditorium Prof. Soedarto, S.H.", Type: "Gedung/Aula", Location: "Lainnya", Capacity: 800, Description: "Auditorium utama universitas.", Address: "Jl. Prof. Soedarto, S.H., Tembalang", Image: "assets/images/Gd-Auditorium-Prof.-Soedarto.png", Status: "Dalam Perbaikan"},
		{Name: "Laboratorium Komputer Terintegrasi - Gedung Acintya Prasada", Type: "Laboratorium", Location: "FSM", Capacity: 50, Description: "Laboratorium praktikum dan tes berbasis komputer.", Address: "Jl. Prof. Jacob Rais, Tembalang", Image: "assets/images/Lab-Komputer-Gd-AP.png", Status: "Aktif"},
		{Name: "Gedung Laboratorium Terpadu", Type: "Laboratorium", Location: "Lainnya", Capacity: 50, Description: "Gedung laboratorium riset bersama.", Address: "Jl. Prof. Soedarto, S.H., Tembalang", Image: "assets/images/gd-lab-bersama.png", Status: "Nonaktif"},
		{Name: "Laboratorium Sentral FK", Type: "Laboratorium", Location: "Lainnya", Capacity: 50, Description: "Fasilitas laboratorium Fakultas Kedokteran.", Address: "Jl. Prof. Moeljono S. Trastotenojo", Image: "assets/images/lab-sentral-fk.png", Status: "Aktif"},
	}

	if err := DB.Create(&facilities).Error; err != nil {
		log.Fatal("Gagal seeding data Facility:", err)
	}

	parseDate := func(dateStr string) time.Time {
		t, _ := time.Parse("2006-01-02", dateStr)
		return t
	}

	reservations := []model.Reservation{
		{
			UserID: users[3].ID, FacilityID: facilities[3].ID,
			ReservationDate: parseDate("2026-10-25"), StartTime: "08:00:00", EndTime: "11:30:00",
			Purpose: "Pelatihan UI/UX Design", Status: "Menunggu",
		},
		{
			UserID: users[4].ID, FacilityID: facilities[0].ID,
			ReservationDate: parseDate("2026-10-28"), StartTime: "13:00:00", EndTime: "16:00:00",
			Purpose: "Seminar Generative AI untuk Mahasiswa Informatika", Status: "Disetujui",
		},
		{
			UserID: users[5].ID, FacilityID: facilities[2].ID,
			ReservationDate: parseDate("2026-10-30"), StartTime: "09:00:00", EndTime: "12:00:00",
			Purpose: "Gathering Maba Informatika", Status: "Ditolak", CancellationReason: "Gedung sedang dalam perbaikan.",
		},
		{
			UserID: users[6].ID, FacilityID: facilities[1].ID,
			ReservationDate: parseDate("2026-11-02"), StartTime: "10:00:00", EndTime: "14:00:00",
			Purpose: "Pertandingan Badminton Tingkat Fakultas", Status: "Dibatalkan", CancellationReason: "Dialihkan untuk acara universitas.",
		},
	}

	if err := DB.Create(&reservations).Error; err != nil {
		log.Fatal("Gagal seeding data Reservation:", err)
	}

	reports := []model.Report{
		{
			UserID: users[3].ID, FacilityID: facilities[5].ID,
			Category: "Kelistrikan", Description: "Kerusakan pada instalasi listrik utama, teknisi sedang melakukan pengecekan.",
			Status: "Baru",
		},
		{
			UserID: users[4].ID, FacilityID: facilities[2].ID,
			Category: "Infrastruktur Bangunan", Description: "Ditemukan kebocoran pada beberapa bagian atap gedung yang menyebabkan rembesan air ke area dalam.",
			Status: "Diproses",
		},
		{
			UserID: users[5].ID, FacilityID: facilities[3].ID,
			Category: "Inventaris Ruangan", Description: "Beberapa kursi dan meja komputer mengalami kerusakan dan perlu diperbaiki.",
			Status: "Selesai", ResolutionNote: "Penggantian dan perbaikan unit kursi",
		},
	}

	if err := DB.Create(&reports).Error; err != nil {
		log.Fatal("Gagal seeding data Report:", err)
	}

	fmt.Println("Seeding data sinkronisasi berhasil dilakukan!")
}