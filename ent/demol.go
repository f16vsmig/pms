// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"gopms/ent/demol"
	"strings"
	"time"

	"entgo.io/ent/dialect/sql"
)

// Demol is the model entity for the Demol schema.
type Demol struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// MgmPmsrgstPk holds the value of the "mgm_pmsrgst_pk" field.
	MgmPmsrgstPk string `json:"mgm_pmsrgst_pk,omitempty"`
	// BldNm holds the value of the "bld_nm" field.
	BldNm *string `json:"bld_nm,omitempty"`
	// DemolExtngGBCd holds the value of the "demol_extng_gb_cd" field.
	DemolExtngGBCd string `json:"demol_extng_gb_cd,omitempty"`
	// DemolExtngGBCdNm holds the value of the "demol_extng_gb_cd_nm" field.
	DemolExtngGBCdNm string `json:"demol_extng_gb_cd_nm,omitempty"`
	// DemolStrtDay holds the value of the "demol_strt_day" field.
	DemolStrtDay string `json:"demol_strt_day,omitempty"`
	// DemolEndDay holds the value of the "demol_end_day" field.
	DemolEndDay string `json:"demol_end_day,omitempty"`
	// DemolExtngDay holds the value of the "demol_extng_day" field.
	DemolExtngDay string `json:"demol_extng_day,omitempty"`
	// TotArea holds the value of the "tot_area" field.
	TotArea uint32 `json:"tot_area,omitempty"`
	// BldCnt holds the value of the "bld_cnt" field.
	BldCnt uint32 `json:"bld_cnt,omitempty"`
	// MainPurpsCd holds the value of the "main_purps_cd" field.
	MainPurpsCd string `json:"main_purps_cd,omitempty"`
	// MainPurpsCdNm holds the value of the "main_purps_cd_nm" field.
	MainPurpsCdNm string `json:"main_purps_cd_nm,omitempty"`
	// StrctCd holds the value of the "strct_cd" field.
	StrctCd string `json:"strct_cd,omitempty"`
	// StrctCdNm holds the value of the "strct_cd_nm" field.
	StrctCdNm string `json:"strct_cd_nm,omitempty"`
	// HhldCnt holds the value of the "hhld_cnt" field.
	HhldCnt string `json:"hhld_cnt,omitempty"`
	// HoCnt holds the value of the "ho_cnt" field.
	HoCnt string `json:"ho_cnt,omitempty"`
	// CrtnDay holds the value of the "crtn_day" field.
	CrtnDay string `json:"crtn_day,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
	jibun_demol *int
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Demol) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case demol.FieldID, demol.FieldTotArea, demol.FieldBldCnt:
			values[i] = new(sql.NullInt64)
		case demol.FieldMgmPmsrgstPk, demol.FieldBldNm, demol.FieldDemolExtngGBCd, demol.FieldDemolExtngGBCdNm, demol.FieldDemolStrtDay, demol.FieldDemolEndDay, demol.FieldDemolExtngDay, demol.FieldMainPurpsCd, demol.FieldMainPurpsCdNm, demol.FieldStrctCd, demol.FieldStrctCdNm, demol.FieldHhldCnt, demol.FieldHoCnt, demol.FieldCrtnDay:
			values[i] = new(sql.NullString)
		case demol.FieldCreatedAt, demol.FieldUpdatedAt:
			values[i] = new(sql.NullTime)
		case demol.ForeignKeys[0]: // jibun_demol
			values[i] = new(sql.NullInt64)
		default:
			return nil, fmt.Errorf("unexpected column %q for type Demol", columns[i])
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Demol fields.
func (d *Demol) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case demol.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			d.ID = int(value.Int64)
		case demol.FieldMgmPmsrgstPk:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field mgm_pmsrgst_pk", values[i])
			} else if value.Valid {
				d.MgmPmsrgstPk = value.String
			}
		case demol.FieldBldNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field bld_nm", values[i])
			} else if value.Valid {
				d.BldNm = new(string)
				*d.BldNm = value.String
			}
		case demol.FieldDemolExtngGBCd:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field demol_extng_gb_cd", values[i])
			} else if value.Valid {
				d.DemolExtngGBCd = value.String
			}
		case demol.FieldDemolExtngGBCdNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field demol_extng_gb_cd_nm", values[i])
			} else if value.Valid {
				d.DemolExtngGBCdNm = value.String
			}
		case demol.FieldDemolStrtDay:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field demol_strt_day", values[i])
			} else if value.Valid {
				d.DemolStrtDay = value.String
			}
		case demol.FieldDemolEndDay:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field demol_end_day", values[i])
			} else if value.Valid {
				d.DemolEndDay = value.String
			}
		case demol.FieldDemolExtngDay:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field demol_extng_day", values[i])
			} else if value.Valid {
				d.DemolExtngDay = value.String
			}
		case demol.FieldTotArea:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field tot_area", values[i])
			} else if value.Valid {
				d.TotArea = uint32(value.Int64)
			}
		case demol.FieldBldCnt:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field bld_cnt", values[i])
			} else if value.Valid {
				d.BldCnt = uint32(value.Int64)
			}
		case demol.FieldMainPurpsCd:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field main_purps_cd", values[i])
			} else if value.Valid {
				d.MainPurpsCd = value.String
			}
		case demol.FieldMainPurpsCdNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field main_purps_cd_nm", values[i])
			} else if value.Valid {
				d.MainPurpsCdNm = value.String
			}
		case demol.FieldStrctCd:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field strct_cd", values[i])
			} else if value.Valid {
				d.StrctCd = value.String
			}
		case demol.FieldStrctCdNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field strct_cd_nm", values[i])
			} else if value.Valid {
				d.StrctCdNm = value.String
			}
		case demol.FieldHhldCnt:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field hhld_cnt", values[i])
			} else if value.Valid {
				d.HhldCnt = value.String
			}
		case demol.FieldHoCnt:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field ho_cnt", values[i])
			} else if value.Valid {
				d.HoCnt = value.String
			}
		case demol.FieldCrtnDay:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field crtn_day", values[i])
			} else if value.Valid {
				d.CrtnDay = value.String
			}
		case demol.FieldCreatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field created_at", values[i])
			} else if value.Valid {
				d.CreatedAt = value.Time
			}
		case demol.FieldUpdatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updated_at", values[i])
			} else if value.Valid {
				d.UpdatedAt = value.Time
			}
		case demol.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field jibun_demol", value)
			} else if value.Valid {
				d.jibun_demol = new(int)
				*d.jibun_demol = int(value.Int64)
			}
		}
	}
	return nil
}

// Update returns a builder for updating this Demol.
// Note that you need to call Demol.Unwrap() before calling this method if this Demol
// was returned from a transaction, and the transaction was committed or rolled back.
func (d *Demol) Update() *DemolUpdateOne {
	return NewDemolClient(d.config).UpdateOne(d)
}

// Unwrap unwraps the Demol entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (d *Demol) Unwrap() *Demol {
	_tx, ok := d.config.driver.(*txDriver)
	if !ok {
		panic("ent: Demol is not a transactional entity")
	}
	d.config.driver = _tx.drv
	return d
}

// String implements the fmt.Stringer.
func (d *Demol) String() string {
	var builder strings.Builder
	builder.WriteString("Demol(")
	builder.WriteString(fmt.Sprintf("id=%v, ", d.ID))
	builder.WriteString("mgm_pmsrgst_pk=")
	builder.WriteString(d.MgmPmsrgstPk)
	builder.WriteString(", ")
	if v := d.BldNm; v != nil {
		builder.WriteString("bld_nm=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	builder.WriteString("demol_extng_gb_cd=")
	builder.WriteString(d.DemolExtngGBCd)
	builder.WriteString(", ")
	builder.WriteString("demol_extng_gb_cd_nm=")
	builder.WriteString(d.DemolExtngGBCdNm)
	builder.WriteString(", ")
	builder.WriteString("demol_strt_day=")
	builder.WriteString(d.DemolStrtDay)
	builder.WriteString(", ")
	builder.WriteString("demol_end_day=")
	builder.WriteString(d.DemolEndDay)
	builder.WriteString(", ")
	builder.WriteString("demol_extng_day=")
	builder.WriteString(d.DemolExtngDay)
	builder.WriteString(", ")
	builder.WriteString("tot_area=")
	builder.WriteString(fmt.Sprintf("%v", d.TotArea))
	builder.WriteString(", ")
	builder.WriteString("bld_cnt=")
	builder.WriteString(fmt.Sprintf("%v", d.BldCnt))
	builder.WriteString(", ")
	builder.WriteString("main_purps_cd=")
	builder.WriteString(d.MainPurpsCd)
	builder.WriteString(", ")
	builder.WriteString("main_purps_cd_nm=")
	builder.WriteString(d.MainPurpsCdNm)
	builder.WriteString(", ")
	builder.WriteString("strct_cd=")
	builder.WriteString(d.StrctCd)
	builder.WriteString(", ")
	builder.WriteString("strct_cd_nm=")
	builder.WriteString(d.StrctCdNm)
	builder.WriteString(", ")
	builder.WriteString("hhld_cnt=")
	builder.WriteString(d.HhldCnt)
	builder.WriteString(", ")
	builder.WriteString("ho_cnt=")
	builder.WriteString(d.HoCnt)
	builder.WriteString(", ")
	builder.WriteString("crtn_day=")
	builder.WriteString(d.CrtnDay)
	builder.WriteString(", ")
	builder.WriteString("created_at=")
	builder.WriteString(d.CreatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updated_at=")
	builder.WriteString(d.UpdatedAt.Format(time.ANSIC))
	builder.WriteByte(')')
	return builder.String()
}

// Demols is a parsable slice of Demol.
type Demols []*Demol
