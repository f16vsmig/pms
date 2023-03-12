// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"gopms/ent/bjd"
	"strings"
	"time"

	"entgo.io/ent/dialect/sql"
)

// Bjd is the model entity for the Bjd schema.
type Bjd struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// BjdongCd holds the value of the "bjdong_cd" field.
	BjdongCd string `json:"bjdong_cd,omitempty"`
	// SigunguCd holds the value of the "sigungu_cd" field.
	SigunguCd string `json:"sigungu_cd,omitempty"`
	// SidoNm holds the value of the "sido_nm" field.
	SidoNm string `json:"sido_nm,omitempty"`
	// SigunguNm holds the value of the "sigungu_nm" field.
	SigunguNm string `json:"sigungu_nm,omitempty"`
	// DongNm holds the value of the "dong_nm" field.
	DongNm string `json:"dong_nm,omitempty"`
	// LiNm holds the value of the "li_nm" field.
	LiNm string `json:"li_nm,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the BjdQuery when eager-loading is set.
	Edges BjdEdges `json:"edges"`
}

// BjdEdges holds the relations/edges for other nodes in the graph.
type BjdEdges struct {
	// Jibun holds the value of the jibun edge.
	Jibun []*Jibun `json:"jibun,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// JibunOrErr returns the Jibun value or an error if the edge
// was not loaded in eager-loading.
func (e BjdEdges) JibunOrErr() ([]*Jibun, error) {
	if e.loadedTypes[0] {
		return e.Jibun, nil
	}
	return nil, &NotLoadedError{edge: "jibun"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Bjd) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case bjd.FieldID:
			values[i] = new(sql.NullInt64)
		case bjd.FieldBjdongCd, bjd.FieldSigunguCd, bjd.FieldSidoNm, bjd.FieldSigunguNm, bjd.FieldDongNm, bjd.FieldLiNm:
			values[i] = new(sql.NullString)
		case bjd.FieldCreatedAt, bjd.FieldUpdatedAt:
			values[i] = new(sql.NullTime)
		default:
			return nil, fmt.Errorf("unexpected column %q for type Bjd", columns[i])
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Bjd fields.
func (b *Bjd) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case bjd.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			b.ID = int(value.Int64)
		case bjd.FieldBjdongCd:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field bjdong_cd", values[i])
			} else if value.Valid {
				b.BjdongCd = value.String
			}
		case bjd.FieldSigunguCd:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field sigungu_cd", values[i])
			} else if value.Valid {
				b.SigunguCd = value.String
			}
		case bjd.FieldSidoNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field sido_nm", values[i])
			} else if value.Valid {
				b.SidoNm = value.String
			}
		case bjd.FieldSigunguNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field sigungu_nm", values[i])
			} else if value.Valid {
				b.SigunguNm = value.String
			}
		case bjd.FieldDongNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field dong_nm", values[i])
			} else if value.Valid {
				b.DongNm = value.String
			}
		case bjd.FieldLiNm:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field li_nm", values[i])
			} else if value.Valid {
				b.LiNm = value.String
			}
		case bjd.FieldCreatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field created_at", values[i])
			} else if value.Valid {
				b.CreatedAt = value.Time
			}
		case bjd.FieldUpdatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updated_at", values[i])
			} else if value.Valid {
				b.UpdatedAt = value.Time
			}
		}
	}
	return nil
}

// QueryJibun queries the "jibun" edge of the Bjd entity.
func (b *Bjd) QueryJibun() *JibunQuery {
	return NewBjdClient(b.config).QueryJibun(b)
}

// Update returns a builder for updating this Bjd.
// Note that you need to call Bjd.Unwrap() before calling this method if this Bjd
// was returned from a transaction, and the transaction was committed or rolled back.
func (b *Bjd) Update() *BjdUpdateOne {
	return NewBjdClient(b.config).UpdateOne(b)
}

// Unwrap unwraps the Bjd entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (b *Bjd) Unwrap() *Bjd {
	_tx, ok := b.config.driver.(*txDriver)
	if !ok {
		panic("ent: Bjd is not a transactional entity")
	}
	b.config.driver = _tx.drv
	return b
}

// String implements the fmt.Stringer.
func (b *Bjd) String() string {
	var builder strings.Builder
	builder.WriteString("Bjd(")
	builder.WriteString(fmt.Sprintf("id=%v, ", b.ID))
	builder.WriteString("bjdong_cd=")
	builder.WriteString(b.BjdongCd)
	builder.WriteString(", ")
	builder.WriteString("sigungu_cd=")
	builder.WriteString(b.SigunguCd)
	builder.WriteString(", ")
	builder.WriteString("sido_nm=")
	builder.WriteString(b.SidoNm)
	builder.WriteString(", ")
	builder.WriteString("sigungu_nm=")
	builder.WriteString(b.SigunguNm)
	builder.WriteString(", ")
	builder.WriteString("dong_nm=")
	builder.WriteString(b.DongNm)
	builder.WriteString(", ")
	builder.WriteString("li_nm=")
	builder.WriteString(b.LiNm)
	builder.WriteString(", ")
	builder.WriteString("created_at=")
	builder.WriteString(b.CreatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updated_at=")
	builder.WriteString(b.UpdatedAt.Format(time.ANSIC))
	builder.WriteByte(')')
	return builder.String()
}

// Bjds is a parsable slice of Bjd.
type Bjds []*Bjd