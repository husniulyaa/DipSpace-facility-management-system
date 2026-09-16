package model

import (
	"time"
)

type User struct {
	ID             uint      `gorm:"primaryKey;autoIncrement"`
	Name           string    `gorm:"type:varchar(100);not null"`
	IdentityNumber string    `gorm:"type:varchar(50)"`
	Email          string    `gorm:"type:varchar(150);not null;unique"`
	Password       string    `gorm:"type:varchar(255);not null"`
	Role           string    `gorm:"type:varchar(20);not null"` 
	Status         string    `gorm:"type:varchar(30);not null"`
	CreatedAt      time.Time `gorm:"not null;autoCreateTime"`
	UpdatedAt      time.Time `gorm:"not null;autoUpdateTime"`

	Reservations []Reservation `gorm:"foreignKey:UserID"`
	Reports      []Report      `gorm:"foreignKey:UserID"`
}

type Facility struct {
	ID          uint      `gorm:"primaryKey;autoIncrement"`
	Name        string    `gorm:"type:varchar(150);not null"`
	Type        string    `gorm:"type:varchar(100);not null"`
	Location    string    `gorm:"type:varchar(150);not null"`
	Capacity    int       `gorm:"not null"`
	Description string    `gorm:"type:text"`
	Address     string    `gorm:"type:varchar(255)"`
	Image       string    `gorm:"type:varchar(255)"`
	Status      string    `gorm:"type:varchar(30);not null"` 
	CreatedAt   time.Time `gorm:"not null;autoCreateTime"`
	UpdatedAt   time.Time `gorm:"not null;autoUpdateTime"`

	Reservations []Reservation `gorm:"foreignKey:FacilityID"`
	Reports      []Report      `gorm:"foreignKey:FacilityID"`
}

type Reservation struct {
	ID                 uint      `gorm:"primaryKey;autoIncrement"`
	UserID             uint      `gorm:"not null;index:idx_user_resdate"`
	FacilityID         uint      `gorm:"not null;index:idx_fac_resdate_status"`
	ReservationDate    time.Time `gorm:"type:date;not null;index:idx_user_resdate;index:idx_fac_resdate_status"`
	StartTime          string    `gorm:"type:time;not null"`
	EndTime            string    `gorm:"type:time;not null"`
	Purpose            string    `gorm:"type:text"`
	Status             string    `gorm:"type:varchar(30);not null;index:idx_fac_resdate_status"` 
	CancellationReason string    `gorm:"type:text"`
	CreatedAt          time.Time `gorm:"not null;autoCreateTime"`
	UpdatedAt          time.Time `gorm:"not null;autoUpdateTime"`

	User     User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Facility Facility `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}

type Report struct {
	ID             uint      `gorm:"primaryKey;autoIncrement"`
	UserID         uint      `gorm:"index:idx_user_created"`
	FacilityID     uint      `gorm:"index:idx_fac_status"`
	Category       string    `gorm:"type:varchar(100)"`
	Description    string    `gorm:"type:text;not null"`
	Photo          string    `gorm:"type:varchar(255)"`
	Status         string    `gorm:"type:varchar(30);not null;index:idx_fac_status"`
	ResolutionNote string    `gorm:"type:text"`
	CreatedAt      time.Time `gorm:"not null;autoCreateTime;index:idx_user_created"`
	UpdatedAt      time.Time `gorm:"not null;autoUpdateTime"`

	User     User     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	Facility Facility `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}