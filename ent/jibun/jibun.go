// Code generated by ent, DO NOT EDIT.

package jibun

import (
	"time"
)

const (
	// Label holds the string label denoting the jibun type in the database.
	Label = "jibun"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldBjdongCd holds the string denoting the bjdong_cd field in the database.
	FieldBjdongCd = "bjdong_cd"
	// FieldSigunguCd holds the string denoting the sigungu_cd field in the database.
	FieldSigunguCd = "sigungu_cd"
	// FieldBun holds the string denoting the bun field in the database.
	FieldBun = "bun"
	// FieldJi holds the string denoting the ji field in the database.
	FieldJi = "ji"
	// FieldGuyukCd holds the string denoting the guyuk_cd field in the database.
	FieldGuyukCd = "guyuk_cd"
	// FieldGuyukCdNm holds the string denoting the guyuk_cd_nm field in the database.
	FieldGuyukCdNm = "guyuk_cd_nm"
	// FieldJimokCd holds the string denoting the jimok_cd field in the database.
	FieldJimokCd = "jimok_cd"
	// FieldJimokCdNm holds the string denoting the jimok_cd_nm field in the database.
	FieldJimokCdNm = "jimok_cd_nm"
	// FieldJiyukCd holds the string denoting the jiyuk_cd field in the database.
	FieldJiyukCd = "jiyuk_cd"
	// FieldJiyukCdNm holds the string denoting the jiyuk_cd_nm field in the database.
	FieldJiyukCdNm = "jiyuk_cd_nm"
	// FieldJiguCd holds the string denoting the jigu_cd field in the database.
	FieldJiguCd = "jigu_cd"
	// FieldJiguCdNm holds the string denoting the jigu_cd_nm field in the database.
	FieldJiguCdNm = "jigu_cd_nm"
	// FieldPlatGBCd holds the string denoting the plat_gb_cd field in the database.
	FieldPlatGBCd = "plat_gb_cd"
	// FieldPlatPlc holds the string denoting the plat_plc field in the database.
	FieldPlatPlc = "plat_plc"
	// FieldSplotNm holds the string denoting the splot_nm field in the database.
	FieldSplotNm = "splot_nm"
	// FieldBlock holds the string denoting the block field in the database.
	FieldBlock = "block"
	// FieldLot holds the string denoting the lot field in the database.
	FieldLot = "lot"
	// FieldCreatedAt holds the string denoting the created_at field in the database.
	FieldCreatedAt = "created_at"
	// FieldUpdatedAt holds the string denoting the updated_at field in the database.
	FieldUpdatedAt = "updated_at"
	// EdgeDemol holds the string denoting the demol edge name in mutations.
	EdgeDemol = "demol"
	// Table holds the table name of the jibun in the database.
	Table = "jibuns"
	// DemolTable is the table that holds the demol relation/edge.
	DemolTable = "demols"
	// DemolInverseTable is the table name for the Demol entity.
	// It exists in this package in order to avoid circular dependency with the "demol" package.
	DemolInverseTable = "demols"
	// DemolColumn is the table column denoting the demol relation/edge.
	DemolColumn = "jibun_demol"
)

// Columns holds all SQL columns for jibun fields.
var Columns = []string{
	FieldID,
	FieldBjdongCd,
	FieldSigunguCd,
	FieldBun,
	FieldJi,
	FieldGuyukCd,
	FieldGuyukCdNm,
	FieldJimokCd,
	FieldJimokCdNm,
	FieldJiyukCd,
	FieldJiyukCdNm,
	FieldJiguCd,
	FieldJiguCdNm,
	FieldPlatGBCd,
	FieldPlatPlc,
	FieldSplotNm,
	FieldBlock,
	FieldLot,
	FieldCreatedAt,
	FieldUpdatedAt,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "jibuns"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"bjd_jibun",
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultCreatedAt holds the default value on creation for the "created_at" field.
	DefaultCreatedAt func() time.Time
	// DefaultUpdatedAt holds the default value on creation for the "updated_at" field.
	DefaultUpdatedAt func() time.Time
)
