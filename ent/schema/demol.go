package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Demol holds the schema definition for the Demol entity.
type Demol struct {
	ent.Schema
}

// Fields of the Demol.
func (Demol) Fields() []ent.Field {
	return []ent.Field{
		field.String("mgm_pmsrgst_pk").
			NotEmpty(), // 관리허가대장pk
		field.String("bld_nm").
			Optional().
			Nillable(), // 건물명
		field.String("demol_extng_gb_cd").
			Optional(), // 철거멸실구분코드
		field.String("demol_extng_gb_cd_nm").
			Optional(), // 철거멸실구분코드명
		field.String("demol_strt_day").
			Optional(), // 철거시작일
		field.String("demol_end_day").
			Optional(), // 철거종료일
		field.String("demol_extng_day").
			Optional(), // 철거멸실일
		field.Uint32("tot_area").
			Optional(), // 연면적
		field.Uint32("bld_cnt").
			Optional(), // 건축물수
		field.String("main_purps_cd").
			Optional(), // 주용도코드
		field.String("main_purps_cd_nm").
			Optional(), // 주용도코드명
		field.String("strct_cd").
			Optional(), // 구조코드
		field.String("strct_cd_nm").
			Optional(), // 구조코드명
		field.String("hhld_cnt").
			Optional(), // 세대수(세대)
		field.String("ho_cnt").
			Optional(), // 호수(호)
		field.String("crtn_day"), // 생성일
		field.Time("created_at").
			Default(time.Now).
			Immutable(), // 생성일자
		field.Time("updated_at").
			Default(time.Now), // 업데이트일자
	}
}

// Edges of the Demol.
func (Demol) Edges() []ent.Edge {
	return nil
}
