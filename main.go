package main

import (
	"fmt"
	"siaga-dips/config"
	"siaga-dips/model"
)

func main() {
	
	config.ConnectDB()

	err := config.DB.AutoMigrate(
		&model.User{},
		&model.Facility{},
		&model.Reservation{},
		&model.Report{},
	)

	if err != nil {
		fmt.Println("Gagal melakukan migrasi database:", err)
		return
	}

	fmt.Println("Migrasi tabel SIAGA DIPS berhasil dijalankan!")

	config.SeedDatabase()
}